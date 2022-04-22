import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, Alert} from 'react-native';
import {deleteObject, get} from "../../data/DAO";
import {Gear} from "../../models/GearModel";
import {EventEmitter} from "../../data/EventEmitter"
import * as UnitConverter from "../../data/UnitConverter"
import ModalMenuComponent from "../../components/ModalMenuComponent";
import {useFocusEffect} from "@react-navigation/native";


export default function GearViewScreen({navigation, route}) {
    const {gear_id} = route.params;
    const [gear, setGear] = useState(new Gear())
    const constant = true
    const [trigger, setTrigger] = useState(0)
    const [ready, setReady] = useState(false)
    const [settings, setSettings] = useState()

    useEffect(()=>{
        EventEmitter.subscribe('refreshGearView', ()=>setTrigger(prev=>prev+1))
        return ()=>{EventEmitter.unsubscribe('refreshGearView')}
    }, [constant])

    useFocusEffect(
        React.useCallback(()=>{
        let isMounted = true
        get("settings").then((setting)=>{
            navigation.setOptions({
                headerRight: () => (
                    <ModalMenuComponent
                        options={[
                            {action:()=>editItem(gear_id), text: "Edit"},
                            {action:()=>deleteItem(gear_id), text: "Delete"}
                        ]}
                    />
                )
            })
            if (isMounted) {
                setSettings(setting)
                get(gear_id).then((gear : Gear) => {
                    gear = new Gear().initFromObject(gear)
                    if (setting["Units"]) gear = gear.convertToMetric()
                    if (isMounted) {
                        setGear(gear)
                        setReady(true)
                    }
                })
            }
        })
        return () => {isMounted = false}
    },[trigger]))

    const deleteItem = async (id) => {
        let success = await deleteObject("gear", id)
        if (success) {
            navigation.goBack()
        } else {
            Alert.alert(`Error`, 'Please remove dependent dives first')
        }
    }

    const editItem = (id) => navigation.navigate("entryGear", {destination: "viewGear", gear_id: id})


    return (
        <View style= {styles.container}>
            {ready ?
                <View style={styles.content}>
                    <Text style={styles.title}>{gear.name}</Text>
                    {settings["Show Cylinder Type"] ? <Text style={styles.subtitle}>Cylinder Type: {gear.cylinderType}</Text> : null}
                    {settings["Show Cylinder Size"] ? <Text style={styles.subtitle}>Cylinder Size: {parseFloat(gear.cylinderSize).toFixed(0)+(" ft^3")}</Text> : null}
                    {settings["Show Default Weight"] ? <Text style={styles.subtitle}>Default Weight: {parseFloat(gear.defaultWeight).toFixed(0)+(settings["Units"] ? " kg" : " lbs")}</Text> : null}
                    {settings["Show Default PSI"] ? <Text style={styles.subtitle}>Default Starting PSI: {parseFloat(gear.defaultStartingPSI).toFixed(0)+(settings["Units"] ? " bar" : " psi")}</Text> : null}
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
        borderRadius: 10,
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