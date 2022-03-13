import {StyleSheet, Text, TextInput, View, Pressable} from 'react-native'
import {useEffect, useState} from "react";
import * as Location from "expo-location";


export default function LocationInputComponent({title, location, setterCallbacks}) {
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')

    useEffect(()=>{
        if (location) {
            if (location.latitude) {
                setLatitude(location.latitude.toString())
            }
            if (location.longitude) {
                setLongitude(location.longitude.toString())
            }
        }
    }, [location])


    const onChangeLatitude =  (value) => {
        setLatitude(value.toString())
        setterCallbacks[0](value.toString())
    }

    const onChangeLongitude = (value) => {
        setLongitude(value.toString())
        setterCallbacks[1](value.toString())
    }

    const getLocation = () => {
        Location.requestForegroundPermissionsAsync().then(({status})=> {
            if (status !== 'granted') {
                alert("Not permitted")
                return;
            }
            Location.getCurrentPositionAsync({}).then((location)=> {
                onChangeLatitude(location.coords.latitude)
                onChangeLongitude(location.coords.longitude)
            })
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.description}>
                <Text>{title}</Text>
            </View>
            <Pressable style={({pressed})=>[pressed ? styles.pressed : styles.unpressed ,styles.pressable]} onPress={()=>alert("open map")}>
                <Text style={styles.text}>
                    Open Map
                </Text>
            </Pressable>
            <Pressable style={({pressed})=>[pressed ? styles.pressed : styles.unpressed ,styles.pressable]} onPress={getLocation}>
                <Text style={styles.text}>
                    Use Current Location
                </Text>
            </Pressable>
            <View style={styles.content}>
                <View>
                    <TextInput
                        style={styles.textInput}
                        placeholder={"Enter latitude"}
                        value={latitude}
                        onChangeText={onChangeLatitude}/>
                </View>
                <View>
                    <TextInput
                        style={styles.textInput}
                        placeholder={"Enter longitude"}
                        value={longitude}
                        onChangeText={onChangeLongitude}/>
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
        flexDirection: 'row',
    },
    pressable: {
        alignItems: 'center',
        margin: 5,
        padding: 5,
        borderWidth: 1,
        borderColor: 'black',
    },
    pressed: {
        backgroundColor: 'grey'
    },
    unpressed: {
        backgroundColor: 'lightgrey'
    },
    textInput: {
        textAlign: 'center',
        textAlignVertical: 'center',
        backgroundColor: 'lightgrey',
        margin: 5,
        padding: 5,
    },

})