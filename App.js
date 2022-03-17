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
import AsyncStorage from "@react-native-async-storage/async-storage";
import {MenuProvider} from "react-native-popup-menu";
import {Pressable, Image, Modal, Text, StyleSheet} from "react-native";
import SettingsComponent from "./components/SettingsComponent";

export default function App() {
    const constant = null
    const Stack = createNativeStackNavigator();
    useEffect(()=> {
        //AsyncStorage.clear().then(()=>console.log("Cleared"))
        get("dives").then((rv) => console.log("Number of dives: " + rv.length)).catch(() => set("dives", []))
        get("sites").then((rv) => console.log("Number of sites: " + rv.length)).catch(() => set("sites", []))
        get("gear").then((rv) => console.log("Number of gears: " + rv.length)).catch(() => set("gear", []))
        get("settings").then((rv) => console.log("Num of settings: " + Object.keys(rv).length)).catch(() => set("settings", {
            "Note 1 Name": "Notes 1",
            "Note 2 Name": "Notes 2",
            "Note 3 Name": "Notes 3",
            "Note 4 Name": "Notes 4",
            "Note 5 Name": "Notes 5",
            "Show Depth": true,
            "Show Duration": true,
            "Show Weight": true,
            "Show Exposure": true,
            "Show PSI": true,
            "Show Notes 1": true,
            "Show Notes 2": true,
            "Show Notes 3": true,
            "Show Notes 4": true,
            "Show Notes 5": true,
        }))
    }, [constant])

    const [modalVisible, setModalVisible] = useState(false)
    return (
        <MenuProvider>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: '#02adec',
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                        headerRight: () => (
                            <Pressable onPress={()=>setModalVisible(true)}>
                                <Image source={require("./assets/settings.png")}/>
                            </Pressable>)
                    }}>
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
                </Stack.Navigator>
            </NavigationContainer>
            <Modal
                style = {styles.modal}
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false)}}>
                <SettingsComponent close={()=>setModalVisible(false)}/>
            </Modal>
        </MenuProvider>
    );
}

const styles = StyleSheet.create({
    modal: {
        marginTop: 30,
    }
})

