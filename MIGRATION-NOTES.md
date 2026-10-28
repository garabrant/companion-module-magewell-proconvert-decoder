# Migration to @companion-module/base 2.x

This is a working copy of `bitfocus/companion-module-magewell-proconvert-decoder`,
migrated from base 1.11 to base 2.x and updated so that source selection can be
driven by variables.

It requires Companion 4.x or newer. It will not load on Companion 3.x.

**Verified against real hardware on 2026-10-28.** `yarn install`, `yarn lint`,
`yarn format` and `yarn package` all pass, and the built module was loaded into
Companion 5.1.1 and exercised against a Pro Convert - CR1 (NDI to HDMI 4K,
firmware 1.1.1059): connection, variables, dashboard presets, dropdown
discovery, variable-driven source selection, query encoding and conditional
field visibility were all confirmed working.

## The original problem

"Select Source Preset by Name" used a dropdown, which could not be set from a
variable.

The underlying cause: `useVariables` only exists on text-input fields. It is not
a property of `CompanionInputFieldDropdown`, in base 1.x or 2.x. The module set
`useVariables: true` on two dropdowns in `selectSourceName`, where it did
nothing, and called `parseVariablesInString` on the result, which therefore
never had a variable to expand. `selectPresetName` did not even do that, so a
typed `$(...)` reached the device as literal text.

## How it is fixed

Base 2.x added expression mode to _every_ option field. Each field in the UI
gets a toggle that switches it from a value to an expression, so any dropdown
can now be driven by a variable without the module doing anything special. The
dead `useVariables` flags and the `parseVariablesInString` calls are gone;
Companion resolves option values before the callback runs.

The preset and NDI dropdowns keep `allowCustom: true`. This matters: per
`validateDropdownValue` in the host, a value that is not in `choices` is
rejected when `allowCustom` is false, and a rejected option value causes the
action to be skipped entirely. With `allowCustom` the value passes through as a
string, so a variable may name a preset the module has not discovered yet.

## Breaking API changes handled

| 1.x                                            | 2.x                                                  |
| ---------------------------------------------- | ---------------------------------------------------- |
| `runEntrypoint(Class, scripts)`                | `export default class` + `export { UpgradeScripts }` |
| `setVariableDefinitions([{variableId, name}])` | object keyed by id: `{ id: { name } }`               |
| `setPresetDefinitions(presets)`                | `setPresetDefinitions(structure, presets)`           |
| preset `type: 'button'` + `category`           | preset `type: 'simple'` + a structure of sections    |
| preset `options: { relativeDelay }`            | removed; delays are always relative                  |
| `checkFeedbacks()` with no arguments           | `checkAllFeedbacks()`                                |
| `isVisible: (options) => ...`                  | `isVisibleExpression: '...'`                         |
| `parseVariablesInString(...)`                  | removed; values arrive resolved                      |
| manifest without `type`                        | `"type": "connection"` required                      |
| runtime `node22`                               | `node26`                                             |

`isVisibleExpression` may only reference fields that cannot themselves be
expressions, so the `isNameNDI` checkbox in "Select Source" is marked
`disableAutoExpression: true`.

## Bugs found by a review pass over the migrated code

- **`max` is required on `number` fields in 2.x.** `CompanionInputFieldNumber`
  declares `max: number` non-optionally and the host validates it with a
  required zod key, so the commented-out `max` on the two "Preset #" fields
  would have had the definitions rejected. Both now set a deliberately generous
  `max: 999` rather than the preset count: the real bounds check belongs in
  `presetNameByIndex`, because a tight `max` would make the host reject an
  out-of-range value and skip the action, which is exactly the wrong failure
  mode for a variable-driven index.
- **A failed login was treated as a live session.** `login()` had no `return` on
  its failure paths, so it returned `undefined`. `checkSession()` stored that,
  and since `undefined !== null`, login was never retried and `sendCommand`
  sailed past its `if (session !== null)` guard to send requests with
  `cookie: undefined`. The "No connection to device" error was unreachable.
  `login()` now returns `null` explicitly, and `setupSession` ignores a missing
  cookie.
- **Concurrent callers each started their own login.** `pullData` and every
  `sendCommand` call `checkSession` independently; they now share one in-flight
  login promise.
- **`sourceBufferUsage` published the string `"NaN"`.** Before the first poll,
  jitter and buffer are both 0, and `NaN` fails every comparison in
  `normalizePct`, so it fell through to `(NaN).toFixed(0)`. Guarded with
  `Number.isFinite`.
- **Preset styles used CSS colour strings.** The three Magewell brand colours
  were `'#ee9c26'` and friends, but `CompanionButtonStyleProps` declares
  `color`/`bgcolor` as `number`. Converted to `combineRgb`.
