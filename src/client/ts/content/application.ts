import { fullscreenExitSVG, fullscreenSVG, radioButtonCheckedSVG } from 'harmony-svg';
import { addRemoveClass, createElement, createShadowRoot, defineHarmonySwitch, defineHarmonyToggleButton, HTMLHarmonySwitchElement, HTMLHarmonyToggleButtonElement } from 'harmony-ui';
import marketHistoryCSS from '../../css/content.css';
import { readyPromise } from './ready';
import { Recorder } from './recorder';

export class Application {
	#webGLAllowed = true;
	#webGL2Allowed = false;
	#webGPUAllowed = true;
	#htmlPanel?: ShadowRoot;
	#recorder = new Recorder();
	#webGLMethods = new Map<string, Function>();
	#webGL2Methods = new Map<string, Function>();
	#webGLInitialized = false;
	#webGL2Initialized = false;

	#originalOffscreenCanvasGetContext = window.OffscreenCanvas.prototype.getContext;
	#originalHTMLCanvasElementGetContext = window.HTMLCanvasElement.prototype.getContext;

	constructor() {
		this.#initOffscreenCanvas();
		this.#initHTMLCanvasElement();
	}

	async #initPanel(): Promise<void> {
		if (this.#htmlPanel) {
			return;
		}

		defineHarmonyToggleButton();
		defineHarmonySwitch();

		// We wait for page readiness. document.body doesn't exist before that
		await readyPromise;

