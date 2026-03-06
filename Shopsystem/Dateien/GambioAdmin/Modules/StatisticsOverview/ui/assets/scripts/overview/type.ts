export type Id = number;

export type Name = string;

export enum Category {
    Orders = "orders",
    Customers = "customers",
    System = "system",
}

export type Categories = Category[];

export enum Visualization {
    AreaChart = "areaChart",
    BarChart = "barChart",
    PieChart = "pieChart",
    Table = "table",
    Text = "text",
    TreemapChart = "treemapChart",
    RadialBarChart = "radialBarChart",
    TwoSidedBarChart = "twoSidedBarChart",
}

export type Options = { [key: string]: Option };

export type Option = NumberOption | TextOption | DropdownOption | CheckboxOption;

export type OptionTitle = string;

export type OptionId = string;

export type OptionIds = OptionId[];

export type NumberOption = {
    type: "number";
    value: number;
    title: OptionTitle;
};

export type TextOption = {
    type: "text";
    value: string;
    title: OptionTitle;
};

export type DropdownOptionItems = { [key: string]: string };

export type DropdownOption = {
    type: "dropdown";
    value: string;
    title: OptionTitle;
    dropdown: DropdownOptionItems;
};

export type CheckboxOption = {
    type: "checkbox";
    value: boolean;
    title: OptionTitle;
};

export type SerialDataCategories = string[];

export type SerialDataItemValues = number[];

export type SerialDataItem = {
    title: string;
    values: SerialDataItemValues;
};

export type SerialDataItems = SerialDataItem[];

export type SerialData = {
    type: "serial";
    categories: SerialDataCategories;
    series: SerialDataItems;
};

export type MapDataValue = {
    title: string;
    value: number;
};

export type MapDataValues = MapDataValue[];

export type MapData = {
    type: "map";
    values: MapDataValues;
};

export type TextValue = string;

export type TextData = {
    type: "text";
    value: TextValue;
};

export type NumberData = {
    type: "number";
    value: NumberValue;
};

export type NumberValue = string;

export type TableDataColumnTitle = string;

export type TableDataColumnField = string;

export type TableDataBooleanColumn = {
    type: "boolean";
    title: TableDataColumnTitle;
    field: TableDataColumnField;
};

export type TableDataDateColumnFormat = {
    input: string;
    output: string;
};

export type TableDataDateColumn = {
    type: "date";
    title: TableDataColumnTitle;
    field: TableDataColumnField;
    format: TableDataDateColumnFormat;
};

export type TableDataDecimalColumn = {
    type: "decimal";
    title: TableDataColumnTitle;
    field: TableDataColumnField;
};

export type TableDataIntegerColumn = {
    type: "integer";
    title: TableDataColumnTitle;
    field: TableDataColumnField;
};

export type TableDataPercentageColumn = {
    type: "percentage";
    title: TableDataColumnTitle;
    field: TableDataColumnField;
};

export type TableDataTextColumn = {
    type: "text";
    title: TableDataColumnTitle;
    field: TableDataColumnField;
};

export type TableDataColumn =
    | TableDataBooleanColumn
    | TableDataDateColumn
    | TableDataDecimalColumn
    | TableDataIntegerColumn
    | TableDataPercentageColumn
    | TableDataTextColumn;

export type TableDataColumns = TableDataColumn[];

export type TableDataRowStringField = string;

export type TableDataRowNumberField = number;

export type TableDataRowBooleanField = boolean;

export type TableDataRowField = TableDataRowStringField | TableDataRowNumberField | TableDataRowBooleanField;

export type TableDataRow = { [key: string]: TableDataRowField };

export type TableDataRows = TableDataRow[];

export type TableData = {
    type: "table";
    columns: TableDataColumns;
    rows: TableDataRows;
};

export type Data = SerialData | MapData | TextData | TableData | NumberData;

export type UpdateSetValue = string | number | boolean;

export type OptionUpdateSet = {
    [key: string]: UpdateSetValue;
};

export type Widgets = Widget[];

export interface Widget {
    id: Id;
    name: Name;
    category: Category
    visualization: Visualization;
    options: Options;
    data: Data;
}

export interface PageTranslations {
    language_code: string;
    overview_cancel: string;
    overview_configure_widget: string;
    overview_save: string;
    overview_erroneous_widget: string;
    overview_refresh: string;
    overview_customize: string;
    overview_widget_without_data: string;
    overview_error_occurred: string;
    overview_category_orders: string;
    overview_category_customers: string;
    overview_category_system: string;
}

export type ModalOpenState = boolean;

export type LoadingState = boolean;

export type Color = string;

export type ColorPalette = Color[];

export type ErrorMessage = string;

export interface Customization {
    id: Id;
    name: Name;
    sortOrder: number;
    visibility: boolean;
}

export type Customizations = Customization[];