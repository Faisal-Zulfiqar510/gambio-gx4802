export interface Options {
    data: Data[];
    _meta: Meta;
}

export interface OptionValues {
    data: OptionsData;
    _meta: Meta;
}

export enum DeleteType {
    Value = "value",
    Option = "option",
}

export enum OptionType {
    Dropdown = "Dropdown",
    Image = "Image",
    Radio = "Radio",
    Text = "Text",
    BoxedText = "BoxedText",
}

export type Data = OptionsData;

export interface OptionDataSet {
    type: string;
    sortOrder: number;
    details: OptionDetail[];
}

export interface Meta {
    links: string[];
    page: number;
    perPage: number;
    totalItems: number;
}

export interface OptionsData {
    id: number;
    type: OptionType;
    sortOrder: number;
    details: OptionDetail[];
    values: OptionValue[];
}

export interface OptionDetail {
    languageCode: string;
    label: string;
    adminLabel: string;
    description: string;
}

export interface OptionValue {
    id: number;
    sortOrder: number;
    image: string;
    modelNumber: string;
    weight: number;
    price: number;
    stock: number;
    stockType: StockType;
    stockCentrallyManaged: boolean;
    details: OptionValueDetail[];
}

export interface OptionValueDetail {
    languageCode: string;
    label: string;
    description: string;
}

export interface PageTranslations {
    add_option: string;
    create_option: string;
    create_option_description: string;
    cancel: string;
    create: string;
    delete: string;
    close: string;
    save: string;
    fill_all_fields: string;
    label: string;
    label_description: string;
    description: string;
    description_description: string;
    edit_option_heading: string;
    sort_option_heading: string;
    add_option_heading: string;
    add_option_admin_label: string;
    add_option_admin_label_description: string;
    add_option_type: string;
    add_option_type_description: string;
    add_option_type_option_dropdown: string;
    add_option_type_option_image: string;
    add_option_type_option_radio: string;
    add_option_type_option_text: string;
    add_option_type_option_boxed_text: string;
    add_option_type_preview: string;
    confirm_modal_heading: string;
    confirm_modal_body: string;
    values_table_row_actions: string;
    values_table_col_value: string;
    values_table_col_model: string;
    values_table_col_gross_price: string;
    values_table_col_net_price: string;
    values_table_col_weight: string;
    values_table_col_stock: string;
    values_table_no_values_added: string;
    values_table_add_value: string;
    value_modal_add_heading: string;
    value_modal_edit_heading: string;
    value_modal_sort_heading: string;
    value_modal_label: string;
    value_modal_label_description: string;
    value_modal_description: string;
    value_modal_description_description: string;
    value_modal_image: string;
    value_modal_image_description: string;
    value_modal_image_select: string;
    value_modal_image_no_file_selected: string;
    value_modal_image_selected: string;
    value_modal_model_number: string;
    value_modal_model_number_description: string;
    value_modal_weight: string;
    value_modal_weight_description: string;
    value_modal_gross_price: string;
    value_modal_net_price: string;
    value_modal_price_description: string;
    value_modal_stock: string;
    value_modal_stock_description: string;
    file_manager_modal_title: string;
    success_heading: string;
    success_message: string;

    error_heading: string;
    error_message: string;
    error_message_409: string;
}

export interface Language {
    code: string;
    icon: string;
}

export type Languages = Language[];

export interface LanguageRequest {
    activeLanguage: string;
    languages: Languages;
}

export enum StockType {
    Positive = "only-positive",
    Natural = "all-numbers",
    NotManaged = "not-managed",
}

export interface ResponsiveFileManagerFile {
    name: string;
    fullPath: string;
}

export enum ResponsiveFileManagerFolders {
    OPTION_IMAGES = "images/product_images/option_images",
}

export interface FormConfig {
    formId: string;
    requiredFields?: Array<any>;
}
