export default class CustomerGroupId {
    constructor(private readonly _value: number) {
        if (_value < 0) {
            throw new Error(`Customer group ID must be greater than 0. Got: ${_value}`);
        }
        
        this._value = _value;
    }
    
    value(): number {
        return this._value;
    }
}