import SettingsComponent from "./SettingsComponent";
import {Image, Modal, Pressable, StyleSheet, View} from "react-native";
import React, {useRef, useState} from "react";
import {EventEmitter} from "../data/EventEmitter";
import MenuComponent from "./MenuComponent";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

export default function ModalMenuComponent(props) {
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

    const menuRef = useRef();

    return(
        <View>
            <Pressable onPress={props.options !== [] ? ()=>menuRef.current.openMenu() : ()=>setModalVisible(true)}>
                <FontAwesomeIcon icon={faBars} color={'white'} size={24}/>
                <MenuComponent options={[{action: ()=>setModalVisible(true), text: "Settings"}, ...props.options]} ref={menuRef}/>
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
    modal: {
        marginTop: 30,
    }
})