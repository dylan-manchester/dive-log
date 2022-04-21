import SettingsComponent from "./SettingsComponent";
import {Image, Modal, Pressable, StyleSheet, View} from "react-native";
import React, {useRef, useState} from "react";
import {EventEmitter} from "../data/EventEmitter";
import MenuComponent from "./MenuComponent";

export default function ModalMenuComponent(props) {
    const [refreshes,setRefreshes] = useState(1)
    const [modalVisible, setModalVisible] = useState(false)

    function triggerSettingsRefresh() {
        setRefreshes((prev)=>prev+1)
        console.log("Refreshes: "+refreshes)
        EventEmitter.dispatch('refreshSiteEntry', refreshes)
        EventEmitter.dispatch('refreshDiveEntry', refreshes)
        EventEmitter.dispatch('refreshGearEntry', refreshes)
        EventEmitter.dispatch('refreshDiveSelect', refreshes)
        EventEmitter.dispatch('refreshSiteSelect', refreshes)
        EventEmitter.dispatch('refreshGearSelect', refreshes)
        EventEmitter.dispatch('refreshGearView', refreshes)
        EventEmitter.dispatch('refreshSiteView', refreshes)
        EventEmitter.dispatch('refreshDiveView', refreshes)
        EventEmitter.dispatch('refreshSettings', refreshes)
    }

    const menuRef = useRef();

    return(
        <View>
            <Pressable onPress={props.options !== [] ? ()=>menuRef.current.openMenu() : ()=>setModalVisible(true)}>
                <Image source={require("../assets/settings.png")}/>
                <MenuComponent options={[...props.options, {action: ()=>setModalVisible(true), text: "Settings"}]} ref={menuRef}/>
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