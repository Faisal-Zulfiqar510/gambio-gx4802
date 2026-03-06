import {baseUrl, devMode} from "../data";
import {request} from "../functions";
import CustomerId from "../model/CustomerId";
import PaymentModules from "../model/PaymentModules";

/**
 * Returns the is-subscribed state of a customer.
 */
export default async function getDisallowedPaymentMethods(customerId: CustomerId): Promise<PaymentModules> {
    /**
     * Might not be needed
     */
    return [];
    
    try {
        const url = `${baseUrl}/admin/api/customer-memos/${customerId.value()}`;
        const response = await request<{ data: PaymentModules }>(url);
        
        return response.data;
    } catch (e) {
        if (devMode) {
            console.error(e);
        }
        
        return [];
    }
}
