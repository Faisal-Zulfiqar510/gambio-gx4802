import SearchElements from '../SearchElements';
import {safeQuerySelector} from 'core/dom';

export default class SearchInputListener {
	constructor(private readonly elements: SearchElements) {
	}
	
	/**
	 * Updates the search section items.
	 * Prepends the search input to the section label.
	 *
	 * @param {Event} event
	 */
	public updateSections = (event: Event): void => {
		const target = event.target as HTMLInputElement;
		
		this.elements.searchSections.forEach((section: HTMLElement): void => {
			const placeholder = safeQuerySelector('.search-placeholder', section);
			placeholder.textContent = target.value;
		});
	}
}