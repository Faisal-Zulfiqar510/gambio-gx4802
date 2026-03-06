export default class ShippingModuleId {
    constructor(private readonly _value : string) {
        if (_value && !/^\s*$/.test(_value)) {
            throw new Error(`Payment module ID can not be empty.`);
        }
        
        this._value = _value;
    }
    
    value(): string {
        return this._value;
    }
}