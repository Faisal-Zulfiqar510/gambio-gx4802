import {baseUrl, devMode} from "../data";
import {request} from "../functions";
import CustomerId from "../model/CustomerId";
import CustomerMemos from "../model/CustomerMemos";

/**
 * Returns a filtered, sorted and paginated collection of customers as well as the total count of customers.
 */
export default async function getCustomerMemos(customerId: CustomerId): Promise<CustomerMemos> {
    /**
     * Backend endpoint not implemented
     */
    return [];
    
    try {
        const url = `${baseUrl}/admin/api/customer-memos/${customerId.value()}`;
        const response = await request<{ data: CustomerMemos }>(url);
        
        return response.data;
    } catch (e) {
        if (devMode) {
            console.error(e);
        }
        
        return [];
    }
}
