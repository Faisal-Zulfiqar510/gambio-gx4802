import LayoutDescriptor from '../LayoutDescriptor';
import LayoutBootstrapper from '../LayoutBootstrapper';
import {FIX_FOOTER, MENU_TOGGLED} from '../../events';

/**
 * Window bootstrapper.
 */
export default class Window implements LayoutBootstrapper {
	private readonly descriptor: LayoutDescriptor;
	
	/**
	 * Window bootstrapper constructor.
	 * @param {LayoutDescriptor} descriptor
	 */
	constructor(descriptor: LayoutDescriptor) {
		this.descriptor = descriptor;
	}
	
	/**
	 * Layout window bootstrapping.
	 *
	 * The method is responsible to set the event listeners for the global window object.
	 * Additionally, the
	 */
	async boot(): Promise<void> {
		const footerState = this.descriptor.listener.footerState;
		const contentHeader = this.descriptor.listener.contentHeader;
		const sessionKeepAlive = this.descriptor.listener.sessionKeepAlive;
  
		footerState.handle();
		contentHeader.handle();
		
		window.addEventListener(MENU_TOGGLED, footerState.handle);
		window.addEventListener('resize', footerState.handle);
		window.addEventListener('scroll', footerState.handle);
		window.addEventListener(FIX_FOOTER, footerState.fixFooter);
		
		if (contentHeader.isContentHeaderAvailable()) {
			window.addEventListener('scroll', contentHeader.handle);
		}
        await sessionKeepAlive.handle();
	}
}