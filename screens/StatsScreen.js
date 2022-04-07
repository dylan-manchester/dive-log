import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import * as Application from 'expo-application';
import {get} from "../Data/DAO";
import {availableHeaders} from "../Data/IO";


export default function StatsScreen({navigation}) {
    const [settings, setSettings] = useState()
    const [ready, setReady] = useState(false)
    const [trigger, setTrigger] = useState(0)
    const [dives, setDives] = useState(0)
    const [sites, setSites] = useState(0)


    useEffect(()=>{
        let isMounted = true
        get("settings").then((rv)=>{
            if (isMounted) {
                setSettings(rv)
                get("dives").then((rv) => {
                    if (isMounted) {
                        setDives(rv.length)
                        get("sites").then((rv) => {
                            setSites(rv.length)
                            setReady(true)
                        })
                    }
                })
            }
        })
        return () => {isMounted = false}
    },[trigger])

    return (
        <View style={styles.container}>
            {ready ?
                <View style={styles.content}>
                    <Text>Total Dives: {dives}</Text>
                    <Text>Total Sites: {sites}</Text>
                    <Text>Version: {Application.nativeApplicationVersion}</Text>
                    <Text>Headers: {availableHeaders()}</Text>
                </View>
            : <View/>}
        </View>
    )
            }


const styles = StyleSheet.create({
    container: {
    }
})