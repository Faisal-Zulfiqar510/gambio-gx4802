import {request} from "../functions";
import {baseUrl, devMode} from "../data";
import {CustomerApiResult} from './CustomerApiResult';
import CustomerCart from "../model/CustomerCart";
import CustomerId from "../model/CustomerId";

export default async function getCustomerCart(id: CustomerId): Promise<CustomerApiResult<CustomerCart, string>> {
    try {
        const url = `${baseUrl}/admin/api/customer/${id.value()}/cart`;
        const response = await request<CustomerCart>(url, 'GET');
        
        return { success: true, value: response };
    } catch (e) {
        if (devMode) {
            console.log(e);
        }
        
        return { success: false, error: 'Cart could not be loaded!' };
    }
}