import {request} from "../functions";
import {baseUrl, devMode} from "../data";
import {CustomerApiResult} from './CustomerApiResult';
import CustomerWishlist from "../model/CustomerWishlist";
import CustomerId from "../model/CustomerId";

export default async function getCustomerWishlist(id: CustomerId): Promise<CustomerApiResult<CustomerWishlist, string>> {
    try {
        const url = `${baseUrl}/admin/api/customer/${id.value()}/wishlist`;
        const response = await request<CustomerWishlist>(url, 'GET');
        
        return { success: true, value: response };
    } catch (e) {
        if (devMode) {
            console.log(e);
        }
        
        return { success: false, error: 'Wishlist could not be loaded!' };
    }
}