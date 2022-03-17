import {StyleSheet, Text, View, Image} from "react-native";
import {get, wait} from "../../Data/DAO";
import React, {useEffect, useState} from "react";
import {Site} from "../../models/SiteModel";

export default function SiteViewScreen({route}) {
    const {site_id} = route.params
    const [site, setSite] = useState(new Site())
    const [ready, setReady] = useState(false)


    useEffect(() => {
        wait(800).then(()=>
            get(site_id).then((rv) => {
                setSite(rv)
                setReady(true)
            }).catch(e=>console.log(e))
        )
    },[ready])

    return (
        <View style={styles.container}>
            {ready ?
                <View style={styles.content}>
                    <Text style={styles.title}>{site.name}</Text>
                    <Text style={styles.subtitle}>Location: ({site.latitude}, {site.longitude})</Text>
                    <Text style={styles.subtitle}>Water Type: {site.waterType}</Text>
                    <Text style={styles.subtitle}>Default Depth: {site.defaultDepth} ft</Text>
                </View>
                : <Image source={require("../../assets/loading.gif")}/> }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 30,
        flex: 1,
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#02adec',
    },
    content: {
        width: "90%",
        justifyContent: "space-between",
        backgroundColor: '#aecdcb',
    },
    title: {
        fontSize: 30,
        marginBottom: 10,
        paddingLeft: 10,
    },
    subtitle: {
        fontSize: 20,
        marginBottom: 5,
        paddingLeft: 25,
    },
})