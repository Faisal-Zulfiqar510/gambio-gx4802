import InfoBoxElements from './InfoBoxElements';
import InfoBoxRenderer from './InfoBoxRenderer';
import InfoBoxListeners from './InfoBoxListeners';
import {safeQuerySelector} from '../dom';

export default class InfoBoxFactory {
	/**
	 * Creates an info box elements instance.
	 */
	public createElements = (): InfoBoxElements => {
		const header = safeQuerySelector('.gx-admin-header')
		
		const messageBagElement = safeQuerySelector('.info-box .notifications .messages', header);
		const actionItem = safeQuerySelector('.info-box', header);
		const notifications = safeQuerySelector('.notifications', header);
		
		return new InfoBoxElements(messageBagElement, actionItem, notifications);
	}
	
	/**
	 * Creates an info box renderer instance.
	 *
	 * @param elements
	 * @param listeners
	 */
	public createRenderer = (elements: InfoBoxElements, listeners: InfoBoxListeners): InfoBoxRenderer => {
		return new InfoBoxRenderer(elements, listeners);
	}
	
	/**
	 * Creates an info box listeners instance.
	 *
	 * @param elements
	 */
	public createListeners = (elements: InfoBoxElements): InfoBoxListeners => {
		return new InfoBoxListeners(elements);
	}
}