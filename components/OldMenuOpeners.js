const {deleteObject} = require("../Data/DAO");
const {Alert, Pressable, Image} = require("react-native");
const Clipboard = require("expo-clipboard");
const {exportableDive} = require("../Data/IO");
const MenuComponent = require("./MenuComponent");
const React = require("react");
const deleteItem = async (id) => {
    let success = await deleteObject("dives", id)
    if (success) {
        navigation.goBack()
    } else {
        Alert.alert(`Error`, 'Please try again')
    }
}

const editItem = (id) => navigation.navigate("entryDive", {destination: "viewDive", dive_id: id})

const exportItem = async (item) => Clipboard.setString(JSON.stringify(await exportableDive({...item})))

navigation.setOptions({
    headerRight: () => (
        <Pressable onPress={()=>menuRef.current.openMenu()}>
            <MenuComponent ref={menuRef} editAction={()=>editItem(dive_id)} exportAction={()=>exportItem(rv)} deleteAction={()=>deleteItem(dive_id)}/>
            <Image source={require("../../assets/settings.png")}/>
        </Pressable>)
})