import React, {useEffect, useState} from "react";
import CardComponent from "../../components/CardComponent";
import {StyleSheet, View, FlatList, Image} from "react-native";
import {getAll, get, set, deleteObject} from "../../Data/DAO";
import {useFocusEffect} from "@react-navigation/native";

export default function SiteSelectScreen({route, navigation}) {
    const {destination} = route.params
    const selectAction = (id) => navigation.navigate(destination, {site_id: id})
    const [sites, setSites] = useState([]);
    const [settings, setSettings] = useState()
    const [ready, setReady] = useState(false);
    const [trigger, setTrigger] = useState(false);
    const [favorite, setFavorite] = useState(null);

    useFocusEffect(
        React.useCallback(
        () => {
            get("settings").then((rv)=>{
                setSettings(rv)
                get("favSite").then(rv=>setFavorite(rv)).catch(e=>console.log(e))
                getAll("sites", (rv) => {
                    setSites(rv)
                    setReady(true)
                })
            })
        },[trigger]))

    const deleteItem = (id) => {
        deleteObject("sites", id).then((success)=>{
            if (success) {
                setSites([])
                setTrigger(!trigger)
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
            subtitle1={settings["Show Location"] ? "("+item.latitude+", "+item.longitude+")" : ""}
            subtitle2={settings["Show Water Type"] ? item.waterType : ""}
            subtitle3={settings["Show Default Depth"] ? item.defaultDepth+" ft" : ""}
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