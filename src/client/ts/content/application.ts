import { fullscreenExitSVG, fullscreenSVG } from 'harmony-svg';
import { addRemoveClass, createElement, createShadowRoot, defineHarmonySwitch, defineHarmonyTab, defineHarmonyTabGroup, defineHarmonyToggleButton, HTMLHarmonySwitchElement, HTMLHarmonyToggleButtonElement, I18n } from 'harmony-ui';
import marketHistoryCSS from '../../css/content.css';
import english from '../../json/i18n/english.json';
import french from '../../json/i18n/french.json';
import { readyPromise } from './ready';
import { Recorder } from './recorder';

const SUFFIX = '-webgpu-inspector';

export class Application {
	#webGLAllowed = true;
	#webGL2Allowed = true;
	#webGPUAllowed = true;
	#htmlPanel?: ShadowRoot;
	#recorder = new Recorder();
	#webGLMethods = new Map<string, Function>();
	#webGL2Methods = new Map<string, Function>();
	#webGLInitialized = false;
	#webGL2Initialized = false;
	#customRegistry!: CustomElementRegistry;
	#originalOffscreenCanvasGetContext = window.OffscreenCanvas.prototype.getContext;
	#originalHTMLCanvasElementGetContext = window.HTMLCanvasElement.prototype.getContext;
	#originalRequestAnimationFrame = window.requestAnimationFrame;
	#originalCancelAnimationFrame = window.cancelAnimationFrame;

	constructor() {
		try {
			this.#customRegistry = new CustomElementRegistry();
		} catch (e) {
			console.error('Unable to create custom registry:', e);
		}
		this.#initRequestAnimationFrame();
		this.#initOffscreenCanvas();
		this.#initHTMLCanvasElement();
		void this.#initI18n();
	}

	async #initI18n(): Promise<void> {
		await readyPromise;
		I18n.setOptions({ translations: [english, french] });
		I18n.start();
	}

	async #initPanel(): Promise<void> {
		if (this.#htmlPanel) {
			return;
		}

		defineHarmonyToggleButton(SUFFIX);
		defineHarmonySwitch(SUFFIX);
		defineHarmonyTabGroup(SUFFIX);
		defineHarmonyTab(SUFFIX);

		// We wait for page readiness. document.body doesn't exist before that
		await readyPromise;


		let gl: HTMLHarmonySwitchElement, gl2: HTMLHarmonySwitchElement, gpu: HTMLHarmonySwitchElement;

		this.#htmlPanel = createShadowRoot('div', {
			adoptStyles: [marketHistoryCSS],
			parent: document.body,
			//innerText: 'WebGPU',
			childs: [
				createElement('div', {
					class: 'header',
					childs: [
						createElement('harmony-toggle-button' + SUFFIX, {
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
						createElement('span', {
							class: 'toggles',
							childs: [
								createElement('harmony-switch' + SUFFIX, {
									'data-i18n': '#enable_all',
									state: true,
									$change: (event: Event) => {
										const state = (event.target as HTMLHarmonySwitchElement).state as boolean;
										this.#webGLAllowed = state;
										this.#webGL2Allowed = state;
										this.#webGPUAllowed = state;

										gl.state = state;
										gl2.state = state;
										gpu.state = state;
									},
								}),
								gl = createElement('harmony-switch' + SUFFIX, {
									'data-i18n': '#enable_webgl',
									state: this.#webGLAllowed,
									$change: (event: Event) => this.#webGLAllowed = (event.target as HTMLHarmonySwitchElement).state as boolean,
								}) as HTMLHarmonySwitchElement,
								gl2 = createElement('harmony-switch' + SUFFIX, {
									'data-i18n': '#enable_webgl2',
									state: this.#webGL2Allowed,
									$change: (event: Event) => this.#webGL2Allowed = (event.target as HTMLHarmonySwitchElement).state as boolean,
								}) as HTMLHarmonySwitchElement,
								gpu = createElement('harmony-switch' + SUFFIX, {
									'data-i18n': '#enable_webgpu',
									state: this.#webGPUAllowed,
									$change: (event: Event) => this.#webGPUAllowed = (event.target as HTMLHarmonySwitchElement).state as boolean,
								}) as HTMLHarmonySwitchElement,
							],
						}),
					],
				}),
				createElement('div', {
					class: 'toolbar',
					childs: [
						/*
						createElement('span', {
							innerHTML: radioButtonCheckedSVG,
						}),
						*/
					],
				}),
				createElement('div', {
					class: 'content',
					child: createElement('harmony-tab-group' + SUFFIX, {
						childs: [
							createElement('harmony-tab' + SUFFIX, {
								'data-i18n': '#records',
								innerText: 'test',
							}),
							createElement('harmony-tab' + SUFFIX, {
								'data-i18n': '#shaders',
								innerText: 'test',
							}),
						],
					}),
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

	#initRequestAnimationFrame(): void {
		window.requestAnimationFrame = (callback: FrameRequestCallback): number => {

			const c: (time: DOMHighResTimeStamp) => void = time => {
				this.#recorder.requestAnimationFrame();
				callback(time);
			}

			return this.#originalRequestAnimationFrame.call(window, c);
		};

		window.cancelAnimationFrame = (handle: number): void => {
			this.#originalCancelAnimationFrame.call(window, handle);
		};
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
