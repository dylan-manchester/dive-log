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
    startingPSI: number;
    endingPSI: number;


    constructor(dateTime: Date, siteID: string, siteName: string, gearID: string, gearName: string, depth: number, duration: number, weight: number, startingPSI: number, endingPSI: number) {
        this.dateTime = dateTime;
        this.siteID = siteID;
        this.siteName = siteName;
        this.gearID = gearID;
        this.gearName = gearName;
        this.depth = depth;
        this.duration = duration;
        this.weight = weight;
        this.startingPSI = startingPSI;
        this.endingPSI = endingPSI;
    }
}