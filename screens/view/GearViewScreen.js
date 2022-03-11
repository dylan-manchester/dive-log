import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ScrollView, Image} from 'react-native';
import {get, wait} from "../../Data/DAO";
import {Gear} from "../../models/GearModel";

export default function GearViewScreen({route, navigation}) {
    const {gear_id} = route.params;
    const [gear, setGear] = useState(new Gear())
    const [ready, setReady] = useState(false)


    useEffect(() => {
        wait(800).then(()=>
            get(gear_id).then((rv) => {
                setGear(rv)
                setReady(true)
            }).catch(e=>console.log(e))
        )
    },[ready])

    return (
        <View style= {styles.container}>
            {ready ?
                <View style={styles.content}>
                    <Text style={styles.title}>{gear.name}</Text>
                    <Text style={styles.subtitle}>Cylinder Type: {gear.cylinderType}</Text>
                    <Text style={styles.subtitle}>Cylinder Size: {gear.cylinderSize}</Text>
                    <Text style={styles.subtitle}>Default Weight: {gear.defaultWeight} lbs</Text>
                    <Text style={styles.subtitle}>Default Starting PSI: {gear.defaultStartingPSI}</Text>
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