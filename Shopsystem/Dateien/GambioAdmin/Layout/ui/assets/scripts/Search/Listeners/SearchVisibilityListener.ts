import SearchElements from '../SearchElements';
import {hasParent} from 'core/dom';

export default class SearchVisibilityListener {
	constructor(private readonly elements: SearchElements) {
	}
	
	/**
	 * Shows the search sections.
	 */
	public show = (): void => {
		this.elements.searchSectionsContainer.classList.add('active');
	}
	
	/**
	 * Hides the search sections.
	 *
	 * @param event
	 */
	public hide = (event: Event): void => {
		const target = event.target as HTMLElement;
		const clickedOnSearch = target.contains(this.elements.inputContainer)
			|| hasParent(this.elements.inputContainer, target);
		
		if (!clickedOnSearch) {
			this.elements.searchSectionsContainer.classList.remove('active');
		}
	}
}