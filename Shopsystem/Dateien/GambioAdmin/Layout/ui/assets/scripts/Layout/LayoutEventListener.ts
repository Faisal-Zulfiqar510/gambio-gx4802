import FooterStateListener from './EventListener/FooterStateListener';
import ToggleMenuListener from './EventListener/ToggleMenuListener';
import DevelopmentModeListener from './EventListener/DevelopmentModeListener';
import FavoritesListener from './EventListener/FavoritesListener';
import ContentHeaderScrollListener from "./EventListener/ContentHeaderScrollListener";
import SessionKeepAliveListener from "layout/scripts/Layout/EventListener/SessionKeepAliveListener";

/**
 * Layout event listener.
 *
 * The class contains all handlers and delegates on demand
 * to the correct listener.
 */
export default class LayoutEventListener {
	/**
     * Layout event listener constructor.
     *
     * @param {FooterStateListener} footerState
     * @param {ToggleMenuListener} toggleMenu
     * @param {DevelopmentModeListener} developmentMode
     * @param {FavoritesListener} favorites
     * @param {ContentHeaderScrollListener} contentHeader
     * @param sessionKeepAlive
     */
	constructor(public footerState: FooterStateListener,
	            public toggleMenu: ToggleMenuListener,
	            public developmentMode: DevelopmentModeListener,
	            public favorites: FavoritesListener,
	            public contentHeader: ContentHeaderScrollListener,
                public sessionKeepAlive: SessionKeepAliveListener) {
	}
}