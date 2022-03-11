import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, ScrollView} from 'react-native';
import DataInputComponent from "../../components/DataInputComponent";
import {get, newObject, set} from "../../Data/DAO";
import {Gear} from "../../models/GearModel";

export default function GearEntryScreen({route, navigation}) {
    const {destination} = route.params
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
                    setName(gear.name)
                    setCylinderType(gear.cylinderType)
                    setCylinderSize(gear.cylinderSize)
                    setDefaultWeight(gear.defaultWeight)
                    setDefaultStaringPSI(gear.defaultStartingPSI)
                }).catch(e=>console.log(e))
        }
    }, [route.params?.gear_id]);

    const opts2 = [
        {title: "Name", value: name, callback: setName},
        {title: "Cylinder Type", options: ["Aluminum", "Steel"], value: cylinderType, callback: setCylinderType},
        {title: "Cylinder Size", intervals: [1, 10, 25], value: cylinderSize, callback: setCylinderSize},
        {title: "Default Weight", intervals: [1, 10, 25], value: defaultWeight, callback: setDefaultWeight},
        {title: "Default Starting PSI", intervals: [50, 100, 500], value: defaultStaringPSI, callback: setDefaultStaringPSI},

    ]

    const submit = () => {
        const value = new Gear(name, cylinderType, cylinderSize, defaultWeight, defaultStaringPSI)
        if (id == null) {
            newObject("gear",value).then((key)=>navigation.navigate("selectGear", {destination: destination}))
        } else {
            value.id = id
            set(id, value).then(() => navigation.navigate("selectGear", {destination: destination,}))
        }
        clearState()
    }

    return (
        <ScrollView style= {styles.container}>
            {opts2.map((value) => <DataInputComponent key={value.title} props={value}/>)}
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