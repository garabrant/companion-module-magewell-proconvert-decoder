import { combineRgb } from '@companion-module/base'

// ##########################
// #### Define Feedbacks ####
// ##########################
const expressionHint =
	'Use the toggle on this field to switch it to an expression, so the value can come from a variable.'

export function setFeedbacks(self) {
	const feedbacks = {}

	const colorWhite = combineRgb(255, 255, 255)
	const colorRed = combineRgb(255, 0, 0)
	const colorGreen = combineRgb(0, 255, 0)
	//const colorOrange = combineRgb(255, 102, 0)
	//const colorBlue = combineRgb(0, 51, 204)
	//const colorGrey = combineRgb(51, 51, 51)

	feedbacks.sourcePresetName = {
		type: 'boolean',
		name: 'Source Preset selected',
		description: 'Indicate if the Source Preset is currently selected for decoding',
		defaultStyle: {
			color: colorWhite,
			bgcolor: colorRed,
		},
		options: [
			{
				type: 'dropdown',
				label: 'Preset Name',
				tooltip: expressionHint,
				id: 'name',
				default: '',
				choices: self.SOURCE_PRESETS,
				allowCustom: true,
			},
		],
		callback: function (feedback) {
			return self.STATUS.summaryInfo.source.name === feedback.options.name
		},
	}

	feedbacks.sourcePresetIndex = {
		type: 'boolean',
		name: 'Source Preset Index selected',
		description: 'Indicate if the Source Preset # is currently selected for decoding',
		defaultStyle: {
			color: colorWhite,
			bgcolor: colorRed,
		},
		options: [
			{
				type: 'number',
				label: 'Preset #',
				tooltip:
					'Position in the device preset list. #0 is the "None" entry, so the first real preset is #1. ' +
					expressionHint,
				id: 'index',
				min: 0,
				// max is required by the API; see the matching note in actions.js
				max: 999,
				asInteger: true,
				default: 0,
			},
		],
		callback: function (feedback) {
			const name = self.presetNameByIndex(feedback.options.index)
			return name === undefined ? false : self.STATUS.summaryInfo.source.name === name
		},
	}

	feedbacks.ndiSourceSelected = {
		type: 'boolean',
		name: 'NDI Source selected',
		description: 'Indicate if NDI Source is currently selected for decoding',
		defaultStyle: {
			color: colorWhite,
			bgcolor: colorRed,
		},
		options: [
			{
				type: 'dropdown',
				label: 'NDI Source',
				tooltip: expressionHint,
				id: 'name',
				default: '',
				choices: self.NDI_SOURCES,
				allowCustom: true,
			},
		],
		callback: function (feedback) {
			return self.STATUS.summaryInfo.source.name === feedback.options.name
		},
	}

	feedbacks.sourceConnected = {
		type: 'boolean',
		name: 'Source is Connected',
		description: 'Indicate if selected Source is Connected',
		defaultStyle: {
			color: colorWhite,
			bgcolor: colorRed,
		},
		options: [],
		callback: function () {
			// null until the first successful poll; the API expects a boolean
			return Boolean(self.STATUS.summaryInfo.source.connected)
		},
	}

	feedbacks.sourceQosDrop = {
		type: 'boolean',
		name: 'Frame drop detected',
		description: 'Indicate if Decoder is dropping video frames or audio samples',
		defaultStyle: {
			color: colorWhite,
			bgcolor: colorRed,
		},
		options: [],
		callback: function () {
			return self.STATUS.summaryInfo.source.videoDropFrames > 0 || self.STATUS.summaryInfo.source.audioDropSamples > 0
		},
	}

	feedbacks.sourceTallyProgram = {
		type: 'boolean',
		name: 'Tally Program',
		description: 'Indicates if the Program Tally is currently active',
		defaultStyle: {
			color: colorWhite,
			bgcolor: colorRed,
		},
		options: [],
		callback: function () {
			return Boolean(self.STATUS.summaryInfo.source.tallyProgram)
		},
	}

	feedbacks.sourceTallyPreview = {
		type: 'boolean',
		name: 'Tally Preview',
		description: 'Indicates if the Preview Tally is currently active',
		defaultStyle: {
			color: colorWhite,
			bgcolor: colorGreen,
		},
		options: [],
		callback: function () {
			return Boolean(self.STATUS.summaryInfo.source.tallyPreview)
		},
	}

	return feedbacks
}
