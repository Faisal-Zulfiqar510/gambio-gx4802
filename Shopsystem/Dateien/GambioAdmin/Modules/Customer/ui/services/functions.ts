/**
 * Helper method to make API requests.
 *
 * @param url
 * @param method
 * @param body
 */
export async function request<T>(url: string, method: string = 'GET', body: object | null = null): Promise<T> {
    let options = {};
    if (method.toUpperCase() !== 'GET') {
        options = {
            method: method.toUpperCase(),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        };
    }
    
    return await fetch(url, options).then((response): Promise<T> => {
        if (response.url.includes("login.php")) {
            window.location.reload();
        }

        if (response.ok) {
            return response.json();
        }
        
        return Promise.reject(response);
    });
}