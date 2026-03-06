export interface ResponsiveFileManagerFile {
    name: string;
    fullPath: string;
    field: string;
}

export interface ImageCollection {
    id: number;
    name: string;
    images: Image[];
}

export interface Image {
    unsaved?: boolean;
    relativePath: string;
    url: string;
    sortOrder: number;
    titles: ImageTitle[];
    altTitles: ImageTitle[];
}

export interface ImageTitle {
    text: string;
    languageCode: string;
}

export interface Language {
    code: string;
    icon: string;
}

export type Languages = {
    activeLanguage: string;
    languages: Language[];
};

export interface PageTranslations {
    add_option: string;
    create_option: string;
    attach_options_button: string;
    attach_options: string;
    attach_options_description: string;
    cancel: string;
    create: string;
    create_attach: string;
    attach_save: string;
    add_existing_option: string;
    add_existing_value: string;
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
    edit_image: string;
    add_image: string;
    edit_image_collection: string;
    add_image_collection: string;
    new_collection: string;
    select_collection: string;
    collection_name: string;
    add_images: string;
    main_image: string;
    attach_options_modal_title: string;
    attach_options_modal_label: string;
    attach_options_modal_description: string;
    attach_options_modal_available_product_options: string;
    attach_options_modal_selected_options: string;
    attach_options_modal_search_options: string;
    attach_options_modal_search_not_found: string;
    attach_options_modal_no_available_options: string;
    attach_options_modal_attached_product_options: string;
    attach_options_modal_attached_product_options_number: string;
    attach_options_modal_attached_no_options: string;
    attach_options_modal_attached_no_options_tip: string;
    attach_option_values_modal_title_add: string;
    attach_option_values_modal_title_attach: string;
    attach_option_values_label: string;
    attach_option_values_description: string;
    attach_option_values_available_option_values: string;
    attach_option_values_selected_values: string;
    attach_option_values_search_values: string;
    attach_option_values_search_not_found: string;
    attach_option_values_attached_option_values: string;
    attach_option_values_attached_option_values_number: string;
    attach_option_values_attached_no_values: string;
    attach_option_values_attached_no_values_tip: string;
    success_heading: string;
    success_message: string;
    edit_option_value_modal_title: string;
    attach_downloads_description: string;
    attach_downloads_button: string;
}

export interface Meta {
    links: string[];
    page: number;
    perPage: number;
    totalItems: number;
}

export enum StockType {
    Positive = "only-positive",
    Natural = "all-numbers",
    NotManaged = "not-managed",
}

export enum DeleteType {
    Value = "value",
    Option = "option",
    ProductOption = "productOption",
    ProductOptionValue = "productOptionValue",
    ImageCollection = "imageCollection",
    Image = "image",
}

export enum OptionType {
    Dropdown = "Dropdown",
    Image = "Image",
    Radio = "Radio",
    Text = "Text",
    BoxedText = "BoxedText",
}

export enum ResponsiveFileManagerField {
    OptionValue = "responseFileManagerOptionValueModal",
    ImageCollection = "responseFileManagerImageCollectionModal",
}

export enum ResponsiveFileManagerFolders {
    OPTION_IMAGES = "images/product_images/option_images",
    IMAGE_COLLECTION = "images/product_images/original_images",
}

export interface Option {
    id: number;
    type: OptionType;
    sortOrder: number;
    details: OptionDetail[];
    values: OptionValue[];
}

export interface OptionValueDetail {
    languageCode: string;
    label: string;
    description: string;
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

export interface OptionValueToAttach extends ToAttach {
    imageListId?: number | null;
    weight: number;
    price: number;
    stockType: StockType;
    stock: number;
    sortOrder: number;
    modelNumber: string;
}

export interface ProductOption {
    id: number;
    details: OptionDetail[];
    values: ProductOptionValue[];
}

export interface AttachOptionValue {
    id: number;
    optionValueId: number;
    details: OptionValueDetail[];
    attached: boolean;
    alreadyAttached: boolean;
    
    checked?: boolean;
}

export interface AttachOptionListValue {
    id: number;
    details: OptionValueDetail[];
    optionValueId: number;
    
    attached: boolean;
    alreadyAttached: boolean;
    checked?: boolean;
    added?: boolean;
}

export interface AttachOption {
    id: number;
    details: OptionDetail[];
    values: AttachOptionListValue[];
    
    attached: boolean;
    alreadyAttached: boolean;
    checked?: boolean;
    deleted?: boolean;
}

export interface ProductOptionValue extends ToAttach {
    id: number;
    imageListId?: number | null;
    sortOrder: number;
    modelNumber: string;
    weight: number;
    price: number;
    stockType: StockType;
    stock: number;
    optionValue?: OptionValue;
}

export interface ProductOptionValueToAttach extends ToAttach {
    optionId: number;
    optionValueId: number;
    imageListId: number | null;
    modelNumber: string;
    weight: number;
    price: number;
    stockType: StockType;
    stock: number;
    sortOrder: number;
}

export interface ProductOptionListToAttach extends ToAttach {
    id: number;
    details: OptionDetail[];
    values: AttachedProductOptionValue[];
}

export interface AttachedProductOptionValue extends ToAttach, ProductOptionValue {
}

export interface AttachedProductOptions extends ToAttach {
    id: number;
    details: OptionDetail[];
    values: AttachedProductOptionValue[];
}

export interface ToAttach {
    added?: boolean;
    attached?: boolean;
    checked?: boolean;
    alreadyAttached?: boolean;
    deleted?: boolean;
    optionId?: number;
    optionValueId?: number;
    productId?: number;
}

export interface DownloadOptions {
    data: number[];
    _meta: Meta;
}

export interface ProductOptionResponse {
    data: ProductOption;
}

export interface ImageListResponse {
    data: ImageCollection[];
}

export interface CreateImageListResponse {
    data: Array<number>;
    _meta: Meta;
}

export interface OptionValueResponse {
    data: OptionValue[];
    _meta: Meta;
}

export interface CreateOptionValueResponse {
    data: Array<number>;
    _meta: Meta;
}

export interface OptionsResponse {
    data: Option[];
    _meta: Meta;
}

export interface AvailableOption {
    id: number;
    details: OptionDetail[];
    values: AvailableOptionValue[];
}

export interface AvailableOptionValue {
    id: number;
    details: OptionValueDetail[];
}

export interface AvailableOptionsResponse {
    data: AvailableOption[];
}

export interface AvailableOptionValuesResponse {
    data: AvailableOption[];
}

export interface AttachProductOptionValuesResponse {
    data: number[];
}

export interface FormConfig {
    formId: string;
    requiredFields?: Array<any>;
}
