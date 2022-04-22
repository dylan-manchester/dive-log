import React, {useEffect, useState} from 'react';
import {Pressable, Image, StyleSheet, Text, View, ScrollView, Alert} from 'react-native';
import {deleteObject, get, wait} from "../../data/DAO";
import {Dive} from "../../models/DiveModel";
import {Gear} from "../../models/GearModel";
import {Site} from "../../models/SiteModel";
import {EventEmitter} from "../../data/EventEmitter"
import ModalMenuComponent from "../../components/ModalMenuComponent";
import {useFocusEffect} from "@react-navigation/native";


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
        EventEmitter.subscribe('refreshDiveView', ()=>setTrigger(prev=>prev+1))
        return ()=>{EventEmitter.unsubscribe('refreshDiveView')}
    }, [constant])

    useEffect( () => {
        let isMounted = true
        wait(800).then(()=>
            get("settings").then((rv)=>{
                navigation.setOptions({
                    headerRight: () => (
                        <ModalMenuComponent
                            options={[
                                {action: () => editItem(dive_id), text: "Edit"},
                                {action: () => deleteItem(dive_id), text: "Delete"}
                            ]}
                        />
                    )
                })
                if (isMounted) {
                    setSettings(rv)
                }
            })
        )
        return () => {isMounted = false}
    }, [constant])

    useFocusEffect(
        React.useCallback(()=>{
        let isMounted = true
        get("settings").then((setting)=>{
            if (isMounted) {
                setSettings(setting)
                get(dive_id).then((dive : Dive) => {
                    dive = new Dive().initFromObject(dive)
                    if (setting["Units"]) dive = dive.convertToMetric()
                    if (isMounted) {
                        setDive(dive)
                        setDT(new Date(dive.dateTime))
                        get(dive.siteID).then((site: Site)=>{
                            site = new Site().initFromObject(site)
                            if (setting["Units"]) site = site.convertToMetric()
                            setSite(site)
                            get(dive.gearID).then((gear : Gear)=>{
                                gear = new Gear().initFromObject(gear)
                                if (setting["Units"]) gear = gear.convertToMetric()
                                setGear(gear)
                                setReady(true)
                            })
                        })
                    }
                })
            }
        })
        return () => {isMounted = false}
    },[trigger]))


    const deleteItem = async (id) => {
        let success = await deleteObject("dives", id)
        if (success) {
            navigation.goBack()
        } else {
            Alert.alert(`Error`, 'Please try again')
        }
    }

    const editItem = (id) => navigation.navigate("entryDive", {destination: "viewDive", dive_id: id})

    //const exportItem = async (item) => Clipboard.setString(JSON.stringify(await exportableDive({...item})))


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
                            {settings["Show Cylinder Size"] ? <Text style={styles.subtitle}>Cylinder Size: {parseFloat(gear.cylinderSize).toFixed(0)+(" ft^3")}</Text> : null}
                        </Pressable>
                        {settings["Show Depth"] ? <Text style={styles.subtitle}>Depth: {parseFloat(dive.depth).toFixed(0)+(settings["Units"] ? " m" : " ft")}</Text> : null}
                        {settings["Show Duration"] ? <Text style={styles.subtitle}>Duration: {dive.duration} min</Text> : null}
                        {settings["Show Weight"] ? <Text style={styles.subtitle}>Weight: {parseFloat(dive.weight).toFixed(0)+(settings["Units"] ? " kg" : " lbs")}</Text> : null}
                        {settings["Show Exposure"] ? <Text style={styles.subtitle}>Exposure Suit: {dive.exposure}</Text> : null}
                        {settings["Show PSI"] ? <Text style={styles.subtitle}>Starting Pressure: {parseFloat(dive.startingPSI).toFixed(0)+(settings["Units"] ? " bar" : " psi")}</Text> : null}
                        {settings["Show PSI"] ? <Text style={styles.subtitle}>Ending Pressure: {parseFloat(dive.endingPSI).toFixed(0)+(settings["Units"] ? " bar" : " psi")}</Text> : null}
                        {settings["Note 1"]["Show"] ? <Text style={styles.subtitle}>{settings["Note 1"]["Name"]}: {dive.notes1}</Text> : null}
                        {settings["Note 2"]["Show"] ? <Text style={styles.subtitle}>{settings["Note 2"]["Name"]}: {dive.notes2}</Text> : null}
                        {settings["Note 3"]["Show"] ? <Text style={styles.subtitle}>{settings["Note 3"]["Name"]}: {dive.notes3}</Text> : null}
                        {settings["Note 4"]["Show"] ? <Text style={styles.subtitle}>{settings["Note 4"]["Name"]}: {dive.notes4}</Text> : null}
                        {settings["Note 5"]["Show"] ? <Text style={styles.subtitle}>{settings["Note 5"]["Name"]}: {dive.notes5}</Text> : null}
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