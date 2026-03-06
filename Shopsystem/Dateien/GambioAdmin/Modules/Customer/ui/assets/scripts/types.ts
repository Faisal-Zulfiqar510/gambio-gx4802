import Preferences from "../../services/model/Preferences";

export interface Customer {
    data: Customer[];
    _meta: Meta;
}

export interface Customers {
    data: Customer[];
    _meta: Meta;
}

export interface CustomerGroups {
    data: CustomerGroup[];
}

export interface CustomerGroup {
    id: number;
    label: string;
}

export interface Meta {
    links: string[];
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
}

export interface Customer {
    id: number;
    customerGroup: number;
    isGuestAccount: boolean;
    isFavorite: boolean;
    personalInformation: personalInformation;
    contactInformation: contactInformation;
    businessInformation: businessInformation;
    credit: number;
}

export interface personalInformation {
    gender: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    customerNumber: string;
}

export interface contactInformation {
    email: string;
    phoneNumber: string;
    faxNumber: string;
}

export interface businessInformation {
    companyName: string;
    vatId: string;
    isTradesperson: boolean;
}

export interface locationInformation {
    paymentAddress: CustomerAddress
}

export interface Statistics {
    companyName: string;
    vatId: string;
    isTradesperson: boolean;
}

export type Translations = OverviewTranslations & ProfileTranslations & ModalTranslations & ErrorTranslations;

export interface OverviewTranslations {
    overview_add_customer: string;
    overview_customer_group: string;
    overview_search_placeholder: string;
    overview_settings: string;
    overview_country: string;
    overview_city: string;
    overview_is_favorite: string;
    overview_has_subscribed: string;
    overview_name: string;
    overview_email: string;
    overview_phone: string;
    overview_company: string;
    overview_vat_number: string;
    overview_vat_id_verified: string;
    overview_vat_id_not_verified: string;
    overview_per_page: string;
    overview_page_prev: string;
    overview_page_next: string;
    overview_page: string;
    overview_from: string;
    overview_customers: string;
    overview_to: string;
    overview_guest_account: string;
    overview_no_filter_selected: string;
    overview_filter_favorite: string;
    overview_no_results: string;
    overview_no_results_hint: string;
    overview_delete_guest_accounts: string;
    overview_delete_guest_accounts_modal_body: string;
    overview_delete_guest_accounts_deleted: string;
    overview_tooltip_customer_profile: string;
    overview_tooltip_shopping_cart: string;
    overview_tooltip_customer_favorite_add: string;
    overview_tooltip_customer_favorite_remove: string;
    overview_tooltip_customer_email: string;
    overview_registration_date: string;
    overview_last_login: string;
    
    profile_no_name: string;
    profile_customer_group: string;
    profile_customer_group_hint: string;
    profile_create_customer_group: string;
    profile_new_customer_group: string;
    profile_current_customer_group: string;
    profile_customer_group_desc: string;
    profile_email: string;
    profile_password: string;
    profile_password_show: string;
    profile_password_hide: string;
    profile_password_generate: string;
    profile_salutation: string;
    profile_salutation_mr: string;
    profile_salutation_ms: string;
    profile_salutation_none: string;
    profile_first_name: string;
    profile_last_name: string;
    profile_company_name: string;
    profile_street_name: string;
    profile_house_number: string;
    profile_post_code: string;
    profile_city: string;
    profile_country: string;
    profile_suburb: string;
    profile_state: string;
    profile_additional_information: string;
    profile_vat_id: string;
    profile_vat_id_verified: string;
    profile_vat_id_not_verified: string;
    profile_tradeperson: string;
    profile_disallowed_payment_methods: string;
    profile_disallowed_shipping_methods: string;
    profile_logging: string;
    profile_log_activity: string;
    profile_phone_number: string;
    profile_fax_number: string;
    profile_payment_address: string;
    profile_shipping_address: string;
    profile_date_of_birth: string;
    profile_customer_number: string;
    profile_business_information: string;
    profile_configurations: string;
    profile_contact_information: string;
    profile_address: string;
    profile_guest_account: string;
    profile_gender: string;
    profile_gender_m: string;
    profile_gender_f: string;
    profile_gender_d: string;
    profile_balance: string;
    profile_balance_increment: string;
    profile_balance_decrement: string;
    
    profile_new_password: string;
    profile_error_password: string;
    profile_error_password_empty: string;
    
    create_customer_password_email_subject: string;
    create_customer_password_email_body: string;
    
