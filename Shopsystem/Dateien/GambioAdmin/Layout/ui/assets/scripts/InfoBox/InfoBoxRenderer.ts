import {InfoBoxMessage, MessageStatus, MessageVisibility} from './InfoBoxMessage';
import InfoBoxListeners from './InfoBoxListeners';

/**
 * Info box renderer.
 */
export default class InfoBoxRenderer {
	constructor(private readonly messageBagElement: HTMLElement) {
	}
	
	/**
	 * Renders the info box messages.
	 *
	 * @param infoBoxMessages
	 * @param listeners
	 */
	public renderMessages = (infoBoxMessages: InfoBoxMessage[], listeners: InfoBoxListeners): void => {
		this.truncateMessageBag();
		if (infoBoxMessages.length === 0) {
			this.noMessages();
			return;
		}
		
		let hasHiddenItems = false;
		infoBoxMessages.forEach((infoBox: InfoBoxMessage): void => {
			const isNewOrRead = infoBox.status === MessageStatus.NEW || infoBox.status === MessageStatus.READ;
			if (isNewOrRead) {
				this.messageBagElement.appendChild(this.createMessage(infoBox, listeners));
			}
			if (infoBox.status === MessageStatus.HIDDEN) {
				hasHiddenItems = true;
			}
		});
		if (hasHiddenItems) {
			this.createDisplayCheckbox(listeners);
		}
	}
	
	/**
	 * Renders an element containing the information that no info box messages are available.
	 */
	private noMessages = (): void => {
		const container = document.createElement('div');
		const text = document.createElement('span');
		
		container.classList.add('empty');
		text.textContent = window.jsEnvironment.translations.emptyInfoBox;
		
		container.appendChild(text);
		this.messageBagElement.appendChild(container);
	}
	
	/**
	 * Truncates the info box message bag element (which is essentially the container for all messages).
	 */
	private truncateMessageBag = (): void => {
		Array.from(this.messageBagElement.children).forEach((node: Element): void => {
			if (!node.classList.contains('loading-spinner')) {
				node.remove();
			}
		});
	}
	
	/**
	 * Creates the container that contains a checkbox to show
	 * all hidden info box messages.
	 *
	 * @param listeners
	 */
	private createDisplayCheckbox = (listeners: InfoBoxListeners): void => {
		const container = document.createElement('div');
		const label = document.createElement('label');
		const input = document.createElement('input');
		const text = document.createElement('span');
		
		container.classList.add('message-show');
		container.appendChild(label);
		
		label.appendChild(input);
		label.appendChild(text);
		
		input.setAttribute('type', 'checkbox');
		input.addEventListener('change', listeners.markAllAsRead);
		
		text.textContent = window.jsEnvironment.translations.showAllInfoBoxMessages;
		
		this.messageBagElement.appendChild(container);
	}
	
	/**
	 * Creates the message container element.
	 *
	 * @param infoBox
	 * @param listeners
	 */
	private createMessage = (infoBox: InfoBoxMessage, listeners: InfoBoxListeners): HTMLDivElement => {
		const container = document.createElement('div');
		container.classList.add('message');
		
		const icons = this.createIcons(infoBox, listeners);
		const title = this.createTitle(infoBox);
		const message = this.createMessageText(infoBox);
		
		if (icons) {
			container.appendChild(icons);
		}
		container.appendChild(title);
		container.appendChild(message);
		container.dataset.messageId = infoBox.id.toString();
		
		return container;
	}
	
	/**
	 * Creates the title element.
	 *
	 * @param infoBox
	 */
	private createTitle = (infoBox: InfoBoxMessage): HTMLElement => {
		const title = document.createElement('div');
		title.classList.add('title');
		title.classList.add(infoBox.type);
		title.innerHTML = infoBox.headline;
		
		return title;
	}
	
	/**
	 * Creates the message text element.
	 *
	 * @param infoBox
	 */
	private createMessageText = (infoBox: InfoBoxMessage): HTMLElement => {
		const message = document.createElement('div');
		message.classList.add('message-text');
		message.innerHTML = infoBox.message;
		
		return message;
	}
	
	/**
	 * Creates an container containing the icons to close and delete messages.
	 *
	 * @param infoBox
	 * @param listeners
	 */
	private createIcons = (infoBox: InfoBoxMessage, listeners: InfoBoxListeners): HTMLElement | null => {
		if (infoBox.visibility !== MessageVisibility.ALWAYS_ON) {
			const icons = document.createElement('div');
			icons.classList.add('icons');
			
			if (infoBox.visibility === MessageVisibility.HIDEABLE) {
				icons.appendChild(this.createIcon('minus', listeners.hideMessage));
				
			}
			if (infoBox.visibility === MessageVisibility.REMOVABLE) {
				icons.appendChild(this.createIcon('minus', listeners.hideMessage));
				icons.appendChild(this.createIcon('times', listeners.removeMessage));
			}
			
			return icons;
		}
		
		return null;
	}
	
	/**
	 * Creates a font awesome icon element.
	 *
	 * @param faClass
	 * @param listener
	 */
	private createIcon = (faClass: string, listener: (event: Event) => void): HTMLElement => {
		const icon = document.createElement('i');
		icon.classList.add('icon');
		icon.classList.add('fa');
		icon.classList.add(`fa-${faClass}`);
		
		icon.addEventListener('click', listener)
		
		return icon;
	}
}