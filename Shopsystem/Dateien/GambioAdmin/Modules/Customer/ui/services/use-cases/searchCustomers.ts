import CustomerSearchError from "../errors/CustomerSearchError";
import {request} from "../functions";
import {baseUrl, devMode} from "../data";
import Customers from "../model/Customers";
import {CustomerApiResult} from "./CustomerApiResult";
import SearchData from "../model/SearchData";
import {RequestFilter, Pagination} from "./getCustomersOverview";
import {Sort} from "../model/Sort";
import AdditionalInformation from "../model/AdditionalInformation";

export default async function searchCustomer(
    filter: RequestFilter,
    pagination: Pagination,
    sort: Sort,
): Promise<CustomerApiResult<SearchData, string>> {
    try {
        const queryParams = [
            `per-page=${pagination.perPage()}`,
            `page=${pagination.page()}`,
            `sort=${sort.type}${sort.name}`,
            `term=${filter.searchTerm}`
        ];
        
        const url = `${baseUrl}/admin/api/customers/search?${queryParams.join('&')}`;
        const response = await request<{ data: { customers: Customers, additionalInformation: AdditionalInformation[] }, _meta: {} }>(url);
        
        return {
            success: true,
            value: {
                customers: response.data.customers,
                additionalInformation: response.data.additionalInformation,
                _meta: response._meta
            }
        }
        
    } catch (e) {
        if (devMode) {
            console.error(e);
        }
        
        throw new CustomerSearchError();
    }
}