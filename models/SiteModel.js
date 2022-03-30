export class Site {
    name: string;
    latitude: number;
    longitude: number;
    waterType: string;
    defaultDepth: number;

    constructor() {
        this.name = "Site Name";
        this.latitude = 0.000;
        this.longitude = 0.000;
        this.waterType = "Not Set";
        this.defaultDepth = 0;
    }

    initFromValues(name: string, latitude: number, longitude: number, waterType: string, defaultDepth: number) {
        if (name != null) this.name = name;
        if (latitude != null) this.latitude = latitude;
        if (longitude != null) this.longitude = longitude;
        if (waterType != null) this.waterType = waterType;
        if (defaultDepth != null) this.defaultDepth = defaultDepth;
        return this
    }

    initFromObject(obj : Site) {
        if (typeof obj != "undefined") {
            if (typeof obj.name != "undefined") this.name = obj.name
            if (typeof obj.latitude != "undefined") this.latitude = obj.latitude
            if (typeof obj.longitude != "undefined") this.longitude = obj.longitude
            if (typeof obj.waterType != "undefined") this.waterType = obj.waterType
            if (typeof obj.defaultDepth != "undefined") this.defaultDepth = obj.defaultDepth
        }
        return this
    }

    static eq(me: Site, other : Site) {
        return me.name === other.name &&
        me.latitude === other.latitude &&
        me.longitude === other.longitude &&
        me.waterType === other.waterType &&
        me.defaultDepth === other.defaultDepth
    }
}