import OverviewData from "../model/OverviewData";
import {baseUrl, devMode} from "../data";
import {request} from "../functions";
import Customers from "../model/Customers";
import CustomerGroups from "../model/CustomerGroups";
import {CustomerApiResult} from "./CustomerApiResult";
import {Configurations} from "../../assets/scripts/types";
import {Sort} from "../model/Sort";
import AdditionalInformation from "../model/AdditionalInformation";
import Preferences from "../model/Preferences";

/**
 * Returns a filtered, sorted and paginated collection of customers as well as the total count of customers.
 */
export default async function getCustomersOverview(
    pagination: Pagination,
    filter: RequestFilter,
    sort: Sort
): Promise<CustomerApiResult<OverviewData, string>> {
    try {
        const queryParams = [
            `per-page=${pagination.perPage()}`,
            `page=${pagination.page()}`,
            `sort=${sort.type}${sort.name}`,
        ];
        
        if (filter.customerGroup !== undefined) {
            queryParams.push(`filter[customerGroup]=${filter.customerGroup}`);
        }
        
        if (filter.isFavorite !== undefined) {
            queryParams.push(`filter[isFavorite]=${filter.isFavorite}`);
        }
        
        const url = `${baseUrl}/admin/api/customers-overview?${queryParams.join('&')}`;
        const response = await request<{
            customers: Customers,
            customerGroups: CustomerGroups,
            configurations: Configurations,
            additionalInformation: AdditionalInformation[],
            userConfigurations: {},
            userId: number,
            activeCountries: [],
            securityToken: string,
            currency: {},
            _meta: {},
        }>(url);
        
        response.activeCountries.forEach((country: any) => {
            if (Object.keys(country).includes('zones') && country.zones.length) {
                // adds an empty element to the first array position
                country.zones.unshift({id: 0, name: ''});
            }
        });
        
        return {
            success: true,
            value: {
                customers: response.customers,
                customerGroups: response.customerGroups,
                configurations: response.configurations,
                additionalInformation: response.additionalInformation,
                userConfigurations: response.userConfigurations,
                userId: response.userId,
                activeCountries: response.activeCountries,
                pageToken: response.securityToken,
                currency: response.currency,
                _meta: response._meta,
            }
        };
    } catch (e) {
        if (devMode) {
            console.error(e);
        }
        
        return {
            success: true,
            value: {
                customers: [],
                customerGroups: [],
                configurations: {} as Configurations,
                additionalInformation: [],
                userConfigurations: {} as Preferences,
                userId: 0,
                activeCountries: [],
                pageToken: "",
                currency: {},
                _meta: {},
            }
        };
    }
}

/**
 * Used for paginating customers.
 */
export class Pagination {
    constructor(private readonly _perPage: number, private readonly _page: number) {
        this._perPage = _perPage;
        this._page = _page;
        
        if (this._perPage <= 0) {
            this._perPage = 1;
        }
        
        if (this._page <= 0) {
            this._page = 1;
        }
    }
    
    perPage(): number {
        return this._perPage;
    }
    
    page(): number {
        return this._page;
    }
}

/**
 * Used to filter customers.
 */
export interface RequestFilter {
    customerGroup?: any,
    isFavorite?: any,
    searchTerm?: string
}

/**
 * Used to define sort order for customers overview.
 */
export enum SortingName {
    ID = 'id',
    CustomerGroup = 'customerGroup',
    IsFavorite = 'isFavorite',
    FirstName = 'personalInformation.firstName',
    LastName = 'personalInformation.lastName',
    Email = 'contactInformation.email',
    CustomerNumber = 'personalInformation.customerNumber',
    CompanyName = 'businessInformation.companyName',
    IsTradesperson = 'businessInformation.isTradesperson',
    RegistrationDate = 'registrationDate'
}

export enum SortingType {
    ASC = '',
    DESC = '-'
}