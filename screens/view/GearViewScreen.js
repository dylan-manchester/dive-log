import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {get, wait} from "../../Data/DAO";
import {Gear} from "../../models/GearModel";
import {EventEmitter} from "../../Data/EventEmitter"

export default function GearViewScreen({route}) {
    const {gear_id} = route.params;
    const [gear, setGear] = useState(new Gear())
    const constant = true
    const [trigger, setTrigger] = useState(0)
    const [ready, setReady] = useState(false)
    const [settings, setSettings] = useState()

    useEffect(()=>{
        EventEmitter.subscribe('refreshGearView', (r)=>setTrigger(r))
        return ()=>{EventEmitter.unsubscribe('refreshGearView')}
    }, [constant])

    useEffect(()=>{
        let isMounted = true
        get("settings").then((rv)=>{
            if (isMounted) {
                setSettings(rv)
                get(gear_id).then((rv) => {
                    if (isMounted) {
                        setGear(rv)
                        setReady(true)
                    }
                })
            }
        })
        return () => {isMounted = false}
    },[trigger])


    return (
        <View style= {styles.container}>
            {ready ?
                <View style={styles.content}>
                    <Text style={styles.title}>{gear.name}</Text>
                    {settings["Show Cylinder Type"] ? <Text style={styles.subtitle}>Cylinder Type: {gear.cylinderType}</Text> : null}
                    {settings["Show Cylinder Size"] ? <Text style={styles.subtitle}>Cylinder Size: {gear.cylinderSize}</Text> : null}
                    {settings["Show Default Weight"] ? <Text style={styles.subtitle}>Default Weight: {gear.defaultWeight} lbs</Text> : null}
                    {settings["Show Default PSI"] ? <Text style={styles.subtitle}>Default Starting PSI: {gear.defaultStartingPSI}</Text> : null}
                </View>
                : <Image source={require("../../assets/loading.gif")}/> }
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        paddingTop: 30,
        flex: 1,
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#02adec',
    },
    content: {
        width: "90%",
        justifyContent: "space-between",
        backgroundColor: '#3c7782',
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
})