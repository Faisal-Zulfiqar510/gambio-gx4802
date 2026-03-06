import {baseUrl, devMode} from "../data";
import Customer from "../model/Customer";

import {CustomerApiResult} from "./CustomerApiResult";

type ErrorUnknown = 'ErrorUnknown';
type ErrorApi = 'ErrorApi';
type ChangeConfigurationsError = ErrorUnknown | ErrorApi;

/**
 * Creates a new customer.
 */
export default async function createCustomer(
    customer: Customer,
): Promise<CustomerApiResult<boolean, ChangeConfigurationsError>> {
    try {
        const body = [{
            ...customer,
        }];
        
        const url = `${baseUrl}/admin/api/customer-register`;
        const response = await fetch(url, { body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }, method: 'POST' });
    
        if(response.status === 200) {
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