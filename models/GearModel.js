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
}