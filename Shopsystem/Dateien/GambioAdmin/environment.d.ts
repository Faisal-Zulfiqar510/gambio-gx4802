declare interface Window {
	jsEnvironment: {
		baseUrl: string;
		environment: string,
		translations: {
			[index: string]: string;
		},
		vuePage: {
			translations: {}
		}
	}
}