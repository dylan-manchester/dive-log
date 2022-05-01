import React, {useEffect, useState} from "react";
import CardComponent from "../../components/CardComponent";
import {StyleSheet, View, FlatList, Image, Alert} from "react-native";
import {deleteObject, getAll, get} from "../../data/DAO";
import {useFocusEffect} from "@react-navigation/native";
import * as Clipboard from 'expo-clipboard';
import {EventEmitter} from "../../data/EventEmitter"
import {exportableDive, importDive} from "../../data/IO";
import * as UnitConverter from "../../data/UnitConverter"


export default function DiveSelectScreen({route, navigation}) {
    const {destination} = route.params
    const selectAction = (id) => { if (id != null)
        navigation.navigate(destination, {dive_id: id})
        else navigation.navigate("entry")
    }
    const [settings, setSettings] = useState()
    const [dives, setDives] = useState([]);
    const constant = true;
    const [ready, setReady] = useState(false);
    const [trigger, setTrigger] = useState(0);

    useEffect(()=>{
        EventEmitter.subscribe('refreshDiveSelect', ()=>setTrigger(prev=>prev+1))
        return ()=>{EventEmitter.unsubscribe('refreshDiveSelect')}
    }, [constant])

    useFocusEffect(
        React.useCallback(() => {
            let isMounted = true
            setReady(false)
            setDives([])
            get("settings").then((rv)=>{
                if (isMounted) {
                    setSettings(rv)
                    getAll("dives").then((rv) => {
                        if (isMounted) {
                            setDives(rv)
                            setReady(true)
                        }
                    })
                }
            })
            return () => {isMounted = false}
        },[trigger])
    )

    const deleteItem = async (id) => {
        let success = await deleteObject("dives", id)
        if (success) {
            setDives([])
            setTrigger((prev)=>prev+1)
        } else {
            Alert.alert(`Error`, 'Please try again')
        }
    }

    const editItem = (id) => navigation.navigate("entryDive", {destination: destination, dive_id: id})

    const exportItem = async (item) => Clipboard.setString(JSON.stringify(await exportableDive({...item})))

    const importItem = async () => {
        let text = await Clipboard.getStringAsync()
        await importDive(JSON.parse(text))
        setDives([])
        setTrigger(trigger+1)
    }


    const renderItem = ({item}) => {
        let dt = new Date(item.dateTime)
        return <CardComponent
            title={String(dt.getMonth()).padStart(2,'0')+"/"+String(dt.getDate()).padStart(2,'0')+"/"+ dt.getFullYear()+" "+ String(dt.getHours()).padStart(2,'0')+":"+ String(dt.getMinutes()).padStart(2,'0')}
            subtitle1={item.siteName}
            subtitle2={settings["Show Depth"] ? parseFloat(item.depth).toFixed(0)+" ft" : ""}
            subtitle3={settings["Show Duration"] ? item.duration+" min" : ""}
            pressAction={() => selectAction(item.id)}
            editAction={()=> editItem(item.id)}
            deleteAction={() => deleteItem(item.id)}
            exportAction={() => exportItem(item)}/>
    }

    return (
        <View style={styles.container}>
            <View style={styles.new}>
                <CardComponent
                    title="New Dive"
                    subtitle1= ""
                    subtitle2= ""
                    subtitle3= ""
                    pressAction={() => navigation.navigate("entryDive", {destination: destination})}
                    importAction={importItem}/>
            </View>
            <View style={styles.old}>
                {ready ?
                    <FlatList
                        data ={dives}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}/>
                    : <Image source={require("../../assets/loading.gif")}/>}
            </View>
        </View>
    )

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