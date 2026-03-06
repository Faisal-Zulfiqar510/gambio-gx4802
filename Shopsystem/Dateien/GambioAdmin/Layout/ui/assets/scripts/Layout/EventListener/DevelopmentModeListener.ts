import LayoutSections from '../LayoutSections';
import {set as setUserConfig} from 'core/UserConfigurationService';

/**
 * Development mode listener.
 */
export default class DevelopmentModeListener {
	private readonly item: Element | null;
	
	/**
	 * Development mode listener constructor.
	 * @param {LayoutSections} sections
	 */
	constructor(sections: LayoutSections) {
		this.item = sections.header.querySelector('.dev-mode');
	}
	
	/**
	 * Handles toggling of development mode.
	 */
	public handle = async (): Promise<void> => {
		if (this.item) {
			if (this.item.classList.contains('enabled')) {
				await setUserConfig('jsNextDev', '0');
			} else {
				await setUserConfig('jsNextDev', '1');
			}
			this.item.classList.toggle('enabled');
		}
	}
}