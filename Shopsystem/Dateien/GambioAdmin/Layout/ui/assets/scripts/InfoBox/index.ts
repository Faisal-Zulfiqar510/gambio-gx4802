import LayoutBootstrapper from '../LayoutBootstrapper';
import LayoutDescriptor from '../LayoutDescriptor';
import InfoBoxElements from './InfoBoxElements';
import InfoBoxListeners from './InfoBoxListeners';
import InfoBoxRenderer from './InfoBoxRenderer';
import InfoBoxLib from 'core/InfoBox';
import {safeQuerySelector} from 'core/dom';
import {
	SEND_INFO_BOX_INFO_MESSAGE,
	SEND_INFO_BOX_MESSAGE,
	SEND_INFO_BOX_SUCCESS_MESSAGE, SEND_INFO_BOX_WARNING_MESSAGE,
	UPDATE_INFO_BOX
} from '../../events';

/**
 * Info box bootstrapper.
 */
export default class InfoBox implements LayoutBootstrapper {
	private readonly elements: InfoBoxElements;
	private readonly listeners: InfoBoxListeners;
	
	constructor(private readonly descriptor: LayoutDescriptor) {
		this.elements = new InfoBoxElements(
			safeQuerySelector('.info-box .messages', this.descriptor.sections.header),
			safeQuerySelector('.info-box', this.descriptor.sections.header),
			safeQuerySelector('.info-box .notifications', this.descriptor.sections.header)
		);
		const renderer = new InfoBoxRenderer(this.elements.messageBagElement);
		this.listeners = new InfoBoxListeners(this.elements, renderer, InfoBoxLib.create(), [])
	}
	
	/**
	 * Info box bootstrapping by setting all event listeners.
	 */
	boot = async (): Promise<void> => {
		window.addEventListener(UPDATE_INFO_BOX, this.listeners.updateInfoBox);
		
		this.elements.notifications.addEventListener('click', (event: Event): void => event.stopPropagation());
		this.elements.actionItem.addEventListener('click', this.listeners.toggleInfoBox);
		
		window.addEventListener(SEND_INFO_BOX_MESSAGE, this.listeners.notify);
		window.addEventListener(SEND_INFO_BOX_SUCCESS_MESSAGE, this.listeners.notifySuccess);
		window.addEventListener(SEND_INFO_BOX_INFO_MESSAGE, this.listeners.notifyInfo);
		window.addEventListener(SEND_INFO_BOX_WARNING_MESSAGE, this.listeners.notifyWarning);
	}
}