import {StyleSheet, Text, TextInput, View, Pressable} from 'react-native'
import {useEffect, useState} from "react";
import NumericInputComponent from "./NumericInputComponent";
import OptionsInputComponent from "./OptionsInputComponent";
import StringInputComponent from "./StringInputComponent";
import LocationInputComponent from "./LocationInputComponent";
import SwitchInputComponent from "./SwitchInputComponent";

export default function SettingInputComponent({props}) {

    return (
        <View style={styles.container}>
            {props.value === true || props.value === false ?
                <SwitchInputComponent
                    key={props.value.toString()}
                    title={props.title}
                    value={props.value}
                    setterCallback={props.callback}/>
                    : <StringInputComponent
                        title={props.title}
                        value={props.value}
                        setterCallback={props.callback}/>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 5,
        padding: 5,
        borderWidth: 1,
        borderColor: 'black',
    }
})