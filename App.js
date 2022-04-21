import React, {useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "./screens/HomeScreen";
import DiveEntryScreen from "./screens/entry/DiveEntryScreen";
import DiveViewScreen from "./screens/view/DiveViewScreen";
import DiveSelectScreen from "./screens/select/DiveSelectScreen";
import GearEntryScreen from "./screens/entry/GearEntryScreen";
import GearViewScreen from "./screens/view/GearViewScreen";
import GearSelectScreen from "./screens/select/GearSelectScreen";
import SiteEntryScreen from "./screens/entry/SiteEntryScreen";
import SiteViewScreen from "./screens/view/SiteViewScreen";
import SiteSelectScreen from "./screens/select/SiteSelectScreen";
import StatsScreen from "./screens/StatsScreen"
import ModalMenuComponent from "./components/ModalMenuComponent";
import {get, set} from "./data/DAO";
import {MenuProvider} from "react-native-popup-menu";
import {Settings} from "./models/SettingsModel"


export default function App() {
    const constant = null
    const Stack = createNativeStackNavigator();
    useEffect(()=> {
        get("dives").then((rv) => console.log("Number of dives: " + rv.length)).catch(() => set("dives", []))
        get("sites").then((rv) => console.log("Number of sites: " + rv.length)).catch(() => set("sites", []))
        get("gear").then((rv) => console.log("Number of gears: " + rv.length)).catch(() => set("gear", []))
        get("settings").then((rv) => console.log("Num of settings: " + Object.keys(rv).length)).catch(() => set("settings", Settings.initialSettings))
    }, [constant])

    return (
        <MenuProvider>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: '#02adec'
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'bold'
                        }}}>
                    <Stack.Group>
                        <Stack.Screen
                            name="home"
                            component={HomeScreen}
                            options={({navigation})=> ({
                                title: "Home",
                                headerRight: () => (
                                    <ModalMenuComponent
                                        options={[{action: () => navigation.navigate("stats"), text: "Stats"}]}/>
                                )}
                            )}/>
                        <Stack.Screen
                            name="stats"
                            component={StatsScreen}
                            options={{title: "Statistics"}}/>
                    </Stack.Group>
                    <Stack.Group>
                        <Stack.Screen
                            name="viewDive"
                            component={DiveViewScreen}
                            options={{title: "View Dive"}}/>
                        <Stack.Screen
                            name="viewGear"
                            component={GearViewScreen}
                            options={{title: "View Gear"}}/>
                        <Stack.Screen
                            name="viewSite"
                            component={SiteViewScreen}
                            options={{title: "View Site"}}/>
                    </Stack.Group>
                    <Stack.Group>
                        <Stack.Screen
                            name="selectDive"
                            component={DiveSelectScreen}
                            initialParams={{ destination: "viewDive"}}
                            options={{title: "Select a Dive"}}/>
                        <Stack.Screen
                            name="selectGear"
                            component={GearSelectScreen}
                            initialParams={{ destination: "viewGear"}}
                            options={{title: "Select Gear"}}/>
                        <Stack.Screen
                            name="selectSite"
                            component={SiteSelectScreen}
                            initialParams={{ destination: "viewSite"}}
                            options={{title: "Select a Site"}}/>
                    </Stack.Group>
                    <Stack.Group>
                        <Stack.Screen
                            name="entryDive"
                            component={DiveEntryScreen}
                            initialParams={{ destination: "viewDive"}}
                            options={{title: "Dive Entry"}}/>
                        <Stack.Screen
                            name="entryGear"
                            component={GearEntryScreen}
                            initialParams={{ destination: "viewGear"}}
                            options={{title: "Gear Entry"}}/>
                        <Stack.Screen
                            name="entrySite"
                            component={SiteEntryScreen}
                            initialParams={{ destination: "viewSite"}}
                            options={{title: "Site Entry"}}/>
                    </Stack.Group>
                </Stack.Navigator>
            </NavigationContainer>
        </MenuProvider>
    );
}

