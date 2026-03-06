import {baseUrl, devMode} from "../data";
import {request} from "../functions";
import CustomerId from "../model/CustomerId";

/**
 * Creates a new customer memo.
 */
export default async function createCustomerMemo(customerId: CustomerId, content: string): Promise<void> {
    try {
        const body = {
            customerId: customerId.value(),
            content,
        };
        
        const url = `${baseUrl}/admin/api/customer-memos`;
        await request<any>(url, 'POST', body);
    } catch (e) {
        if (devMode) {
            console.error(e);
        }
    }
}
