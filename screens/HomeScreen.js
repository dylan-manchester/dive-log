import React from 'react';
import {Pressable, StyleSheet, Text, View, ImageBackground} from 'react-native';


export default function HomeScreen({navigation}) {

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Pressable style={({pressed})=>[pressed ? styles.pressed : styles.unpressed, styles.pressable]} onPress={()=>navigation.navigate("selectDive", {destination: "viewDive"})}>
                    <ImageBackground style={styles.image} source={require("../assets/dive.jpg")}>
                        <Text style={styles.text}>Dives</Text>
                    </ImageBackground>
                </Pressable>
            </View>
            <View style={styles.row}>
                <Pressable style={({pressed})=>[pressed ? styles.pressed : styles.unpressed, styles.pressable]} onPress={()=>navigation.navigate("selectSite", {destination: "viewSite"})}>
                    <ImageBackground style={styles.image} source={require("../assets/site.jpg")}>
                        <Text style={styles.text}>Sites</Text>
                    </ImageBackground>
                </Pressable>
            </View>
            <View style={styles.row}>
                <Pressable style={({pressed})=>[pressed ? styles.pressed : styles.unpressed, styles.pressable]} onPress={()=>navigation.navigate("selectGear", {destination: "viewGear"})}>
                    <ImageBackground style={styles.image} source={require("../assets/gear.jpg")} alt={"Gear"}>
                        <Text style={styles.text}>Gear</Text>
                    </ImageBackground>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#02adec',
        justifyContent: "space-evenly"
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: .3,
    },
    pressable: {
        zIndex: 100,
        flex: .5,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 3,
    },
    unpressed: {
    },
    pressed: {
        opacity: .75,
    },
    image: {
        height: "100%",
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -1,
    },
    text: {
        color: "white",
        fontWeight: "bold",
        fontSize: 50,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: -2, height: 4},
        textShadowRadius: 20
    }
})