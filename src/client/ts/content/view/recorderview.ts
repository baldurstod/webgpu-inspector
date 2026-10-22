import { createElement, hide, I18n, shadowRootStyle, show } from 'harmony-ui';
import recorderCSS from '../../../css/recorder.css';
import { Controller } from '../controller';
import { Recorder } from '../recorder';
import { ViewComponent } from './component';

const ACE_URL = './assets/js/ace-builds/src-min/ace.js'

type RecordView = {
	top: number;
	html: HTMLElement;
}

export class RecorderView implements ViewComponent {
	readonly htmlElement = createElement('div');
	#shadowRoot?: ShadowRoot;
	#htmlRecordsContainer?: HTMLElement;
	#htmlItemsContainerSpacer?: HTMLElement;
	#recorder: Recorder;
	#htmlRecords = new Map<number, RecordView>();

	constructor(recorder: Recorder) {
		Controller.addEventListener('requestanimationframe', (event) => this.#requestAnimationFrame(event.detail));
		this.#recorder = recorder;
		this.#shadowRoot = this.htmlElement.attachShadow({ mode: 'closed' });
		I18n.observeElement(this.#shadowRoot);
		void shadowRootStyle(this.#shadowRoot, recorderCSS);

		this.#htmlRecordsContainer = createElement('div', {
			class: 'records',
			parent: this.#shadowRoot,
			attributes: {
				tabindex: '1',
			},
			child: this.#htmlItemsContainerSpacer = createElement('div', { style: 'width:100%;', }),// This element force records to use as much width as they can
		});
		this.#htmlRecordsContainer.addEventListener('scroll', () => this.#handleItemsScroll(), { passive: true });

		new ResizeObserver(() => this.#refreshItems()).observe(this.#htmlRecordsContainer);
	}

	#requestAnimationFrame(time: DOMHighResTimeStamp) {
		//console.info(this.#recorder.getRecords().size);
		this.#refreshItems()
	}

	#refreshItems(): void {
		// Ensure html is initialized
		//this.getHTMLElement();
		//this.#htmlItemsContainer!.replaceChildren();
		for (const [, record] of this.#htmlRecords) {
			hide(record.html);
		}

		//const selectedItems = ItemManager.getSelectedItems();
		//const excludedItems = { e: 0 };
		//const [items, conflictingItems] = ItemManager.getFilteredItems(excludedItems);

		const w = this.#htmlRecordsContainer!.clientWidth;
		const elementSize = /*OptionsManager.getItem('app.css.variables.item-manager-item-size') as number ??*/ 20;
		const columns = 1;// w / elementSize;
		const offset = (columns % 1) * elementSize / 2;

		let row = 0;
		let column = 0;
		let k = 0;
		for (const record of this.#recorder.getRecords()) {
			if (++k > 100) {
				break;
			}
			let htmlRecord = this.#htmlRecords.get(record.recordId);
			if (htmlRecord) {
				//this.#htmlItemsContainer?.append(htmlItem);
				show(htmlRecord.html);
			} else {
				/*
				htmlRecord = createElement('item-manager-item', {
					properties: {
						item: item,
					},
					//parent: this.#htmlItemsContainer,
					$click: (event: Event) => {
						if (event.currentTarget == event.target) {
							Controller.dispatchEvent<ItemTemplate>(ControllerEvent.ItemClicked, { detail: item });
						}
					},
				}) as ItemManagerItem;
				 */
				htmlRecord = {
					html: createElement('div', {
						innerText: record.functionName,
					}),
					top: 0,
				};

				this.#htmlRecords.set(record.recordId, htmlRecord);
			}

			htmlRecord.html.style.position = 'absolute';
			htmlRecord.top = row * elementSize;
			//htmlRecord.left = column * elementSize + offset;
			htmlRecord.html.style.top = `${htmlRecord.top}px`;
			//htmlRecord.html.style.left = `${htmlRecord.left}px`;

			++column;
			if (column + 1 > columns) {
				// Wrap to the next row
				column = 0;
				++row;
			}
		}

		this.#htmlItemsContainerSpacer!.style.height = `${row * elementSize + 200}px`;


		//this.#refreshActiveListAndConflicts();
		//this.#updateFilters();
		//this.#setFilteredItems(excludedItems.e);
		this.#handleItemsScroll();
	}

	#handleItemsScroll(): void {
		const scrollTop = this.#htmlRecordsContainer!.scrollTop;

		for (const [, item] of this.#htmlRecords) {
			if (item.top + 200 > scrollTop && item.top < scrollTop + this.#htmlRecordsContainer!.clientHeight) {
				this.#htmlRecordsContainer!.append(item.html);
			} else {
				item.html.remove();
			}
		}
	}
}
