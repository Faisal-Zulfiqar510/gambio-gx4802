const safeQuerySelector = (selector: string, container?: Element): HTMLElement => {
	const element = container === undefined ? document.querySelector(selector) : container.querySelector(selector);
	if (!element) {
		throw new Error(`Invalid selector (${selector}) provided.`);
	}
	
	return element as HTMLElement;
}

const safeQuerySelectorAll = (selector: string, container?: Element): NodeListOf<HTMLElement> => {
	const elements = container === undefined ? document.querySelectorAll(selector) : container.querySelectorAll(selector);
	if (!elements) {
		throw new Error(`Invalid selector (${selector}) provided.`);
	}
	
	return elements as NodeListOf<HTMLElement>;
}

const safeGetElementById = (id: string): HTMLElement => {
	const element = document.getElementById(id);
	if (!element) {
		throw new Error(`Invalid id selector (${id}) provided.`);
	}
	
	return element;
}

const safeGetParentElement = (element: Element): HTMLElement => {
	const parent = element.parentElement;
	if (!parent) {
		throw new Error('parent element not found!');
	}
	
	return parent;
}

const parentQuerySelector = (selector: string, child: HTMLElement): HTMLElement | null => {
	if (typeof child.matches === 'function' && child.matches(selector)) {
		return child;
	}
	
	let nextParent = child;
	while (nextParent && nextParent.parentElement) {
		nextParent = nextParent.parentElement;
		if (nextParent.matches(selector)) {
			return nextParent;
		}
	}
	
	return null;
}

const safeParentQuerySelector = (selector: string, child: HTMLElement): HTMLElement => {
	const parent = parentQuerySelector(selector, child);
	if (!parent) {
		throw new Error(`Could not find parent of given element with selector "${selector}".`)
	}
	
	return parent;
}

const hasParent = (parent: HTMLElement, child: HTMLElement): boolean => {
	if (parent === child) {
		return true;
	}
	
	let nextParent = child;
	while (nextParent && nextParent.parentElement) {
		nextParent = nextParent.parentElement;
		
		if (nextParent === parent) {
			return true;
		}
	}
	
	return false;
}

export {
	safeQuerySelector,
	safeGetElementById,
	safeQuerySelectorAll,
	safeGetParentElement,
	safeParentQuerySelector,
	parentQuerySelector,
	hasParent
};
