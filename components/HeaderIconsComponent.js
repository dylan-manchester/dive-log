import SettingsComponent from "./SettingsComponent";
import {Image, Modal, Pressable, StyleSheet, View} from "react-native";
import React, {useRef, useState} from "react";
import {EventEmitter} from "../data/EventEmitter";
import MenuComponent from "./MenuComponent";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";

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
                <FontAwesomeIcon icon={faPencilAlt} color={'white'} size={24}/>
            </Pressable>
            <Pressable style={styles.icon} onPress={props.deleteAction}>
                <FontAwesomeIcon icon={faTrashAlt} color={'white'} size={24}/>
            </Pressable>
            <Pressable style={styles.icon} onPress={()=>setModalVisible(true)}>
                <FontAwesomeIcon icon={faGear} color={'white'} size={24}/>
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