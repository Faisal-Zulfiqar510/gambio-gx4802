import {baseUrl, devMode} from "../data";
import {request} from "../functions";
import CustomerId from "../model/CustomerId";
import {CustomerApiResult} from './CustomerApiResult';
import CustomerOrders from "../model/CustomerOrders";

/**
 * Returns the data for the customer profile page.
 */
export default async function getCustomerOrders(id: CustomerId): Promise<CustomerApiResult<CustomerOrders, string>> {
    try {
        const body = {};
        
        const url = `${baseUrl}/admin/api/customer/${id.value()}/orders`;
        const response = await request<any>(url, 'GET', body);
        
        return { success: true, value: response };
    } catch (e) {
        if (devMode) {
            console.error(e);
        }
        
        return { success: false, error: "Orders could not be loaded!" };
    }
}