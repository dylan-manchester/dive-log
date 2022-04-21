import {StyleSheet, Text, View, Image, Alert} from "react-native";
import {deleteObject, get} from "../../data/DAO";
import React, {useEffect, useState} from "react";
import {Site} from "../../models/SiteModel";
import {EventEmitter} from "../../data/EventEmitter"
import * as UnitConverter from "../../data/UnitConverter"
import ModalMenuComponent from "../../components/ModalMenuComponent";


export default function SiteViewScreen({navigation, route}) {
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
            navigation.setOptions({
                headerRight: () => (
                    <ModalMenuComponent
                        options={[
                            {action:()=>editItem(site_id), text: "Edit"},
                            {action:()=>deleteItem(site_id), text: "Delete"}
                        ]}
                    />
                )
            })
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

    const deleteItem = async (id) => {
        let success = await deleteObject("sites", id)
        if (success) {
            navigation.goBack()
        } else {
            Alert.alert(`Error`, 'Please remove dependent dives first')
        }
    }

    const editItem = (id) => navigation.navigate("entrySite", {destination: "viewSite", site_id: id})

    return (
        <View style={styles.container}>
            {ready ?
                <View style={styles.content}>
                    <Text style={styles.title}>{site.name}</Text>
                    {settings["Show Location"] ? <Text style={styles.subtitle}>Location: ({site.latitude},{site.longitude})</Text> : null }
                    {settings["Show Water Type"] ? <Text style={styles.subtitle}>Water Type: {site.waterType}</Text> : null }
                    {settings["Show Default Depth"] ?<Text style={styles.subtitle}>Default Depth: {settings["Units"] ? UnitConverter.ft2m(parseFloat(site.defaultDepth)).toFixed(0)+" m" : parseFloat(site.defaultDepth).toFixed(0) +" ft"}</Text> : null }
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