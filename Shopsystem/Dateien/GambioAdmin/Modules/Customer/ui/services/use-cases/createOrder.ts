import {baseUrl, devMode} from "../data";
import CustomerId from "../model/CustomerId";
import {CustomerApiResult} from "./CustomerApiResult";

export default async function createOrder(id: CustomerId): Promise<CustomerApiResult<number, string>> {
    try {
        const body = new FormData();
        const url = `${baseUrl}/admin/admin.php?do=NewCustomerOrderAjax`;

        body.append("customerId", String(id))

        const response = await fetch(url, {body, method: 'POST'});

        const json: { success: true, data: { orderId: number } } = await response.json();

        return {success: true, value: json.data.orderId};
    } catch (e) {
        if (devMode) {
            window.console.log(e);
        }

        return {success: false, error: 'ErrorApi'};
    }
}