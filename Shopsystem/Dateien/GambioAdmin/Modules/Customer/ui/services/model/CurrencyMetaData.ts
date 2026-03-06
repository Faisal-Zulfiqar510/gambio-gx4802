export default interface CurrencyMetaData {
    code: string,
    decimalPlaces: number,
    decimalSeparator: string,
    id: number,
    isDefault: boolean,
    name: string,
    symbols: {
        left: string,
        right: string,
    },
    thousandsSeparator: string,
    value: number,
}