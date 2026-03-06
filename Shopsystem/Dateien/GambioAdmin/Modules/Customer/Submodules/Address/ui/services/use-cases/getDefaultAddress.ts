import {baseUrl, devMode} from "../data";
import {request} from "../functions";
import CustomerAddress from "../model/CustomerAddress";
import CustomerId from "../model/CustomerId";
import CustomerAddressDoesNotExistError from "../errors/CustomerAddressDoesNotExistError";

/**
 * Returns the customers default address.
 */
export default async function getDefaultAddress(customerId: CustomerId): Promise<CustomerAddress> {
    /**
     * Backend endpoint not implemented
     */
    throw new CustomerAddressDoesNotExistError('Backend endpoint not implemented');
    
    try {
        const body = {
            customerId: customerId.value(),
        };
        
        const url = `${baseUrl}/admin/api/customer-address/default`;
        const response = await request<{ data: CustomerAddress }>(url, 'POST', body);
        
        return response.data;
    } catch (e) {
        if (devMode) {
            console.error(e);
        }
        
        throw new CustomerAddressDoesNotExistError();
    }
}