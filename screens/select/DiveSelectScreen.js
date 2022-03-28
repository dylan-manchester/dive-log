import React, {useEffect, useState} from "react";
import CardComponent from "../../components/CardComponent";
import {StyleSheet, View, FlatList, Image} from "react-native";
import {deleteObject, getAll, get, set} from "../../Data/DAO";
import {useFocusEffect} from "@react-navigation/native";
import Clipboard from '@react-native-clipboard/clipboard';
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
    const [trigger, setTrigger] = useState(false);

    useEffect(()=>{
        EventEmitter.subscribe('refreshDiveSelect', (r)=>setTrigger(r))
        return ()=>{EventEmitter.unsubscribe('refreshDiveSelect')}
    }, [constant])

    useFocusEffect(
        React.useCallback(() => {
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

    const exportItem = (item) => Clipboard.setString(JSON.stringify(item))

    const importItem = () => {
        Clipboard.getString().then((text)=>
            set("tempDive",text).then(
                navigation.navigate("entryDive", {destination: destination, dive_id: "tempDive"})
            ).catch(e=>console.log(e))
        ).catch(e=>console.log(e))
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