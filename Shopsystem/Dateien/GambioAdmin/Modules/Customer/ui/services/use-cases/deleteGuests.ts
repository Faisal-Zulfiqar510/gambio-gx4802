import {CustomerApiResult} from "./CustomerApiResult";
import {baseUrl, devMode} from "../data";

export default async function deleteGuests(): Promise<CustomerApiResult<boolean, string>> {
    try {
        const url = `${baseUrl}/admin/api/delete-guests`;
        
        await fetch(url, {method: 'POST'});
        
        return { success: true, value: true };
    } catch (e) {
        if (devMode) {
            console.log(e);
        }
        
        return { success: false, error: 'Guests could not be deleted!' };
    }
}