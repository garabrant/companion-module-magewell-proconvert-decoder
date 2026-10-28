// ##########################
// #### Define Variables ####
// ##########################
export function setVariables(self) {
	// Since base 2.0 the definitions are an object keyed by variable id, not an array.
	const variables = {
		// Summary Info
		deviceName: { name: 'Device - Name' },
		deviceModel: { name: 'Device - Model' },
		deviceProductId: { name: 'Device - Product ID' },
		deviceSerialNo: { name: 'Device - Serial number' },
		deviceHwRevision: { name: 'Device - Hardware version' },
		deviceFwVersion: { name: 'Device - Firmware version' },
		deviceOutputState: { name: 'Device - HDMI Output State' },
		deviceCpuUsage: { name: 'Device - CPU Usage (%)' },
		deviceMemoryUsage: { name: 'Device - Memory Usage (%)' },
		deviceCoreTemp: { name: 'Device - Temperature (°C)' },
		deviceBoardId: { name: 'Device - Slot index' },
		deviceUpTime: { name: 'Device - Up time (s)' },

		ethernetState: { name: 'Ethernet - Link State' },
		ethernetTxSpeedKbps: { name: 'Ethernet - Send Rate (Kbps)' },
		ethernetRxSpeedKbps: { name: 'Ethernet - Receive Rate (Kbps)' },

		sourceName: { name: 'Source - Name' },
		sourceUrl: { name: 'Source - URL' },
		sourceUrlType: { name: 'Source - Type' }, // Custom variable
		sourceBufferDuration: { name: 'Source - Buffer Duration (ms)' }, // Custom variable
		sourceBufferUsage: { name: 'Source - Buffer Usage (%)' }, // Custom variable
		sourceBufferUsageBar: { name: 'Source - Buffer Usage Bar' }, // Custom variable
		sourceConnected: { name: 'Source - Connected' },
		sourceTallyPreview: { name: 'Source - Tally Preview' },
		sourceTallyProgram: { name: 'Source - Tally Program' },
		sourceAudioDropSamples: { name: 'Source - Audio Dropped Samples' },
		sourceVideoDropFrames: { name: 'Source - Video Dropped Frames' },
		sourceVideoBitrate: { name: 'Source - Video Bit Rate (kbps)' },
		sourceAudioBitrate: { name: 'Source - Audio Bit Rate (Kbps)' },
		sourceTotalBitrate: { name: 'Source - Total Bit Rate (kbps)' }, // Custom variable
		sourceAudioJitter: { name: 'Source - Audio Jitter (ms)' },
		sourceVideoJitter: { name: 'Source - Video Jitter (ms)' },
		sourceTotalJitter: { name: 'Source - Total Jitter (ms)' }, // Custom variable
		sourceVideoWidth: { name: 'Source - Video Width' },
		sourceVideoHeight: { name: 'Source - Video Height' },
		sourceVideoScan: { name: 'Source - Video Scan Mode' },
		sourceVideoScanShort: { name: 'Source - Video Scan Mode (Short)' }, // Custom variable
		sourceVideoFieldrate: { name: 'Source - Video Field Rate (FPS)' },
		sourceAudioNumChannels: { name: 'Source - Audio Number of Channels' },
		sourceAudioSamplerate: { name: 'Source - Audio Sample Rate (Hz)' },
		sourceAudioBitCount: { name: 'Source - Audio Bit Count' },

		// Video Config
		configVideoShowTitle: { name: 'Video Config - OSD - Show source name & resolution' },
		configVideoShowTally: { name: 'Video Config - OSD - Show tally indicators' },
		configVideoShowVUMeter: { name: 'Video Config - OSD - Show audio meter' },
		configVideoVuMeterMode: { name: 'Video Config - OSD - Audio meter scale' },
		configVideoShowCenterCross: { name: 'Video Config - OSD - Show center cross' },
		configVideoFollowInputMode: { name: 'Video Config - Resolution - Follow input' },
		configVideoSafeAreaMode: { name: 'Video Config - OSD - Safe area' },
		configVideoIdentMode: { name: 'Video Config - OSD - Ident Mode' },
		configVideoIdentText: { name: 'Video Config - OSD - Ident Text' },
		configVideoHFlip: { name: 'Video Config - Process - Horizontal flip' },
		configVideoVFlip: { name: 'Video Config - Process - Vertical flip' },
		configVideoSwitchMode: { name: 'Video Config - Source - Display after source lost' },
		configVideoDeinterlaceMode: { name: 'Video Config - Process - Deinterlace mode' },
		configVideoArConvertMode: { name: 'Video Config - Process - AR convert' },
		configVideoInAutoColorFmt: { name: 'Video Config - Source - Auto color encoding' },
		configVideoInColorFmt: { name: 'Video Config - Source - Color encoding' },

		// Audio Config
		configAudioCheckPts: { name: 'Audio Config - Check audio PTS' },
		configAudioGain: { name: 'Audio Config - Gain (dB)' },
		configAudioSamplerate: { name: 'Audio Config - Sample Rate (Hz)' },
		configAudioChannels: { name: 'Audio Config - Channel count' },
		configAudioConvertMode: { name: 'Audio Config - Convert Mode' },

		// Count of presets currently reported by the device, so expressions can bound an index
		sourcePresetCount: { name: 'Source Preset - Count' },
	}

	// Source Presets
	self.SOURCE_PRESETS.forEach((channel, index) => {
		variables[`presetSource${index}`] = { name: `Source Preset #${index}` }
	})

	return variables
}

