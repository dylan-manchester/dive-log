import {StyleSheet, Text, View} from 'react-native'
import {useState} from "react";
import {Switch} from 'react-native-paper';

export default function SwitchInputComponent({title, value, setterCallback}) {
    const [switchOn, setSwitchOn] = useState(value)

    return (
        <View style={styles.container}>
            <View style={styles.description}>
                <Text style={styles.text}>{title === "Units" ? switchOn ? "Units: Metric" : "Units: Imperial" : title}</Text>
            </View>
            <View style={styles.content}>
                <Switch value={switchOn} onValueChange={(rv)=>{
                    setSwitchOn(rv)
                    setterCallback(rv)
                }}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    description: {
        alignContent: 'flex-start',
    },
    content: {
        alignContent: 'flex-end',
    },
    text: {
        textAlignVertical: 'center',
        flex: 1,
    }
})