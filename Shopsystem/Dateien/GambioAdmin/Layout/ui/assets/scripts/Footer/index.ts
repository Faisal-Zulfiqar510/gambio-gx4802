import LayoutBootstrapper from '../LayoutBootstrapper';
import LayoutDescriptor from '../LayoutDescriptor';

/**
 * Footer bootstrapper.
 */
export default class Footer implements LayoutBootstrapper {
	private readonly descriptor: LayoutDescriptor;
	private readonly menuTrigger: Element;
	private readonly flags: NodeListOf<Element>;
	
	/**
	 * Footer bootstrapper constructor.
	 * @param {LayoutDescriptor} descriptor
	 */
	constructor(descriptor: LayoutDescriptor) {
		this.descriptor = descriptor;
		this.flags = descriptor.sections.footer.querySelectorAll('.language-selection a')
		
		const menuTrigger = descriptor.sections.footer.querySelector('.menu-trigger');
		if (!menuTrigger) {
			throw new Error('Could not find menu trigger element in footer element.')
		}
		this.menuTrigger = menuTrigger;
	}
	
	/**
	 * Layout footer bootstrapping.
	 *
	 * The method is responsible to set all event listeners for the footer.
	 * At the moment,there is the menu trigger to toggle the admin menu and
	 * the language selection.
	 */
	async boot(): Promise<void> {
		// menu toggle on trigger click
		this.menuTrigger.addEventListener('click', this.descriptor.listener.toggleMenu.handle);
		
		// footer language selection
		this.flags.forEach((flag: Element) => {
			const element = flag as HTMLElement;
			const language = element.dataset.languageCode;
			
			if (language != null) {
				element.addEventListener('click', () => {
					const url = new URL(document.location.toString());
					url.searchParams.set('language', language);
					
					window.location.href = url.toString();
				})
			}
		});
	}
}
