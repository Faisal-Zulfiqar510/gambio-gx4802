import LayoutSections from '../LayoutSections';
import {
    safeGetElementById,
    safeGetParentElement,
    safeParentQuerySelector,
    safeQuerySelector
} from 'core/dom';

const ITEM_IDENTIFIER = 'custom/menu-item-identifier';
const DROP_TYPE = 'custom/menu-item-drop-type';

const favoritesEndpoint = `${window.jsEnvironment.baseUrl}/admin/api/favorites`;

/**
 * Favorites listener.
 */
export default class FavoritesListener {
    private readonly sections: LayoutSections;
    private readonly favoritesDropZone: HTMLElement;
    private readonly favoritesList: HTMLElement;
    
    /**
     * Favorites listener constructor.
     * @param {LayoutSections} sections
     */
    constructor(sections: LayoutSections) {
        this.sections = sections;
        this.favoritesDropZone = safeQuerySelector('.favorites-drop-zone', sections.menu);
        this.favoritesList = safeQuerySelector('.menu-group-item.favorites', sections.menu);
    }
    
    
    /**
     * Drop event listener.
     * Prevents the default browser event handling and determines
     * to either add or remove a favorite.
     *
     * @param {Event} event
     */
    public drop = async (event: Event): Promise<void> => {
        if (event instanceof DragEvent && event.dataTransfer) {
            event.preventDefault();
            
            const dropType = event.dataTransfer.getData(DROP_TYPE);
            if (dropType === 'add') {
                await this.addFavorite(event.dataTransfer);
            } else {
                await this.deleteFavorite(event.dataTransfer);
            }
        }
    }
    
    /**
     * Assigns a new favorite.
     * The action is usually performed on the drop event if a favorite should be assigned as favorite.
     * The method is responsible to send an ajax request to assign the item as favorite and
     * also adding the dom node to the favorites menu.
     *
     * @param {DataTransfer} dataTransfer
     */
    private addFavorite = async (dataTransfer: DataTransfer): Promise<void> => {
        const method = 'post';
        const body = new FormData();
        const identifier = dataTransfer.getData(ITEM_IDENTIFIER);
        
        body.append('menu_item_id', dataTransfer.getData(ITEM_IDENTIFIER));
        
        const response = await fetch(favoritesEndpoint, {
            method,
            body
        });
        const json = await response.json();
        
        if (json.success) {
            // Todo: Display success message via notification box
            if (this.favoritesList.children.length === 1) {
                const menuEntryList = document.createElement('ul');
                menuEntryList.classList.add('menu-entry-list');
                this.favoritesList.appendChild(menuEntryList);
            }
            
            const favoriteEntries = safeQuerySelector('.menu-entry-list', this.favoritesList);
            const link = safeGetElementById(identifier);
            const item = safeGetParentElement(link);
            favoriteEntries.appendChild(item);
        }
    }
    
    /**
     * Deletes a favorite.
     * The action is usually performed on the drop event if a favorite should be removed.
     * The method is responsible to send an ajax request to delete the favorite assignment and
     * also removing the dom node from the menu.
     *
     * @param {DataTransfer} dataTransfer
     */
    private deleteFavorite = async (dataTransfer: DataTransfer): Promise<void> => {
        const identifier = dataTransfer.getData(ITEM_IDENTIFIER);
        const uriIdentifier = encodeURIComponent(identifier);
        const endpoint = `${favoritesEndpoint}/${uriIdentifier}`;
        const method = 'delete';
        
        const response = await fetch(endpoint, {
            method
        });
        const json = await response.json();
        if (json.success) {
            const link = safeGetElementById(identifier);
            const item = safeGetParentElement(link);
            const favoriteEntries = safeQuerySelector('.menu-entry-list', this.favoritesList);
            item.remove();
            if (favoriteEntries.children.length === 1) {
                favoriteEntries.remove();
            }
                // Todo: Display success message via notification box
        }
    }
    
    /**
     * Drag start events.
     *
     * This listener usually will be triggered if the client drags a menu item.
     * The favorites drop zone element data is modified to position the element in the correct position.
     * In the end, the menu link identifier is appended to the whole drop event
     * in order to save/delete the favorite item.
     *
     * @param  {Event|DragEvent} event
     */
    public dragStart = (event: Event): void => {
        this.favoritesDropZone.classList.add('active');
        
        if (event.target && event instanceof DragEvent && event.dataTransfer) {
            // by picking the selector wisely, we get around issues like what happen on dragging selected texts.
            const target = event.target as HTMLElement;
            const parent = safeParentQuerySelector('.menu-entry-list', target);
            const item = safeParentQuerySelector('.menu-entry-item', target);
            const link = safeQuerySelector('a', item);
            const groupItem = safeParentQuerySelector('.menu-group-item', target);
            const isFavorite = groupItem.classList.contains('favorites');
            
            // placing drop box item. Thresholds to take borders into account
            this.favoritesDropZone.style.left = `${parent.offsetWidth - 2}px`;
            this.favoritesDropZone.style.top = '-1px';
            
            const itemId = link.getAttribute('id');
            parent.appendChild(this.favoritesDropZone);
            event.dataTransfer.setData(ITEM_IDENTIFIER, itemId || '');
            event.dataTransfer.setData(DROP_TYPE, isFavorite ? 'delete' : 'add');
        }
    }
    
    /**
     * Drag end event. Just removed the active class from the drop zone element.
     */
    public dragEnd = (): void => {
        this.favoritesDropZone.classList.remove('active');
    }
    
    /**
     * Drag enter event.
     * Checks for correct drag type and if everything is ok, the default browser event will be
     * prevented in order to make the drop event accessible.
     * Additionally, the .hover class will be applied to the drop zone.
     *
     * @param {Event} event
     */
    public dragEnter = (event: Event): void => {
        if (event instanceof DragEvent
            && event.dataTransfer
            && event.dataTransfer.types.includes(ITEM_IDENTIFIER)
            && event.dataTransfer.types.includes(DROP_TYPE)
            && event.dataTransfer.types.includes('text/html')) {
            event.preventDefault();
            this.favoritesDropZone.classList.add('hover');
        }
    }
    
    /**
     * Drag leave event. Just removed the .hover class from the drop zone element.
     */
    public dragLeave = (): void => {
        this.favoritesDropZone.classList.remove('hover');
    }
    
    /**
     * Drag over event.
     * Checks for correct drag type and if everything is ok, the default browser event will be
     * prevented in order to make the drop event accessible.
     *
     * @param event
     */
    public dragOver = (event: Event): void => {
        if (event instanceof DragEvent
            && event.dataTransfer
            && event.dataTransfer.types.includes(ITEM_IDENTIFIER)
            && event.dataTransfer.types.includes(DROP_TYPE)
            && event.dataTransfer.types.includes('text/html')) {
            event.preventDefault();
        }
    }
}