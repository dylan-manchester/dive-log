import {Image, Pressable, StyleSheet, Text, View, ScrollView} from "react-native";
import {useEffect, useState} from "react";
import {Menu, MenuOption, MenuOptions, MenuTrigger} from "react-native-popup-menu";
import {set, get} from "../Data/DAO"
import SettingInputComponent from "./SettingInputComponent"

export default function SettingsComponent({close}) {
    const [trigger, setTrigger] = useState(true)
    const [settings, setSettings] = useState([])
    const [ready, setReady] = useState(false)

    useEffect(()=>{get("settings").then((rv)=>{
        setSettings(rv)
        setReady(true)
    })},[trigger])

    const updateSetting = (settingName, settingValue) => {
        settings[settingName] = settingValue
        set("settings", settings).then(()=>console.log("Set")).catch(e=>console.log(e))
    }

    const importCSV = () => alert("import")
    const exportCSV = () => alert("export")


    const resetSettings = () => {
        set("settings", {
            "Note 1 Name": "Notes 1",
            "Note 2 Name": "Notes 2",
            "Note 3 Name": "Notes 3",
            "Note 4 Name": "Notes 4",
            "Note 5 Name": "Notes 5",
            "Show Depth": true,
            "Show Duration": true,
            "Show Weight": true,
            "Show Exposure": true,
            "Show PSI": true,
            "Show Notes 1": true,
            "Show Notes 2": true,
            "Show Notes 3": true,
            "Show Notes 4": true,
            "Show Notes 5": true,
            "Show Water Type": true,
            "Show Location": true,
            "Show Default Depth": true,
            "Show Cylinder Type": true,
            "Show Cylinder Size": true,
            "Show Default Weight": true,
            "Show Default PSI": true,
        }).then(()=>{
            setTrigger(!trigger)
            alert("Settings Reset")
        })
    }

    const clearData = () => {
        AsyncStorage.clear().then(() =>
            set("dives", []).then(() =>
                set("sites", []).then(() =>
                    set("gear", []).then(() =>
                        set("settings", {
                            "Note 1 Name": "Notes 1",
                            "Note 2 Name": "Notes 2",
                            "Note 3 Name": "Notes 3",
                            "Note 4 Name": "Notes 4",
                            "Note 5 Name": "Notes 5",
                            "Show Depth": true,
                            "Show Duration": true,
                            "Show Weight": true,
                            "Show Exposure": true,
                            "Show PSI": true,
                            "Show Notes 1": true,
                            "Show Notes 2": true,
                            "Show Notes 3": true,
                            "Show Notes 4": true,
                            "Show Notes 5": true,
                            "Show Water Type": true,
                            "Show Location": true,
                            "Show Default Depth": true,
                            "Show Cylinder Type": true,
                            "Show Cylinder Size": true,
                            "Show Default Weight": true,
                            "Show Default PSI": true,
                        }).then(()=> {
                            setTrigger(!trigger)
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
                        <SettingInputComponent key={key.toString()+":"+settings[key].toString()} props={{title: key, value: settings[key], callback: (value)=>updateSetting(key, value)}} />
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