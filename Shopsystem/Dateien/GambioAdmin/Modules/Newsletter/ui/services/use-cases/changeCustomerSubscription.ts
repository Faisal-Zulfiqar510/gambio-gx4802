import {baseUrl, devMode} from "../data";
import {request} from "../functions";
import CustomerId from "../model/CustomerId";

/**
 * Changes the subscription of a customer.
 */
export default async function changeCustomerSubscription(customerId: CustomerId, subscribed: boolean): Promise<void> {
    try {
        const body = {
            customerId: customerId.value(),
            subscribed,
        };
        
        const url = `${baseUrl}/admin/api/newsletter-subscription`;
        await request<any>(url, 'POST', body);
    } catch (e) {
        if (devMode) {
            console.error(e);
        }
    }
}
