import {baseUrl, devMode} from "../data";
import CustomerId from "../model/CustomerId";
import Configurations from "../model/Configurations";
import {CustomerApiResult} from "./CustomerApiResult";

type ErrorUnknown = 'ErrorUnknown';
type ErrorApi = 'ErrorApi';
type ChangeConfigurationsError = ErrorUnknown | ErrorApi;


/**
 * Updates the business information of an existing customer.
 */
export default async function changeCustomerConfigurations(id: CustomerId, configurations: Configurations): Promise<CustomerApiResult<boolean, ChangeConfigurationsError>> {
    try {
        const body = {
            customerId: id.value(),
            paymentModuleIds: configurations.disallowedPaymentMethods,
            shippingModuleIds: configurations.disallowedShippingMethods,
        };
        
        const url = `${baseUrl}/admin/api/change-customer-disallowed-payment-and-shipping-modules`;
        const response = await fetch(url, { body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }, method: 'POST' });
        
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