export type ContextType = 'webgl' | 'webgl2' | 'webgpu';

export class Record {
	readonly contextType: ContextType;
	readonly functionName: string;
	readonly recordId: number;
	readonly timestamp: DOMHighResTimeStamp;
	readonly args: any[];
	readonly duration: number;

	constructor(contextType: ContextType, functionName: string, recordId: number, timestamp: DOMHighResTimeStamp, duration: DOMHighResTimeStamp, ...args: any[]) {
		this.contextType = contextType;
		this.functionName = functionName;
		this.recordId = recordId;
		this.timestamp = timestamp;
		this.duration = duration;
		this.args = args;

		//console.info(functionName, timestamp, duration * 1000);
	}
}

function formatTimestamp(timestamp: DOMHighResTimeStamp): string {

	if (timestamp < 1) {
		return ''

	}


	return '';
}