		this.#htmlPanel = createShadowRoot('div', {
			adoptStyles: [marketHistoryCSS],
			parent: document.body,
			//innerText: 'WebGPU',
			childs: [
				createElement('div', {
					class: 'header',
					childs: [
						createElement('harmony-toggle-button', {
							state: false,
							childs: [
								createElement('div', {
									slot: 'off',
									innerHTML: fullscreenSVG,
								}),
								createElement('div', {
									slot: 'on',
									innerHTML: fullscreenExitSVG,
								}),
							],
							$change: (event: Event) => addRemoveClass(this.#htmlPanel!.host as HTMLElement, 'maximized', (event.target as HTMLHarmonyToggleButtonElement).state),
							//this.#setPanelMaximized((event.target as HTMLHarmonyToggleButtonElement).state),
						}),
						createElement('span', {
							class: 'extension-name',
							innerText: 'WebGPU inspector',
						}),
					],
				}),
				createElement('div', {
					class: 'toolbar',
					childs: [
						createElement('span', {
							innerHTML: radioButtonCheckedSVG,
						}),
						createElement('harmony-switch', {
							'data-i18n': '#enable_webgl',
							state: this.#webGLAllowed,
							$change: (event: Event) => this.#webGLAllowed = (event.target as HTMLHarmonySwitchElement).state as boolean,
						}),
						createElement('harmony-switch', {
							'data-i18n': '#enable_webgl2',
							state: this.#webGL2Allowed,
							$change: (event: Event) => this.#webGL2Allowed = (event.target as HTMLHarmonySwitchElement).state as boolean,
						}),
						createElement('harmony-switch', {
							'data-i18n': '#enable_webgpu',
							state: this.#webGPUAllowed,
							$change: (event: Event) => this.#webGPUAllowed = (event.target as HTMLHarmonySwitchElement).state as boolean,
						}),
					],
				}),
				createElement('div', {
					class: 'content',
					childs: [
						createElement('div', {
							class: 'filters',
							childs: [
							],
						}),
						createElement('div', {
							class: 'records',
							childs: [
							],
						}),
					],
				}),
			],
		});
	}

	#initOffscreenCanvas(): void {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const that = this;

		// Note: we can't use an arrow function
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		window.OffscreenCanvas.prototype.getContext = function (this: OffscreenCanvas, contextId: OffscreenRenderingContextId, options?: any): OffscreenRenderingContext | null {
			switch (contextId) {
				case 'webgl':
					if (!that.#webGLAllowed) {
						return null;
					}
					that.#initWebGLHook();
					void that.#initPanel();
					break;
				case 'webgl2':
					if (!that.#webGL2Allowed) {
						return null;
					}
					that.#initWebGL2Hook();
					void that.#initPanel();
					break;
				case 'webgpu':
					if (!that.#webGPUAllowed) {
						return null;
					}
					void that.#initPanel();
					break;
			}
			return that.#originalOffscreenCanvasGetContext.call(this, contextId, options,);
		} as any;
	}

	#initHTMLCanvasElement(): void {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const that = this;

		// Note: we can't use an arrow function
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		window.HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, contextId: OffscreenRenderingContextId, options?: any): RenderingContext | null {
			switch (contextId) {
				case 'webgl':
					if (!that.#webGLAllowed) {
						return null;
					}
					that.#initWebGLHook();
					void that.#initPanel();
					break;
				case 'webgl2':
					if (!that.#webGL2Allowed) {
						return null;
					}
					that.#initWebGL2Hook();
					void that.#initPanel();
					break;
				case 'webgpu':
					if (!that.#webGPUAllowed) {
						return null;
					}
					void that.#initPanel();
					break;
			}
			return that.#originalHTMLCanvasElementGetContext.call(this, contextId, options,);
		} as any;
	}

	#initWebGLHook(): void {
		if (this.#webGLInitialized) {
			return;
		}
		this.#webGLInitialized = true;

		const canvas = createElement('canvas') as HTMLCanvasElement;
		const webGLContext = this.#originalHTMLCanvasElementGetContext.call(canvas, 'webgl');
		console.info(webGLContext);

		if (!webGLContext) {
			console.error('Unable to create a WebGL context');
			return;
		}

		const proto = Object.getPrototypeOf(webGLContext);
		for (const propertyName of Object.getOwnPropertyNames(proto)) {
			const propertyValue = (webGLContext as any)[propertyName];
			if (typeof propertyValue !== 'function') {
				continue;
			}

			this.#webGLMethods.set(propertyName, propertyValue);
			const that = this;

			(window.WebGLRenderingContext.prototype as any)[propertyName] = function (...args: any[]): any {
				that.#recorder.addRecord('webgl', propertyName, args);
				if (!that.#webGLAllowed) {
					return null;
				}
				return propertyValue.apply(this, args);
			};
		}
	}

	#initWebGL2Hook(): void {
		if (this.#webGL2Initialized) {
			return;
		}
		this.#webGL2Initialized = true;
		const canvas = createElement('canvas') as HTMLCanvasElement;
		const webGL2Context = this.#originalHTMLCanvasElementGetContext.call(canvas, 'webgl2');
		console.info(webGL2Context);

		if (!webGL2Context) {
			console.error('Unable to create a WebGL2 context');
		}

		const proto = Object.getPrototypeOf(webGL2Context);
		for (const propertyName of Object.getOwnPropertyNames(proto)) {
			const propertyValue = (webGL2Context as any)[propertyName];
			if (typeof propertyValue !== 'function') {
				continue;
			}

			this.#webGL2Methods.set(propertyName, propertyValue);
			const that = this;

			(window.WebGL2RenderingContext.prototype as any)[propertyName] = function (...args: any[]): any {
				that.#recorder.addRecord('webgl2', propertyName, args);
				if (!that.#webGL2Allowed) {
					return null;
				}
				return propertyValue.apply(this, args);
			};
		}
	}
	/*
	#initWebGL2Hook(): void {
		const canvas = createElement('canvas') as HTMLCanvasElement;
		const webGL2Context = this.#originalHTMLCanvasElementGetContext.call(canvas, 'webgl2');
		console.info(webGL2Context);

		if (!webGL2Context) {
			console.error('Unable to create a WebGL2 context');
		}

		//Object.getOwnPropertyNames(WebGL2RenderingContext.prototype)

		//console.log(Object.getOwnPropertyNames(WebGL2RenderingContext.prototype).filter(function (p) {
		//console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(webGL2Context)).filter(function (p) {
		const proto = Object.getPrototypeOf(webGL2Context);
		console.log(proto);
		console.log(Object.getOwnPropertyNames(proto));
		console.log(Object.getOwnPropertyNames(webGL2Context));
		//console.log(Object.getOwnPropertyNames(webGL2Context.prototype));
		console.log(Object.getOwnPropertyNames(proto).filter(function (p) {
			//console.log(webGL2Context[p])
			if (webGL2Context[p] === undefined) {
				console.log(p)
			}
			return typeof webGL2Context[p] === 'function';
		}));

		console.log(typeof webGL2Context['beginQuery'])
	}
	*/

}
