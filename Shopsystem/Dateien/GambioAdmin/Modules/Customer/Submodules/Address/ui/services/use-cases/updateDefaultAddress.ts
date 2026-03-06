import {baseUrl, devMode} from "../data";
import {request} from "../functions";
import CustomerAddressUpdateFailedError from "../errors/CustomerAddressUpdateFailedError";
import LocationInformation from "../model/LocationInformation";
import PersonalInformation from "../model/PersonalInformation";
import CustomerId from "../model/CustomerId";


/**
 * Updated the customers default address.
 */
export default async function updateCustomer(
    id: CustomerId,
    personalInformation: PersonalInformation,
    locationInformation: LocationInformation,
): Promise<void> {
    try {
        const body = {
            customerId: id.value(),
            personalInformation,
            locationInformation,
        };
        
        const url = `${baseUrl}/admin/api/customer-address/update-default`;
        await request<any>(url, 'POST', body);
    } catch (e) {
        if (devMode) {
            console.error(e);
        }
        
        throw new CustomerAddressUpdateFailedError();
    }
}