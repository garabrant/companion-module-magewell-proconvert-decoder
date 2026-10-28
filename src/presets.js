import { combineRgb } from '@companion-module/base'

// Since base 2.0 presets are returned as two parts: the definitions keyed by id,
// and a structure describing the sections they are grouped under in the UI.
// The old per-preset `category` property is gone.
export function setPresets(self) {
	const presets = {}

	const colorWhite = combineRgb(255, 255, 255)
	const colorRed = combineRgb(255, 0, 0)
	const colorGreen = combineRgb(0, 204, 0)
	const colorBlack = combineRgb(0, 0, 0)

	// CompanionButtonStyleProps declares color/bgcolor as numbers, so these
	// Magewell brand colours cannot be CSS strings as they were previously
	const colorMagewellAttention = combineRgb(238, 156, 38) // #ee9c26
	const colorMagewellActive = combineRgb(31, 142, 236) // #1f8eec
	const colorMagewellHighlight = combineRgb(237, 246, 254) // #edf6fe

	// Reference this connection's own variables. The previous code hardcoded
	// 'generic-module' here, which never resolved to anything.
	const v = (id) => `$(${self.label}:${id})`

	presets['dashboardSourceConnected'] = {
		type: 'simple',
		name: 'Source Connected',
		style: {
			text: `SOURCE\\n${v('sourceName')}`,
			size: '14',
			color: colorWhite,
			bgcolor: colorBlack,
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'sourceConnected',
				options: {},
				style: {
					color: colorWhite,
					bgcolor: colorGreen,
				},
			},
		],
	}

	presets['dashboardQoS'] = {
		type: 'simple',
		name: 'QoS Video/Audio Dropped Frames/Samples',
		style: {
			text: `QoS\\n${v('sourceVideoDropFrames')}\\n${v('sourceAudioDropSamples')}`,
			size: '14',
			color: colorWhite,
			bgcolor: colorBlack,
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'sourceQosDrop',
				options: {},
				style: {
					color: colorWhite,
					bgcolor: colorRed,
				},
			},
		],
	}

	presets['dashboardDecoding'] = {
		type: 'simple',
		name: 'Decoding Video/Audio Bitrate',
		style: {
			text: `Decoding\\n${v('sourceVideoBitrate')} k\\n${v('sourceAudioBitrate')} k`,
			size: '14',
			color: colorWhite,
			bgcolor: colorBlack,
		},
		steps: [],
		feedbacks: [],
	}

	presets['dashboardJitter'] = {
		type: 'simple',
		name: 'Jitter Video/Audio',
		style: {
			text: `Jitter\\n${v('sourceVideoJitter')} ms\\n${v('sourceAudioJitter')} ms`,
			size: '14',
			color: colorWhite,
			bgcolor: colorBlack,
		},
		steps: [],
		feedbacks: [],
	}

	presets['dashboardJitterBuffer'] = {
		type: 'simple',
		name: 'Buffer Usage',
		style: {
			// Was sourceBufferBar, which is not a variable this module defines
			text: `Buffer\\n${v('sourceBufferDuration')} ms\\n${v('sourceBufferUsageBar')}`,
			size: '14',
			color: colorWhite,
			bgcolor: colorBlack,
		},
		steps: [],
		feedbacks: [],
	}

	presets['dashboardVideoFmt'] = {
		type: 'simple',
		name: 'Video Format',
		style: {
			text: `Video\\n${v('sourceVideoHeight')}${v('sourceVideoScanShort')}\\n${v('sourceVideoFieldrate')} Hz`,
			size: '14',
			color: colorWhite,
			bgcolor: colorBlack,
		},
		steps: [],
		feedbacks: [],
	}

	presets['dashboardAudioFmt'] = {
		type: 'simple',
		name: 'Audio Format',
		style: {
			text: `Audio\\n${v('sourceAudioNumChannels')}x${v('sourceAudioBitCount')} Bit\\n${v('sourceAudioSamplerate')} Hz`,
			size: '14',
			color: colorWhite,
			bgcolor: colorBlack,
		},
		steps: [],
		feedbacks: [],
	}

	presets['dashboardTallyProgram'] = {
		type: 'simple',
		name: 'Tally Program',
		style: {
			text: '⚪ TALLY\\nProgram',
			size: '14',
			color: colorWhite,
			bgcolor: colorBlack,
		},
		steps: [
			{
				down: [],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'sourceTallyProgram',
				options: {},
				style: {
					color: colorWhite,
					bgcolor: colorRed,
				},
			},
		],
	}

	presets['dashboardTallyPreview'] = {
		type: 'simple',
		name: 'Tally Preview',
		style: {
			text: '⚪ TALLY\\nPreview',
			size: '14',
			color: colorWhite,
			bgcolor: colorBlack,
		},
		steps: [
			{
				down: [],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'sourceTallyPreview',
				options: {},
				style: {
					color: colorWhite,
					bgcolor: colorGreen,
				},
			},
		],
	}

	presets['systemReboot'] = {
		type: 'simple',
		name: 'Reboot Device (Hold for 2s)',
		style: {
			text: 'Reboot\\n↺',
			size: '14',
			color: colorWhite,
			bgcolor: colorMagewellAttention,
		},
		steps: [
			{
				down: [],
				up: [],
				2000: {
					options: { runWhileHeld: true },
					actions: [
						{
							actionId: 'reboot',
							options: {},
						},
					],
				},
			},
		],
		feedbacks: [],
	}

	presets['videoFollowInput'] = {
		type: 'simple',
		name: 'Video Follow Input',
		style: {
			text: 'Video Follow Input',
			size: '14',
			color: colorWhite,
			bgcolor: colorBlack,
		},
		steps: [
			{
				down: [
					{
						actionId: 'videoConfigFollowInputMode',
						options: {
							mode: true,
						},
					},
					{
						actionId: 'videoConfigDeinterlaceMode',
						options: {
							mode: 'weave',
						},
					},
					{
						actionId: 'videoConfigAutoColorFmt',
						options: {
							auto: true,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['audioFollowInput'] = {
		type: 'simple',
		name: 'Audio Follow Input',
		style: {
			text: 'Audio Follow Input',
			size: '14',
			color: colorWhite,
			bgcolor: colorBlack,
		},
		steps: [
			{
				down: [
					{
						actionId: 'audioConfigGain',
						options: {
							gain: 20.0,
						},
					},
					{
						actionId: 'audioConfigConvertMode',
						options: {
							mode: 'smpte',
						},
					},
					{
						actionId: 'audioConfigSamplerate',
						options: {
							samplerate: '0',
						},
					},
					{
						actionId: 'audioConfigChannelCount',
						options: {
							channels: '0',
						},
					},
					{
						actionId: 'videoConfigVUMeterMode',
						options: {
							mode: 'post-gain-dbfs',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	// #################
	// #### Presets ####
	// #################

	const presetNameIds = []
	const presetIndexIds = []

	// Index 0 is always the 'None' entry, which clears the decoder rather than
	// selecting a preset. Label it as such instead of rendering a blank button.
	const isNone = (preset) => preset.id === ''

	self.SOURCE_PRESETS.forEach((preset, index) => {
		const id = `presetName${index}`
		presetNameIds.push(id)

		presets[id] = {
			type: 'simple',
			name: isNone(preset) ? 'Clear source (None)' : `Select SOURCE "${preset.id}"`,
			style: {
				text: isNone(preset) ? 'CLEAR\\nSOURCE' : `SELECT\\nSOURCE PRESET\\n\\n${preset.id}`,
				size: '7',
				color: colorBlack,
				bgcolor: colorWhite,
			},
			steps: [
				{
					down: [
						{
							actionId: 'selectPresetName',
							options: {
								name: preset.id,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'sourcePresetName',
					options: {
						name: preset.id,
					},
					style: {
						color: colorMagewellHighlight,
						bgcolor: colorMagewellActive,
					},
				},
			],
		}
	})

	self.SOURCE_PRESETS.forEach((preset, index) => {
		const id = `presetIndex${index}`
		presetIndexIds.push(id)

		presets[id] = {
			type: 'simple',
			name: isNone(preset) ? 'Clear source (index #0)' : `Select Source Preset #${index}`,
			style: {
				text: `SELECT\\nSOURCE PRESET\\nINDEX #${index}\\n\\n${v(`presetSource${index}`)}`,
				size: '7',
				color: colorBlack,
				bgcolor: colorWhite,
			},
			steps: [
				{
					down: [
						{
							actionId: 'selectPresetIndex',
							options: {
								index: index,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'sourcePresetIndex',
					options: {
						index: index,
					},
					style: {
						color: colorMagewellHighlight,
						bgcolor: colorMagewellActive,
					},
				},
			],
		}
	})

	// A section's `definitions` may be either an array of groups or, as here, a
	// flat array of preset ids, which the host shows without a grouping level.
	// The flat form matches what the 1.x per-preset `category` produced.
	const structure = [
		{
			id: 'dashboard',
			name: 'Dashboard',
			definitions: [
				'dashboardSourceConnected',
				'dashboardQoS',
				'dashboardDecoding',
				'dashboardJitter',
				'dashboardJitterBuffer',
				'dashboardVideoFmt',
				'dashboardAudioFmt',
				'dashboardTallyProgram',
				'dashboardTallyPreview',
			],
		},
		{
			id: 'system',
			name: 'System',
			definitions: ['systemReboot', 'videoFollowInput', 'audioFollowInput'],
		},
		{
			id: 'sourcePresetsByName',
			name: 'Source Presets by Name',
			description: 'Select a source preset using its name, as configured on the device',
			definitions: presetNameIds,
		},
		{
			id: 'sourcePresetsByIndex',
			name: 'Source Presets by Index',
			description: 'Select a source preset using its position in the device preset list',
			definitions: presetIndexIds,
		},
	]

	return { structure, presets }
}
