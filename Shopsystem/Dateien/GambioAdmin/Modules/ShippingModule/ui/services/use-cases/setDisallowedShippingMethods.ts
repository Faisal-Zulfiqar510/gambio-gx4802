import {baseUrl, devMode} from "../data";
import {request} from "../functions";
import CustomerId from "../model/CustomerId";
import ShippingModuleId from "../model/ShippingModuleId";

/**
 Sets the disallowed shipping methods of a customer.
 */
export default async function setDisallowedShippingMethods(customerId: CustomerId, shippingModuleIds: ShippingModuleId): Promise<void> {
    try {
        const body = {
            customerId: customerId.value(),
            shippingModuleIds,
        };
    
        const url = `${baseUrl}/admin/api/set-disallowed-shipping-modules`;
        await request<any>(url, 'POST', body);
    } catch (e) {
        if (devMode) {
            console.error(e);
        }
    }
}
