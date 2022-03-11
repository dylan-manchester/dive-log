import {StyleSheet, Text, TextInput, View, Pressable} from 'react-native'
import {useEffect, useState} from "react";


export default function NumericInputComponent({title, value, intervals, setterCallback}) {
    const [text, setText] = useState(0)

    useEffect(()=>{
        if (value) {
            setText(value.toString())
        }
    }, [value])

    // Called when an option is selected
    const onChange = (value) => {
        setText(value);
        setterCallback(value);
    }


    return (
        <View style={styles.container}>
            <View style={styles.description}>
                <Text>{title}</Text>
            </View>
            <View style={styles.content}>
                {intervals.map((value, index, array) =>
                    <Pressable key={(-1*array[array.length-index-1]).toString()} style={({pressed})=>[pressed ? styles.pressed : styles.unpressed ,styles.pressable]} onPress={()=>onChange(parseInt(text)-array[array.length-index-1])}>
                        <Text style={styles.text}>-{array[array.length-index-1]}</Text>
                    </Pressable>)
                }
                <View>
                    <TextInput
                        style={styles.textInput}
                        value={text.toString()}
                        onChangeText={onChange}/>
                </View>
                {intervals.map((value, index, array) =>
                    <Pressable key={value.toString()} style={({pressed})=>[pressed ? styles.pressed : styles.unpressed ,styles.pressable]} onPress={()=>onChange(parseInt(text)+value)}>
                        <Text style={styles.text}>+{value}</Text>
                    </Pressable>)
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
    },

    content: {
        flexDirection: 'row',
    },

    pressable: {
        borderWidth: 2,
        borderColor: 'grey',
        margin: 2.5,
        padding: 2,
        height: 45,
        width: 45,
        alignItems: 'center',
        justifyContent: 'center',
    },

    pressed: {
        backgroundColor: 'grey'
    },

    unpressed: {
        backgroundColor: 'black',
    },

    text: {
        fontSize: 10,
        color: 'white',
    },

    textInput: {
        textAlign: 'center',
        textAlignVertical: 'center',
        backgroundColor: 'lightgrey',
        height: 45,
        width: 70,
        margin: 2.5,
        padding: 2,
    },

})