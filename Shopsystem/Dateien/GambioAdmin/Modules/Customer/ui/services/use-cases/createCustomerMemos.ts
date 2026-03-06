import {baseUrl, devMode} from "../data";
import CustomerId from "../model/CustomerId";
import {CustomerApiResult} from './CustomerApiResult';

type ErrorUnknown = 'ErrorUnknown';
type ErrorApi = 'ErrorApi';
type ChangeBusinessInfoError = ErrorUnknown | ErrorApi;

export default async function createCustomerMemos(id: CustomerId, memo: any): Promise<CustomerApiResult<boolean, ChangeBusinessInfoError>> {
    try {
        const body = {
            customerId: id.value(),
            content: memo.content,
        };
        const url = `${baseUrl}/admin/api/customer/memos`;
        const response = await fetch(url, { body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }, method: 'POST' });
        
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