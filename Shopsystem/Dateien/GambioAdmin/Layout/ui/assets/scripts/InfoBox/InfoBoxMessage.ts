export enum MessageStatus {
	NEW = 'new',
	READ = 'read',
	HIDDEN = 'hidden',
}

export enum MessageVisibility {
	ALWAYS_ON = 'alwayson',
	HIDEABLE = 'hideable',
	REMOVABLE = 'removable',
}

export enum MessageType {
	INFO = 'info',
	WARNING = 'warning',
	SUCCESS = 'success',
}

export interface InfoBoxMessage {
	id: number;
	customerId: number;
	identifier: string;
	source: string;
	headline: string;
	message: string;
	status: MessageStatus;
	type: MessageType;
	visibility: MessageVisibility;
	buttonLink: string;
	buttonLabel: string;
	addedDateTime: string;
	modifiedDateTime: string;
}