import Customer from "./Customer";
import CustomerGroups from "./CustomerGroups";
import CustomerMemos from "./CustomerMemos";
import CustomerLocationInformation from "./CustomerLocationInformation";
import CustomerHistory from "./CustomerHistory";
import Statistics from "./Statistics";
import CurrencyMetaData from "./CurrencyMetaData";
import CustomerProduct from "./CustomerProduct";
import {Configurations} from "../../assets/scripts/types";
import LocationInformation from "./LocationInformation";

export default interface ProfileData {
    customer: Customer,
    customerGroups: CustomerGroups,
    customerMemos: CustomerMemos,
    address: LocationInformation,
    history: CustomerHistory,
    disallowedPaymentMethods: [],
    disallowedShippingMethods: [],
    statistics: Statistics,
    currency: CurrencyMetaData
    products: { [key: number]: CustomerProduct },
    logAdminActivities: boolean,
    configurations: Configurations,
    userConfigurations: {},
    userId: number,
    activeCountries: [],
    newsletterSubscriptionStatus: boolean,
}