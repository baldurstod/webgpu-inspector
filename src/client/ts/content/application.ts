import { fullscreenExitSVG, fullscreenSVG } from 'harmony-svg';
import { addRemoveClass, createElement, createShadowRoot, defineHarmonySwitch, defineHarmonyTab, defineHarmonyTabGroup, defineHarmonyToggleButton, HTMLHarmonySwitchElement, HTMLHarmonyToggleButtonElement, I18n } from 'harmony-ui';
import { Map2 } from 'harmony-utils';
import marketHistoryCSS from '../../css/content.css';
import english from '../../json/i18n/english.json';
import french from '../../json/i18n/french.json';
import { addMethod } from './methods';
import { readyPromise } from './ready';
import { ContextType } from './record';
import { Recorder } from './recorder';
import { ShaderEditor } from './view/shadereditor';

const SUFFIX = '-webgpu-inspector';

export class Application {
	#allowed: { webgl: boolean, webgl2: boolean, webgpu: boolean } = { webgl: true, webgl2: true, webgpu: true };
	#htmlPanel?: ShadowRoot;
	#htmlShaderEditor?: ShaderEditor;
	#recorder = new Recorder();
	#methods = new Map2<ContextType, string, Function>();
	#webGLInitialized: { webgl: boolean, webgl2: boolean } = { webgl: false, webgl2: false };
	#originalOffscreenCanvasGetContext = window.OffscreenCanvas.prototype.getContext;
	#originalHTMLCanvasElementGetContext = window.HTMLCanvasElement.prototype.getContext;
	#originalRequestAnimationFrame = window.requestAnimationFrame;
	#originalCancelAnimationFrame = window.cancelAnimationFrame;

	constructor() {
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

		this.#htmlShaderEditor = new ShaderEditor();

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
										this.#allowed.webgl = state;
										this.#allowed.webgl2 = state;
										this.#allowed.webgpu = state;

										gl.state = state;
										gl2.state = state;
										gpu.state = state;
									},
								}),
								gl = createElement('harmony-switch' + SUFFIX, {
									'data-i18n': '#enable_webgl',
									state: this.#allowed.webgl,
									$change: (event: Event) => this.#allowed.webgl = (event.target as HTMLHarmonySwitchElement).state as boolean,
								}) as HTMLHarmonySwitchElement,
								gl2 = createElement('harmony-switch' + SUFFIX, {
									'data-i18n': '#enable_webgl2',
									state: this.#allowed.webgl2,
									$change: (event: Event) => this.#allowed.webgl2 = (event.target as HTMLHarmonySwitchElement).state as boolean,
								}) as HTMLHarmonySwitchElement,
								gpu = createElement('harmony-switch' + SUFFIX, {
									'data-i18n': '#enable_webgpu',
									state: this.#allowed.webgpu,
									$change: (event: Event) => this.#allowed.webgpu = (event.target as HTMLHarmonySwitchElement).state as boolean,
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
								innerText: 'records',
							}),
							createElement('harmony-tab' + SUFFIX, {
								'data-i18n': '#shaders',
								child: this.#htmlShaderEditor.htmlElement,
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
					if (!that.#allowed.webgl) {
						return null;
					}
					that.#initWebGLHook();
					void that.#initPanel();
					break;
				case 'webgl2':
					if (!that.#allowed.webgl2) {
						return null;
					}
					that.#initWebGL2Hook();
					void that.#initPanel();
					break;
				case 'webgpu':
					if (!that.#allowed.webgpu) {
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
					if (!that.#allowed.webgl) {
						return null;
					}
					that.#initWebGLHook();
					void that.#initPanel();
					break;
				case 'webgl2':
					if (!that.#allowed.webgl2) {
						return null;
					}
					that.#initWebGL2Hook();
					void that.#initPanel();
					break;
				case 'webgpu':
					if (!that.#allowed.webgpu) {
						return null;
					}
					void that.#initPanel();
					break;
			}
			return that.#originalHTMLCanvasElementGetContext.call(this, contextId, options,);
		} as any;
	}

	#initWebGLHook(): void {
		this.#initWebAnyHook('webgl');
	}

	#initWebGL2Hook(): void {
		this.#initWebAnyHook('webgl2');
	}

	#initWebAnyHook(contextId: 'webgl' | 'webgl2'): void {
		if (this.#webGLInitialized[contextId]) {
			return;
		}
		this.#webGLInitialized[contextId] = true;

		const canvas = createElement('canvas') as HTMLCanvasElement;
		const webGLAnyContext = this.#originalHTMLCanvasElementGetContext.call(canvas, contextId);

		if (!webGLAnyContext) {
			console.error(`Unable to create a ${contextId} context`);
		}

		const proto = Object.getPrototypeOf(webGLAnyContext);
		const context = contextId === 'webgl' ? window.WebGLRenderingContext : window.WebGL2RenderingContext;
		for (const propertyName of Object.getOwnPropertyNames(proto)) {
			const propertyValue = (webGLAnyContext as any)[propertyName];
			if (typeof propertyValue !== 'function') {
				continue;
			}

			this.#methods.set(contextId, propertyName, propertyValue);
			addMethod(contextId, propertyName, propertyValue);
			const that = this;

			(context.prototype as any)[propertyName] = function (...args: any[]): any {
				if (!that.#allowed[contextId]) {
					return null;
				}
				const result = propertyValue.apply(this, args);
				that.#recorder.addRecord(contextId, this, propertyName, args, result);

				return result;
			};
		}
	}
}
