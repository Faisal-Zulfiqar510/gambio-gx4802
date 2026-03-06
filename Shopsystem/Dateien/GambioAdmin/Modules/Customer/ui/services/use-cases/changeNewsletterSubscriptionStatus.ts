import {baseUrl, devMode} from "../data";
import CustomerId from "../model/CustomerId";
import {CustomerApiResult} from "./CustomerApiResult";

type ErrorUnknown = 'ErrorUnknown';
type ErrorApi = 'ErrorApi';
type ChangeConfigurationsError = ErrorUnknown | ErrorApi;


/**
 * Updates the newsletter subscription status.
 */
export default async function changeNewsletterSubscriptionStatus(id: CustomerId, subscribed: boolean): Promise<CustomerApiResult<boolean, ChangeConfigurationsError>> {
    try {
        const body = [{
            customerId: id.value(),
            subscribed: subscribed,
        }];
    
        const url = `${baseUrl}/admin/api/newsletter-subscription`;
        const response = await fetch(url, { body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }, method: 'POST' });
        
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