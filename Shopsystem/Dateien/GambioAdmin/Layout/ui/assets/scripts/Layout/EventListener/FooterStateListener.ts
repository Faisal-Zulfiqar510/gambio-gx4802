import {FOOTER_STATE_UPDATED} from 'layout/events';
import LayoutSections from '../LayoutSections';

/**
 * Footer state listener.
 */
export default class FooterStateListener {
	private readonly sections: LayoutSections;
	
	/**
	 * Footer state listener constructor.
	 * @param {LayoutSections} sections
	 */
	constructor(sections: LayoutSections) {
		this.sections = sections;
	}
	
	/**
	 * Toggles footer state (whether fixed or not) based on the
	 * current clients vertical scroll axis.
	 */
	handle = (): void => {
		const isEndOfPage = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
		const isFixed = this.sections.footer.classList.contains('fixed');
		
		if (!isEndOfPage) {
			this.sections.footer.classList.add('fixed');
		} else {
			this.sections.footer.classList.remove('fixed');
		}
		
		if ((isEndOfPage && isFixed) || (!isEndOfPage && !isFixed)) {
			window.dispatchEvent(new Event(FOOTER_STATE_UPDATED));
		}
	}
    
    /**
     * Sets the footer state to fixed.
     */
    fixFooter = (): void => {
        this.sections.footer.classList.add('fixed');
        window.dispatchEvent(new Event(FOOTER_STATE_UPDATED));
    }
}