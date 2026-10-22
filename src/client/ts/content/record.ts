export type ContextType = 'webgl' | 'webgl2' | 'webgpu';

export class Record {
	#contextType: ContextType;
	#functionName: string;
	#recordId: number;
	#timestamp: DOMHighResTimeStamp;
	#args: any[];

	constructor(contextType: ContextType, functionName: string, recordId: number, timestamp: DOMHighResTimeStamp, ...args: any[]) {
		this.#contextType = contextType;
		this.#functionName = functionName;
		this.#recordId = recordId;
		this.#timestamp = timestamp;
		this.#args = args;
	}
}
