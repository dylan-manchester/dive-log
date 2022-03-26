import React, {useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import DataInputComponent from "../../components/DataInputComponent";
import {get, newObject, set} from "../../Data/DAO";
import {Site} from "../../models/SiteModel";
import * as Location from 'expo-location';
import {useFocusEffect, useIsFocused} from "@react-navigation/native";

export default function SiteEntryScreen({route, navigation}) {
    const {destination} = route.params;
    const focus = useIsFocused();
    const [trigger, setTrigger] = useState(true);
    const [ready, setReady] = useState(false);
    const [settings, setSettings] = useState();
    const [id, setID] = useState();
    const [name, setName] = useState('');
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [waterType, setWaterType] = useState('')
    const [defaultDepth, setDefaultDepth] = useState(0)

    const clearState = ()=>{
        setName('')
        setLatitude('')
        setLongitude('')
        setWaterType('')
        setDefaultDepth(0)
    }

    useEffect(() => {
        if (route.params?.site_id) {
            setID(route.params.site_id)
            get(route.params.site_id).then(
                (site : Site)=>{
                    setName(site.name)
                    setLongitude(site.longitude)
                    setLatitude(site.latitude)
                    setWaterType(site.waterType)
                    setDefaultDepth(site.defaultDepth)
                }).catch(e=>console.log(e))
        }
    }, [route.params?.site_id]);

    useFocusEffect(
        React.useCallback(()=>{
            get("settings").then((rv)=>{
                setSettings(rv)
                setReady(true)
            }).catch(e=>console.log(e))
        },[focus])
    )

    const opts2 = ready ? [
        {toggle: true, title: "Name", value: name, callback: setName},
        {toggle: settings["Show Water Type"], title: "Water Type", options: ["Salt", "Fresh"], value: waterType, callback: setWaterType},
        {toggle: settings["Show Location"], title: "Location", location: [latitude, longitude], callbacks: [setLatitude, setLongitude]},
        {toggle: settings["Show Default Depth"], title: "Default Depth", intervals: [1, 10, 25], value: defaultDepth, callback: setDefaultDepth},
    ] : []

    const submit = () => {
        const value = new Site(name, latitude, longitude, waterType, defaultDepth)
        if (id == null) {
            newObject("sites",value).then((key)=>navigation.navigate("selectSite", {destination: destination}))
        } else {
            value.id = id
            set(id, value).then(() => navigation.navigate("selectSite", {destination: destination}))
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