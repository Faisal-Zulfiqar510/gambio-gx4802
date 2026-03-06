import LayoutDescriptor from '../LayoutDescriptor';
import LayoutBootstrapper from '../LayoutBootstrapper';

/**
 * Header bootstrapper.
 */
export default class Header implements LayoutBootstrapper {
	private readonly descriptor: LayoutDescriptor;
	
	/**
	 * Header bootstrapper constructor.
	 * @param {LayoutDescriptor} descriptor
	 */
	constructor(descriptor: LayoutDescriptor) {
		this.descriptor = descriptor;
	}
	
	/**
	 * Layout header bootstrapping.
	 */
	async boot(): Promise<void> {
		const devModeIcon = this.descriptor.sections.header.querySelector('.dev-mode');
		if (devModeIcon) {
			devModeIcon.addEventListener('click', this.descriptor.listener.developmentMode.handle);
		}
	}
}