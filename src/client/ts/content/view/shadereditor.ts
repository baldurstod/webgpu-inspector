import { Ace } from 'ace-builds';
import { loadScript } from 'harmony-browser-utils';
import { createElement, I18n, shadowRootStyle } from 'harmony-ui';
import shaderEditorCSS from '../../../css/shadereditor.css';
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
	//#htmlShaderSource: HTMLTextAreaElement;
	#shaders = new Map<string, ShaderRecord>()
	#selectedShader?: string;
	#shaderEditor?: Ace.Editor;
	#sessions = new Map<string, Ace.EditSession>;

	constructor() {
		this.#shadowRoot = this.htmlElement.attachShadow({ mode: 'closed' });
		I18n.observeElement(this.#shadowRoot);
		void shadowRootStyle(this.#shadowRoot, shaderEditorCSS);

		let editorContainer;
		createElement('div', {
			class: 'editor',
			parent: this.#shadowRoot,
			childs: [
				this.#htmlShaderSelect = createElement('select', {
					$input: (event: Event) => {
						this.#selectShader((event.target as HTMLSelectElement).value);
						//const selectedOption = (event.target as HTMLSelectElement).selectedOptions[0];
						//if (selectedOption) {
						/*
						if (selectedOption) {
							if (selectedOption.getAttribute('data-shader')) {
								this.setEditorShaderName((event.target as HTMLSelectElement).value);
							}
							if (selectedOption.getAttribute('data-include')) {
								this.setEditorIncludeName((event.target as HTMLSelectElement).value);
							}
						}
						*/
					}
				}) as HTMLSelectElement,
				//this.#htmlShaderSource = createElement('textarea') as HTMLTextAreaElement,
				this.#htmlRecompile = createElement('button', {
					i18n: '#recompile',
					$click: () => this.#recompileShader(),
				}) as HTMLButtonElement,
				editorContainer = createElement('div', { style: 'flex:1;' }),
			],
		});

		Controller.addEventListener('shadersource', (event) => {
			//console.log(event.detail);
			this.#shaders.set(event.detail.name, event.detail);
			this.#reloadShaderList();
		});


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

		if (!this.#selectedShader) {
			this.#selectShader(this.#htmlShaderSelect.value);
		}
	}

	#selectShader(name: string): void {
		if (name === this.#selectedShader) {
			return;
		}

		this.#selectedShader = name;

		console.debug('shader selected', name);
		const shader = this.#shaders.get(name);
		if (!shader) {
			return;
		}
		//this.#htmlShaderSource.value = shader.source ?? '';

		if (!this.#shaderEditor) {
			return;
		}

		const editSession = this.#getSession(name);
		/*
		if (this.#htmlShaderNameSelect) {
			this.#htmlShaderNameSelect.value = shaderName;
		}
			*/

		this.#shaderEditor.setSession(editSession);

		//this.#shaderType = source.getType();
		//this.#editMode = EDIT_MODE_SHADER;
		//const code = source.getSource();
		//this.#shaderEditor.setValue(code);
		editSession.doc.setValue(shader.source ?? '');
		//ShaderManager.setCustomSource(this.#shaderType, this.#editorShaderName, code);

		//this.#setAnnotations(this.#editorShaderName);
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
		})
	}
}
