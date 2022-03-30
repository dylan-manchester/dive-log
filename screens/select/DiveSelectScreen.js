import React, {useEffect, useState} from "react";
import CardComponent from "../../components/CardComponent";
import {StyleSheet, View, FlatList, Image} from "react-native";
import {deleteObject, getAll, get, exportableDive, importDive} from "../../Data/DAO";
import {useFocusEffect} from "@react-navigation/native";
import * as Clipboard from 'expo-clipboard';
import {EventEmitter} from "../../Data/EventEmitter"


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
        EventEmitter.subscribe('refreshDiveSelect', (r)=>setTrigger(r))
        return ()=>{EventEmitter.unsubscribe('refreshDiveSelect')}
    }, [constant])

    useFocusEffect(
        React.useCallback(() => {
            setReady(false)
            setDives([])
            get("settings").then((rv)=>{
                setSettings(rv)
                getAll("dives").then((rv) => {
                    setDives(rv)
                    setReady(true)
                })
            })
        },[trigger])
    )

    const deleteItem = (id) => {
        deleteObject("dives", id).then((success)=>{
            if (success) {
                setDives([])
                setTrigger(trigger+1)
            } else {
                alert(`This should not appear!`)
            }
        })
    }

    const editItem = (id) =>
        navigation.navigate("entryDive", {destination: destination, dive_id: id})

    const exportItem = async (item) => Clipboard.setString(JSON.stringify(await exportableDive(item)))

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
            subtitle2={settings["Show Depth"] ? item.depth+" ft" : ""}
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