import { Ace } from 'ace-builds';
import { loadScript } from 'harmony-browser-utils';
import { mysterySVG } from 'harmony-svg';
import { createElement, defineHarmonyToggleButton, HTMLHarmonyToggleButtonElement, I18n, shadowRootStyle } from 'harmony-ui';
import shaderEditorCSS from '../../../css/shadereditor.css';
import { SUFFIX } from '../constants';
import { Controller } from '../controller';
import { getRuntimeURL } from '../messages';
import { getShaderType, ShaderRecord } from '../recorder';
import { ViewComponent } from './component';

const ACE_URL = './assets/js/ace-builds/src-min/ace.js'

export class ShaderEditor implements ViewComponent {
	readonly htmlElement = createElement('div');
	#shadowRoot?: ShadowRoot;
	#htmlShaderSelect: HTMLSelectElement;
	#htmlRecompile: HTMLButtonElement;
	#htmlIdentify: HTMLHarmonyToggleButtonElement;
	//#htmlShaderSource: HTMLTextAreaElement;
	#shaders = new Map<string, ShaderRecord>()
	#selectedShader?: string;
	#shaderEditor?: Ace.Editor;
	#sessions = new Map<string, Ace.EditSession>;
	#identify = false;
	#identifiedShader: string | null = null;

	constructor() {
		this.#shadowRoot = this.htmlElement.attachShadow({ mode: 'closed' });
		I18n.observeElement(this.#shadowRoot);
		void shadowRootStyle(this.#shadowRoot, shaderEditorCSS);

		defineHarmonyToggleButton(SUFFIX);

		let editorContainer;
		createElement('div', {
			class: 'editor',
			parent: this.#shadowRoot,
			childs: [
				createElement('div', {
					class: 'select-container',
					childs: [
						this.#htmlShaderSelect = createElement('select', {
							$input: (event: Event) => {
								this.#selectShader((event.target as HTMLSelectElement).value);
							}
						}) as HTMLSelectElement,
						this.#htmlIdentify = createElement('harmony-toggle-button' + SUFFIX, {
							class: 'identify-shader',
							disabled: true,
							state: false,
							'data-i18n': '#identify_shader',
							childs: [
								createElement('div', {
									slot: 'off',
									innerHTML: mysterySVG,
								}),
								createElement('div', {
									slot: 'on',
									class: 'recording-on',
									innerHTML: mysterySVG,
								}),
							],
							$change: (event: Event) => this.#identifyShader((event.target as HTMLHarmonyToggleButtonElement).state),
						}) as HTMLHarmonyToggleButtonElement,
					],
				}),
				//this.#htmlShaderSource = createElement('textarea') as HTMLTextAreaElement,
				this.#htmlRecompile = createElement('button', {
					i18n: '#recompile',
					$click: () => this.#recompileShader(),
				}) as HTMLButtonElement,
				/*
				this.#htmlIdentify = createElement('button', {
					i18n: '#identify',
					$click: () => this.#identifyShader(),
				}) as HTMLButtonElement,
				*/
				createElement('button', {
					i18n: '#reset',
					$click: () => this.#resetShader(),
				}) as HTMLButtonElement,
				editorContainer = createElement('div', { style: 'flex:1;' }),
			],
		});

		Controller.addEventListener('shadersource', (event) => {
			//console.log(event.detail);
			this.#shaders.set(event.detail.name, event.detail);
			this.#reloadShaderList();
		});
		/*
		Controller.addEventListener('shaderdeleted', (event) => {
			this.#shaders.delete(event.detail.name);
			this.#reloadShaderList();
		});
		*/


		void this.#initEditor(editorContainer);

	}

	async #initEditor(container: HTMLElement): Promise<void> {
		const url = await getRuntimeURL(ACE_URL);
		loadScript(url).then(() => this.#initEditor2(container));
	}

	#initEditor2(container: HTMLElement): void {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		this.#shaderEditor = (globalThis as any).ace.edit(container) as Ace.Editor;
		this.#shaderEditor.renderer.attachToShadowRoot();
		//this.#shaderEditor.$blockScrolling = Infinity;
		this.#shaderEditor.setTheme('ace/theme/monokai');
		this.#shaderEditor.getSession().setMode('ace/mode/glsl');
		/*
		this.#shaderEditor.getSession().on('change', () => {
			clearTimeout(this.#recompileTimeout);
			this.#recompileTimeout = setTimeout(() => { this.recompile() }, this.#recompileDelay);//TODO:
		});
		*/
		this.#reloadShaderList();

	}

	#reloadShaderList(): void {
		this.#htmlShaderSelect.innerText = '';

		for (const [, shader] of this.#shaders) {
			const option = createElement('option', {
				class: 'shader-editor-shader-list-shader',
				value: shader.name,
				innerText: `${shader.name} ${getShaderType(shader.type)}`,
				'data-shader': true,
				parent: this.#htmlShaderSelect,
			}) as HTMLOptionElement;

			/*
			if (this.#editMode == EDIT_MODE_SHADER && this.getEditorShaderName() == shaderName) {
				option.selected = true;
			}
			*/
		}

		//display(this.#htmlIdentify, this.#shaders.size > 0);
		this.#htmlIdentify.disabled = this.#shaders.size == 0;

		if (!this.#selectedShader) {
			this.#selectShader(this.#htmlShaderSelect.value);
		} else {
			this.#htmlShaderSelect.value = this.#selectedShader;
		}
	}

	#selectShader(name: string): void {
		if (!this.#shaderEditor) {
			return;
		}

		if (name === this.#selectedShader) {
			return;
		}

		this.#selectedShader = name;

		const shader = this.#shaders.get(name);
		if (!shader) {
			return;
		}

		const editSession = this.#getSession(name);

		this.#shaderEditor.setSession(editSession);

		editSession.doc.setValue(shader.source ?? '');

		// Change the shader identification
		this.#identifyShader(this.#identify);
	}

	#getSession(name: string): Ace.EditSession {
		let session = this.#sessions.get(name);
		if (!session) {
			const ace = (globalThis as any).ace;
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			session = new ace.EditSession('', 'ace/mode/glsl') as Ace.EditSession;
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			session.setUndoManager(new ace.UndoManager());
			/*
			session.on('change', () => {
				clearTimeout(this.#recompileTimeout);
				this.#recompileTimeout = setTimeout(() => { this.recompile() }, this.#recompileDelay);
			});
			*/
		}

		return session;
	}

	#recompileShader(): void {
		const shaderSource = this.#shaderEditor?.getValue();
		if (shaderSource === undefined) {
			return;
		}

		Controller.dispatchEvent('recompileshader', {
			detail: {
				name: this.#htmlShaderSelect.value,
				source: shaderSource,
			}
		});
	}

	#identifyShader(identify: boolean): void {
		this.#identify = identify;

		// Reset the previously identified shader
		if (this.#identifiedShader) {
			Controller.dispatchEvent('resetshader', {
				detail: {
					name: this.#identifiedShader,
				}
			});
		}

		if (identify) {
			this.#identifiedShader = this.#htmlShaderSelect.value;
			Controller.dispatchEvent('identifyshader', {
				detail: {
					name: this.#identifiedShader,
				}
			});
		} else {
			this.#identifiedShader = null;
		}
	}

	#resetShader(): void {
		const shaderSource = this.#shaderEditor?.getValue();
		if (shaderSource === undefined) {
			return;
		}

		Controller.dispatchEvent('resetshader', {
			detail: {
				name: this.#htmlShaderSelect.value,
			}
		});
	}
}