    profile_change_customer_group: string;
    profile_delete_customer: string;
    profile_export_personal_data: string;
    profile_delete_personal_data: string;
    profile_select_personal_data_base_data: string;
    profile_select_personal_data_orders: string;
    profile_select_personal_data_withdrawals: string;
    profile_select_personal_data_agreements: string;
    profile_select_personal_data_emails: string;
    profile_select_personal_data_carts: string;
    profile_select_personal_data_reviews: string;
    profile_select_personal_data_newsletter_subscriptions: string;
    overview_send_new_customer_password_email: string;
    overview_send_new_customer_password_email_hint: string;
    
    profile_login_as_customer: string;
    profile_login_as_customer_button: string;
    profile_login_as_customer_warning: string;
    profile_login_as_customer_warning_preference: string;
    
    profile_currency_format_locale: string;
    
    profile_error_first_name: string;
    profile_error_last_name: string;
    profile_error_gender: string;
    profile_error_invalid_email: string;
    profile_error_phone_number: string;
    profile_error_company_name: string;
    profile_error_street_name: string;
    profile_error_house_number: string;
    profile_error_street_name_house_number: string;
    profile_error_postcode: string;
    profile_error_city: string;
    profile_error_state_empty: string;
    profile_error_state: string;
    profile_error_empty_field: string;
    profile_newsletter_subscription_badge: string;
    profile_newsletter_subscription_label: string;
    profile_newsletter_subscription_option: string;
    profile_newsletter_subscription_warning: string;
}

export interface ProfileTranslations {
    profile_title: string;
    profile_no_name: string;
    profile_not_found: string;
    profile_not_found_description: string;
    profile_not_found_back_button: string;
    profile_login_as_customer: string;
    profile_login_as_customer_modal_title: string;
    profile_login_as_customer_button: string;
    profile_login_as_customer_warning: string;
    profile_login_as_customer_warning_preference: string;
    profile_email: string;
    profile_new_order: string;
    profile_memos: string;
    profile_memos_loading: string;
    profile_memos_empty: string;
    profile_memos_placeholder: string;
    profile_memos_add: string;
    profile_memos_cancel: string;
    profile_memos_delete: string;
    profile_memos_delete_confirmation: string;
    profile_change_customer_group: string;
    profile_customer_group: string;
    profile_customer_group_hint: string;
    profile_create_customer_group: string;
    profile_new_customer_group: string;
    profile_current_customer_group: string;
    profile_customer_group_desc: string;
    profile_change_password: string;
    profile_new_password: string;
    profile_password: string;
    profile_password_show: string;
    profile_password_hide: string;
    profile_password_generate: string;
    profile_salutation: string;
    profile_salutation_mr: string;
    profile_salutation_ms: string;
    profile_salutation_none: string;
    profile_first_name: string;
    profile_last_name: string;
    profile_company_name: string;
    profile_street_name: string;
    profile_house_number: string;
    profile_post_code: string;
    profile_city: string;
    profile_country: string;
    profile_suburb: string;
    profile_state: string;
    profile_additional_information: string;
    profile_vat_id: string;
    profile_vat_id_verified: string;
    profile_vat_id_not_verified: string;
    profile_tradeperson: string;
    profile_disallowed_payment_methods: string;
    profile_disallowed_shipping_methods: string;
    profile_logging: string;
    profile_log_activity: string;
    profile_phone_number: string;
    profile_fax_number: string;
    profile_payment_address: string;
    profile_shipping_address: string;
    profile_date_of_birth: string;
    profile_customer_number: string;
    profile_business_information: string;
    profile_configurations: string;
    profile_contact_information: string;
    profile_address: string;
    profile_guest_account: string;
    profile_gender: string;
    profile_gender_m: string;
    profile_gender_f: string;
    profile_gender_d: string;
    profile_personal_information: string;
    profile_error_password: string;
    profile_error_password_empty: string;
    profile_delete_customer: string;
    profile_edit: string;
    profile_total_spent_to_date: string;
    profile_loading: string;
    profile_total_orders: string;
    profile_average_order_value: string;
    profile_balance: string;
    profile_balance_hint: string;
    profile_balance_edit: string;
    profile_balance_increment: string;
    profile_balance_decrement: string;
    profile_add: string;
    profile_placed_order: string;
    profile_reviewed_product: string;
    profile_created_account: string;
    profile_redeemed_voucher: string;
    profile_added_product_to_cart: string;
    profile_added_product_to_wishlist: string;
    profile_subscribed_to_newsletter: string;
    profile_subscribed_to_newsletter_by_you: string;
    profile_subscribed_to_newsletter_by_admin: string;
    profile_order: string;
    profile_order_view: string;
    profile_products: string;
    profile_history: string;
    profile_orders: string;
    profile_wishlist: string;
    profile_cart: string;
    profile_reviews: string;
    profile_currency_format_locale: string;
    profile_error_empty_email: string;
    profile_customer_deleted: string;
    profile_product_number: string;
    profile_empty_wishlist: string;
    profile_empty_cart: string;
    profile_empty_state_cart: string;
    profile_empty_state_reviews: string;
    profile_empty_state_wishlist: string;
    profile_empty_state_orders: string;
    profile_export_personal_data: string;
    profile_delete_personal_data: string;
    profile_select_personal_data_base_data: string;
    profile_select_personal_data_orders: string;
    profile_select_personal_data_withdrawals: string;
    profile_select_personal_data_agreements: string;
    profile_select_personal_data_emails: string;
    profile_select_personal_data_carts: string;
    profile_select_personal_data_reviews: string;
    profile_select_personal_data_newsletter_subscriptions: string;
    profile_disallowed_payment_methods_hint: string;
    profile_disallowed_shipping_methods_hint: string;
    profile_newsletter_subscription_badge: string;
    profile_newsletter_subscription_label: string;
    profile_newsletter_subscription_option: string;
    profile_newsletter_subscription_warning: string;
    profile_favorite_customer: string;
    profile_favorite_customer_button: string;
    
