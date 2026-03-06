import {baseUrl, devMode} from "../data";
import CustomerId from "../model/CustomerId";
import {CustomerApiResult} from "./CustomerApiResult";

type ErrorUnknown = 'ErrorUnknown';
type ErrorApi = 'ErrorApi';
type ChangeBusinessInfoError = ErrorUnknown | ErrorApi;

/**
 * Updates the contact information of an existing customer.
 */
export default async function changeCustomerPassword(id: CustomerId, password: string): Promise<CustomerApiResult<boolean, ChangeBusinessInfoError>> {
    try {
        const body = {
            customerId: id.value(),
            password: password,
        };
        
        const url = `${baseUrl}/admin/api/change-customer-password`;
        const response = await fetch(url, { body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }, method: 'POST' });
    
        if(response.status === 201) {
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