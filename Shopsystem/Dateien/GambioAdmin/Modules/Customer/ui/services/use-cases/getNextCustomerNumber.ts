import NextCustomerNumberData from "../model/NextCustomerNumberData";
import {baseUrl, devMode} from "../data";
import {request} from "../functions";

/**
 * Returns a filtered, sorted and paginated collection of customers as well as the total count of customers.
 */
export default async function getNextCustomerNumber(): Promise<{ data: NextCustomerNumberData }> {
    try {
        const url = `${baseUrl}/admin/api/next-customer-number`;
        const response = await request<{ data: number }>(url);
        
        return {
            "data" : {
                success: true,
                value: response.data + ''
            }
        };
    } catch (e) {
        if (devMode) {
            console.error(e);
        }
        
        return {
            "data" : {
                success: false,
                value: ''
            }
        }
    }
}