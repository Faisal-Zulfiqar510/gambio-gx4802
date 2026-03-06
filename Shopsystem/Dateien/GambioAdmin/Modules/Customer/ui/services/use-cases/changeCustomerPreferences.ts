import {baseUrl, devMode} from "../data";
import {CustomerApiResult} from "./CustomerApiResult";

type ErrorUnknown = 'ErrorUnknown';
type ErrorApi = 'ErrorApi';
type ChangeBusinessInfoError = ErrorUnknown | ErrorApi;

export default async function changeCustomerPreferences(options: {[key: string]: any}): Promise<CustomerApiResult<boolean, ChangeBusinessInfoError>> {
    try {
        const url = `${baseUrl}/admin/api/customer-user-configuration`;
        const response = await fetch(url, {body: JSON.stringify(options), headers: { 'Content-Type': 'application/json' }, method: 'PATCH'});
    
        if(response.status === 204) {
            return { success: true, value: true };
        }
    
        return { success: false, error: 'ErrorUnknown' };
    } catch (e) {
        if (devMode) {
            window.console.log(e);
        }
        
        return {success: false, error: 'ErrorApi'};
    }
}