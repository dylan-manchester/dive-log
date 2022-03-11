export class Site {
    name: string;
    latitude: number;
    longitude: number;
    waterType: string;
    defaultDepth: number;

    constructor(name: string, latitude: number, longitude: number, waterType: string, defaultDepth: number) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.waterType = waterType;
        this.defaultDepth = defaultDepth;
    }
}