import {parentQuerySelector} from 'core/dom';
import {InfoBoxMessage, MessageStatus} from './InfoBoxMessage';
import InfoBoxRenderer from './InfoBoxRenderer';
import InfoBoxElements from './InfoBoxElements';
import InfoBoxMessagesDownloader from './InfoBoxMessagesDownloader';
import InfoBox from 'core/InfoBox';
import {UPDATE_INFO_BOX} from '../../events';

const INFO_BOX_ENDPOINT = `${window.jsEnvironment.baseUrl}/admin/admin.php?do=AdminInfoBoxAjax`;

/**
 * Info box event listener callbacks.
 */
export default class InfoBoxListeners {
	constructor(
		private readonly elements: InfoBoxElements,
		private readonly renderer: InfoBoxRenderer,
		private readonly lib: InfoBox,
		private messages: InfoBoxMessage[],
	) {
	}
	
	/**
	 * Displays a info box notification.
	 *
	 * Any additional information, like "title", "message" and "type" have to
	 * be appended to the event, using a custom event type.
	 *
	 * @param event
	 */
	public notify = (event: Event): void => {
		if (event instanceof CustomEvent) {
			this.lib.notify(event.detail?.type, event.detail?.message, event.detail?.title);
		}
	}
	
	/**
	 * Displays a success message in the info box.
	 * The method provides default "title" and "message" values.
	 *
	 * @param event
	 */
	public notifySuccess = (event: Event): void => {
		if (event instanceof CustomEvent) {
			this.lib.notifySuccess(event.detail?.message, event.detail?.title);
		} else {
			this.lib.notifySuccess();
		}
	}
	
	/**
	 * Displays a info message in the info box.
	 *
	 * It is required to append a "title" and "message" to the
	 * event in order to see a message, because no defaults are provided.
	 *
	 * @param event
	 */
	public notifyInfo = (event: Event): void => {
		if (event instanceof CustomEvent) {
			this.lib.notifyInfo(event.detail?.message, event.detail?.title);
		}
	}
	
	/**
	 * Displays a warning in the info box.
	 *
	 * It is required to append a "title" and "message" to the
	 * event in order to see a message, because no defaults are provided.
	 *
	 * @param event
	 */
	public notifyWarning = (event: Event): void => {
		if (event instanceof CustomEvent) {
			this.lib.notifyWarning(event.detail?.message, event.detail?.title);
		}
	}
	
	
	/**
	 * Hides an info box message.
	 * The method is sending a request to the shop backend to update the state.
	 *
	 * @param {Event} event
	 */
	public hideMessage = async (event: Event): Promise<void> => {
		const messageContainer = parentQuerySelector('.message', event.target as HTMLElement);
		const messageId = messageContainer?.dataset.messageId;
		const urlQuery = `&id=${messageId}&status=hidden`;
		const endpoint = `${INFO_BOX_ENDPOINT}/SetMessageStatus${urlQuery}`;
		
		this.elements.messageBagElement.classList.add('load');
		await fetch(endpoint);
		
		window.dispatchEvent(new Event(UPDATE_INFO_BOX));
	}
	
	/**
	 * Removes an info box message.
	 * The method is sending a request to the shop backend to update the state.
	 *
	 * @param {Event} event
	 */
	public removeMessage = async (event: Event): Promise<void> => {
		const messageContainer = parentQuerySelector('.message', event.target as HTMLElement);
		const messageId = messageContainer?.dataset.messageId;
		const endpoint = `${INFO_BOX_ENDPOINT}/DeleteById&id=${messageId}`;
		
		this.elements.messageBagElement.classList.add('load');
		await fetch(endpoint);
		
		window.dispatchEvent(new Event(UPDATE_INFO_BOX));
	}
	
	/**
	 * Shows all hidden info box messages.
	 *
	 * The method collect the id's from all hidden items and performs ajax requests
	 * modify the state on the backend side. In the end, an event is dispatched
	 * to update the info box.
	 */
	public markAllAsRead = async (): Promise<void> => {
		const requests: Promise<any>[] = [];
		const endpoint =
			(messageId: number): string => `${INFO_BOX_ENDPOINT}/SetMessageStatus&id=${messageId}&status=read`;
		
		this.elements.messageBagElement.classList.add('load');
		this.messages.forEach((message: InfoBoxMessage): void => {
			if (message.status === MessageStatus.HIDDEN) {
				requests.push(
					fetch(endpoint(message.id))
				)
			}
		});
		await Promise.all(requests);
		window.dispatchEvent(new Event(UPDATE_INFO_BOX));
	}
	
	/**
	 * Toggles the info box.
	 * If the info box should be displayed, the messages will be updated.
	 */
	public toggleInfoBox = async (): Promise<void> => {
		if (!this.elements.notifications.classList.contains('show')) {
			await this.updateInfoBox();
		} else {
			this.elements.notifications.classList.remove('show');
			
			// timeout duration matches animation duration that is applied to the class
			setTimeout(() => this.elements.notifications.classList.add('hidden'), 700);
		}
	}
	
	
	/**
	 * Updates the info box, including classes to hide the loading spinner and displaying the info box.
	 */
	public updateInfoBox = async (): Promise<void> => {
		const messages = await InfoBoxMessagesDownloader.fetchMessages();
		this.messages = messages;
		
		this.renderer.renderMessages(messages, this);
		this.elements.messageBagElement.classList.remove('load');
		this.elements.notifications.classList.add('show');
		this.elements.notifications.classList.remove('hidden');
	}
}