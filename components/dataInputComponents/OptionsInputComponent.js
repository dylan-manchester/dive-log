import {StyleSheet, Text, View, Pressable} from 'react-native'

export default function OptionsInputComponent({title, value, options, setterCallback}) {

    return (
        <View style={styles.container}>
            <View style={styles.description}>
                <Text>{title}</Text>
            </View>
            <View style={styles.content}>
                {options.map((item)=>
                <Pressable
                    key={item}
                    style={({pressed})=>[pressed ? styles.pressed : value===item? styles.selected : styles.unpressed , styles.pressable]}
                    onPress={()=>setterCallback(item)}>
                    <Text style={styles.text}>{item}</Text>
                </Pressable>)}
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

    content: {
        flexDirection: 'row',
    },
    pressable: {
        margin: 5,
        padding: 5,
        borderWidth: 2,
        borderColor: 'grey',
    },
    unpressed: {
        backgroundColor: 'black',
    },
    pressed: {
        backgroundColor: 'grey',
    },
    selected: {
        backgroundColor: '#666699',
    },
    text: {
        color: 'white'
    }

})