export class Gear {
    name: string;
    cylinderType: string;
    cylinderSize: number;
    defaultWeight: number;
    defaultStartingPSI: number;

    constructor(name: string, cylinderType: string, cylinderSize: number, defaultWeight: number, defaultStartingPSI: number) {
        this.name = name;
        this.cylinderType = cylinderType;
        this.cylinderSize = cylinderSize;
        this.defaultWeight = defaultWeight;
        this.defaultStartingPSI = defaultStartingPSI;
    }

    static eq(me : Gear, other : Gear) {
        return me.name === other.name &&
        me.cylinderType === other.cylinderType &&
        me.cylinderSize === other.cylinderSize &&
        me.defaultWeight === other.defaultWeight &&
        me.defaultStartingPSI === other.defaultStartingPSI
    }
}