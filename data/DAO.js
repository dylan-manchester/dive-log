import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from 'react-native-uuid';


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
    const newRV = [key,...rv]
    await set(type, newRV)
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
        if (["dives", "sites", "gear"].includes(key)) {
            console.log("Total "+key+": "+value.length)
        } else {console.log("Value: "+jsonValue)}
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


