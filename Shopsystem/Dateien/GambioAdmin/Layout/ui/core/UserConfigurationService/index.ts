const endpoint = `${window.jsEnvironment.baseUrl}/admin/api/user-configuration`;

class UserConfigurationService {
	/**
	 * Returns a user configuration value.
	 *
	 * @param key
	 */
	public async get(key: string): Promise<string> {
		const response = await fetch(`${endpoint}?key=${key}`);
		if (!response.ok) {
			throw new Error(`Failed to request (GET) user configuration with key: "${key}"`);
		}
		
		const json = await response.json();
		if (!json.success) {
			throw new Error(`Could not find user configuration with key: "${key}"`);
		}
		
		return json.value;
	}
	
	
	/**
	 * Sets a new user configuration value.
	 *
	 * @param key
	 * @param value
	 */
	public async set(key: string, value: string): Promise<void> {
		const data = new FormData();
		data.append('key', key);
		data.append('value', value);
		
		const response = await fetch(`${endpoint}`, {
			method: 'post',
			body: data
		});
		if (!response.ok) {
			throw new Error(`Failed to request (POST) user configuration with key: "${key}"`);
		}
		
		const json = await response.json();
		if (!json.success) {
			let message = `Could not set user configuration with key: "${key}"`;
			if (undefined !== json.message) {
				message = `${message}\nError message: ${json.message}`
			}
			
			throw new Error(message);
		}
	}
}

const service = new UserConfigurationService();

/**
 * Utility function to get a user configuration value.
 *
 * @param key
 */
const get = async (key: string): Promise<string> => {
	return await service.get(key);
}

/**
 * Utility function to set a user configuration value.
 *
 * @param key
 * @param value
 */
const set = async (key: string, value: string): Promise<void> => {
	await service.set(key, value);
}

export default UserConfigurationService;
export {get, set};
