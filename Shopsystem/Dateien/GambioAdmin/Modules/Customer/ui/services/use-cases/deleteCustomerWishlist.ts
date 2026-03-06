import {baseUrl, devMode} from "../data";
import {CustomerApiResult} from './CustomerApiResult';
import CustomerId from "../model/CustomerId";

export default async function getCustomerWishlist(id: CustomerId): Promise<CustomerApiResult<boolean, string>> {
    try {
        const url = `${baseUrl}/admin/api/customer/${id.value()}/wishlist`;
        
        await fetch(url, {method: 'DELETE'});

        return { success: true, value: true };
    } catch (e) {
        if (devMode) {
            console.log(e);
        }
        
        return { success: false, error: 'Wishlist could not be loaded!' };
    }
}