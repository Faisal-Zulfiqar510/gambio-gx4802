import {baseUrl, devMode} from "../data";
import {request} from "../functions";
import CustomerId from "../model/CustomerId";
import PaymentModuleId from "../model/PaymentModuleId";

/**
 * Sets the disallowed payment methods of a customer.
 */
export default async function setDisallowedPaymentMethods(customerId: CustomerId, paymentModuleIds: PaymentModuleId): Promise<void> {
    try {
        const body = {
            customerId: customerId.value(),
            paymentModuleIds,
        };
        
        const url = `${baseUrl}/admin/api/set-disallowed-payment-modules`;
        await request<any>(url, 'POST', body);
    } catch (e) {
        if (devMode) {
            console.error(e);
        }
    }
}
