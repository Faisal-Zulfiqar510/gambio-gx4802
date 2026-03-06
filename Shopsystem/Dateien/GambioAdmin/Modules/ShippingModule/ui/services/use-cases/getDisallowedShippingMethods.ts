import {baseUrl, devMode} from "../data";
import {request} from "../functions";
import CustomerId from "../model/CustomerId";
import ShippingModules from "../model/ShippingModules";

/**
 * Returns the is-subscribed state of a customer.
 */
export default async function getDisallowedShippingMethods(customerId: CustomerId): Promise<ShippingModules> {
    /**
     * Might not be needed
     */
    return [];
    
    try {
        const url = `${baseUrl}/admin/api/customer-memos/${customerId.value()}`;
        const response = await request<{ data: ShippingModules }>(url);
        
        return response.data;
    } catch (e) {
        if (devMode) {
            console.error(e);
        }
        
        return [];
    }
}
