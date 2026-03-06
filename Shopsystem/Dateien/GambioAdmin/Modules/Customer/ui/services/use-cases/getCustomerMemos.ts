import {request} from "../functions";
import {baseUrl, devMode} from "../data";
import {CustomerApiResult} from './CustomerApiResult';
import CustomerMemos from "../model/CustomerMemos";
import CustomerId from "../model/CustomerId";

export default async function getCustomerMemos(id: CustomerId): Promise<CustomerApiResult<CustomerMemos, string>> {
    try {
        const url = `${baseUrl}/api.php/v3/customers/${id.value()}/memos`;
        const response = await request<{ data: CustomerMemos }>(url, 'GET');
        
        return { success: true, value: response.data };
    } catch (e) {
        if (devMode) {
            console.log(e);
        }
        
        return { success: false, error: 'Memos could not be loaded!' };
    }
}