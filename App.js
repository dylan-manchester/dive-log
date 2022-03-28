import React, {useEffect, useState} from 'react';
import DiveEntryScreen from "./screens/entry/DiveEntryScreen";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DiveViewScreen from "./screens/view/DiveViewScreen";
import DiveSelectScreen from "./screens/select/DiveSelectScreen";
import GearViewScreen from "./screens/view/GearViewScreen";
import GearSelectScreen from "./screens/select/GearSelectScreen";
import SiteViewScreen from "./screens/view/SiteViewScreen";
import SiteSelectScreen from "./screens/select/SiteSelectScreen";
import GearEntryScreen from "./screens/entry/GearEntryScreen";
import SiteEntryScreen from "./screens/entry/SiteEntryScreen";
import {get, set} from "./Data/DAO";
import HomeScreen from "./screens/HomeScreen";
import {MenuProvider} from "react-native-popup-menu";
import {Pressable, Image, Modal, Text, StyleSheet} from "react-native";
import SettingsComponent from "./components/SettingsComponent";
import {Settings} from "./models/SettingsModel"
import {EventEmitter} from "./Data/EventEmitter"

export default function App() {
    const [refreshes,setRefreshes] = useState(1)
    const constant = null
    const Stack = createNativeStackNavigator();
    useEffect(()=> {
        get("dives").then((rv) => console.log("Number of dives: " + rv.length)).catch(() => set("dives", []))
        get("sites").then((rv) => console.log("Number of sites: " + rv.length)).catch(() => set("sites", []))
        get("gear").then((rv) => console.log("Number of gears: " + rv.length)).catch(() => set("gear", []))
        get("settings").then((rv) => console.log("Num of settings: " + Object.keys(rv).length)).catch(() => set("settings", Settings.initialSettings))
    }, [constant])

    const [modalVisible, setModalVisible] = useState(false)

    function triggerSettingsRefresh() {
        setRefreshes((prev)=>prev+1)
        console.log("Refreshes: "+refreshes)
        EventEmitter.dispatch('refreshSiteEntry', refreshes)
        EventEmitter.dispatch('refreshDiveEntry', refreshes)
        EventEmitter.dispatch('refreshGearEntry', refreshes)
        EventEmitter.dispatch('refreshDiveSelect', refreshes)
        EventEmitter.dispatch('refreshSiteSelect', refreshes)
        EventEmitter.dispatch('refreshGearSelect', refreshes)
        EventEmitter.dispatch('refreshGearView', refreshes)
        EventEmitter.dispatch('refreshSiteView', refreshes)
        EventEmitter.dispatch('refreshDiveView', refreshes)
        EventEmitter.dispatch('refreshSettings', refreshes)
    }

    return (
        <MenuProvider>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Group
                        screenOptions={{
                            headerStyle: {
                            backgroundColor: '#02adec',
                        },
                            headerTintColor: '#fff',
                            headerTitleStyle: {fontWeight: 'bold',
                        },
                            headerRight: () => (
                            <Pressable onPress={()=>setModalVisible(true)}>
                                <Image source={require("./assets/settings.png")}/>
                            </Pressable>)}}>
                        <Stack.Screen
                            name="home"
                            component={HomeScreen}
                            options={{title: "Home"}}/>
                        <Stack.Screen
                            name="entryDive"
                            component={DiveEntryScreen}
                            initialParams={{ destination: "home"}}
                            options={{title: "Dive Entry"}}/>
                        <Stack.Screen
                            name="selectDive"
                            component={DiveSelectScreen}
                            initialParams={{ destination: "viewDive"}}
                            options={{title: "Select a Dive"}}/>
                        <Stack.Screen
                            name="viewDive"
                            component={DiveViewScreen}
                            options={{title: "View Dive"}}/>
                        <Stack.Screen
                            name="entryGear"
                            component={GearEntryScreen}
                            initialParams={{ destination: "home"}}
                            options={{title: "Gear Entry"}}/>
                        <Stack.Screen
                            name="selectGear"
                            component={GearSelectScreen}
                            initialParams={{ destination: "viewGear"}}
                            options={{title: "Select Gear"}}/>
                        <Stack.Screen
                            name="viewGear"
                            component={GearViewScreen}
                            options={{title: "View Gear"}}/>
                        <Stack.Screen
                            name="entrySite"
                            component={SiteEntryScreen}
                            initialParams={{ destination: "home"}}
                            options={{title: "Site Entry"}}/>
                        <Stack.Screen
                            name="selectSite"
                            component={SiteSelectScreen}
                            initialParams={{ destination: "viewSite"}}
                            options={{title: "Select a Site"}}/>
                        <Stack.Screen
                            name="viewSite"
                            component={SiteViewScreen}
                            options={{title: "View Site"}}/>
                    </Stack.Group>
                </Stack.Navigator>
            </NavigationContainer>
            <Modal
                style = {styles.modal}
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    triggerSettingsRefresh()
                    setModalVisible(false)}}>
                <SettingsComponent close={()=> {
                    triggerSettingsRefresh()
                    setModalVisible(false)}}/>
            </Modal>
        </MenuProvider>
    );
}

const styles = StyleSheet.create({
    modal: {
        marginTop: 30,
    }
})

