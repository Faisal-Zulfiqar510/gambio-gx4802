export type Languages = Language[];

export interface Language {
    code: string;
    icon: string;
}

export interface PageTranslations {
    create_option: string;
    create_option_description: string;
    create_download_description: string;
    cancel: string;
    create: string;
    create_attach: string;
    attach_save: string;
    add_existing_option: string;
    add_existing_value: string;
    add_option: string;
    delete: string;
    close: string;
    save: string;
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
    values_table_col_filename: string;
    values_table_col_model: string;
    values_table_col_gross_price: string;
    values_table_col_net_price: string;
    values_table_col_weight: string;
    values_table_col_stock: string;
    values_table_col_max_count: string;
    values_table_col_max_days: string;
    values_table_no_values_added: string;
    values_table_no_file_selected_label: string;
    values_table_add_value: string;
    value_modal_add_heading: string;
    value_modal_edit_heading: string;
    value_modal_sort_heading: string;
    value_modal_label: string;
    value_modal_label_description: string;
    value_modal_description: string;
    value_modal_description_description: string;
    value_modal_file: string;
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

    value_modal_stock_max_count: string;
    value_modal_stock_max_count_description: string;
    value_modal_stock_max_days: string;
    value_modal_stock_max_days_group_text: string;
    value_modal_stock_max_days_description: string;

    file_manager_modal_title: string;
    add_option_downloads: string;
    add_option_download_heading: string;
    values_table_no_values_added_download: string;

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
    attach_option_values_no_values_to_attach: string;
    success_heading: string;
    success_message: string;
    edit_download_value_modal_title: string;
    edit_option_value_modal_title: string;
    attach_downloads_modal_title: string;
    attach_downloads_modal_label: string;
    attach_downloads_modal_description: string;
    attach_options_modal_available_download_options: string;
    attach_options_modal_attached_download_options: string;
    attach_options_modal_attached_download_options_number: string;
    fill_all_fields: string;
}

export interface Option extends ToAttach {
    id: number;
    details: OptionDetail[];
    values: OptionValue[];
}

export interface OptionDetail {
    languageCode: string;
    label: string;
    adminLabel: string;
    description: string;
}

export interface OptionValue extends ToAttach {
    id: number;
    optionValueId: number;
    sortOrder: number;
    image: string;
    modelNumber: string;
    weight: number;
    price: number;
    stockType: StockType;
    stock: number;
    stockCentrallyManaged: boolean;
    details: OptionValueDetail[];
    filePath: string;
    maxCount: number;
    maxDays: number;
}

export interface ProductOptionValue {
    id: number;
    optionId: number;
    optionValue?: OptionValue;
    imageListId: number | null;
    modelNumber: string;
    weight: number;
    price: number;
    stockType: StockType;
    stock: number;
    sortOrder: number;
}

export interface OptionToAttach extends Omit<Option, "values">, ToAttach {
    values: OptionValueToAttach[];
}

export interface OptionValueToAttach extends Omit<OptionValue, "id"> {
    id?: number;
    optionId?: number;
    imageListId?: number | null;
}

export interface OptionValueDetail {
    languageCode: string;
    label: string;
    description: string;
}

export interface OptionValueModal extends Omit<OptionValue, "id"> {
    id?: number;
    downloadLimitDate?: string;
    imageListId?: number | null;
}

export interface ToAttach {
    added?: boolean;
    attached?: boolean;
    checked?: boolean;
    alreadyAttached?: boolean;
    deleted?: boolean;
}

export interface ProductOptionValueResponse {
    data: ProductDownloadOption;
    _meta: Meta;
}

export interface CreateOptionValuesResponse {
    data: Array<number>;
}

export interface LanguagesResponse {
    activeLanguage: string;
    languages: Languages;
}

export interface ImageListResponse {
    data: ImageCollection[];
}

export interface CreateImageListResponse {
    data: Array<number>;
    _meta: Meta;
}

