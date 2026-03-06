import LocationInformationCountry from "./LocationInformationCountry";

export default interface LocationInformation {
    streetName: string,
    houseNumber: string,
    postcode: string,
    city: string,
    country: LocationInformationCountry,
    additionalInformation: string,
    suburb: string,
    state: string,
}