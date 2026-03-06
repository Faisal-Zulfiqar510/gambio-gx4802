import {baseUrl, devMode} from "../data";
import {request} from "../functions";
import CustomerId from "../model/CustomerId";

/**
 * Returns the is-subscribed state of a customer.
 */
export default async function isCustomerSubscribed(customerId: CustomerId): Promise<boolean> {
    /**
     * Endpoint not implemented
     */
    return false;
    
    
    try {
        const url = `${baseUrl}/admin/api/customer-memos/${customerId.value()}`;
        const response = await request<{ subscribed: boolean }>(url);
        
        return response.subscribed;
    } catch (e) {
        if (devMode) {
            console.error(e);
        }
        
        return false;
    }
}
