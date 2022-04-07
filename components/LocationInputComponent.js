import {StyleSheet, Text, TextInput, View, Pressable} from 'react-native'
import * as Location from "expo-location";


export default function LocationInputComponent({title, latitude, longitude, latitudeCallback, longitudeCallback}) {



    const onChangeLatitude =  (value) => {
        latitudeCallback(value.toString())
    }

    const onChangeLongitude = (value) => {
        longitudeCallback(value.toString())
    }

    const getLocation = () => {
        Location.requestForegroundPermissionsAsync().then(({status})=> {
            if (status !== 'granted') {
                alert("Please grant location permissions to use this feature")
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
                        value={latitude.toString()}
                        onChangeText={onChangeLatitude}/>
                </View>
                <View>
                    <TextInput
                        style={styles.textInput}
                        placeholder={"Enter longitude"}
                        value={longitude.toString()}
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