// #########################
// #### Check Variables ####
// #########################
export function checkVariables(self) {
	const progressBar = (pct, width = 20, start = '', end = '') => {
		if (pct && pct >= 0 && pct <= 100) {
			const flr = Math.floor((pct * width) / 100)
			return start + '|'.repeat(flr).padEnd(width, '.') + end
		}
		return '---'
	}

	const normalizePct = (val, low = 0, high = 100, limit = false, fractionDigits = 0) => {
		// NaN fails every comparison below, so it would otherwise fall through
		// and be published as the string 'NaN'
		if (!Number.isFinite(val)) return null
		if (limit) {
			val = val < low ? low : val
			val = val > high ? high : val
		}
		return val < low || val > high ? null : (((val - low) / (high - low)) * 100).toFixed(fractionDigits)
	}

	const getBufferDuration = (url) => {
		const bufferDuration = url?.match(/mw-buffer-duration=(\d+)/)
		return bufferDuration ? parseInt(bufferDuration[1]) : 0
	}

	const buffer = getBufferDuration(self.STATUS.summaryInfo.source.url)
	const jitter = Math.max(self.STATUS.summaryInfo.source.audioJitter, self.STATUS.summaryInfo.source.videoJitter)
	const bitrate = self.STATUS.summaryInfo.source.videoBitRate + self.STATUS.summaryInfo.source.audioBitRate

	self.setVariableValues({
		deviceName: self.STATUS.summaryInfo.device.name,
		deviceModel: self.STATUS.summaryInfo.device.model,
		deviceProductId: self.STATUS.summaryInfo.device.productId,
		deviceSerialNo: self.STATUS.summaryInfo.device.serialNo,
		deviceHwRevision: self.STATUS.summaryInfo.device.hwRevision,
		deviceFwVersion: self.STATUS.summaryInfo.device.fwVersion,
		deviceOutputState: self.STATUS.summaryInfo.device.outputState,
		deviceCpuUsage: self.STATUS.summaryInfo.device.cpuUsage?.toFixed(2),
		deviceMemoryUsage: self.STATUS.summaryInfo.device.memoryUsage?.toFixed(2),
		deviceCoreTemp: self.STATUS.summaryInfo.device.coreTemp?.toFixed(2),
		deviceBoardId: self.STATUS.summaryInfo.device.boardId,
		deviceUpTime: self.STATUS.summaryInfo.device.upTime,

		ethernetState: self.STATUS.summaryInfo.ethernet.state,
		ethernetTxSpeedKbps: self.STATUS.summaryInfo.ethernet.txSpeedKbps,
		ethernetRxSpeedKbps: self.STATUS.summaryInfo.ethernet.rxSpeedKbps,

		sourceName: self.STATUS.summaryInfo.source.name,
		sourceUrl: self.STATUS.summaryInfo.source.url,
		sourceConnected: self.STATUS.summaryInfo.source.connected,
		sourceTallyPreview: self.STATUS.summaryInfo.source.tallyPreview,
		sourceTallyProgram: self.STATUS.summaryInfo.source.tallyProgram,
		sourceAudioDropSamples: self.STATUS.summaryInfo.source.audioDropSamples,
		sourceVideoDropFrames: self.STATUS.summaryInfo.source.videoDropFrames,
		sourceVideoBitrate: self.STATUS.summaryInfo.source.videoBitRate,
		sourceAudioBitrate: self.STATUS.summaryInfo.source.audioBitRate,
		sourceAudioJitter: self.STATUS.summaryInfo.source.audioJitter,
		sourceVideoJitter: self.STATUS.summaryInfo.source.videoJitter,
		sourceVideoWidth: self.STATUS.summaryInfo.source.videoWidth,
		sourceVideoHeight: self.STATUS.summaryInfo.source.videoHeight,
		sourceVideoScan: self.STATUS.summaryInfo.source.videoScan,
		sourceVideoFieldrate: self.STATUS.summaryInfo.source.videoFieldRate,
		sourceAudioNumChannels: self.STATUS.summaryInfo.source.audioNumChannels,
		sourceAudioSamplerate: self.STATUS.summaryInfo.source.audioSampleRate,
		sourceAudioBitCount: self.STATUS.summaryInfo.source.audioBitCount,

		configVideoShowTitle: self.STATUS.videoConfig.showTitle,
		configVideoShowTally: self.STATUS.videoConfig.showTally,
		configVideoShowVUMeter: self.STATUS.videoConfig.showVUMeter,
		configVideoVuMeterMode: self.STATUS.videoConfig.vuMeterMode,
		configVideoShowCenterCross: self.STATUS.videoConfig.showCenterCross,
		configVideoFollowInputMode: self.STATUS.videoConfig.followInputMode,
		configVideoSafeAreaMode: self.STATUS.videoConfig.safeAreaMode,
		configVideoIdentMode: self.STATUS.videoConfig.identMode,
		configVideoIdentText: self.STATUS.videoConfig.identText,
		configVideoHFlip: self.STATUS.videoConfig.hFlip,
		configVideoVFlip: self.STATUS.videoConfig.vFlip,
		configVideoSwitchMode: self.STATUS.videoConfig.switchMode,
		configVideoDeinterlaceMode: self.STATUS.videoConfig.deinterlaceMode,
		configVideoArConvertMode: self.STATUS.videoConfig.arConvertMode,
		configVideoInAutoColorFmt: self.STATUS.videoConfig.inAutoColorFmt,
		configVideoInColorFmt: self.STATUS.videoConfig.inColorFmt,

		configAudioCheckPts: self.STATUS.audioConfig.checkPts,
		configAudioGain: self.STATUS.audioConfig.gain,
		configAudioSamplerate: self.STATUS.audioConfig.sampleRate,
		configAudioChannels: self.STATUS.audioConfig.channels,
		configAudioConvertMode: self.STATUS.audioConfig.convertMode,

		// Custom variables
		sourceUrlType: (self.STATUS.summaryInfo.source.url?.split(':')[0] ?? '').toUpperCase(),
		sourceVideoScanShort: self.STATUS.summaryInfo.source.videoScan?.charAt(0) ?? ' ',

		sourceBufferDuration: buffer,
		sourceBufferUsage: normalizePct(jitter / buffer, 0, 1, true),
		sourceBufferUsageBar: progressBar(normalizePct(jitter / buffer, 0, 1, true), 15),

		sourceTotalBitrate: bitrate,
		sourceTotalJitter: jitter,

		// SOURCE_PRESETS carries a leading 'None' entry, which is not a real preset
		sourcePresetCount: Math.max(self.SOURCE_PRESETS.length - 1, 0),

		// Source Presets
		...Object.fromEntries(self.SOURCE_PRESETS.map((channel, index) => [`presetSource${index}`, channel.id])),
		//...Object.fromEntries(self.SOURCE_PRESETS.map((channel, index) => [`presetSourceURL${index}`, channel.url])),
	})
}
