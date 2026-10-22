import { ShaderRecord } from './recorder';

export type ControllerEvent =
	'shadersource';

// Same as CustomEventInit with required detail
export interface ControllerEventInit<T = any> extends EventInit {
	detail: T;
}

export class Controller {
	static readonly #eventTarget = new EventTarget();

	static addEventListener(type: 'shadersource', callback: (evt: CustomEvent<ShaderSource>) => void, options?: AddEventListenerOptions | boolean): void;
	static addEventListener(type: ControllerEvent, callback: (evt: CustomEvent) => void, options?: AddEventListenerOptions | boolean): void {
		this.#eventTarget.addEventListener(type, callback as (evt: Event) => void, options);
	}

	static dispatchEvent(type: 'shadersource', options: ControllerEventInit<ShaderSource>): boolean;
	static dispatchEvent<T>(type: ControllerEvent, options?: CustomEventInit<T>): boolean {
		return this.#eventTarget.dispatchEvent(new CustomEvent<T>(type, options));
	}

	static removeEventListener(type: ControllerEvent, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void {
		this.#eventTarget.removeEventListener(type, callback, options);
	}
}

export type ShaderSource = ShaderRecord;
