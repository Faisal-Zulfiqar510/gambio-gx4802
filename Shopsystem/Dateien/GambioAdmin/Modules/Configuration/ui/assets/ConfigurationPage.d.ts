export default interface ConfigurationPage {
	isLoading: boolean;
	tags: Tag[];
	data: Category[];
	filter: {
		searchQuery: string,
		tags: string[]
	},
	changes: ChangedConfigurations;
	category: Category | {};
	disableScrollSpy: boolean;
	txt: {
		[index: string]: string;
	}
	pageStyles?: any
}

export interface ChangedConfigurations {
	[index: string]: string | boolean | null;
}

export interface ListingItem {
	label: string;
	tags?: string[];
	match?: SearchMatch;
	visible: boolean;
}

export interface Category extends ListingItem {
	id: string;
	groups: Group[];
}

export interface Group extends ListingItem {
	id: string;
	configurations: Configuration[];
	links: Link[]
	parent?: Category;
}

export interface Link extends ListingItem {
	link: string;
	newWindow: boolean;
	parent?: Group;
}

export interface ConfigItem {
	key: string;
	value: string | null;
	hasMatch?: boolean;
}

export interface Configuration extends ConfigItem, ListingItem {
	tooltip: string;
	type: Type;
	options?: Option[];
	parent?: Group;
}

export interface Tag {
	id: string;
	label: string;
}

export interface Type {
	id: string | TypeId;
	params: any;
}

export enum TypeId {
	SWITCHER = 'switcher',
	TEXT = "text",
	TEXTAREA = 'textarea',
	PASSWORD = 'password',
	EMAIL = 'email',
	NUMBER = 'number',
	COLOR = 'color',
	DATE = 'date',
	DATETIME = 'datetime',
	DROPDOWN = 'dropdown',
	MULTISELECT = 'multi-select',
}

export interface Option {
	value: string;
	text: string;
}

export interface SearchMatch {
	start: string;
	match: string;
	end: string;
}

export interface PageFilter {
	validate: (item: ListingItem) => boolean;
}