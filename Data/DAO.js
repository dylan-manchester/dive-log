import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from 'react-native-uuid';
import * as FileSystem from 'expo-file-system';
import * as Sharing from "expo-sharing";
import * as DocumentPicker from 'expo-document-picker';
import {Site} from "../models/SiteModel"
import {Gear} from "../models/GearModel"
import {Dive} from "../models/DiveModel"


export async function getAll(topLevelKey) {
    console.log("Getting all "+topLevelKey)
    const ids = await get(topLevelKey);
    if (ids) {
        return await getMultiple(ids);
    }
    return []
}

export async function newObject(type, value) {
    let key = await setObject(value)
    let rv = await get(type)
    rv.push(key)
    await set(type, rv)
    return key
}

export async function deleteObject(topLevelKey, key) {
    try {
        let proceed = true
        if (topLevelKey !== "dives") {
            let dives = await getAll("dives")
            let filtered = []
            if (topLevelKey === "sites") {
                filtered = dives.filter((value, index, array) => value.siteID !== key)
            }
            else if (topLevelKey === "gear") {
                filtered = dives.filter((value, index, array) => value.gearID !== key)
            }
            if (dives.length !== filtered.length) {
                proceed = false
            }
        }
        if (proceed) {
            let keys = await get(topLevelKey)
            let filtered = keys.filter((value, index, array) => value !== key)
            await set(topLevelKey, filtered)
            await del(key)
        }
        return proceed
    } catch (e) {
        console.log(e)
    }
}

export async function get(key) {
    try {
        const jsonValue = await AsyncStorage.getItem(key)
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
        console.log(e)
    }
}

export async function set(key, value) {
    console.log("Setting...")
    try {
        console.log("Key: "+key)
        const jsonValue = JSON.stringify(value)
        console.log("Value: "+jsonValue)
        await AsyncStorage.setItem(key, jsonValue)
        console.log("Set Successful!\n")
    } catch(e) {
        console.log("Set Failed")
        console.log(e)
    }
}

export async function del(key) {
    try {
        await AsyncStorage.removeItem(key)
    } catch(e) {
        console.log(e)
    }
}

async function getMultiple(keys) {
    let values
    let rv = []
    try {
        values = await AsyncStorage.multiGet(keys)
        if (values != null) {
            values.map((obj) => rv.push(JSON.parse(obj[1])))
            return rv
        }
        return []
    } catch(e) {
        console.log(e)
    }
}


async function setObject(value) {
    let key = null
    try {
        // Generate Unique Key
        while (true) {
            key = uuid.v4().toString()
            let v = await get(key)
            if (v == null) break;
        }
        value.id = key
        await set(key, value)
        return key
    } catch(e) {
        console.log(e)
    }
}

export const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

async function alreadyExists(topLevelKey, newObj) {
    const oldObjects = await getAll(topLevelKey)
    const equivalentObjects = oldObjects.filter((value)=>topLevelKey==="sites" ? Site.eq(value,newObj): Gear.eq(value,newObj))
    console.log("Equivilent Objects:\n")
    console.log(equivalentObjects)
    if (equivalentObjects.length !== 0) {
        return equivalentObjects[0].id
    }
    return null
}


const unflattenJSON = (obj = {}, res = {}, extraKey = '') => {
    for(const key in obj){
        if(key.includes("__")){
            let parts = key.split("__")
            if (res[parts[0]]) {
                res[parts[0]][parts[1]] = obj[key];
            } else {
                res[parts[0]] = {[parts[1]]: obj[key]}
            }
        }else{
            res[key] = obj[key];
        }
    }
    return res;
};

const flattenJSON = (obj = {}, res = {}, extraKey = '') => {
    for(const key in obj){
        if(typeof obj[key] !== 'object'){
            res[extraKey + key] = obj[key];
        }else{
            flattenJSON(obj[key], res, `${extraKey}${key}__`);
        }
    }
    return res;
};

const JSONtoCSV = (obj = {}) => {
    let replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
    let header = Object.keys(obj[0])
    let csv = [
        header.join(','), // header row first
        ...obj.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n')
    return csv
}

const CSVtoJSON = (csv = '') => {
    let lines=csv.split("\n");
    let result = [];
    let headers=lines[0].split(",");
    for(let i=1;i<lines.length;i++){
        let obj = {};
        let currentline=lines[i].split(",");
        for(let j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    return result;
}

export async function exportAllDives() {
    const dives = await getAll("dives");
    let flatDives = await Promise.all(dives.map(exportableDive))
    let csv = JSONtoCSV(flatDives);
    console.log("CSV:\n"+csv);
    let fileURI = FileSystem.documentDirectory+"export.csv"
    await FileSystem.writeAsStringAsync(fileURI, csv)
    await Sharing.shareAsync(fileURI)
    return csv;
}

export async function importDives() {
    let file = await selectOneFile()
    if (file.type !== 'cancel') {
        let string = await FileSystem.readAsStringAsync(file.uri)
        const flatDives = CSVtoJSON(string)
        for (let i in flatDives) {
            await importDive(flatDives[i])
        }
    } else
        {
            console.log("File Selection Canceled\n")
        }
}


const selectOneFile = async () => {

    try {
        console.log('Importing:')
        const res = await DocumentPicker.getDocumentAsync()
        console.log('URI : ' + res.uri);
        console.log('Type : ' + res.type);
        console.log('File Name : ' + res.name);
        console.log('')
        return res;
    } catch (err) {
        if (DocumentPicker.isCancel(err)) {
            alert('Canceled from single doc picker');
        } else {
            alert('Unknown Error: ' + JSON.stringify(err));
            throw err;
        }
    }
};

export const exportableDive = async (dive) => {
    delete dive.id
    let site = await get(dive.siteID)
    dive.site = site
    delete dive.site.id
    delete dive.siteID
    let gear = await get(dive.gearID)
    dive.gear = gear
    delete dive.gear.id
    delete dive.gearID
    let flatDive = flattenJSON(dive, {}, '')
    return flatDive
}

export const importDive = async (flatDive) => {
    let dive = unflattenJSON(flatDive, {}, '')
    const site = new Site().initFromObject(dive.site)
    let site_id = await alreadyExists("sites", site)
    if (site_id === null) site_id = await newObject("sites", site)
    dive.siteName = site.name
    dive.siteID = site_id
    delete dive.site

    const gear = new Gear().initFromObject(dive.gear)
    let gear_id = await alreadyExists("gear", gear)
    if (gear_id === null) gear_id = await newObject("gear", gear)
    dive.gearName = gear.name
    dive.gearID = gear_id
    delete dive.gear

    const diveObject = new Dive().initFromObject(dive)
    let newKey = await newObject("dives", diveObject)
}
