import React, {useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text} from 'react-native';
import DataInputComponent from "../../components/dataInputComponents/DataInputWrapperComponent";
import {filterBySiteID, get, newObject, set} from "../../data/DAO";
import {Site} from "../../models/SiteModel";
import * as Location from 'expo-location';
import {EventEmitter} from "../../data/EventEmitter"
import * as UnitConverter from "../../data/UnitConverter"
import {Dive} from "../../models/DiveModel";


export default function SiteEntryScreen({route, navigation}) {
    const {destination} = route.params;
    const constant = true;
    const [trigger, setTrigger] = useState(0);
    const [ready, setReady] = useState(false);
    const [settings, setSettings] = useState();
    const [id, setID] = useState();
    const [name, setName] = useState('');
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [waterType, setWaterType] = useState('')
    const [defaultDepth, setDefaultDepth] = useState(0)

    const clearState = ()=>{
        setName('')
        setLatitude('')
        setLongitude('')
        setWaterType('')
        setDefaultDepth(0)
    }

    useEffect(() => {
        if (route.params?.site_id) {
            setID(route.params.site_id)
            get(route.params.site_id).then(
                (site : Site)=> {
                    site = new Site().initFromObject(site)
                    get("settings").then((rv) => {
                        if (rv["Units"]) site = site.convertToMetric()
                        setName(site.name)
                        setLongitude(site.longitude)
                        setLatitude(site.latitude)
                        setWaterType(site.waterType)
                        setDefaultDepth(site.defaultDepth)
                    })
                })
        }
    }, [route.params?.site_id]);

    useEffect(()=>{
        EventEmitter.subscribe('refreshSiteEntry', ()=>setTrigger(prev=>prev+1))
        return ()=>{EventEmitter.unsubscribe('refreshSiteEntry')}
    }, [constant])

    useEffect(()=>{
        let isMounted = true
        get("settings").then((rv)=>{
            if (isMounted) {
                setSettings(rv)
                setReady(true)
            }
            return () => {isMounted = false}
        })},[trigger])

    const opts2 = ready ? [
        {toggle: true, title: "Name", value: name, callback: setName},
        {toggle: settings["Show Water Type"], title: "Water Type", options: ["Salt", "Fresh"], value: waterType, callback: setWaterType},
        {toggle: settings["Show Location"], title: "Location", latitude: latitude, longitude: longitude, latitudeCallback: setLatitude, longitudeCallback: setLongitude},
        {toggle: settings["Show Default Depth"], title: settings["Units"] ? "Default Depth (m)" : "Default Depth (ft)", intervals: [1, 10, 25], value: defaultDepth, callback: setDefaultDepth},
    ] : []

    const submit = async () => {
        let value = new Site().initFromValues(name, latitude, longitude, waterType, defaultDepth)
        if (settings["Units"]) {
            value.convertFromMetric()
        }
        if (id == null) {
            newObject("sites", value).then((key) => navigation.navigate("selectSite", {destination: destination}))
        } else {
            value.id = id
            let old = await get(id)
            if (old.name !== name) {
                let dives = await filterBySiteID(id);
                for (const i in dives) {
                    let dive = new Dive().initFromObject(dives[i])
                    dive.siteName = name
                    dive.id = dives[i].id
                    await set(dive.id, dive)
                }
            }
            await set(id, value)
            navigation.goBack()
        }
        clearState()
    }

    return (
        <ScrollView style= {styles.container}>
            {ready ? opts2.map((value) => <DataInputComponent key={value.title} props={value}/>) : null}
            <Pressable style={({pressed})=>[pressed ? styles.pressed : styles.unpressed ,styles.pressable]} onPress={submit}>
                <Text style={styles.text}>
                    Submit
                </Text>
            </Pressable>
        </ScrollView>
    )

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    pressable: {
        alignItems: 'center',
        margin: 5,
        padding: 5,
        borderWidth: 1,
        borderColor: 'black',
    },
    pressed: {
        backgroundColor: 'grey'
    },
    unpressed: {
        backgroundColor: 'lightgrey'
    },
    text: {
        textAlign: 'center'
    }
});