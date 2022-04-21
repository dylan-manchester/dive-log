import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import * as Application from 'expo-application';
import {get} from "../data/DAO";
import {availableHeaders} from "../data/IO";


export default function StatsScreen({navigation}) {
    const [settings, setSettings] = useState()
    const [ready, setReady] = useState(false)
    const [trigger, setTrigger] = useState(0)
    const [dives, setDives] = useState(0)
    const [sites, setSites] = useState(0)
    const [totalDiveTime, setTotalDiveTime] = useState(0)
    const [maxDepth, setMaxDepth] = useState(0)


    useEffect(()=>{
        let isMounted = true
        get("settings").then((rv)=>{
            if (isMounted) {
                setSettings(rv)
                get("dives").then((rv) => {
                    let totalDiveTime = rv.reduce((sum, dive)=>sum+dive.duration, 0)
                    let maxDepth = rv.reduce((max, dive)=>dive.depth>max ? dive.depth : max, 0)
                    if (isMounted) {
                        setDives(rv.length)
                        setTotalDiveTime(totalDiveTime)
                        setMaxDepth(maxDepth)
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
                    <Text>Unique Sites: {sites}</Text>
                    <Text>Total Dive Time: </Text>
                    <Text>Max Depth: </Text>
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