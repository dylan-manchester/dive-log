import React, {useEffect, useState} from "react";
import CardComponent from "../../components/CardComponent";
import {StyleSheet, View, FlatList, Image} from "react-native";
import {deleteObject, getAll} from "../../Data/DAO";
import {useFocusEffect} from "@react-navigation/native";

export default function DiveSelectScreen({route, navigation}) {
    const {destination} = route.params
    const selectAction = (id) => { if (id != null)
        navigation.navigate(destination, {dive_id: id})
        else navigation.navigate("entry")
    }
    const [dives, setDives] = useState([]);
    const [ready, setReady] = useState(false);
    const [trigger, setTrigger] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            getAll("dives", (rv) => {
                setDives(rv)
                setReady(true)
            })
        },[trigger])
    )

    const deleteItem = (id) => {
        deleteObject("dives", id).then((success)=>{
            if (success) {
                setDives([])
                setTrigger(!trigger)
            } else {
                alert(`This should not appear!`)
            }
        })
    }

    const editItem = (id) =>
        navigation.navigate("entryDive", {destination: destination, dive_id: id})

    const renderItem = ({item}) => {
        let dt = new Date(item.dateTime)
        return <CardComponent
            title={String(dt.getMonth()).padStart(2,'0')+"/"+String(dt.getDate()).padStart(2,'0')+"/"+ dt.getFullYear()+" "+ String(dt.getHours()).padStart(2,'0')+":"+ String(dt.getMinutes()).padStart(2,'0')}
            subtitle1={item.siteName}
            subtitle2={item.depth+" ft"}
            subtitle3={item.duration+" min"}
            pressAction={() => selectAction(item.id)}
            editAction={()=> editItem(item.id)}
            deleteAction={() => deleteItem(item.id)}/>
    }

    return (
        <View style={styles.container}>
            <View style={styles.new}>
                <CardComponent
                    title="New Dive"
                    subtitle1= ""
                    subtitle2= ""
                    subtitle3= ""
                    pressAction={() => navigation.navigate("entryDive", {destination: destination})}/>
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