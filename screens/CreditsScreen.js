import React, {useEffect, useState} from 'react';
import {Linking, Pressable, StyleSheet, Text, View} from 'react-native';
import * as Application from 'expo-application';
import {get} from "../data/DAO";
import {availableHeaders} from "../data/IO";
import {Dive} from "../models/DiveModel";
import * as NavigationBar from 'expo-navigation-bar';



export default function CreditsScreen({navigation}) {
    const constant = true

    useEffect(async ()=>{
        await NavigationBar.setBehaviorAsync('overlay-swipe')
        await NavigationBar.setVisibilityAsync("hidden")
    }, [constant])

    return (
        <Pressable onPress={(()=>{navigation.goBack()})}>
            <View style={styles.container}>
                <View style={styles.section}>
                    <Text style={styles.title}>Credits</Text>
                    <Text style={styles.text}>Thank you for using Simple Dive Log</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Dive Photo:</Text>
                    <Pressable onPress={()=>Linking.openURL("https://photoeverywhere.co.uk/east/fiji/slides/scuba_coral_fans.htm")}><Text style={styles.link}>Lance Cpl. Ian McMahon</Text></Pressable>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Site Photo:</Text>
                    <Pressable onPress={()=>Linking.openURL("https://www.flickr.com/photos/myfwcmedia/7214902660/")}><Text style={styles.link}>Florida Fish and Wildlife</Text></Pressable>
                    <Text style={styles.text}>Photo by Tim Donovan</Text>
                    <Text style={styles.text}>via Flickr</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Gear Photo:</Text>
                    <Pressable onPress={()=>Linking.openURL("https://commons.wikimedia.org/wiki/File:Careful_attention_to_safety,_equipment_necessary_for_successful_scuba_dive_120601-M-GO212-011.jpg")}><Text style={styles.link}>Lance Cpl. Ian McMahon</Text></Pressable>
                    <Text style={styles.text}>Public domain</Text>
                    <Text style={styles.text}>via Wikimedia Commons</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.text}>Tap Anywhere to Return</Text>
                </View>

            </View>
        </Pressable>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        alignItems: 'center',
        height: '100%'
    },
    title: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold'
    },
    subtitle: {
        color: 'white',
        fontSize: 24,
    },
    section: {
        alignItems: 'center',
        marginBottom: 50,
        marginTop: 25,
    },
    link: {
        color: 'white',
        fontSize: 18,
        textDecorationLine: 'underline',
    },
    text: {
        color: 'white',
        fontSize: 18,
    }
})