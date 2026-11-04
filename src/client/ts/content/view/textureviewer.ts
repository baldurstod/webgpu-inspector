import { createElement, I18n, shadowRootStyle } from 'harmony-ui';
import textureViewerCSS from '../../../css/textureviewer.css';
import { ViewComponent } from './component';

export class TextureViewer implements ViewComponent {
	readonly htmlElement = createElement('div');
	#shadowRoot?: ShadowRoot;

	constructor() {
		this.#shadowRoot = this.htmlElement.attachShadow({ mode: 'closed' });
		I18n.observeElement(this.#shadowRoot);
		void shadowRootStyle(this.#shadowRoot, textureViewerCSS);

		createElement('div', {
			class: 'editor',
			parent: this.#shadowRoot,
			childs: [
			],
		});
	}
}
