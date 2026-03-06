export default interface LayoutBootstrapper {
	boot(): Promise<void>;
}