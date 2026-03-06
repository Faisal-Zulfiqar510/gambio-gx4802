import {baseUrl, devMode} from "../data";
import {request} from "../functions";
import CustomerId from "../model/CustomerId";
import {CustomerApiResult} from './CustomerApiResult';
import CustomerHistory from "../model/CustomerHistory";

/**
 * Returns the data for the customer profile page.
 */
export default async function getCustomerHistory(id: CustomerId): Promise<CustomerApiResult<CustomerHistory, string>> {
    try {
        const body = {};
        
        const url = `${baseUrl}/admin/api/customer/${id.value()}/history`;
        const response = await request<any>(url, 'GET', body);
        
        return { success: true, value: response };
    } catch (e) {
        if (devMode) {
            console.error(e);
        }
        
        return { success: false, error: "History could not be loaded!" };
    }
}