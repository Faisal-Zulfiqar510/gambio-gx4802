import {baseUrl, devMode} from "../data";
import {CustomerApiResult} from "./CustomerApiResult";

type ErrorUnknown = 'ErrorUnknown';
type ErrorApi = 'ErrorApi';
type ChangeConfigurationsError = ErrorUnknown | ErrorApi;


/**
 * Updates the business information of an existing customer.
 */
export default async function changeItemsPerPage(itemsPerPage: string): Promise<CustomerApiResult<boolean, ChangeConfigurationsError>> {
    try {
        const body = {
            CUSTOMERS_PER_PAGE: parseInt(itemsPerPage, 10),
        };
    
        const url = `${baseUrl}/admin/api/customer-user-configuration`;
        const response = await fetch(url, { body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }, method: 'PATCH' });
        
        if(response.status === 204) {
            return { success: true, value: true };
        }
        
        return { success: false, error: 'ErrorUnknown' };
    } catch (e) {
        if (devMode) {
            console.error(e);
        }
        
        return { success: false, error: 'ErrorApi' };
    }
}