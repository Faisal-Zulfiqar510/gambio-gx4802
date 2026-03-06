import LayoutBootstrapper from '../LayoutBootstrapper';
import LayoutDescriptor from '../LayoutDescriptor';
import {safeQuerySelector, safeQuerySelectorAll} from 'core/dom';
import SearchElements from './SearchElements';
import SearchListeners from './SearchListeners';

/**
 * Search bootstrapper.
 */
export default class Search implements LayoutBootstrapper {
	private readonly elements: SearchElements;
	private readonly listeners: SearchListeners;
	
	/**
	 * Search bootstrapper constructor.
	 *
	 * @param {LayoutDescriptor} descriptor
	 */
	constructor(descriptor: LayoutDescriptor) {
		const header = descriptor.sections.header
		
		this.elements = new SearchElements(
			safeQuerySelector('.search-bar-input', header),
			safeQuerySelector('.search-bar-input input', header) as HTMLInputElement,
			safeQuerySelectorAll('.search-section', header),
			safeQuerySelector('.search-bar-sections', header)
		);
		this.listeners = new SearchListeners(this.elements);
	}
	
	/**
	 * Layout search bootstrapper.
	 *
	 * Assigns all search events to the layout.
	 */
	public boot = async (): Promise<void> => {
		this.elements.inputContainer.addEventListener('click', this.listeners.visibility.show);
		window.addEventListener('click', this.listeners.visibility.hide);
		
		this.elements.input.addEventListener('input', this.listeners.input.updateSections);
		this.elements.input.addEventListener('keydown', this.listeners.search.handleHotkey);
		
		this.elements.searchSections.forEach((section: HTMLElement): void => {
			const searchArea = section.dataset.searchArea;
			if (searchArea) {
				section.addEventListener('click', () => this.listeners.search.search(searchArea));
			}
		});
	}
}