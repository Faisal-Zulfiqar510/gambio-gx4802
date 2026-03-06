import {
	Category,
	ChangedConfigurations,
	ConfigItem,
	Configuration,
	Group,
	Link,
	ListingItem,
	PageFilter
} from './ConfigurationPage';
import cloneDeep from 'lodash/cloneDeep';

/**
 * Displays all items the the category.
 *
 * @param {Category} category
 */
const showCategory = (category: Category): void => {
	category.visible = true;
	category.groups.forEach((group: Group) => {
		group.visible = true;
		group.configurations.forEach((configuration: Configuration) => {
			configuration.visible = true;
		});
	});
}

/**
 * Displays all items in the group and enables visibility on the category.
 *
 * @param {Group} group
 */
const showGroup = (group: Group): void => {
	group.visible = true;
	group.configurations.forEach((configuration: Configuration) => {
		configuration.visible = true;
	});
	if (group.parent) {
		group.parent.visible = true;
	}
}

/**
 * Displays the link and sets the visibility flag in the parents only.
 *
 * @param link
 */
const showLink = (link: Link): void => {
	link.visible = true;
	
	if (link.parent) {
		link.parent.visible = true;
		
		if (link.parent.parent) {
			link.parent.parent.visible = true;
		}
	}
}

/**
 * Displays the configuration and sets the visibility flag on the parents only.
 *
 * @param {Configuration} configuration
 */
const showConfiguration = (configuration: Configuration): void => {
	configuration.visible = true;
	
	if (configuration.parent) {
		configuration.parent.visible = true;
		
		if (configuration.parent.parent) {
			configuration.parent.parent.visible = true;
		}
	}
}

/**
 * Checks if any tag of the item matches a tag in the filter.
 * Returns true if no tags exists in filter.
 *
 * @param {ListingItem} item
 * @param {string} searchQuery
 */
const isSearchMatching = (item: ListingItem, searchQuery: string): boolean => {
	const position = item.label.toLowerCase().indexOf(searchQuery);
	if (position === -1) {
		return false;
	}
	const queryLength = searchQuery.length;
	const itemLength = item.label.length;
	
	const start = item.label.substring(0, position);
	const match = item.label.substring(position, position + queryLength);
	const end = item.label.substring(position + queryLength, itemLength);
	
	item.match = {
		start,
		match,
		end
	};
	
	return true;
}

/**
 * Checks if they config item's key matches the search query.
 * The function only work in the 'development' environment. Any other
 * environment let the function return true.
 *
 * @param item
 * @param searchQuery
 */
const configKeyMatches = (item: ConfigItem, searchQuery: string): boolean => {
	const position = item.key.toLowerCase().indexOf(searchQuery);
	const hasMatch = position !== -1;
	
	item.hasMatch = hasMatch;
	
	return hasMatch;
}

/**
 * Checks if any tag of the item matches a tag in the filter.
 * Returns true if no tags exists in filter.
 *
 * @param {ListingItem} item
 * @param {Array<string>} tags
 */
const isTagMatching = (item: ListingItem, tags: Array<string>): boolean => {
	if (tags.length === 0) {
		return true;
	}
	if (!item.tags) {
		return false;
	}
	
	return item.tags.some(value => tags.includes(value));
}


/**
 * Creates a filter based on the tags.
 *
 * @param {Array<string>} tags
 */
const tagFilter = (tags: Array<string>): PageFilter => {
	return {
		validate: (item: ListingItem) => isTagMatching(item, tags)
	}
}

/**
 * Creates a filter based on the search query and tags.
 *
 * @param {string} searchQuery
 * @param {Array<string>} tags
 */
const searchAndTagFilter = (searchQuery: string, tags: Array<string>): PageFilter => {
	return {
		validate: (item: ListingItem) => isSearchMatching(item, searchQuery) && isTagMatching(item, tags)
	}
}


/**
 * Creates a deep copy of the configurations data set.
 * This is required, so any changes will not affect the original configuration data.
 *
 * @param {Array<Category>} listing
 */
const getDeepCopy = (listing: Array<Category>): Array<Category> => {
	const copy = cloneDeep(listing) as Array<Category>;
	
	copy.forEach((category: Category) => {
		category.groups.forEach((group: Group) => {
			group.configurations.forEach((configuration: Configuration) => {
				configuration.visible = false;
				configuration.parent = group;
			});
			group.links.forEach((link: Link) => {
				link.visible = false;
				link.parent = group;
			});
			group.visible = false;
			group.parent = category;
		});
		category.visible = false;
	});
	
	return copy;
}

/**
 * Checks if the object contains a valid configuration that could be sent
 * to the server. If any configuration value is of type string, number or boolean,
 * the configuration is determined as valid.
 *
 * @param configurations
 */
const containsValidConfig = (configurations: ChangedConfigurations): boolean => {
	for (let value of Object.values(configurations)) {
		if (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || typeof value === 'object') {
			return true;
		}
	}
	return false;
}


/**
 * Scrolls the content of the container element to the provided target element.
 * The promise is resolved when the target is reached.
 *
 * @param container
 * @param target
 * @param duration
 * @param targetOffset
 */
const scrollContainer = (container: HTMLElement, target: HTMLElement, duration: number, targetOffset: number = 160): Promise<void> => {
	return new Promise(resolve => {
		const easeOutQuint = (x: number): number => {
			return 1 - Math.pow(1 - x, 5);
		};
		const scrollProgress = (runtime: number): number => {
			const percentage = runtime / duration;
			
			return easeOutQuint(percentage);
		};
		const scrollStart = container.scrollTop as number;
		const scrollEnd = target.offsetTop - targetOffset;
		const scrollDistance = scrollEnd - scrollStart;
		
		let startTime: DOMHighResTimeStamp | undefined;
		const scroll = (now: DOMHighResTimeStamp) => {
			if (startTime === undefined) {
				startTime = now;
			}
			const elapsed = now - startTime;
			
			if (elapsed < duration) {
				const progress = scrollProgress(elapsed);
				const scrollAmount = progress * scrollDistance
				
				container.scrollTop = scrollAmount + scrollStart;
				window.requestAnimationFrame(scroll);
			} else {
				resolve();
			}
		};
		window.requestAnimationFrame(scroll);
	});
}

export {
	showCategory,
	showGroup,
	showLink,
	showConfiguration,
	tagFilter,
	searchAndTagFilter,
	getDeepCopy,
	containsValidConfig,
	configKeyMatches,
	scrollContainer,
};
