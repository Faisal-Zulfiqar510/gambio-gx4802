import {baseUrl, devMode} from "../data";
import {request} from "../functions";
import CustomerDeletionFailedError from "../errors/CustomerDeletionFailedError";

/**
 * Deletes all old guest accounts.
 */
export default async function deleteOldGuests(): Promise<void> {
    try {
        const url = `${baseUrl}/admin/api/delete-guests`;
        await request<any>(url, 'POST');
    } catch (e) {
        if (devMode) {
            console.error(e);
        }
        
        throw new CustomerDeletionFailedError();
    }
}