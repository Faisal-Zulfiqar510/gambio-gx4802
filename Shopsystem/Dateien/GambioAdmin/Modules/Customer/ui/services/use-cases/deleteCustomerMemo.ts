import {baseUrl, devMode} from "../data";
import {CustomerApiResult} from './CustomerApiResult';

type ErrorUnknown = 'ErrorUnknown';
type ErrorApi = 'ErrorApi';
type ChangeBusinessInfoError = ErrorUnknown | ErrorApi;

export default async function deleteCustomerMemo(id: number): Promise<CustomerApiResult<boolean, ChangeBusinessInfoError>> {
    try {
        const url = `${baseUrl}/admin/api/customer/memos/${id}`;
        const response = await fetch(url, { body: JSON.stringify({}), headers: { 'Content-Type': 'application/json' }, method: 'DELETE' });
        
        if(response.status === 204) {
            return { success: true, value: true };
        }
        
        return { success: false, error: 'ErrorUnknown' };
    } catch (e) {
        if (devMode) {
            window.console.log(e);
        }
    
        return { success: false, error: 'ErrorApi' };
    }
}