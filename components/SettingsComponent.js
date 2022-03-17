import {Image, Pressable, StyleSheet, Text, View, ScrollView} from "react-native";
import {useEffect, useState} from "react";
import {Menu, MenuOption, MenuOptions, MenuTrigger} from "react-native-popup-menu";
import {set, get} from "../Data/DAO"
import SettingInputComponent from "./SettingInputComponent"

export default function SettingsComponent({close}) {
    const constant = true
    const [settings, setSettings] = useState([])
    const [ready, setReady] = useState(false)

    useEffect(()=>{get("settings").then((rv)=>{
        setSettings(rv)
        setReady(true)
    })},[constant])

    const updateSetting = (settingName, settingValue) => {
        settings[settingName] = settingValue
        set("settings", settings).then(()=>console.log("Set")).catch(e=>console.log(e))
    }

    return (
        <View style={styles.container}>
            <Pressable style={({pressed})=>[pressed ? styles.pressed : styles.unpressed ,styles.pressable]} onPress={close}>
                <Text style={styles.textStyle}>Back</Text>
            </Pressable>
            <ScrollView styles={styles.content} showsVerticalScrollIndicator={false}>
                {ready ?
                    Object.keys(settings).map((key)=>
                        <SettingInputComponent key={key} props={{title: key, value: settings[key], callback: (value)=>updateSetting(key, value)}} />
                    ) : null
                }
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
    unpressed: {
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