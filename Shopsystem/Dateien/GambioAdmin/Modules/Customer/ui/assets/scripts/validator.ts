import validateEmailAddress from "../../services/use-cases/validateEmailAddress";

export async function validateContactInformation(fields: any, translations: any) {
    const errors = {} as any;
    const emailRegEx = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    
    if (!fields.email.length) {
        errors['email'] = translations.profile_error_empty_field
        return errors;
    }
    
    if (!String(fields.email).toLowerCase().match(emailRegEx)) {
        errors['email'] = translations.profile_error_invalid_email;
    }
    
    const response = await validateEmailAddress(fields.email);
    
    if (response.success && !response.value.success) {
        errors['email'] = response.value.message;
    }
    
    return errors;
}

export function validateLocationInformation(data: any, configurations: any, translations: any) {
    let errors = [] as any;
    
    Object.entries(data).forEach(([key, dataSet]: [any, any]) => {
        const addressValidation = {hasErrors: false, fields: {} as any};
        
        if (configurations.value.ACCOUNT_SPLIT_STREET_INFORMATION) {
            if (!dataSet.streetName.length) {
                addressValidation.fields['streetName'] = translations.profile_error_empty_field;
            }
            if (!dataSet.houseNumber.length) {
                addressValidation.fields['houseNumber'] = translations.profile_error_empty_field;
            }
        } else {
            if (!dataSet.streetName.length) {
                addressValidation.fields['streetName'] = translations.profile_error_empty_field;
            }
        }
        
        if (!dataSet.postcode.length) {
            addressValidation.fields['postcode'] = translations.profile_error_empty_field;
        }
        
        if (!dataSet.city.length) {
            addressValidation.fields['city'] = translations.profile_error_empty_field;
        }
        
        addressValidation.hasErrors = Object.keys(addressValidation.fields).length !== 0;
        errors.push(addressValidation);
        
        if (!addressValidation.hasErrors) {
            errors = [];
        }
    });
    
    return errors;
}

export function validateGeneral(fields: any, configurations: any, translations: any) {
    const errors = {} as any;
    
    if (!fields.password.length) {
        errors['password'] = translations.profile_error_empty_field;
    }
    
    return errors;
}