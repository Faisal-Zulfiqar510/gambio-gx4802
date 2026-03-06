export default interface Dashboard {
	messages: DashboardMessages,
	additionalClasses: string[],
	size: number,
	customerId: number | null
}

export interface DashboardMessages {
	danger?: Message[],
	info?: Message[],
	success?: Message[],
	warning?: Message[]
}

export interface Message {
	message: string,
	user_config_key: string,
	user_config_value: string
	hidden?: boolean;
}

export interface DashboardMessageResponse {
	messages: DashboardMessages,
	additionalClasses: string[],
	size: number,
	customer_id: number,
	link?: {
		url: string,
		text: string
	}
}

export interface dismissPayload {
	success: success
}

export enum success {
	true,
	false
}