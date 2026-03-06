import Customers from "./Customers";
import AdditionalInformation from "./AdditionalInformation";

export default interface SearchData {
    customers: Customers,
    additionalInformation: AdditionalInformation[],
    _meta: {},
}