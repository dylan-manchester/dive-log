import React from 'react';
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

export default function App() {
    //AsyncStorage.clear().then(()=>console.log("Cleared"))
    get("dives").then((rv)=>console.log("Number of dives: "+rv.length)).catch(()=>set("dives", []))
    get("sites").then((rv)=>console.log("Number of sites: "+rv.length)).catch(()=>set("sites", []))
    get("gear").then((rv)=>console.log("Number of gears: "+rv.length)).catch(()=>set("gear", []))


    const Stack = createNativeStackNavigator();

    return (
        <MenuProvider>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="home"
                        component={HomeScreen}/>
                    <Stack.Screen
                        name="entryDive"
                        component={DiveEntryScreen}
                        initialParams={{ destination: "home"}}/>
                    <Stack.Screen
                        name="selectDive"
                        component={DiveSelectScreen}
                        initialParams={{ destination: "viewDive"}}/>
                    <Stack.Screen
                        name="viewDive"
                        component={DiveViewScreen} />
                    <Stack.Screen
                        name="entryGear"
                        component={GearEntryScreen}
                        initialParams={{ destination: "home"}}/>
                    <Stack.Screen
                        name="selectGear"
                        component={GearSelectScreen}
                        initialParams={{ destination: "viewGear"}}/>
                    <Stack.Screen
                        name="viewGear"
                        component={GearViewScreen} />
                    <Stack.Screen
                        name="entrySite"
                        component={SiteEntryScreen}
                        initialParams={{ destination: "home"}}/>
                    <Stack.Screen
                        name="selectSite"
                        component={SiteSelectScreen}
                        initialParams={{ destination: "viewSite"}}/>
                    <Stack.Screen
                        name="viewSite"
                        component={SiteViewScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </MenuProvider>
    );
}