export interface Meta {
    links: string[];
    page: number;
    perPage: number;
    totalItems: number;
}

export enum DeleteType {
    Value = "value",
    Option = "option",
    ImageCollectionList = "image-collection-list",
    ImageCollectionImage = "image-collection-image",
}

export enum FileManagerFields {
    Downloads = "responseFileManagerDownloadsModal",
    ImageCollection = "responseFileManagerImageCollectionModal",
}

export interface ResponsiveFileManagerFile {
    name: string;
    fullPath: string;
    field: string;
}

export enum ResponsiveFileManagerFolders {
    OPTION_DOWNLOADS = "download",
    IMAGE_COLLECTION = "images/product_images/original_images",
}

export enum StockType {
    Positive = "only-positive",
    Natural = "all-numbers",
    NotManaged = "not-managed",
}

export enum OptionType {
    Dropdown = "Dropdown",
    Image = "Image",
    Radio = "Radio",
    Text = "Text",
    BoxedText = "BoxedText",
}

export interface DownloadOptions {
    data: number[];
    _meta: Meta;
}

export interface Download {
    filePath?: string;
    maxCount?: number;
    maxDays?: number;
}

export interface AttachedProductOptionValue extends ToAttach, ProductOptionValue {}

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

// ==========================================================================================

// New interfaces
export interface Product {
    id: number;
    name: string;
}

export interface ProductDownloadOption {
    id: number;
    details: OptionDetail[];
    values: ProductDownloadOptionValue[];
}

export interface ProductDownloadOptionValue extends ToAttach {
    id?: number;
    optionId?: number;
    optionValueId?: number;
    optionValue?: OptionValue;
    imageListId: number | null;
    sortOrder: number;
    modelNumber: string;
    price: number;
    weight: number;
    stockType: StockType;
    stock: number;
    filePath: string;
    maxCount: number;
    maxDays: number;
}

export interface AvailableDownloadOptionValue extends ToAttach {
    id: number;
    optionValueId?: number;
    detail: OptionValueDetail[];
}

export interface DownloadToAttach extends ToAttach {
    id: number;
    details: OptionDetail[];
    values: ProductDownloadOptionValue[];
}

export interface DownloadValueToAttach extends ToAttach {
    optionId: number;
    optionValueId: number;
    imageListId: number | null;
    sortOrder: number;
    modelNumber: string;
    price: number;
    weight: number;
    stockType: StockType;
    stock: number;
    filePath: string;
    maxCount: number;
    maxDays: number;
}

// ==========================================================================================

export interface DownloadList {
    id: number;
    details: OptionDetail[];
    values: DownloadValueList[];
}

export interface DownloadValueList {
    id: number;
    details: OptionValueDetail[];
}

export interface ProductDownload {
    id: number;
    details: OptionDetail[];
    values: ProductDownloadValue[];
}

export interface ProductDownloadValue {
    id: number;
    imageListId: number | null;
    sortOrder: number;
    modelNumber: string;
    weight: number;
    price: number;
    stockType: StockType;
    stock: number;
    filePath: string;
    maxCount: number;
    maxDays: number;
    optionValue: ProductDownloadValueOptionValue;
}

export interface ProductDownloadValueOptionValue {
    id: number;
    sortOrder: number;
    image: string;
    modelNumber: string;
    weight: number;
    price: number;
    stockType: StockType;
    stock: number;
    stockCentrallyManaged: boolean;
    details: OptionValueDetail[];
}

export interface AttachDownloadList extends ToAttach {
    id: number;
    details: OptionDetail[];
    values: AttachDownloadValueList[];
}

export interface AttachDownloadValueList extends ToAttach {
    id: number;
    details: OptionValueDetail[];
}

// Ajax response interfaces
export interface AvailableDownloadsListResponse {
    data: DownloadList[];
}

export interface ProductDownloadsResponse {
    data: ProductDownload[];
}

export interface FormConfig {
    formId: string;
    requiredFields?: Array<any>;
}
