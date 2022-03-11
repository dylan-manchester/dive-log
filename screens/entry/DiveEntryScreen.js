import React, {useEffect, useState} from 'react';
import {Platform, Pressable, StyleSheet, Text, TextInput, View, ScrollView} from 'react-native';
import DataInputComponent from "../../components/DataInputComponent";
import {get, set, newObject} from "../../Data/DAO";
import {Dive} from "../../models/DiveModel";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DiveEntryScreen({route, navigation}) {
    const {destination} = route.params
    const constant = false
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
    const [startingPSI, setStartingPSI] = useState(0)
    const [endingPSI, setEndingPSI] = useState(0)

    const clearState = ()=>{
        setDateTime(new Date())
        setSiteID()
        setSiteName('')
        setGearID()
        setGearName('')
        setDepth(0)
        setDuration(0)
        setWeight(0)
        setStartingPSI(0)
        setEndingPSI(0)
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
                    setStartingPSI(dive.startingPSI)
                    setEndingPSI(dive.endingPSI)
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
        })
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
        })
    }, [constant]);



    useEffect(() => {
        if (route.params?.site_id) {
            setSiteID(route.params.site_id)
            get(route.params.site_id).then(
                site=>{
                    setSiteName(site.name)
                    setDepth(site.defaultDepth)
                }).catch(e=>console.log(e))
        }
    }, [route.params?.site_id]);

    useEffect(() => {
        if (route.params?.gear_id) {
            setGearID(route.params.gear_id)
            get(route.params.gear_id).then(
                gear=>{
                    setGearName(gear.name)
                    setStartingPSI(gear.defaultStartingPSI)
                    setWeight(gear.defaultWeight)
                }).catch(e=>console.log(e))
        }
    }, [route.params?.gear_id]);


    const opts2 = [
        {title: "Depth", intervals: [1, 10, 25], value: depth, callback: setDepth},
        {title: "Duration", intervals: [1, 10, 25], value: duration, callback: setDuration},
        {title: "Weight", intervals: [1, 10, 25], value: weight, callback: setWeight},
        {title: "Starting PSI", intervals: [50, 100, 500], value: startingPSI, callback: setStartingPSI},
        {title: "Ending PSI", intervals: [50, 100, 500], value: endingPSI, callback: setEndingPSI}
    ]

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
        const value = new Dive(dateTime, siteID, siteName, gearID, gearName, depth, duration, weight, startingPSI, endingPSI)
        if (id == null) {
            newObject("dives", value).then((key) => navigation.navigate("selectDive", {destination: destination}))
        } else {
            value.id = id
            set(id, value).then(() => navigation.navigate("selectDive", {destination: destination}))
        }
        clearState()
    }

    return (
        <ScrollView style= {styles.container}>
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
            {opts2.map((value) => <DataInputComponent key={value.title} props={value}/>)}
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