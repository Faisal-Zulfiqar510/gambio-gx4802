import {baseUrl, devMode} from "../data";
import {CustomerApiResult} from "./CustomerApiResult";
import ValidateEmailAddress from "../model/ValidateEmailAddress";
import {request} from "../functions";

export default async function validateEmailAddress(email: String): Promise<CustomerApiResult<ValidateEmailAddress, string>> {
    try {
        const url = `${baseUrl}/admin/api/validate-email`;
        const response = await request<ValidateEmailAddress>(url, 'POST', {email});
        
        return {
            success: true,
            value: {
                success: response.success,
                errorCode: response.errorCode || undefined,
                message: response.message || undefined
            }
        };
    } catch (e) {
        if (devMode) {
            console.error(e);
        }
    
        throw e;
    }
};