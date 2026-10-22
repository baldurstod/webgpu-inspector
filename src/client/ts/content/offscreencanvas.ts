import { MyWebGL2RenderingContext } from "./webgl2";

const oldOffscreenCanvas: OffscreenCanvas = window.OffscreenCanvas as unknown as OffscreenCanvas;

export function init() {
	console.log(oldOffscreenCanvas);
}

export class MyOffscreenCanvas implements OffscreenCanvas {
	#canvas: OffscreenCanvas;

	constructor(width: number, height: number) {
		this.#canvas = new oldOffscreenCanvas(width, height);
	}

	get width(): number {
		return this.#canvas.width;
	}

	set width(width: number) {
		this.#canvas.width = width;
	}

	get height(): number {
		return this.#canvas.height;
	}

	set height(height: number) {
		this.#canvas.height = height;
	}

	get oncontextlost(): ((this: OffscreenCanvas, ev: Event) => any) | null {
		return this.#canvas.oncontextlost;
	}

	set oncontextlost(oncontextlost: ((this: OffscreenCanvas, ev: Event) => any) | null) {
		this.#canvas.oncontextlost = oncontextlost;
	}

	get oncontextrestored(): ((this: OffscreenCanvas, ev: Event) => any) | null {
		return this.#canvas.oncontextrestored;
	}

	set oncontextrestored(oncontextrestored: ((this: OffscreenCanvas, ev: Event) => any) | null) {
		this.#canvas.oncontextrestored = oncontextrestored;
	}

	convertToBlob(options?: ImageEncodeOptions): Promise<Blob> {
		return this.#canvas.convertToBlob(options);
	}

	getContext(contextId: "2d", options?: any): OffscreenCanvasRenderingContext2D | null;
	getContext(contextId: "bitmaprenderer", options?: any): ImageBitmapRenderingContext | null;
	getContext(contextId: "webgl", options?: any): WebGLRenderingContext | null;
	getContext(contextId: "webgl2", options?: any): WebGL2RenderingContext | null;
	getContext(contextId: OffscreenRenderingContextId, options?: any): OffscreenRenderingContext | null;
	getContext(contextId: OffscreenRenderingContextId, options?: any): OffscreenRenderingContext | null {
		console.info('MyOffscreenCanvas getContext');
		switch (contextId) {
			case 'webgl2':
				const webgl2Context = this.#canvas.getContext('webgl2', options);
				if (!webgl2Context) {
					return null;
				}
				return new MyWebGL2RenderingContext(webgl2Context);
			default:
				return this.#canvas.getContext(contextId, options);
		}

	}

	transferToImageBitmap(): ImageBitmap {
		return this.#canvas.transferToImageBitmap();
	}

	addEventListener<K extends keyof OffscreenCanvasEventMap>(type: K, listener: (this: OffscreenCanvas, ev: OffscreenCanvasEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
	addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
		return this.#canvas.addEventListener(type, listener, options);
	}

	removeEventListener<K extends keyof OffscreenCanvasEventMap>(type: K, listener: (this: OffscreenCanvas, ev: OffscreenCanvasEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
	removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void {
		return this.#canvas.removeEventListener(type, listener, options);
	}

	dispatchEvent(event: Event): boolean {
		return this.#canvas.dispatchEvent(event);
	}

}

window.OffscreenCanvas = MyOffscreenCanvas;


//const test = new MyWebGL2RenderingContext()
