import React, {useEffect, useRef, useState} from 'react';
import {Linking, Pressable, StyleSheet, Text, View, Animated, Easing, Dimensions} from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';



export default function CreditsScreen({navigation}) {
    const constant = true
    const scrollRef = useRef()
    const scrollAnimation = useRef(new Animated.Value(0))
    const [contentHeight, setContentHeight] = useState(0)

    useEffect(async ()=>{
        await NavigationBar.setBehaviorAsync('overlay-swipe')
        await NavigationBar.setVisibilityAsync("hidden")
    }, [constant])

    useEffect(() => {
        scrollAnimation.current.addListener((animation) => {
            scrollRef.current &&
            scrollRef.current.scrollTo({
                y: animation.value,
                animated: false,
            })
        })

        if (contentHeight) {
            Animated.timing(scrollAnimation.current, {
                toValue: contentHeight,
                duration: contentHeight * 20,
                useNativeDriver: true,
                easing: Easing.linear,
            }).start()
        }
        return () => scrollAnimation.current.removeAllListeners()
    }, [contentHeight])

    return (
        <Pressable onPress={(async ()=>{
            await NavigationBar.setVisibilityAsync("visible")
            scrollAnimation.current.stopAnimation()
            navigation.goBack()
        })}>
            <Animated.ScrollView
                ref={scrollRef}
                style={styles.container}
                onContentSizeChange={(width, height) => {
                    setContentHeight(height)
                }}>

                <View style={styles.buffer}>
                </View>

                <View style={styles.section}>
                    <Text style={styles.title}>Credits</Text>
                </View>


                <View style={styles.section}>
                    <Text style={styles.subtitle}>Thank you for using</Text>
                    <Text style={[{fontWeight: 'bold'}, styles.subtitle]}>Simple Dive Log!</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Author:</Text>
                    <Pressable onPress={()=>Linking.openURL("https://dylan-manchester.github.io/website/")}>
                    <Text style={styles.link}>Dylan Manchester</Text>
                    </Pressable>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Dive Photo:</Text>
                    <Pressable style={styles.pressable} onPress={()=>Linking.openURL("https://photoeverywhere.co.uk/east/fiji/slides/scuba_coral_fans.htm")}>
                        <Text style={styles.link}>PhotoEverywhere.com.uk</Text>
                    </Pressable>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Site Photo:</Text>
                    <Pressable style={styles.pressable} onPress={()=>Linking.openURL("https://www.flickr.com/photos/myfwcmedia/7214902660/")}>
                        <Text style={styles.link}>Florida Fish and Wildlife</Text>
                    </Pressable>
                    <Text style={styles.text}>Photo by Tim Donovan</Text>
                    <Pressable style={styles.pressable} onPress={()=>Linking.openURL("https://www.flickr.com/")}>
                        <Text style={styles.text}>via </Text>
                        <Text style={styles.link}>Flickr</Text>
                    </Pressable>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Gear Photo:</Text>
                    <Pressable style={styles.pressable} onPress={()=>Linking.openURL("https://commons.wikimedia.org/wiki/File:Careful_attention_to_safety,_equipment_necessary_for_successful_scuba_dive_120601-M-GO212-011.jpg")}>
                        <Text style={styles.link}>Lance Cpl. Ian McMahon</Text>
                    </Pressable>
                    <Text style={styles.text}>Public domain</Text>
                    <Pressable style={styles.pressable} onPress={()=>Linking.openURL("https://commons.wikimedia.org/wiki/Main_Page")}>
                        <Text style={styles.text}>via </Text>
                        <Text style={styles.link}>Wikimedia Commons</Text>
                    </Pressable>
                </View>

                <View style={styles.section}>
                    <Text style={styles.text}>Tap Anywhere to Return</Text>
                </View>

                <View style={styles.buffer}>
                </View>

            </Animated.ScrollView>
        </Pressable>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        height: '100%'
    },
    buffer: {
        height: Dimensions.get('screen').height * .85
    },
    title: {
        color: 'white',
        fontSize: 72,
        fontWeight: 'bold'
    },
    subtitle: {
        color: 'white',
        fontSize: 36,
    },
    section: {
        alignItems: 'center',
        marginBottom: 50,
        marginTop: 25,
    },
    pressable: {
        flexDirection: 'row'
    },
    link: {
        color: 'white',
        fontSize: 24,
        textDecorationLine: 'underline',
    },
    text: {
        color: 'white',
        fontSize: 24,
    }
})