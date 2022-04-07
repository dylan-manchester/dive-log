export class Dive {
    dateTime: Date;
    siteID: string;
    siteName: string;
    gearID: string;
    gearName: string;
    depth: number;
    duration: number;
    weight: number;
    exposure: string;
    startingPSI: number;
    endingPSI: number;
    notes1: string;
    notes2: string;
    notes3: string;
    notes4: string;
    notes5: string;


    constructor() {
        this.dateTime = new Date();
        this.siteID = null;
        this.siteName = "Site Name";
        this.gearID = null;
        this.gearName = "Gear Config";
        this.depth = 0;
        this.duration = 0;
        this.weight = 0;
        this.exposure = "Not set";
        this.startingPSI = 0;
        this.endingPSI = 0;
        this.notes1 = "";
        this.notes2 = "";
        this.notes3 = "";
        this.notes4 = "";
        this.notes5 = "";
    }

    initFromValues(dateTime: Date, siteID: string, siteName: string, gearID: string, gearName: string, depth: number, duration: number, weight: number, exposure: string, startingPSI: number, endingPSI: number, notes1: string, notes2: string, notes3: string, notes4: string, notes5: string) {
        if (dateTime != null) this.dateTime = dateTime;
        if (siteID != null) this.siteID = siteID;
        if (siteName != null) this.siteName = siteName;
        if (gearID != null) this.gearID = gearID;
        if (gearName != null) this.gearName = gearName;
        if (depth != null) this.depth = depth;
        if (duration != null) this.duration = duration;
        if (weight != null) this.weight = weight;
        if (exposure != null) this.exposure = exposure;
        if (startingPSI != null) this.startingPSI = startingPSI;
        if (endingPSI != null) this.endingPSI = endingPSI;
        if (notes1 != null) this.notes1 = notes1;
        if (notes2 != null) this.notes2 = notes2;
        if (notes3 != null) this.notes3 = notes3;
        if (notes4 != null) this.notes4 = notes4;
        if (notes5 != null) this.notes5 = notes5;
        return this
    }

    initFromObject(obj : Dive) {
        if (typeof obj != "undefined") {
            if (typeof obj.dateTime != "undefined") this.dateTime = obj.dateTime;
            if (typeof obj.siteID != "undefined") this.siteID = obj.siteID;
            if (typeof obj.siteName != "undefined") this.siteName = obj.siteName;
            if (typeof obj.gearID != "undefined") this.gearID = obj.gearID;
            if (typeof obj.gearName != "undefined") this.gearName = obj.gearName;
            if (typeof obj.depth != "undefined") this.depth = obj.depth;
            if (typeof obj.duration != "undefined") this.duration = obj.duration;
            if (typeof obj.weight != "undefined") this.weight = obj.weight;
            if (typeof obj.exposure != "undefined") this.exposure = obj.exposure;
            if (typeof obj.startingPSI != "undefined") this.startingPSI = obj.startingPSI;
            if (typeof obj.endingPSI != "undefined") this.endingPSI = obj.endingPSI;
            if (typeof obj.notes1 != "undefined") this.notes1 = obj.notes1;
            if (typeof obj.notes2 != "undefined") this.notes2 = obj.notes2;
            if (typeof obj.notes3 != "undefined") this.notes3 = obj.notes3;
            if (typeof obj.notes4 != "undefined") this.notes4 = obj.notes4;
            if (typeof obj.notes5 != "undefined") this.notes5 = obj.notes5;
        }
        return this
    }
}