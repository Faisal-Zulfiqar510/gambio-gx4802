import SearchInputListener from './Listeners/SearchInputListener';
import SearchVisibilityListener from './Listeners/SearchVisibilityListener';
import SearchElements from './SearchElements';
import SearchListener from './Listeners/SearchListener';

export default class SearchListeners {
	public readonly input: SearchInputListener;
	public readonly visibility: SearchVisibilityListener;
	public readonly search: SearchListener;
	
	constructor(elements: SearchElements) {
		this.input = new SearchInputListener(elements);
		this.visibility = new SearchVisibilityListener(elements);
		this.search = new SearchListener(elements);
	}
}