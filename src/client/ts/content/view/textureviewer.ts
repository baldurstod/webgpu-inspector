import { createElement, I18n, shadowRootStyle } from 'harmony-ui';
import textureViewerCSS from '../../../css/textureviewer.css';
import { ContextType } from '../record';
import { ViewComponent } from './component';

export class TextureViewer implements ViewComponent {
	readonly htmlElement = createElement('div');
	#shadowRoot?: ShadowRoot;
	#htmlTextures: HTMLElement;

	constructor() {
		this.#shadowRoot = this.htmlElement.attachShadow({ mode: 'closed' });
		I18n.observeElement(this.#shadowRoot);
		void shadowRootStyle(this.#shadowRoot, textureViewerCSS);

		this.#htmlTextures = createElement('div', {
			class: 'textures',
			parent: this.#shadowRoot,
			childs: [
			],
		});
	}

	updateTexture(contextType: ContextType, texture: WebGLTexture, image: HTMLImageElement): void {
		this.#htmlTextures.append(image);
	}
}
