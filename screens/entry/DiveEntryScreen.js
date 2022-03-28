import React, {useEffect, useState} from 'react';
import {Platform, Pressable, StyleSheet, Text, TextInput, View, ScrollView} from 'react-native';
import DataInputComponent from "../../components/DataInputComponent";
import {get, set, newObject} from "../../Data/DAO";
import {Dive} from "../../models/DiveModel";
import DateTimePicker from '@react-native-community/datetimepicker';
import {useFocusEffect, useIsFocused} from "@react-navigation/native";
import {EventEmitter} from "../../Data/EventEmitter"

export default function DiveEntryScreen({route, navigation}) {
    const {destination} = route.params
    const constant = false
    const [trigger, setTrigger] = useState(0)
    const [ready, setReady] = useState(false)
    const [settings, setSettings] = useState()
    const [id, setID] = useState()
    const [dateTime, setDateTime] = useState(new Date())
    const [mode, setMode] = useState('date')
    const [show, setShow] = useState(false)
    const [siteID, setSiteID] = useState()
    const [siteName, setSiteName] = useState('')
    const [gearID, setGearID] = useState()
    const [gearName, setGearName] = useState('')
    const [depth, setDepth] = useState(0)
    const [duration, setDuration] = useState(0)
    const [weight, setWeight] = useState(0)
    const [exposure, setExposure] = useState()
    const [startingPSI, setStartingPSI] = useState(0)
    const [endingPSI, setEndingPSI] = useState(0)
    const [notes1, setNotes1] = useState('')
    const [notes2, setNotes2] = useState('')
    const [notes3, setNotes3] = useState('')
    const [notes4, setNotes4] = useState('')
    const [notes5, setNotes5] = useState('')


    const clearState = ()=>{
        setDateTime(new Date())
        setSiteID()
        setSiteName('')
        setGearID()
        setGearName('')
        setDepth(0)
        setDuration(0)
        setWeight(0)
        setExposure(null)
        setStartingPSI(0)
        setEndingPSI(0)
        setNotes1('')
        setNotes2('')
        setNotes3('')
        setNotes4('')
        setNotes5('')
    }

    useEffect(() => {
        if (route.params?.dive_id) {
            setID(route.params.dive_id)
            get(route.params.dive_id).then(
                (dive : Dive)=>{
                    setDateTime(new Date(dive.dateTime))
                    setSiteID(dive.siteID)
                    setSiteName(dive.siteName)
                    setGearID(dive.gearID)
                    setGearName(dive.gearName)
                    setDepth(dive.depth)
                    setDuration(dive.duration)
                    setWeight(dive.weight)
                    setExposure(dive.exposure)
                    setStartingPSI(dive.startingPSI)
                    setEndingPSI(dive.endingPSI)
                    setNotes1(dive.notes1)
                    setNotes2(dive.notes2)
                    setNotes3(dive.notes3)
                    setNotes4(dive.notes4)
                    setNotes5(dive.notes5)
                }).catch(e=>console.log(e))
        }
    }, [route.params?.dive_id]);


    useEffect(() => {
        get("favSite").then((rv)=>{
            if (rv != null) {
                get(rv).then(
                    site=>{
                        if (site != null) {
                            setSiteID(rv)
                            setSiteName(site.name)
                            setDepth(site.defaultDepth)
                        }
                    }).catch(e=>console.log(e))
            }
        }).catch(e=>console.log(e))
        get("favGear").then((rv)=>{
            if (rv != null) {
                get(rv).then(
                    gear=>{
                        if (gear != null) {
                            setGearID(rv)
                            setGearName(gear.name)
                            setStartingPSI(gear.defaultStartingPSI)
                            setWeight(gear.defaultWeight)
                        }
                    }).catch(e=>console.log(e))
            }
        }).catch(e=>console.log(e))
    }, [constant]);

    useEffect(()=>{
        EventEmitter.subscribe('refreshDiveEntry', (r)=>setTrigger(r))
        return ()=>{EventEmitter.unsubscribe('refreshDiveEntry')}
    }, [constant])

    useEffect(()=>{
        let isMounted = true
        setReady(false)
        get("settings").then((rv)=>{
            if (isMounted) {
                setSettings(rv)
                setReady(true)
            }
            return () => {isMounted = false}
        })},[trigger])


    useEffect(() => {
        if (route.params?.site_id) {
            let isMounted = true
            get(route.params.site_id).then(
                site=>{
                    if (isMounted) {
                        setSiteName(site.name)
                        setDepth(site.defaultDepth)
                        setSiteID(route.params.site_id)
                    }
                })
        }
        return () => {isMounted = false}
    }, [route.params?.site_id]);

    useEffect(() => {
        if (route.params?.gear_id) {
            let isMounted = true
            get(route.params.gear_id).then(
                gear=>{
                    if (isMounted) {
                        setGearName(gear.name)
                        setStartingPSI(gear.defaultStartingPSI)
                        setWeight(gear.defaultWeight)
                        setGearID(route.params.gear_id)
                    }
                })
        }
        return () => {isMounted = false}
    }, [route.params?.gear_id]);


    const opts2 = ready ? [
        {toggle: settings["Show Depth"], title: "Depth", intervals: [1, 10, 25], value: depth, callback: setDepth},
        {toggle: settings["Show Duration"], title: "Duration", intervals: [1, 10, 25], value: duration, callback: setDuration},
        {toggle: settings["Show Weight"], title: "Weight", intervals: [1, 10, 25], value: weight, callback: setWeight},
        {toggle: settings["Show Exposure"], title: "Exposure Suit", options: ["3mm", "5mm", "7mm", "dry"], value: exposure, callback: setExposure},
        {toggle: settings["Show PSI"], title: "Starting PSI", intervals: [50, 100, 500], value: startingPSI, callback: setStartingPSI},
        {toggle: settings["Show PSI"], title: "Ending PSI", intervals: [50, 100, 500], value: endingPSI, callback: setEndingPSI},
        {toggle: settings["Show Notes 1"], title: settings["Note 1 Name"], value: notes1, callback: setNotes1},
        {toggle: settings["Show Notes 2"], title: settings["Note 2 Name"], value: notes2, callback: setNotes2},
        {toggle: settings["Show Notes 3"], title: settings["Note 3 Name"], value: notes3, callback: setNotes3},
        {toggle: settings["Show Notes 4"], title: settings["Note 4 Name"], value: notes4, callback: setNotes4},
        {toggle: settings["Show Notes 5"], title: settings["Note 5 Name"], value: notes5, callback: setNotes5},
    ] : []

    const onChange = (event, selectedDateTime) => {
        const currentDateTime = selectedDateTime || dateTime;
        setShow(Platform.OS === 'ios');
        setDateTime(currentDateTime);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const submit = () => {
        const value = new Dive(dateTime, siteID, siteName, gearID, gearName, depth, duration, weight, exposure, startingPSI, endingPSI, notes1, notes2, notes3, notes4, notes5)
        if (id == null) {
            newObject("dives", value).then((key) => navigation.navigate("selectDive", {destination: destination}))
        } else {
            value.id = id
            set(id, value).then(() => navigation.navigate("selectDive", {destination: destination}))
        }
        clearState()
    }

    return (
        <ScrollView style= {styles.container} showsVerticalScrollIndicator={false}>
            <Pressable style={({pressed})=>[pressed ? styles.pressed : styles.unpressed ,styles.pressable]} onPress={()=>showMode('date')} title="Show date picker!">
                <Text>Select Date</Text>
                <Text>{String(dateTime.getMonth()).padStart(2,'0')+"/"+String(dateTime.getDate()).padStart(2,'0')+"/"+dateTime.getFullYear()}</Text>
            </Pressable>
            <Pressable style={({pressed})=>[pressed ? styles.pressed : styles.unpressed ,styles.pressable]} onPress={()=>showMode('time')} title="Show time picker!">
                <Text>Select Time</Text>
                <Text>{String(dateTime.getHours()).padStart(2,'0')+":"+String(dateTime.getMinutes()).padStart(2,'0')}</Text>
            </Pressable>
            {show && (
                <DateTimePicker
                    value={dateTime}
                    mode={mode}
                    onChange={onChange}
                />
            )}
            <Pressable style={({pressed})=>[pressed ? styles.pressed : styles.unpressed ,styles.pressable]} onPress={() => navigation.push("selectSite", {destination: "entryDive"})}>
                <Text>Select a Site</Text>
                <Text>{siteName}</Text>
            </Pressable>
            <Pressable style={({pressed})=>[pressed ? styles.pressed : styles.unpressed ,styles.pressable]} onPress={() => navigation.push("selectGear", {destination: "entryDive"})}>
                <Text>Select a Gear Configuration</Text>
                <Text>{gearName}</Text>
            </Pressable>
            {ready ? opts2.map((value) => <DataInputComponent key={value.title} props={value}/>) : null}
            <Pressable style={({pressed})=>[pressed ? styles.pressed : styles.unpressed ,styles.pressable]} onPress={submit}>
                <Text>Submit</Text>
            </Pressable>
        </ScrollView>
    );

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
    }
});