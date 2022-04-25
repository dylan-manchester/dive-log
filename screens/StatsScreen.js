import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import * as Application from 'expo-application';
import {get} from "../data/DAO";
import {availableHeaders} from "../data/IO";
import {Dive} from "../models/DiveModel";


export default function StatsScreen() {
    const [settings, setSettings] = useState()
    const [ready, setReady] = useState(false)
    const [trigger, setTrigger] = useState(0)
    const [numDives, setNumDives] = useState(false)
    const [numSites, setNumSites] = useState(false)
    const [totalDiveTime, setTotalDiveTime] = useState(false)
    const [maxDepth, setMaxDepth] = useState(false)


    useEffect(()=>{
        let isMounted = true
        get("settings").then((setting)=> {
            if (isMounted) {
                setSettings(setting)
                get("dives").then(async (dives) => {
                    let sum = 0
                    let max = 0
                    for (const i in dives) {
                        let dive = await get(dives[i])
                        dive = new Dive().initFromObject(dive)
                        if (setting["Units"]) dive = dive.convertToMetric()
                        let duration = parseInt(dive.duration)
                        let depth = parseInt(dive.depth)
                        sum = sum + duration
                        max = depth > max ? depth : max
                    }
                    get("sites").then((sites) => {
                        if (isMounted) {
                            setNumDives(dives.length)
                            setTotalDiveTime(sum)
                            setMaxDepth(max)
                            setNumSites(sites.length)
                            setReady(true)
                        }
                    })
                })
            }
        })
        return () => {isMounted = false}
    },[trigger])

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.row}>
                    <View style={styles.cell}>
                        <Text style={styles.title}>Total Dives:</Text>
                        <Text style={styles.statistic}>{numDives ? numDives : "---"}</Text>
                    </View>
                    <View style={styles.cell}>
                        <Text style={styles.title}>Unique Sites:</Text>
                        <Text style={styles.statistic}>{numSites ? numSites : "---"}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.cell}>
                        <Text style={styles.title}>Total Dive Time:</Text>
                        <Text style={styles.statistic}>{totalDiveTime ? totalDiveTime+" min" : "---"}</Text>
                    </View>
                    <View style={styles.cell}>
                        <Text style={styles.title}>Max Depth:</Text>
                        <Text style={styles.statistic}>{maxDepth ? maxDepth+(settings["Units"] ? " m" : " ft") : "---"}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.version}>
                <Text>Version: {Application.nativeApplicationVersion}</Text>
            </View>
        </View>
    )
            }


const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        flex: 100,
    },
    content: {
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        flex: .3,
    },
    cell: {
        flexDirection: 'column',
        borderColor: 'black',
        borderRadius: 40,
        borderWidth: 1,
        flex: .4,
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
    },
    statistic: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    version: {
        alignItems: 'center'
    }
})