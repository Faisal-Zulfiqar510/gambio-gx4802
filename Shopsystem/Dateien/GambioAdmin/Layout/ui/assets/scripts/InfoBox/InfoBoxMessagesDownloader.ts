import {InfoBoxMessage} from './InfoBoxMessage';

export default class InfoBoxMessagesDownloader {
	/**
	 * Fetches and returns info box messages.
	 */
	public static fetchMessages = async (): Promise<InfoBoxMessage[]> => {
		const endpoint = `${window.jsEnvironment.baseUrl}/admin/admin.php?do=AdminInfoBoxAjax/GetAllMessages`;
		const response = await fetch(endpoint);
		
		return await response.json();
	}
}