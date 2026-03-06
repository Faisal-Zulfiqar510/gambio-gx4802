import LayoutBootstrapper from '../LayoutBootstrapper';
import LayoutDescriptor from '../LayoutDescriptor';
import {safeQuerySelector} from 'core/dom';

export default class Menu implements LayoutBootstrapper {
	private readonly descriptor: LayoutDescriptor;
	private readonly favoritesDropZone: Element;
	
	constructor(descriptor: LayoutDescriptor) {
		this.descriptor = descriptor;
		this.favoritesDropZone = safeQuerySelector('.favorites-drop-zone', descriptor.sections.menu);
	}
	
	public async boot(): Promise<void> {
		const listener = this.descriptor.listener.favorites;
		const items = this.descriptor.sections.menu.querySelectorAll('.menu-entry-item a');
		
		items.forEach((item: Element): void => {
			item.addEventListener('dragstart', listener.dragStart);
			item.addEventListener('dragend', listener.dragEnd);
		});
		
		this.favoritesDropZone.addEventListener('drop', listener.drop);
		this.favoritesDropZone.addEventListener('dragover', listener.dragOver);
		this.favoritesDropZone.addEventListener('dragenter', listener.dragEnter);
		this.favoritesDropZone.addEventListener('dragleave', listener.dragLeave);
	}
}