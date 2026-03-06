import {baseUrl, devMode} from "../data";
import {request} from "../functions";
import CustomerId from "../model/CustomerId";
import ProfileData from "../model/ProfileData";
import {CustomerApiResult} from './CustomerApiResult';


/**
 * Returns the data for the customer profile page.
 */
export default async function getCustomerProfile(id: CustomerId): Promise<CustomerApiResult<ProfileData, string>> {
    try {
        const body = {
            customerId: id.value(),
        };

        const url = `${baseUrl}/admin/api/customer-profile`;
        const response = await request<ProfileData>(url, 'POST', body);
    
        response.activeCountries.forEach((country: any) => {
            if (Object.keys(country).includes('zones') && country.zones.length) {
                // adds an empty element to the first array position
                country.zones.unshift({id: 0, name: ''});
            }
        });

        return {
            success: true,
            value: {
                customer: response.customer,
                customerGroups: response.customerGroups,
                customerMemos: response.customerMemos,
                address: response.address,
                history: response.history,
                disallowedPaymentMethods: response.disallowedPaymentMethods,
                disallowedShippingMethods: response.disallowedShippingMethods,
                statistics: response.statistics,
                currency: response.currency,
                products: response.products,
                logAdminActivities: response.logAdminActivities,
                configurations: response.configurations,
                userConfigurations: response.userConfigurations,
                userId: response.userId,
                activeCountries: response.activeCountries,
                newsletterSubscriptionStatus: response.newsletterSubscriptionStatus,
            }
        };
    } catch (e) {
        if (devMode) {
            console.error(e);
        }

        return {success: false, error: "Error while fetching customer"};
    }
}