import React, {useEffect, useState} from "react";
import CardComponent from "../../components/CardComponent";
import {StyleSheet, View, FlatList, Image} from "react-native";
import {deleteObject, get, getAll, set} from "../../Data/DAO";
import {useFocusEffect} from "@react-navigation/native";
import {EventEmitter} from "../../Data/EventEmitter"

export default function GearSelectScreen({route, navigation}) {
    const {destination} = route.params
    const selectAction = (id) => navigation.navigate(destination, {gear_id: id})
    const [gearConfigs, setGearConfigs] = useState([]);
    const [settings, setSettings] = useState();
    const constant = true;
    const [ready, setReady] = useState(false);
    const [trigger, setTrigger] = useState(false);
    const [favorite, setFavorite] = useState(null);

    useFocusEffect(
        React.useCallback(() => {
            get("favGear").then(rv=>{
                setFavorite(rv)
                getAll("gear").then((rv) => {
                    setGearConfigs(rv)
                    setReady(true)
                })
            })
        },[trigger])
    )

    useEffect(()=>{
        EventEmitter.subscribe('refreshGearSelect', (r)=>setTrigger(r))
        return ()=>{EventEmitter.unsubscribe('refreshGearSelect')}
    }, [constant])

    useEffect(()=>{
        let isMounted = true
        get("settings").then((rv)=>{
            if (isMounted) {
                setSettings(rv)
                setReady(true)
            }
            return () => {isMounted = false}
        })},[trigger])


    const deleteItem = (id) => {
        deleteObject("gear", id).then((success)=>{
            if (success) {
                setGearConfigs([])
                setTrigger(trigger+1)
            } else {
                alert(`Please remove dependent dives first`)
            }
        })
    }

    const favoriteItem = (id) => {
        set("favGear", id).then(()=>console.log("Favorite set to "+id))
        setFavorite(id)
    }

    const editItem = (id) =>
        navigation.navigate("entryGear", {destination: destination, gear_id: id})



    const renderItem = ({item}) =>
        <CardComponent
            title={item.name}
            subtitle1= {settings["Show Cylinder Type"] ? item.cylinderType : ""}
            subtitle2= {settings["Show Cylinder Size"] ? item.cylinderSize: ""}
            subtitle3= ""
            favorite={item.id === favorite}
            pressAction={() => selectAction(item.id)}
            editAction={() => editItem(item.id)}
            deleteAction={() => deleteItem(item.id)}
            favoriteAction={() => favoriteItem(item.id)}/>

    return (
        <View style={styles.container}>
            <View style={styles.new}>
                <CardComponent
                    title="New Gear Config"
                    subtitle1= ""
                    subtitle2= ""
                    subtitle3= ""
                    pressAction={() => navigation.navigate("entryGear", {destination: destination})}/>
            </View>
            <View style={styles.old}>
                {ready ?
                    <FlatList
                        data = {gearConfigs}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}/>
                    : <Image source={require("../../assets/loading.gif")}/>}
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#02adec',
    },
    new: {
        flex: .15,
    },
    old: {
        flex: 1,
    }
});