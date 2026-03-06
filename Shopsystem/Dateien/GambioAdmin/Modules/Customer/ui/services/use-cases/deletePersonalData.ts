import {CustomerApiResult} from "./CustomerApiResult";
import {baseUrl, devMode} from "../data";

export default async function deletePersonalData(queryParams: Array<string>): Promise<CustomerApiResult<boolean, string>> {
    try {
        const url = `${baseUrl}/admin/admin.php?do=PersonalData/delete&${queryParams.join('&')}`;
    
        const result = await fetch(url, {method: 'GET'})
            .then((response) => response.ok)
            .catch((e) => e);
        
        return { success: result, value: true };
    } catch (e) {
        if (devMode) {
            console.log(e);
        }
        
        return { success: false, error: 'Personal data could not be deleted!' };
    }
}