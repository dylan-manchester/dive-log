import * as UnitConverter from "../data/UnitConverter"

export class Gear {
    name: string;
    cylinderType: string;
    cylinderSize: number;
    defaultWeight: number;
    defaultStartingPSI: number;

    constructor() {
        this.name = "Gear Config";
        this.cylinderType = "Not Set";
        this.cylinderSize = 0;
        this.defaultWeight = 0;
        this.defaultStartingPSI = 0;
    }

    initFromValues(name: string, cylinderType: number, cylinderSize: number, defaultWeight: string, defaultStartingPSI: number) {
        if (name != null) this.name = name;
        if (cylinderType != null) this.cylinderType = cylinderType;
        if (cylinderSize != null) this.cylinderSize = cylinderSize;
        if (defaultWeight != null) this.defaultWeight = defaultWeight;
        if (defaultStartingPSI != null) this.defaultStartingPSI = defaultStartingPSI;
        return this
    }

    initFromObject(obj : Gear) {
        if (typeof obj != "undefined") {
            if (typeof obj.name != "undefined") this.name = obj.name;
            if (typeof obj.cylinderType != "undefined") this.cylinderType = obj.cylinderType;
            if (typeof obj.cylinderSize != "undefined") this.cylinderSize = obj.cylinderSize;
            if (typeof obj.defaultWeight != "undefined") this.defaultWeight = obj.defaultWeight;
            if (typeof obj.defaultStartingPSI != "undefined") this.defaultStartingPSI = obj.defaultStartingPSI;
        }
        return this
    }

    convertFromMetric() {
        this.defaultWeight = UnitConverter.kg2lbs(this.defaultWeight)
        this.defaultStartingPSI = UnitConverter.bar2psi(this.defaultStartingPSI)
        return this
    }

    convertToMetric() {
        this.defaultWeight = UnitConverter.lbs2kg(this.defaultWeight)
        this.defaultStartingPSI = UnitConverter.psi2bar(this.defaultStartingPSI)
        return this
    }
    

    static eq(me : Gear, other : Gear) {
        return me.name === other.name &&
        me.cylinderType === other.cylinderType &&
        me.cylinderSize === other.cylinderSize &&
        me.defaultWeight === other.defaultWeight &&
        me.defaultStartingPSI === other.defaultStartingPSI
    }
}