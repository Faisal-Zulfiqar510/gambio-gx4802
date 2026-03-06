export default class SearchElements {
	constructor(public readonly inputContainer: HTMLElement,
	            public readonly input: HTMLInputElement,
	            public readonly searchSections: NodeListOf<HTMLElement>,
	            public readonly searchSectionsContainer: HTMLElement) {
	}
}