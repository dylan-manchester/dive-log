import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, ScrollView} from 'react-native';
import DataInputComponent from "../../components/dataInputComponents/DataInputWrapperComponent";
import {get, newObject, set} from "../../data/DAO";
import {Gear} from "../../models/GearModel";
import {EventEmitter} from "../../data/EventEmitter"
import * as UnitConverter from "../../data/UnitConverter"


export default function GearEntryScreen({route, navigation}) {
    const {destination} = route.params;
    const constant = true;
    const [trigger, setTrigger] = useState(0);
    const [ready, setReady] = useState(false);
    const [settings, setSettings] = useState();
    const [name, setName] = useState('');
    const [id, setID] = useState()
    const [cylinderType, setCylinderType] = useState('')
    const [cylinderSize, setCylinderSize] = useState(0)
    const [defaultWeight, setDefaultWeight] = useState(0)
    const [defaultStaringPSI, setDefaultStaringPSI] = useState(0)

    const clearState = ()=>{
        setName('')
        setCylinderType('')
        setCylinderSize(0)
        setDefaultWeight(0)
        setDefaultStaringPSI(0)
    }

    useEffect(() => {
        if (route.params?.gear_id) {
            setID(route.params.gear_id)
            get(route.params.gear_id).then(
                (gear : Gear)=>{
                    gear = new Gear().initFromObject(gear)
                    get("settings").then((rv)=> {
                        if (rv["Units"]) gear = gear.convertToMetric()
                        setName(gear.name)
                        setCylinderType(gear.cylinderType)
                        setCylinderSize(gear.cylinderSize)
                        setDefaultWeight(gear.defaultWeight)
                        setDefaultStaringPSI(gear.defaultStartingPSI)
                    })
                }).catch(e=>console.log(e))
        }
    }, [route.params?.gear_id]);

    useEffect(()=>{
        EventEmitter.subscribe('refreshGearEntry', ()=>setTrigger(prev=>prev+1))
        return ()=>{EventEmitter.unsubscribe('refreshGearEntry')}
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
        {toggle: settings["Show Cylinder Type"], title: "Cylinder Type", options: ["Aluminum", "Steel", "CCR"], value: cylinderType, callback: setCylinderType},
        {toggle: settings["Show Cylinder Size"], title: "Cylinder Type (ft^3)", intervals: [1, 10, 25], value: cylinderSize, callback: setCylinderSize},
        {toggle: settings["Show Default Weight"], title: settings["Units"] ? "Default Weight (kg)" : "Default Weight (lbs)" , intervals: [1, 10, 25], value: defaultWeight, callback: setDefaultWeight},
        {toggle: settings["Show Default PSI"], title: settings["Units"] ? "Default Starting Pressure (bar)" : "Default Starting Pressure (psi)", intervals: [50, 100, 500], value: defaultStaringPSI, callback: setDefaultStaringPSI},
    ] : []

    const submit = () => {
        let value = new Gear().initFromValues(name, cylinderType, cylinderSize, defaultWeight, defaultStaringPSI)
        if (settings["Units"]) {
            value = value.convertFromMetric()
        }
        if (id == null) {
            newObject("gear",value).then((key)=>navigation.navigate("selectGear", {destination: destination}))
        } else {
            value.id = id
            set(id, value).then(() => navigation.goBack())
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