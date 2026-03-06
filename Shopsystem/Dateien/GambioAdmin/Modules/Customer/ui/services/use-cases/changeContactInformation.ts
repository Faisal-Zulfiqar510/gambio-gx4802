import {baseUrl, devMode} from "../data";
import CustomerId from "../model/CustomerId";
import ContactInformation from "../model/ContactInformation";
import {CustomerApiResult} from "./CustomerApiResult";

type ErrorUnknown = 'ErrorUnknown';
type ErrorApi = 'ErrorApi';
type ChangeBusinessInfoError = ErrorUnknown | ErrorApi;

/**
 * Updates the contact information of an existing customer.
 */
export default async function changeContactInformation(id: CustomerId, contactInformation: ContactInformation): Promise<CustomerApiResult<boolean, ChangeBusinessInfoError>> {
    try {
        const body = {
            customerId: id.value(),
            contactInformation: contactInformation,
        };
        
        const url = `${baseUrl}/admin/api/customer`;
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