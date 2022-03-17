import type {Site} from "./SiteModel";
import type {Gear} from "./GearModel";

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


    constructor(dateTime: Date, siteID: string, siteName: string, gearID: string, gearName: string, depth: number, duration: number, weight: number, exposure: string, startingPSI: number, endingPSI: number, notes1: string, notes2: string, notes3: string, notes4: string, notes5: string) {
        this.dateTime = dateTime;
        this.siteID = siteID;
        this.siteName = siteName;
        this.gearID = gearID;
        this.gearName = gearName;
        this.depth = depth;
        this.duration = duration;
        this.weight = weight;
        this.exposure = exposure;
        this.startingPSI = startingPSI;
        this.endingPSI = endingPSI;
        this.notes1 = notes1;
        this.notes2 = notes2;
        this.notes3 = notes3;
        this.notes4 = notes4;
        this.notes5 = notes5;
    }
}