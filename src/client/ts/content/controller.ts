import { ShaderRecord } from './recorder';

export type ControllerEvent =
	'shaderadded'
	| 'shaderdeleted'
	| 'shadersource'
	| 'recompileshader'
	| 'requestanimationframe'
	;

// Same as CustomEventInit with required detail
export interface ControllerEventInit<T = any> extends EventInit {
	detail: T;
}

export class Controller {
	static readonly #eventTarget = new EventTarget();

	static addEventListener(type: 'shaderadded', callback: (evt: CustomEvent<ShaderSource>) => void, options?: AddEventListenerOptions | boolean): void;
	static addEventListener(type: 'shaderdeleted', callback: (evt: CustomEvent<ShaderSource>) => void, options?: AddEventListenerOptions | boolean): void;
	static addEventListener(type: 'shadersource', callback: (evt: CustomEvent<ShaderSource>) => void, options?: AddEventListenerOptions | boolean): void;
	static addEventListener(type: 'recompileshader', callback: (evt: CustomEvent<RecompileShader>) => void, options?: AddEventListenerOptions | boolean): void;
	static addEventListener(type: 'requestanimationframe', callback: (evt: CustomEvent<DOMHighResTimeStamp>) => void, options?: AddEventListenerOptions | boolean): void;
	static addEventListener(type: ControllerEvent, callback: (evt: CustomEvent) => void, options?: AddEventListenerOptions | boolean): void {
		this.#eventTarget.addEventListener(type, callback as (evt: Event) => void, options);
	}

	static dispatchEvent(type: 'shaderadded', options: ControllerEventInit<ShaderSource>): boolean;
	static dispatchEvent(type: 'shaderdeleted', options: ControllerEventInit<ShaderSource>): boolean;
	static dispatchEvent(type: 'shadersource', options: ControllerEventInit<ShaderSource>): boolean;
	static dispatchEvent(type: 'recompileshader', options: ControllerEventInit<RecompileShader>): boolean;
	static dispatchEvent(type: 'requestanimationframe', options: ControllerEventInit<DOMHighResTimeStamp>): boolean;
	static dispatchEvent<T>(type: ControllerEvent, options?: CustomEventInit<T>): boolean {
		return this.#eventTarget.dispatchEvent(new CustomEvent<T>(type, options));
	}

	static removeEventListener(type: ControllerEvent, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void {
		this.#eventTarget.removeEventListener(type, callback, options);
	}
}

export type ShaderSource = ShaderRecord;

export type RecompileShader = {
	name: string;
	source: string;
};
