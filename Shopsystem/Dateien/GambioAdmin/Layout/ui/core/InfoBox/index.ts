import InfoBoxRenderer from './InfoBoxRenderer';
import InfoBoxListeners from './InfoBoxListeners';
import InfoBoxFactory from './InfoBoxFactory';
import InfoBoxMessageType from './InfoBoxMessageType';

export default class InfoBox {
	private constructor(
		private readonly renderer: InfoBoxRenderer,
		private readonly listeners: InfoBoxListeners
	) {
	}
	
	/**
	 * Factory method to create an instance the the info box library.
	 */
	public static create = (): InfoBox => {
		const factory = new InfoBoxFactory();
		
		const elements = factory.createElements();
		const listeners = factory.createListeners(elements);
		const renderer = factory.createRenderer(elements, listeners);
		
		return new InfoBox(renderer, listeners);
	}
	
	public notify = (type: InfoBoxMessageType, message?: string, headline?: string): void => {
		this.renderer.renderMessage(type, message, headline);
		this.listeners.show();
	}
	
	/**
	 * Notifies about a successful operation.
	 *
	 * @param message
	 * @param headline
	 */
	public notifySuccess = (message?: string, headline?: string): void => {
		this.renderer.renderSuccessMessage(message, headline);
		this.listeners.show();
	}
	
	/**
	 * Notifies about any general information.
	 *
	 * @param message
	 * @param headline
	 */
	public notifyInfo = (message: string, headline: string): void => {
		this.renderer.renderInfo(message, headline);
		this.listeners.show();
	}
	
	/**
	 * Notifies about a warning.
	 *
	 * @param message
	 * @param headline
	 */
	public notifyWarning = (message: string, headline: string): void => {
		this.renderer.renderWarning(message, headline);
		this.listeners.show();
	}
}