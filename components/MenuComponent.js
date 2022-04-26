import {Menu, MenuOption, MenuOptions, MenuTrigger} from "react-native-popup-menu";
import {StyleSheet, Text} from "react-native";
import {forwardRef, useImperativeHandle, useState} from "react";

function MenuComponent(props, ref) {
    const [opened, setOpened] = useState()

    useImperativeHandle(ref, () => ({
        openMenu: () => { openMenu() }
    }))

    const openMenu = () => {
        setOpened(true)
    }

    return (
        <Menu
            opened={opened}
            onBackdropPress={() => setOpened(false)}>
            <MenuTrigger/>
            <MenuOptions>
                {props.options.map((option)=>
                    <MenuOption style={styles.button} key={option.text} onSelect={() => {
                        setOpened(false)
                        option.action()}}>
                        <Text style={styles.text}>{option.text}</Text>
                    </MenuOption>
                )}
            </MenuOptions>
        </Menu>
    )
}

const styles = StyleSheet.create({
    button: {
        borderBottomWidth: 0.5,
        borderColor: 'black',
    },
    text: {
        fontSize: 18,
    }
})

export default forwardRef(MenuComponent)