    overview_tooltip_customer_favorite_add: string;
    overview_tooltip_customer_favorite_remove: string;
    
    profile_error_invalid_email: string;
    profile_error_phone_number: string;
    profile_error_company_name: string;
    profile_error_street_name: string;
    profile_error_house_number: string;
    profile_error_street_name_house_number: string;
    profile_error_postcode: string;
    profile_error_city: string;
    profile_error_state_empty: string;
    profile_error_state: string;
    profile_error_empty_field: string;
    profile_configurations_log_admin_activities_logging: string;
}

export interface ModalTranslations {
    modal_save: string;
    modal_cancel: string;
    modal_close: string;
    modal_delete: string;
    modal_next: string;
    modal_create_customer: string;
    modal_create_customer_title: string;
    modal_delete_customer: string;
    modal_delete_customer_text: string;
    modal_delete_customer_deleted_data_text: string;
    modal_delete_customer_action_label: string;
    profile_select_all: string;
    profile_select_personal_data_shopping_cart_wishlist: string;
    profile_select_personal_data_balance: string;
    modal_delete_customer_switch: string;
    profile_delete_personal_data_action_label: string;
    profile_delete_personal_data_account_text: string;
    profile_select_personal_data_wishlist: string;
    profile_delete_personal_data_switch: string;
    profile_delete_personal_data_text: string;
    
    modal_delete_customer_personal_data_gobd_warning_text: string;
}

export interface ErrorTranslations {
    error_heading: string;
    error_message: string;
}

export interface Configurations {
    ACCOUNT_ADDITIONAL_INFO: boolean;
    ACCOUNT_B2B_STATUS: boolean;
    ACCOUNT_COMPANY: boolean;
    ACCOUNT_COMPANY_VAT_CHECK: boolean;
    ACCOUNT_COMPANY_VAT_LIVE_CHECK: boolean;
    ACCOUNT_DOB: boolean;
    ACCOUNT_FAX: boolean;
    ACCOUNT_GENDER: boolean;
    ACCOUNT_NAMES_OPTIONAL: boolean;
    ACCOUNT_SPLIT_STREET_INFORMATION: boolean;
    ACCOUNT_STATE: boolean;
    ACCOUNT_SUBURB: boolean;
    ACCOUNT_TELEPHONE: boolean;
    GENDER_MANDATORY: false;
    STORE_COUNTRY: number;
    STORE_ZONE: number;
    activeCountries: [];
    STORE_NAME: string;
    DEFAULT_CUSTOMERS_STATUS_ID: number;
    pageToken?: string;
    userConfigurations?: Preferences;
    storeCountry?: StoreCountry;
}

export interface StoreCountry {
    name: string;
    isoCode2: string;
}

export enum DateTimeFormatVariant {
    Full,
    DateOnly,
    TimeOnly
}

export interface CustomerAddress {
    firstName: string;
    lastName: string;
    companyName: string;
    streetName: string;
    houseNumber: string;
    postcode: string;
    city: string;
    country: CustomerAddressCountry,
    additionalInformation: string,
    suburb: '',
    state: CustomerAddressState,
}

export interface CustomerAddressCountry {
    name: string;
    isoCode2: string;
}

export interface CustomerAddressState {
    id: number;
    name: string;
}