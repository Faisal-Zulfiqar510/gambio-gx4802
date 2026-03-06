import LayoutSections from '../LayoutSections';
import {safeGetParentElement, safeQuerySelector} from 'core/dom';

enum ContentHeaderState {
	Visible,
	Invisible,
}

/**
 * Content header scroll listener.
 */
export default class ContentHeaderScrollListener {
	private readonly element: HTMLElement;
	private readonly parent: HTMLElement;
	private readonly headerHeight: number;
	private readonly _isContentHeaderAvailable: boolean;
	
	private scrollPosition: number = 0;
	private state: ContentHeaderState = ContentHeaderState.Invisible;
	private isAnimating: boolean = false;
	
	/**
	 * Content header scroll listener constructor.
	 * @param {LayoutSections} sections
	 */
	constructor(sections: LayoutSections) {
		try {
			this.element = safeQuerySelector('.content-header', sections.content);
			if(this.element.classList.contains('not-scrollable')) {
                this._isContentHeaderAvailable = false;
            } else {
			    this._isContentHeaderAvailable = true;
            }
		} catch (e) {
			this.element = safeQuerySelector('body');
			this._isContentHeaderAvailable = false;
		}
		
		this.parent = safeGetParentElement(this.element);
		this.headerHeight = sections.header.offsetHeight;
	}
	
	/**
	 * Handles to hide and show the content header based on scroll behaviour.
	 */
	public handle = (): void => {
		if (!this.isVisibilityChangeRequired()) {
			return;
		}
		
		const isScrollingDown = this.scrollPosition - window.scrollY < 0;
		if (isScrollingDown && this.isVisible()) {
			this.hide();
		} else if (!isScrollingDown && this.isInvisible()) {
			this.display();
		}
		this.scrollPosition = window.scrollY;
	}
	
	public isContentHeaderAvailable = (): boolean => {
		return this._isContentHeaderAvailable;
	}
	
	/**
	 * Hides the content header.
	 */
	private hide = (): void => {
		this.state = ContentHeaderState.Invisible;
		
		this.animate(this.headerHeight, 0, this.disableCustomStyles);
	}
	
	/**
	 * Displays the content header.
	 */
	private display = (): void => {
		this.state = ContentHeaderState.Visible;
		this.element.style.position = 'fixed';
		this.element.style.zIndex = '5';
		this.parent.style.paddingTop = `${this.element.offsetHeight}px`;
		
		this.animate(0, this.headerHeight);
	}
	
	/**
	 * Checks if a visibility change is required.
	 *
	 * If we currently perform an animation, or reached the top of the page, we dont have to change the
	 * content header visibility, so this method will return false.
	 */
	private isVisibilityChangeRequired = (): boolean => {
		if (this.isAnimating) {
			return false;
		}
		if (this.isScrolledToTop()) {
			this.disableCustomStyles();
			this.scrollPosition = window.scrollY;
			return false;
		}
		
		return true;
	}
	
	/**
	 * Disables custom styles.
	 *
	 * To archive a smooth animation, we apply "position" and "padding-top" to the content header element and parent,
	 * respectively. The method removes the custom styles from the elements.
	 */
	private disableCustomStyles = (): void => {
		this.element.style.position = '';
		// this.element.style.zIndex = '0';
		this.parent.style.paddingTop = '';
	}
	
	/**
	 * Checks if the viewport is scrolled to the most top of the page.
	 */
	private isScrolledToTop = (): boolean => {
		return window.scrollY === 0;
	}
	
	/**
	 * Utility method to check if the content header is currently visible.
	 */
	private isVisible = (): boolean => {
		return this.state === ContentHeaderState.Visible;
	}
	
	/**
	 * Utility method to check if the content header is currently invisible.
	 */
	private isInvisible = (): boolean => {
		return this.state === ContentHeaderState.Invisible;
	}
	
	/**
	 * Animates the content header.
	 * The method modifies the content headers top css attribute.
	 *
	 * @param from
	 * @param to
	 * @param callback
	 */
	private animate = (from: number, to: number, callback?: () => void): void => {
		this.isAnimating = true;
		const fromStr = from === 0 ? '0' : `${from.toString()}px`;
		const toStr = to === 0 ? '0' : `${to.toString()}px`;
		const keyframes = {
			top: [fromStr, toStr]
		};
		const options = {
			duration: 200
		};
		
		this.element.animate(keyframes, options).finished.then(() => {
			if (callback) {
				callback();
			}
			this.element.style.top = toStr;
			this.isAnimating = false;
		});
	}
}
