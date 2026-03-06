import {baseUrl, devMode} from "../data";
import {request} from "../functions";
import CustomerGroupId from "../model/CustomerGroupId";
import PersonalInformation from "../model/PersonalInformation";
import ContactInformation from "../model/ContactInformation";
import BusinessInformation from "../model/BusinessInformation";
import CustomerId from "../model/CustomerId";
import CustomerUpdateFailedError from "../errors/CustomerUpdateFailedError";

/**
 * Updated an existing customer.
 */
export default async function updateCustomer(
    id: CustomerId,
    customerGroup: CustomerGroupId,
    isFavorite: boolean,
    personalInformation: PersonalInformation,
    contactInformation: ContactInformation,
    businessInformation: BusinessInformation,
    credit: number
): Promise<void> {
    try {
        const body = {
            customerId: id.value(),
            customerGroup: customerGroup.value(),
            isFavorite,
            personalInformation: personalInformation,
            contactInformation: contactInformation,
            businessInformation: businessInformation,
            credit,
        };
        
        const url = `${baseUrl}/admin/api/update-customer`;
        await request<any>(url, 'POST', body);
    } catch (e) {
        if (devMode) {
            console.error(e);
        }
        
        throw new CustomerUpdateFailedError();
    }
}