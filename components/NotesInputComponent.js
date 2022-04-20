import {StyleSheet, Text, View} from 'react-native'
import {useState} from "react";
import {Switch} from 'react-native-paper';
import StringInputComponent from "./StringInputComponent";

export default function NotesInputComponent({title, value, setterCallback}) {
    const [show, setShow] = useState(value["Show"])
    const [name, setName] = useState(value["Name"])

    const setShowValue = (rv)=>{
        setShow(rv)
        setterCallback({"Show":rv, "Name":name})
    }

    const setNameValue = (rv)=>{
        setName(rv)
        setterCallback({"Show":show, "Name":rv})
    }

    return (
        <View style={styles.container}>
            <View style = {styles.toggle}>
                <View style={styles.description}>
                    <Text style={styles.text}>{title}</Text>
                </View>
                <View style={styles.content}>
                    <Switch value={show} onValueChange={setShowValue}/>
                </View>
            </View>
            {show ?
                <View style={styles.name}>
                    <StringInputComponent title={"Name"} value={name} setterCallback={setNameValue} orientation={"row"}/>
                </View> : null}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
    },
    toggle: {
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
    },
    name: {
        borderTopWidth: 1,
        borderColor: 'lightgrey',
        paddingTop: 5,
    }
})