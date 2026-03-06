import SearchElements from '../SearchElements';

interface SearchUrls {
	[index: string]: (query: string) => { url: string; target: string; };
}

/**
 * Search url callbacks.
 * The URL's are used to perform the search callback.
 */
const searchUrls: SearchUrls = {
	customers: (query: string) => {
		return {
			url: `customers?search=${encodeURIComponent(query)}`,
			target: '_self',
		}
	},
	
	categories: (query: string) => {
		return {
			url: `categories.php?search=${encodeURIComponent(query)}`,
			target: '_self',
		}
	},
	
	configurations: (query: string) => {
		return {
			url: `configurations?query=${encodeURIComponent(query)}`,
			target: '_self',
		}
	},
	
	orders: (query: string) => {
		return {
			url: `admin.php?do=OrdersOverview&filter[number]=${encodeURIComponent(query)}`,
			target: '_self',
		}
	},
	
	invoices: (query: string) => {
		return {
			url: `admin.php?do=InvoicesOverview&filter[invoiceNumber]=${encodeURIComponent(query)}`,
			target: '_self',
		}
	},
	
	manual: (query: string) => {
		return {
			url: `admin.php?do=DirectHelpProxy/GoToManual&search=${encodeURIComponent(query)}`,
			target: '_blank',
		}
	},
	
	forum: (query: string) => {
		return {
			url: `admin.php?do=DirectHelpProxy/GoToForum&search=${encodeURIComponent(query)}`,
			target: '_blank',
		}
	},
}


export default class SearchListener {
	private searchArea: string = '';
	
	constructor(private readonly elements: SearchElements) {
	}
	
	/**
	 * Handles keyboard event for search bar.
	 * Just reacts on arrow key down, up, enter and escape events.
	 *
	 * @param event
	 */
	public handleHotkey = (event: KeyboardEvent): void => {
		const hotkey = Hotkey.fromEvent(event);
		if (hotkey) {
			switch (hotkey.hotkey) {
				case HotkeyInputs.ENTER:
					this.search(this.searchArea);
					break;
				case HotkeyInputs.DOWN:
					this.handleDown();
					break;
				case HotkeyInputs.UP:
					this.handleUp();
					break;
				case HotkeyInputs.ESCAPE:
				default:
					this.handleEscape();
					break;
			}
		}
	}
	
	/**
	 * Performing the search.
	 *
	 * The method just redirects to the page which is represented by searchArea
	 * and applies the query as HTTP-GET parameter.
	 *
	 * @param {string} searchArea
	 */
	public search = (searchArea: string) => {
		const query = this.elements.input.value;
		if (query === '') {
			return;
		}
		const urlFn = searchUrls[searchArea];
		if (urlFn) {
			const urlInfo = urlFn(query);
			window.open(this.addChangeDirectoryDots(urlInfo.url), urlInfo.target);
		}
	}
    
    /**
     * Adds dots ('../') to the url so the redirects work on every route e.g "admin/products/1/options", "admin/customers/1", etc
     *
     * @param url
     */
    private addChangeDirectoryDots = (url: string): string => {
        
        let hrefParts = window.location.href.split('/'), dots = '';
        while(hrefParts.shift() !== 'admin'); // removing everything before and /admin
        hrefParts = hrefParts.filter(String)   // removing '' elements
        for (let i = 0; i < hrefParts.length - 1; i++) {
            dots += '../';
        }
        
        return dots + url;
    }
	
	/**
	 * Handles event if escape key was pressed.
	 * Removes blur from search input and hides the search section container.
	 */
	private handleEscape = () => {
		this.elements.searchSectionsContainer.classList.remove('active');
		this.elements.input.blur();
	}
	
	/**
	 * Handles event if up arrow key was pressed.
	 * Sets previous search section as active item.
	 */
	private handleUp = () => {
		const sections = this.elements.searchSections;
		
		const activeSectionFallback = (): void => {
			const section = sections[sections.length - 1];
			
			section.classList.add('active')
			this.searchArea = section.dataset.searchArea || '';
		};
		const siblingType =
			(element: HTMLElement): HTMLElement | null => (element.previousElementSibling as HTMLElement) || null;
		
		this.handleArrowKey(activeSectionFallback, siblingType);
	}
	
	/**
	 * Handles event if down arrow key was pressed.
	 * Sets next search section as active item.
	 */
	private handleDown = () => {
		const sections = this.elements.searchSections;
		
		const activeSectionFallback = (): void => {
			sections[0].classList.add('active');
			this.searchArea = sections[0].dataset.searchArea || '';
		};
		const siblingType =
			(element: HTMLElement): HTMLElement | null => (element.nextElementSibling as HTMLElement) || null;
		
		this.handleArrowKey(activeSectionFallback, siblingType);
	}
	
	/**
	 * Handles arrow key input events.
	 *
	 * The method is toggling the active search section. The callback function parameter handles the different
	 * behaviour when either the up or down arrow key was pressed.
	 *
	 * @param activeSectionFallback
	 * @param siblingType
	 */
	private handleArrowKey = (activeSectionFallback: () => void, siblingType: (section: HTMLElement) => HTMLElement | null) => {
		const sections = this.elements.searchSections;
		let updated = false;
		
		sections.forEach((section: HTMLElement): void => {
			if (!updated && section.classList.contains('active')) {
				section.classList.remove('active');
				updated = true;
				
				const sibling = siblingType(section);
				if (sibling) {
					sibling.classList.add('active');
					this.searchArea = sibling.dataset.searchArea || '';
				} else {
					activeSectionFallback();
				}
				
				return;
			}
		});
		if (!updated) {
			activeSectionFallback();
		}
	}
}

enum HotkeyInputs {
	UP,
	DOWN,
	ESCAPE,
	ENTER
}

class Hotkey {
	constructor(public readonly hotkey: HotkeyInputs) {
	}
	
	public static fromEvent = (event: KeyboardEvent): Hotkey | null => {
		if (event.code === 'Enter') {
			return new Hotkey(HotkeyInputs.ENTER);
		}
		if (event.code === 'Escape') {
			return new Hotkey(HotkeyInputs.ESCAPE);
		}
		if (event.code === 'ArrowDown') {
			return new Hotkey(HotkeyInputs.DOWN);
		}
		if (event.code === 'ArrowUp') {
			return new Hotkey(HotkeyInputs.UP);
		}
		return null;
	}
}
