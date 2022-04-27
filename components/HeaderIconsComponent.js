import SettingsComponent from "./SettingsComponent";
import {Modal, Pressable, StyleSheet, View} from "react-native";
import React, {useState} from "react";
import {EventEmitter} from "../data/EventEmitter";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function HeaderIconsComponent(props) {
    const [refreshes,setRefreshes] = useState(1)
    const [modalVisible, setModalVisible] = useState(false)

    function triggerSettingsRefresh() {
        setRefreshes((prev)=>prev+1)
        console.log("Refreshes: "+refreshes)
        EventEmitter.dispatch('refreshSiteEntry')
        EventEmitter.dispatch('refreshDiveEntry')
        EventEmitter.dispatch('refreshGearEntry')
        EventEmitter.dispatch('refreshDiveSelect')
        EventEmitter.dispatch('refreshSiteSelect')
        EventEmitter.dispatch('refreshGearSelect')
        EventEmitter.dispatch('refreshGearView')
        EventEmitter.dispatch('refreshSiteView')
        EventEmitter.dispatch('refreshDiveView')
        EventEmitter.dispatch('refreshSettings')
    }

    return(
        <View style={styles.container}>
            <Pressable style={styles.icon} onPress={props.editAction}>
                <Icon name="pencil" color='white' size={28}/>
            </Pressable>
            <Pressable style={styles.icon} onPress={props.deleteAction}>
                <Icon name="trash" color='white' size={28}/>
            </Pressable>
            <Pressable style={styles.icon} onPress={()=>setModalVisible(true)}>
                <Icon name="gear" color='white' size={28}/>
                <Modal
                    style = {styles.modal}
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        triggerSettingsRefresh()
                        setModalVisible(false)}}>
                    <SettingsComponent close={()=> {
                        triggerSettingsRefresh()
                        setModalVisible(false)}}/>
                </Modal>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    icon: {
        padding: 10,
        marginLeft: 15
    }
})