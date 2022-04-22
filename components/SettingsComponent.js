import {Pressable, StyleSheet, Text, View, ScrollView} from "react-native";
import {useEffect, useState} from "react";
import {set, get} from "../data/DAO"
import SettingsInputWrapperComponent from "./dataInputComponents/SettingsInputWrapperComponent"
import {Settings} from "../models/SettingsModel"
import AsyncStorage from "@react-native-async-storage/async-storage";
import {EventEmitter} from "../data/EventEmitter"
import {exportAllDives, importFile} from "../data/IO";

export default function SettingsComponent({close}) {
    const constant = true
    const [trigger, setTrigger] = useState(0)
    const [settings, setSettings] = useState([])
    const [ready, setReady] = useState(false)

    useEffect(()=>{
        EventEmitter.subscribe('refreshSettings', ()=>setTrigger(prev=>prev+1))
        return ()=>{EventEmitter.unsubscribe('refreshSettings')}
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

    const updateSetting = (settingName, settingValue) => {
        settings[settingName] = settingValue
        set("settings", settings).then(()=>console.log("Set")).catch(e=>console.log(e))
    }

    const importCSV = ()=>importFile().then(()=>console.log("Done"))
    const exportCSV = exportAllDives


    const resetSettings = () => {
        set("settings", Settings.initialSettings).then(()=>{
            setTrigger(prev=>prev+1)
            alert("Settings Reset")
        })
    }

    const clearData = () => {
        AsyncStorage.clear().then(() =>
            set("dives", []).then(() =>
                set("sites", []).then(() =>
                    set("gear", []).then(() =>
                        set("settings", Settings.initialSettings).then(()=> {
                            setTrigger(prev=>prev+1)
                            alert("Data Cleared")
                        })
                    )
                )
            )
        )
    }

    return (
        <View style={styles.container}>
            <Pressable style={({pressed})=>[pressed ? styles.pressed : styles.close ,styles.pressable]} onPress={close}>
                <Text style={styles.textStyle}>Back</Text>
            </Pressable>
            <ScrollView styles={styles.content} showsVerticalScrollIndicator={false}>
                {ready ?
                    Object.keys(settings).map((key)=>
                        <SettingsInputWrapperComponent key={key.toString()+":"+settings[key].toString()} props={{title: key, value: settings[key], callback: (value)=>updateSetting(key, value)}} />
                    ) : null
                }
                <Pressable style={({pressed})=>[pressed ? styles.pressed : styles.import ,styles.pressable]} onPress={importCSV}>
                    <Text style={styles.textStyle}>Import</Text>
                </Pressable>
                <Pressable style={({pressed})=>[pressed ? styles.pressed : styles.export ,styles.pressable]} onPress={exportCSV}>
                    <Text style={styles.textStyle}>Export</Text>
                </Pressable>
                <Pressable style={({pressed})=>[pressed ? styles.pressed : styles.reset ,styles.pressable]} onPress={resetSettings}>
                    <Text style={styles.textStyle}>Reset Settings</Text>
                </Pressable>
                <Pressable style={({pressed})=>[pressed ? styles.pressed : styles.clear ,styles.pressable]} onPress={clearData}>
                    <Text style={styles.textStyle}>Clear Data</Text>
                </Pressable>
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        margin: 20,
        height: "95%",
        width: "90%",
        alignSelf: 'center',
        backgroundColor: "white",
        borderRadius: 20,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    pressable: {
        alignItems: 'center',
        margin: 5,
        padding: 5,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        fontSize: 25,
    },
    pressed: {
        backgroundColor: 'grey'
    },
    close: {
        backgroundColor: 'red'
    },
    import: {
        backgroundColor: 'blue'
    },
    export: {
        backgroundColor: 'green'
    },
    reset: {
        backgroundColor: 'pink'
    },
    clear: {
        backgroundColor: 'red'
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 18,
    },
    text: {
        marginBottom: 15,
        textAlign: "center"
    },
    content: {
    }
});