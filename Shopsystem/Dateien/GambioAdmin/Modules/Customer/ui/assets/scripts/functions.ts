import {configurations, translations} from "./data";
import {Configurations, DateTimeFormatVariant} from "./types";

/**
 * Helper method to make API requests.
 *
 * @param url
 * @param method
 * @param body
 */
export async function request<T>(url: string, method: string = 'GET', body: object | null = null): Promise<T> {
    let options = {};
    if (method.toUpperCase() !== 'GET') {
        options = {
            method: method.toUpperCase(),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        };
    }

    return await fetch(url, options).then((response): Promise<T> => {
        if (response.url.includes("login.php")) {
            window.location.reload();
        }

        if (response.ok) {
            return response.json();
        }

        return Promise.reject(response);
    });
}

/**
 * Return financially formatted number from the provided value and currency.
 *
 * @param value Value as number (e.g. 14.99).
 * @param currency Currency code (e.g. "EUR").
 * @param locale Optional locale (e.g. "de-DE" for German format). When not provided, it will use the current language.
 */
export function formatMoneyValue(value: number, currency: string, locale: string = translations.profile_currency_format_locale) {
    return Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    }).format(value)
}

/**
 * Return currency symbol.
 *
 * @param currency Currency code (e.g. "EUR").
 * @param locale Optional locale (e.g. "de-DE" for German format). When not provided, it will use the current language.
 */
export function getCurrencySymbol(currency: string, locale: string = translations.profile_currency_format_locale) {
    return Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    }).formatToParts(0).find(curr => curr.type == 'currency')?.value
}

/**
 * Return locale-formatted number.
 *
 * @param value Value as number (e.g. 1000).
 * @param locale Optional locale (e.g. "de-DE" for German format). When not provided, it will use the current language.
 */
export function formatNumber(value: number, locale: string = translations.profile_currency_format_locale) {
    return Intl.NumberFormat(locale).format(value)
}

/**
 * Return locale-formatted date and time.
 *
 * @param value Date time string in ISO 8601 format (e.g. "2022-08-11T11:36:43+02:00").
 * @param variant Definition of output format.
 * @param locale Optional locale (e.g. "de-DE" for German format). When not provided, it will use the current language.
 */
export function formatDate(
    value: string,
    variant: DateTimeFormatVariant = DateTimeFormatVariant.Full,
    locale: string = translations.profile_currency_format_locale
) {
    const DATE_STYLE = "medium";
    const TIME_STYLE = "short";

    return new Intl.DateTimeFormat(locale, (() => {
        switch (variant) {
            default:
            case DateTimeFormatVariant.Full:
                return {
                    dateStyle: DATE_STYLE,
                    timeStyle: TIME_STYLE
                };
            case DateTimeFormatVariant.DateOnly:
                return {
                    dateStyle: DATE_STYLE,
                };
            case DateTimeFormatVariant.TimeOnly:
                return {
                    timeStyle: TIME_STYLE
                }
        }
    })() as any).format(new Date(value))
}

// Gets the URL query string parameters: https://stackoverflow.com/a/901144
export function getQueryStringParameters() {
  return new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams: URLSearchParams, param:string) => searchParams.get(param),
  })
}

// Gets the list of states from a country (activeCountries)
export function getActiveCountryStatesByCountry(country:string): Array<string> {
    const states: any = (configurations.value as Configurations)
        .activeCountries
        .find((activeCountry: any) => activeCountry.name === country) || [];
    
    return states ? states.zones : [];
}