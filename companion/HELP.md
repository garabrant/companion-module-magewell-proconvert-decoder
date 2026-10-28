# Magewell Pro Convert Decoder

This module will allow you to control functions of a Magewell Pro Convert Decoder

## Configuration

- The IP Address of the device.
- The Username to login
- The Password to login

## Using variables to choose a source

Every option field in this module can be driven by a variable. Instead of picking
a value from the dropdown, use the toggle on the field to switch it to an
expression, then write an expression that returns the value you want, for example:

```
$(internal:custom_next_source)
```

This works on **Select Source Preset by Name**, **Select Source**, and
**Select Source Preset by Index**, as well as on the matching feedbacks. A preset
name that is not currently in the device's list is still sent to the device
rather than being discarded, so you are not limited to the names the module has
already discovered.

The module also exposes `presetSource0`, `presetSource1`, ... for the names of
the presets the device reports, and `sourcePresetCount` for how many there are.

Note that in **Select Source Preset by Index**, index #0 is the "None" entry and
clears the current source. The first real preset is #1, so valid preset indices
run from 1 to `sourcePresetCount`. An index past the end of the list is ignored
and logged, rather than clearing the output.

## Actions

### Set Video Config

#### OSD

- Show Title
- Show Tally
- Show VU Meter
- VU Meter Mode
- Show Center Cross
- Safe Area Mode
- Ident Mode
- Ident Text

#### Video Process

- Horizontal Flip
- Vertical Flip
- Deinterlace Mode
- Aspect Ratio Convert Mode
- Alpha Channel Display Mode

#### Video Source

- Auto Color Format
- Set Color Format
- Switch Mode

### Set Video Mode

- Width
- Height
- Interlaced
- Field Rate
- Aspect Ratio

### Set Audio Config

- Gain
- Sample Rate
- Channels

### Decoding

- Select Preset Channel to Decode
- Select NDI Source to Decode
- Set NDI Config
- Set Playback Config

## Feedbacks

- Show Channel is Selected
- Show NDI Source is Selected
- NDI is Connected

## Variables

- Summary Info (Device Name, Model, etc.)
- Video Config Info (OSD, Process, Source)
- Video Mode Info
- Audio Config Info
- Channel and Source Info
- Network Info

## Presets
