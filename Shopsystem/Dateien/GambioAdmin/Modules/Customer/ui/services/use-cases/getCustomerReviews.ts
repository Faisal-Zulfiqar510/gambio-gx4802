import {baseUrl, devMode} from "../data";
import {request} from "../functions";
import CustomerId from "../model/CustomerId";
import {CustomerApiResult} from './CustomerApiResult';
import CustomerReviews from "../model/CustomerReviews";

/**
 * Returns the data for the customer profile page.
 */
export default async function getCustomerReviews(id: CustomerId): Promise<CustomerApiResult<CustomerReviews, string>> {
    try {
        const body = {};
        
        const url = `${baseUrl}/admin/api/customer/${id.value()}/reviews`;
        const response = await request<any>(url, 'GET', body);
        
        return { success: true, value: response };
    } catch (e) {
        if (devMode) {
            console.error(e);
        }
        
        return { success: false, error: "Statistics could not be loaded!" };
    }
}