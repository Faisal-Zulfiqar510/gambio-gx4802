import InfoBoxElements from './InfoBoxElements';
import InfoBoxListeners from './InfoBoxListeners';
import InfoBoxMessageType from './InfoBoxMessageType';

export default class InfoBoxRenderer {
	constructor(private readonly elements: InfoBoxElements, private listeners: InfoBoxListeners) {
	}
	
	/**
	 * Renders a message of given type.
	 *
	 * @param type
	 * @param message
	 * @param title
	 */
	public renderMessage = (type: InfoBoxMessageType, message?: string, title?: string): void => {
		this.removeEmptyNotice();
		
		const messageElement = this.createMessage(type, message, title);
		this.elements.messageBagElement.appendChild(messageElement);
	}
	
	/**
	 * Render a success message.
	 *
	 * @param message
	 * @param title
	 */
	public renderSuccessMessage = (message?: string, title?: string): void => {
		this.removeEmptyNotice();
		
		const messageElement = this.createMessage(InfoBoxMessageType.SUCCESS, message, title);
		this.elements.messageBagElement.appendChild(messageElement);
	}
	
	/**
	 * Renders an info message.
	 *
	 * @param message
	 * @param title
	 */
	public renderInfo = (message?: string, title?: string): void => {
		this.removeEmptyNotice();
		
		const messageElement = this.createMessage(InfoBoxMessageType.INFO, message, title);
		this.elements.messageBagElement.appendChild(messageElement);
	}
	
	/**
	 * Renders a warning.
	 *
	 * @param message
	 * @param title
	 */
	public renderWarning = (message?: string, title?: string): void => {
		this.removeEmptyNotice();
		
		const messageElement = this.createMessage(InfoBoxMessageType.WARNING, message, title);
		this.elements.messageBagElement.appendChild(messageElement);
	}
	
	
	/**
	 * Creates the message container element.
	 *
	 * @param type
	 * @param messageText
	 * @param title
	 */
	private createMessage = (type: InfoBoxMessageType, messageText?: string, title?: string): HTMLDivElement => {
		const container = document.createElement('div');
		container.classList.add('message');
		
		const iconsElement = this.createIcons();
		const titleElement = this.createTitle(type, title);
		const messageElement = this.createMessageText(type, messageText);
		
		container.appendChild(iconsElement);
		container.appendChild(titleElement);
		container.appendChild(messageElement);
		
		return container;
	}
	
	
	/**
	 * Creates the title element.
	 */
	private createTitle = (type: InfoBoxMessageType, title?: string): HTMLElement => {
		const titleElement = document.createElement('div');
		titleElement.classList.add('title');
		titleElement.classList.add(type);
		titleElement.innerHTML = title ? title : window.jsEnvironment.translations.successTitle;
		
		return titleElement;
	}
	
	/**
	 * Creates the message text element.
	 *
	 * @param type
	 * @param messageText
	 */
	private createMessageText = (type: InfoBoxMessageType, messageText?: string): HTMLElement => {
		const message = document.createElement('div');
		message.classList.add('message-text');
		
		message.innerHTML = messageText ? messageText : this.typeDefaultMessage(type);
		
		return message;
	}
	
	/**
	 * Determines default message per type.
	 *
	 * @param type
	 */
	private typeDefaultMessage = (type: InfoBoxMessageType): string => {
		switch (type) {
			case InfoBoxMessageType.SUCCESS:
				return window.jsEnvironment.translations.saveSuccessMessage;
			case InfoBoxMessageType.INFO:
				return '';
			case InfoBoxMessageType.WARNING:
			default:
				return '';
		}
	}
	
	/**
	 * Creates the message container icons.
	 */
	private createIcons = (): HTMLElement => {
		const icons = document.createElement('div');
		
		icons.classList.add('icons');
		icons.appendChild(this.createRemoveIcon());
		
		return icons;
	}
	
	/**
	 * Creates the remove icon.
	 */
	private createRemoveIcon = (): HTMLElement => {
		const icon = document.createElement('i');
		icon.classList.add('icon');
		icon.classList.add('fa');
		icon.classList.add(`fa-times`);
		
		icon.addEventListener('click', this.listeners.hide);
		
		return icon;
	}
	
	/**
	 * Removes the "empty messages" element which appear on empty message bag's.
	 */
	private removeEmptyNotice = (): void => {
		const empty = this.elements.messageBagElement.querySelector('.empty');
		if (empty) {
			empty.remove();
		}
	}
}