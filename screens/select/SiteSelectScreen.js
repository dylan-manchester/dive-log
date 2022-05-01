import React, {useEffect, useState} from "react";
import CardComponent from "../../components/CardComponent";
import {StyleSheet, View, FlatList, Image} from "react-native";
import {getAll, get, set, deleteObject} from "../../data/DAO";
import {useFocusEffect} from "@react-navigation/native";
import {EventEmitter} from "../../data/EventEmitter"
import * as UnitConverter from "../../data/UnitConverter"


export default function SiteSelectScreen({route, navigation}) {
    const {destination} = route.params
    const selectAction = (id) => navigation.navigate(destination, {site_id: id})
    const [sites, setSites] = useState([]);
    const [settings, setSettings] = useState()
    const constant = true;
    const [ready, setReady] = useState(false);
    const [trigger, setTrigger] = useState(0);
    const [favorite, setFavorite] = useState(null);

    useFocusEffect(
        React.useCallback(() => {
            get("favSite").then(rv=> {
                setFavorite(rv)
                getAll("sites").then((rv) => {
                    setSites(rv)
                    setReady(true)
                })
            })
        },[trigger]))

    useEffect(()=>{
        EventEmitter.subscribe('refreshSiteSelect', ()=>setTrigger(prev=>prev+1))
        return ()=>{EventEmitter.unsubscribe('refreshSiteSelect')}
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
        deleteObject("sites", id).then((success)=>{
            if (success) {
                setSites([])
                setTrigger((prev)=>prev+1)
            } else {
                alert(`Please remove dependent dives first`)
            }
        })
    }

    const favoriteItem = (id) => {
        set("favSite", id).then(()=>console.log("Favorite set to "+id))
        setFavorite(id)
    }

    const editItem = (id) =>
        navigation.navigate("entrySite", {destination: destination, site_id: id})

    const renderItem = ({item}) =>
        <CardComponent
            title={item.name}
            subtitle1={settings["Show Location"] ? "("+ ((!isNaN(parseFloat(item.latitude))) ? parseFloat(item.latitude).toFixed(3) : item.latitude)+", "+((!isNaN(parseFloat(item.longitude))) ? parseFloat(item.longitude).toFixed(3) : item.longitude)+")" : ""}
            subtitle2={settings["Show Water Type"] ? item.waterType : ""}
            subtitle3={settings["Show Default Depth"] ?  item.defaultDepth+" ft" : ""}
            favorite={item.id === favorite}
            pressAction={() => selectAction(item.id)}
            editAction={() => editItem(item.id)}
            deleteAction={() => deleteItem(item.id)}
            favoriteAction={() => favoriteItem(item.id)}/>

    return (
        <View style={styles.container}>
            <View style={styles.new}>
                <CardComponent
                    title="New Site"
                    subtitle1= ""
                    subtitle2= ""
                    subtitle3= ""
                    pressAction={() => navigation.navigate("entrySite", {destination: destination})}/>
            </View>
            <View style={styles.old}>
                {ready ?
                    <FlatList
                        data = {sites}
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