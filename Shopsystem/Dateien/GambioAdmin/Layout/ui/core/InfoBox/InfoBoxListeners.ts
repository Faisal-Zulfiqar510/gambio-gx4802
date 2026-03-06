import InfoBoxElements from './InfoBoxElements';

export default class InfoBoxListeners {
	constructor(private readonly elements: InfoBoxElements) {
	}
	
	/**
	 * Toggles the info box.
	 * If the info box should be displayed, the messages will be updated.
	 */
	public toggleInfoBox = (): void => {
		this.elements.notifications.classList.contains('show')
			? this.hide()
			: this.show();
	}
	
	/**
	 * Shows the info box.
	 */
	public show = (): void => {
		this.elements.messageBagElement.classList.remove('load');
		this.elements.notifications.classList.add('show');
		this.elements.notifications.classList.remove('hidden')
		
		setTimeout(this.hide, 2500);
	}
	
	/**
	 * Hides the info box and silently truncates all messages.
	 */
	public hide = (): void => {
		this.elements.notifications.classList.remove('show');
		
		// timeout duration matches animation duration that is applied to the class
		setTimeout(() => {
			this.elements.notifications.classList.add('hidden');
			this.truncateMessageBag();
		}, 700);
	}
	
	/**
	 * Truncates the info box message bag element (which is essentially the container for all messages).
	 */
	public truncateMessageBag = (): void => {
		Array.from(this.elements.messageBagElement.children).forEach((node: Element): void => {
			if (!node.classList.contains('loading-spinner')) {
				node.remove();
			}
		});
	}
}