- **`required: true` on number fields** no longer exists in 2.x and was silently
  ignored; removed, with `asInteger: true` added to the two index fields.
- Boolean feedbacks returned `null` until the first poll; now coerced.
- `import crypto from 'crypto'` → `node:crypto`.

## Other fixes made along the way

- **Query strings are now encoded.** `sendCommand` took a pre-built string and
  concatenated raw values, so any query-significant character in a name reached
  the device unescaped. It now takes an object and encodes each key and value.

  Pro Convert permits `A-Z a-z 0-9`, space, and
  `- , . ~ ! @ # $ % ^ * + _ = < > ' ( ) [ ]` in a preset name, so `%`, `#`,
  `+` and `=` are all reachable. **`%` is the one that matters most**, because
  it fails silently rather than loudly: unencoded, a preset named `Cam %41`
  arrives as the escape `%41` and decodes to `Cam A` — a different, perfectly
  valid preset, with no error anywhere. `#` truncates the query at the fragment
  delimiter, `+` decodes to a space, and `=` acts as an extra separator. `&`
  cannot occur in a preset name (the device rejects it) but can still arrive via
  an NDI source name, which comes from other vendors' devices and is not subject
  to Magewell's validator, or via the password in the login URL.

  `encodeURIComponent` is used rather than `URLSearchParams` so that spaces
  become `%20` instead of `+`, which matters doubly because `+` is itself a
  legal name character and has to survive as a literal `+`. The login URL is
  encoded too, which matters for passwords with punctuation.

  Verified on hardware: a preset named `Cam %41 #2 +3 =4` round-trips
  byte-identical through the device, inbound via `list-channels` and outbound
  via `set-channel`.

- **Presets referenced a connection that does not exist.** Every preset button
  used `$(generic-module:...)`, a leftover from the module template, so none of
  the dashboard buttons ever showed a value. They now use this connection's own
  label.
- **`dashboardJitterBuffer` referenced `sourceBufferBar`**, which is not a
  variable this module defines. The variable is `sourceBufferUsageBar`.
- **Out-of-range preset index no longer blanks the output.** Previously
  `selectPresetIndex` with an index past the end of the list sent an empty name,
  which clears the decoder. Now it logs a warning and does nothing. This matters
  more now that the index can come from a variable.
- **`eslint.config.mjs` called `require('os')` in an ESM file**, which is a
  `ReferenceError`. It now imports `node:os`.
- **Added `sourcePresetCount`** so an expression can bound an index against the
  number of presets the device reports.
- `get_ndi_sources` no longer rebuilds the variable definitions, since NDI
  sources do not contribute any.

## Deliberately not changed

- **The password is still a normal config field, not a `secret-text` field.**
  Moving it to the secrets store is the modern practice and would keep it out of
  exported configs, but it needs an upgrade script to migrate existing
  installations, and a mistake there would lock users out of their decoders.
  Worth doing as a separate, tested change.
- **Preset index 0 is still the "None" entry**, so "Preset #1" is the first real
  preset. This is confusing, but renumbering would silently repoint every
  existing user's buttons. Instead the tooltips now say so explicitly, and the
  two generated index-0 buttons are labelled "Clear source" rather than
  rendering blank. Note this means `sourcePresetCount` (which excludes "None")
  and the index field have different origins: valid preset indices are
  `1 .. sourcePresetCount`.
- The `static-text` spacer fields in the config layout were left alone.

## Building

```bash
yarn install
yarn lint
yarn format
yarn package
```

Note that `corepack enable` no longer works out of the box: corepack was
unbundled from Node in version 25, so on a clean Node 26 install it has to come
from `npm install -g corepack` first.

## Testing

Load the built package in Companion and check, in roughly this order:

1. The connection comes up and the status goes green.
2. Variables populate, and the Dashboard presets show real values rather than
   blanks (this is the `generic-module` fix).
3. The preset and NDI dropdowns list what the device reports, and follow it
   when a preset is added or removed in the device web UI.
4. Switch the "Preset Name" field on **Select Source Preset by Name** to
   expression mode and point it at a custom variable. Change the variable and
   confirm the decoder follows. Note the expression is evaluated when the
   action runs, so to have the decoder track a variable with no button press,
   drive the action from a **Trigger** on _Variable changed_.
5. Select a preset whose name contains `%`, `#`, `+`, `=` or a space, and
   confirm the reported source name comes back byte-identical.
6. Check that **Select Source** hides and shows the right field when the
   **NDI Source** checkbox is toggled (this is the `isVisibleExpression`
   change). That checkbox correctly has no expression toggle of its own.

All six passed on 2026-10-28 against the device named above.
