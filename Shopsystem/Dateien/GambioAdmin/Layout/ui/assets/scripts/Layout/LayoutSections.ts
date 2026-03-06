/**
 * Layout sections.
 *
 * This class contains the main sections of the gambio admin
 * as properties.
 */
export default class LayoutSections {
	/**
	 * Layout sections constructor.
	 *
	 * @param {HTMLElement} container
	 * @param {HTMLElement} header
	 * @param {HTMLElement} menu
	 * @param {HTMLElement} content
	 * @param {HTMLElement} footer
	 */
	constructor(public readonly container: HTMLElement,
	            public readonly header: HTMLElement,
	            public readonly menu: HTMLElement,
	            public readonly content: HTMLElement,
	            public readonly footer: HTMLElement) {
	}
}