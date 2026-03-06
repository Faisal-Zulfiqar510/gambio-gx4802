import { request } from '../functions';
import {CustomerGroups, Customers} from '../types';

export interface listCustomers {
    searchTerm: string;
    customerGroup: number;
    page: number;
    perPage: number;
}

export async function getCustomers(): Promise<Customers> {
    return await request<Customers>(`/admin/api/customers?per-page=120&page=1&filter[firstName]=Max&filter[lastName]=Max&sort=personalInformation.firstName`);
}

export async function getCustomerGroups(): Promise<CustomerGroups> {
    return await request<CustomerGroups>(`/admin/api/customer-groups`);
}