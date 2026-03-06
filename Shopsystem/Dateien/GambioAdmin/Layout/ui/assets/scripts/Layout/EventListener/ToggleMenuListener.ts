import {MENU_TOGGLED} from 'layout/events';
import LayoutSections from '../LayoutSections';
import {set as setUserConfig} from 'core/UserConfigurationService';

/**
 * Toggle menu listener.
 */
export default class ToggleMenuListener {
	private readonly sections: LayoutSections;
	
	/**
	 * Toggle menu listener constructor.
	 * @param {LayoutSections} sections
	 */
	constructor(sections: LayoutSections) {
		this.sections = sections;
	}
	
	/**
	 * Toggles menu state classes on menu trigger, menu and admin container elements.
	 */
	public handle = async (): Promise<void> => {
		const selectors = [
			this.sections.footer.querySelector('.menu-trigger'),
			this.sections.menu,
			this.sections.container,
		];
		let newValue = 'expand';
		selectors.forEach((value: Element | null): void => {
			if (value) {
				if (value.classList.contains('collapse')) {
					value.classList.remove('collapse');
					value.classList.add('expand');
					newValue = 'expand';
				} else if (value.classList.contains('expand')) {
					value.classList.remove('expand');
					value.classList.add('expand-all');
					newValue = 'expand-all';
				} else if (value.classList.contains('expand-all')) {
					value.classList.remove('expand-all');
					value.classList.add('collapse');
					newValue = 'collapse';
				}
			}
		});
		
		await setUserConfig('menuVisibility', newValue);
		window.dispatchEvent(new Event(MENU_TOGGLED));
	}
}