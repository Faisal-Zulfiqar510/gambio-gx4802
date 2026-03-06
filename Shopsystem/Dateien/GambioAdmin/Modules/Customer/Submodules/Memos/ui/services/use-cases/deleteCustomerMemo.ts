import {baseUrl, devMode} from "../data";
import {request} from "../functions";
import CustomerMemos from "../model/CustomerMemos";
import CustomerMemoId from "../model/CustomerMemoId";

/**
 * Deletes an existing customer memo by given memo ID.
 */
export default async function deleteCustomerMemo(memoId: CustomerMemoId): Promise<void> {
    try {
        const url = `${baseUrl}/admin/api/customer-memos/${memoId.value()}`;
        await request<{ data: CustomerMemos }>(url, 'DELETE');
    } catch (e) {
        if (devMode) {
            console.error(e);
        }
    }
}
