import Customers from "./Customers";
import CustomerGroups from "./CustomerGroups";
import {Configurations} from "../../assets/scripts/types";
import AdditionalInformation from "./AdditionalInformation";

export default interface OverviewData {
    customers: Customers,
    customerGroups: CustomerGroups,
    _meta: {},
    configurations: Configurations,
    userConfigurations: {},
    userId: number,
    activeCountries: [],
    additionalInformation: AdditionalInformation[],
    pageToken: string,
    currency: {},
}