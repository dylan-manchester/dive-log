import {StyleSheet, Text, View, Image} from "react-native";
import {get} from "../../Data/DAO";
import React, {useEffect, useState} from "react";
import {Site} from "../../models/SiteModel";
import {EventEmitter} from "../../Data/EventEmitter"

export default function SiteViewScreen({route}) {
    const {site_id} = route.params
    const [site, setSite] = useState(new Site())
    const constant = true
    const [ready, setReady] = useState(false)
    const [trigger, setTrigger] = useState(0)
    const [settings, setSettings] = useState()

    useEffect(()=>{
        EventEmitter.subscribe('refreshSiteView', (r)=>setTrigger(r))
        return ()=>{EventEmitter.unsubscribe('refreshSiteView')}
    }, [constant])

    useEffect(()=>{
        let isMounted = true
        get("settings").then((rv)=>{
            if (isMounted) {
                setSettings(rv)
                get(site_id).then((rv) => {
                    if (isMounted) {
                        setSite(rv)
                        setReady(true)
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
                    <Text style={styles.title}>{site.name}</Text>
                    {settings["Show Location"] ? <Text style={styles.subtitle}>Location: ({site.latitude},{site.longitude})</Text> : null }
                    {settings["Show Water Type"] ? <Text style={styles.subtitle}>Water Type: {site.waterType}</Text> : null }
                    {settings["Show Default Depth"] ?<Text style={styles.subtitle}>Default Depth: {site.defaultDepth} ft</Text> : null }
                </View>
                : <Image source={require("../../assets/loading.gif")}/> }
        </View>
    )
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
        borderRadius: 10,
        width: "90%",
        justifyContent: "space-between",
        backgroundColor: '#aecdcb',
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