import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import {Dive} from "../models/DiveModel";
import {Site} from "../models/SiteModel";
import {Gear} from "../models/GearModel";
import {get, getAll, newObject} from "./DAO";
import {Alert} from "react-native";

async function alreadyExists(topLevelKey, newObj) {
    const oldObjects = await getAll(topLevelKey)
    const equivalentObjects = oldObjects.filter((value) => topLevelKey === "sites" ? Site.eq(value, newObj) : Gear.eq(value, newObj))
    if (equivalentObjects.length>0) console.log("Using Equivalent " + topLevelKey + ": " + equivalentObjects[0].id)
    if (equivalentObjects.length !== 0) {
        return equivalentObjects[0].id
    }
    return null
}

const unflattenJSON = (obj = {}, res = {}, extraKey = '') => {
    for (const key in obj) {
        if (key.includes("__")) {
            let parts = key.split("__")
            if (res[parts[0]]) {
                res[parts[0]][parts[1]] = obj[key];
            } else {
                res[parts[0]] = {[parts[1]]: obj[key]}
            }
        } else {
            res[key] = obj[key];
        }
    }
    return res;
};
const flattenJSON = (obj = {}, res = {}, extraKey = '') => {
    for (const key in obj) {
        if (typeof obj[key] !== 'object') {
            res[extraKey + key] = obj[key];
        } else {
            flattenJSON(obj[key], res, `${extraKey}${key}__`);
        }
    }
    return res;
};
const JSONtoCSV = (obj = {}) => {
    let replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
    let header = Object.keys(obj[0])
    let csv = [
        header.join(','), // header
        ...obj.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\n')
    return csv
}
const CSVtoJSON = (csv = '') => {
    let lines = csv.split("\n");
    let result = [];
    let headers = lines[0].split(",");
    for (let i = 1; i < lines.length; i++) {
        let obj = {};
        let currentline = lines[i].split(",");
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j].replace(/["]+/g, '')
        }
        result.push(obj);
    }
    return result;
}

export async function exportAllDives() {
    Alert.alert("Please Wait","Export in Progress")
    const dives = await getAll("dives");
    let flatDives = await Promise.all(dives.map(exportableDive))
    let csv = JSONtoCSV(flatDives);
    let fileURI = FileSystem.documentDirectory + "export.csv"
    await FileSystem.writeAsStringAsync(fileURI, csv)
    await Sharing.shareAsync(fileURI)
    return csv;
}

export async function importFile() {
    console.log('Importing:')
    let file = await DocumentPicker.getDocumentAsync()
    if (file.type !== 'cancel') {
        let string = await FileSystem.readAsStringAsync(file.uri)
        await importAlert(string)
    } else {
        console.log("File Selection Canceled\n")
    }
}

async function importAlert(string) {
    let lines = string.split("\n");
    let headers = lines[0].split(",");
    let alertTitle = "Import "+(lines.length-1).toString()+" Dives?"
    let alertMessage = ""
    let possibleHeaders = availableHeaders();
    let invalidColumns = ""
    for (const h in headers) {
        if (!(possibleHeaders.includes(headers[h]))) {
            invalidColumns += headers[h]
            invalidColumns += "\n"
        }
    }
    if (invalidColumns !== "") {
        alertMessage="WARNING!\nInvalid Columns:\n" + invalidColumns
    }
    Alert.alert(alertTitle,alertMessage,[
        {
            text: "Cancel",
            onPress: () => console.log("Import Cancelled"),
            style: "cancel"
        },
        {
            text: "OK",
            onPress: () => importDives(string)
        }
        ]
    )
}

export async function importDives(csv) {
    Alert.alert("Please Wait","Import in Progress")
    const flatDives = CSVtoJSON(csv)
    let totalNewObjects = {"site":0, "gear":0, "dive":0}
    for (let i in flatDives) {
        let newObjects = await importDive(flatDives[i])
        if (newObjects.site) totalNewObjects.site+=1
        if (newObjects.gear) totalNewObjects.gear+=1
        if (newObjects.dive) totalNewObjects.dive+=1

    }
    let alertMessage =
        "New Sites: "+totalNewObjects.site.toString()+"\n"
        +"New Gear Configs: "+totalNewObjects.gear.toString()+"\n"
        +"New Dives: "+totalNewObjects.dive.toString()+"\n"
    Alert.alert("Import Complete",alertMessage)
}

export const importDive = async (flatDive) => {
    let created = {"site":false, "gear":false, "dive":false}

    let dive = unflattenJSON(flatDive, {}, '')
    const site = new Site().initFromObject(dive.Site)
    let site_id = await alreadyExists("sites", site)
    if (site_id === null) {
        site_id = await newObject("sites", site)
        created.site = true
    }
    dive.siteName = site.name
    dive.siteID = site_id
    delete dive.Site

    const gear = new Gear().initFromObject(dive.Gear)
    let gear_id = await alreadyExists("gear", gear)
    if (gear_id === null) {
        gear_id = await newObject("gear", gear)
        created.gear = true
    }
    dive.gearName = gear.name
    dive.gearID = gear_id
    delete dive.Gear

    const diveObject = new Dive().initFromObject(dive)
    let newKey = await newObject("dives", diveObject)
    created.dive = true
    return created
}

export const exportableDive = async (dive) => {
    delete dive.id
    let site = await get(dive.siteID)
    dive.Site = site
    delete dive.Site.id
    delete dive.siteID
    let gear = await get(dive.gearID)
    dive.Gear = gear
    delete dive.Gear.id
    delete dive.gearID
    let flatDive = flattenJSON(dive, {}, '')
    return flatDive
}

export const availableHeaders = () => {
    let dive = new Dive()
    dive.dateTime = dive.dateTime.toString()
    let site = new Site()
    dive.Site = site
    delete dive.siteID
    let gear = new Gear()
    dive.Gear = gear
    delete dive.gearID
    let flatDive = flattenJSON(dive, {}, '')
    return Object.keys(flatDive)
}