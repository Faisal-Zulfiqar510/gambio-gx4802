import { request } from '../functions';
import { Customer } from '../types';

export async function getCustomer(): Promise<Customer> {
    return await request<Customer>(`/admin/api/options`);
}