import React, {useEffect, useState} from 'react';
import {Pressable, Image, StyleSheet, Text, View, ScrollView} from 'react-native';
import {get, wait} from "../../Data/DAO";
import {Dive} from "../../models/DiveModel";
import {Gear} from "../../models/GearModel";
import {Site} from "../../models/SiteModel";
import {EventEmitter} from "../../Data/EventEmitter"



export default function DiveViewScreen({route, navigation}) {
    const {dive_id} = route.params;
    const [dive, setDive] = useState(new Dive())
    const [site, setSite] = useState(new Site())
    const [gear, setGear] = useState(new Gear())
    const [dt, setDT] = useState(new Date())
    const constant = true
    const [trigger, setTrigger] = useState(0)
    const [ready, setReady] = useState(false)
    const [settings, setSettings] = useState()

    useEffect(()=>{
        EventEmitter.subscribe('refreshDiveView', (r)=>setTrigger(r))
        return ()=>{EventEmitter.unsubscribe('refreshDiveView')}
    }, [constant])

    useEffect( () => {
        let isMounted = true
        wait(800).then(()=>
            get("settings").then((rv)=>{
                if (isMounted) {
                    setSettings(rv)
                    get(dive_id).then((rv) => {
                        if (isMounted) {
                            setDive(rv)
                            setDT(new Date(rv.dateTime))
                            get(rv.siteID).then(setSite)
                            get(rv.gearID).then(setGear)
                            setReady(true)
                        }
                    })
                }
            })
        )
        return () => {isMounted = false}
    }, [constant])

    useEffect(()=>{
        let isMounted = true
        get("settings").then((rv)=>{
            if (isMounted) {
                setSettings(rv)
            }
        })
        return () => {isMounted = false}
    },[trigger])


    return (
        <View style={styles.container}>
            {ready ?
                <View style={styles.content}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.title}>Date: {String(dt.getMonth()).padStart(2,'0')}/{String(dt.getDate()).padStart(2,'0')}/{dt.getFullYear()}</Text><Text style={styles.title}>Time: {String(dt.getHours()).padStart(2,'0')+":"+ String(dt.getMinutes()).padStart(2,'0')}</Text>
                        <Pressable style={styles.site} onPress={()=>navigation.push("viewSite",{site_id: dive.siteID})}>
                            <Text style={styles.title}>Site</Text>
                            <Text style={styles.subtitle}>Name: {site.name}</Text>
                            {settings["Show Location"] ? <Text style={styles.subtitle}>Location: ({site.latitude},{site.longitude})</Text> : null}
                            {settings["Show Water Type"] ? <Text style={styles.subtitle}>Water Type: {site.waterType}</Text> : null}
                        </Pressable>
                        <Pressable style={styles.gear} onPress={()=>navigation.push("viewGear",{gear_id: dive.gearID})}>
                            <Text style={styles.title}>Gear Config</Text>
                            <Text style={styles.subtitle}>Name: {gear.name}</Text>
                            {settings["Show Cylinder Type"] ? <Text style={styles.subtitle}>Cylinder Type: {gear.cylinderType}</Text> : null}
                            {settings["Show Cylinder Size"] ? <Text style={styles.subtitle}>Cylinder Size: {gear.cylinderSize}</Text> : null}
                        </Pressable>
                        {settings["Show Depth"] ? <Text style={styles.subtitle}>Depth: {dive.depth} ft</Text> : null}
                        {settings["Show Duration"] ? <Text style={styles.subtitle}>Duration: {dive.duration} min</Text> : null}
                        {settings["Show Weight"] ? <Text style={styles.subtitle}>Weight: {dive.weight} lbs</Text> : null}
                        {settings["Show Exposure"] ? <Text style={styles.subtitle}>Exposure Suit: {dive.exposure}</Text> : null}
                        {settings["Show PSI"] ? <Text style={styles.subtitle}>Starting PSI: {dive.startingPSI}</Text> : null}
                        {settings["Show PSI"] ? <Text style={styles.subtitle}>Ending PSI: {dive.endingPSI}</Text> : null}
                        {settings["Show Notes 1"] ? <Text style={styles.subtitle}>{settings["Note 1 Name"]}: {dive.notes1}</Text> : null}
                        {settings["Show Notes 2"] ? <Text style={styles.subtitle}>{settings["Note 2 Name"]}: {dive.notes2}</Text> : null}
                        {settings["Show Notes 3"] ? <Text style={styles.subtitle}>{settings["Note 3 Name"]}: {dive.notes3}</Text> : null}
                        {settings["Show Notes 4"] ? <Text style={styles.subtitle}>{settings["Note 4 Name"]}: {dive.notes4}</Text> : null}
                        {settings["Show Notes 5"] ? <Text style={styles.subtitle}>{settings["Note 5 Name"]}: {dive.notes5}</Text> : null}
                    </ScrollView>
                </View>
                : <Image source={require("../../assets/loading.gif")}/> }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#02adec',
    },
    content: {
        borderRadius: 10,
        width: "90%",
        backgroundColor: '#dfe8e6',
        padding: 25,
        marginBottom: 30,
        marginTop: 30,
    },
    title: {
        fontSize: 30,
        marginBottom: 10,
        paddingLeft: 10,
    },
    subtitle: {
        fontSize: 20,
        marginBottom: 5,
        paddingLeft: 25,
    },
    site: {
        borderRadius: 5,
        backgroundColor: '#aecdcb',
        marginBottom: 25,
        paddingBottom: 5,
    },
    gear: {
        borderRadius: 5,
        backgroundColor: '#3c7782',
        marginBottom: 25,
        paddingBottom: 5,
    }
})