import {CustomerGender} from "./CustomerGender";

export default interface PersonalInformation {
    gender: CustomerGender,
    firstName: string,
    lastName: string,
    companyName: string,
}