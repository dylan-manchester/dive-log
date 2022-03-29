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

    static eq(me: Site, other : Site) {
        return me.name === other.name &&
        me.latitude === other.latitude &&
        me.longitude === other.longitude &&
        me.waterType === other.waterType &&
        me.defaultDepth === other.defaultDepth
    }
}