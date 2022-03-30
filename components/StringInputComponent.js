import {StyleSheet, Text, TextInput, View} from 'react-native'
import {useEffect, useState} from "react";


export default function StringInputComponent({title, value, setterCallback}) {
    const [text, setText] = useState('')

    useEffect(()=>{
        if (value) {
            setText(value.toString())
        }
    }, [value])


    const onChange =  (value) => {
        setText(value)
        setterCallback(value)
    }

    return (
        <View style={styles.container}>
            <View style={styles.description}>
                <Text>{title}</Text>
            </View>
            <View style={styles.content}>
                <View>
                    <TextInput
                        style={styles.textInput}
                        placeholder={"Enter "+title}
                        value={text}
                        onChangeText={onChange}/>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    description: {
        marginRight: 10,
    },

    content: {
        flexDirection: 'column',
    },

    textInput: {
        textAlign: 'center',
        textAlignVertical: 'center',
        backgroundColor: 'lightgrey',
        margin: 5,
        padding: 5,
    },

})