import CustomerId from "./CustomerId";
import PersonalInformation from "./PersonalInformation";
import LocationInformation from "./LocationInformation";

export default interface CustomerAddress {
    id: CustomerId,
    personalInformation: PersonalInformation,
    locationInformation: LocationInformation,
}