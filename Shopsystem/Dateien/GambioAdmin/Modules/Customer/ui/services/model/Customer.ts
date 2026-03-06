import CustomerId from "./CustomerId";
import CustomerGroupId from "./CustomerGroupId";
import PersonalInformation from "./PersonalInformation";
import ContactInformation from "./ContactInformation";
import BusinessInformation from "./BusinessInformation";
import CustomerLocationInformation from "./CustomerLocationInformation";

export default interface Customer {
    id: CustomerId,
    customerGroup: CustomerGroupId,
    isGuestAccount: boolean,
    isFavorite: boolean,
    personalInformation: PersonalInformation,
    contactInformation: ContactInformation,
    businessInformation: BusinessInformation,
    credit: number,
    addresses: CustomerLocationInformation,
    disallowedPaymentMethods: [],
    disallowedShippingMethods: [],
}