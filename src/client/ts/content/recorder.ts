import { ContextType, Record } from './record';

export class Recorder {
	#recording = true;
	#currentId = 0;
	#lastRequestAnimationFrame = -1;
	readonly #records = new Set<Record>();

	setRecording(recording: boolean): void {
		this.#recording = recording;
	}

	reset(): void {
		this.#currentId = 0;
		this.#records.clear();
	}

	addRecord(contextType: ContextType, functionName: string, ...args: any[]) {
		//console.debug(`Adding new ${contextType} record ${this.#currentId}`);
		if (!this.#recording) {
			return;
		}

		const record = new Record(contextType, functionName, this.#currentId, performance.now(), args);
		++this.#currentId;
	}

	requestAnimationFrame(): void {
		this.#lastRequestAnimationFrame = ++this.#currentId;
		//console.info('request', this.#currentId);
	}
}
