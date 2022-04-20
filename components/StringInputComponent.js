import {StyleSheet, Text, TextInput, View} from 'react-native'
import {useEffect, useState} from "react";


export default function StringInputComponent({title, value, setterCallback, orientation}) {
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
        <View style={[styles.container, orientation==='row' ? {flexDirection: 'row', justifyContent: 'space-between'} : {flexDirection: 'column', justifyContent: 'center'}]} >
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