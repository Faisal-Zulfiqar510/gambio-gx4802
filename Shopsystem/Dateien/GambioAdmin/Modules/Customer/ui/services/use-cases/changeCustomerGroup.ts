import {baseUrl, devMode} from "../data";
import CustomerGroupId from "../model/CustomerGroupId";
import CustomerId from "../model/CustomerId";
import {CustomerApiResult} from "./CustomerApiResult";

type ErrorUnknown = 'ErrorUnknown';
type ErrorApi = 'ErrorApi';
type ChangeBusinessInfoError = ErrorUnknown | ErrorApi;

/**
 * Updates the customer group of an existing customer.
 */
export default async function changeCustomerGroup(id: CustomerId, customerGroup: CustomerGroupId): Promise<CustomerApiResult<boolean, ChangeBusinessInfoError>> {
    try {
        const body = [{
            id: id.value(),
            groupId: customerGroup.value(),
        }];
        
        const url = `${baseUrl}/admin/api/change-customers-group`;
        const response = await fetch(url, { body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }, method: 'PATCH' });
        
        if(response.status === 204) {
            return { success: true, value: true };
        }
    
        return { success: false, error: 'ErrorUnknown' };
    } catch (e) {
        if (devMode) {
            console.error(e);
        }
        
        return { success: false, error: 'ErrorApi' };
    }
}