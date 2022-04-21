import {Menu, MenuOption, MenuOptions, MenuTrigger} from "react-native-popup-menu";
import {Text} from "react-native";
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
                    <MenuOption key={option.text} onSelect={() => {
                        setOpened(false)
                        option.action()}}>
                        <Text>{option.text}</Text>
                    </MenuOption>
                )}
            </MenuOptions>
        </Menu>
    )
}

export default forwardRef(MenuComponent)