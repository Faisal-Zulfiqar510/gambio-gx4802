/**
 * Used to filter customers.
 */
import {FilterTypes} from "./FilterTypes";

export interface Filter {
    id: string,
    label: string,
    type: FilterTypes,
    value: any,
    multipleSelection?: boolean,
}