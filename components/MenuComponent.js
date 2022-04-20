import {Menu, MenuOption, MenuOptions, MenuTrigger} from "react-native-popup-menu";
import {Text} from "react-native";
import {forwardRef, useImperativeHandle, useState} from "react";

function MenuComponent({editAction, deleteAction, favoriteAction, exportAction, importAction}, ref) {
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
                {editAction != null ? <MenuOption onSelect={() => {
                    setOpened(false)
                    editAction()
                }}>
                    <Text>Edit</Text>
                </MenuOption> : null}
                {deleteAction != null ?
                    <MenuOption onSelect={() => {
                        setOpened(false)
                        deleteAction()
                    }}>
                        <Text>Delete</Text>
                    </MenuOption> : null}
                {favoriteAction != null ?
                    <MenuOption onSelect={() => {
                        setOpened(false)
                        favoriteAction()
                    }}>
                        <Text>Favorite</Text>
                    </MenuOption>
                    : null}
                {exportAction != null ?
                    <MenuOption onSelect={() => {
                        setOpened(false)
                        exportAction()
                    }}>
                        <Text>Copy to Clipboard</Text>
                    </MenuOption>
                    : null}
                {importAction != null ?
                    <MenuOption onSelect={() => {
                        setOpened(false)
                        importAction()
                    }}>
                        <Text>Create from Clipboard</Text>
                    </MenuOption>
                    : null}
            </MenuOptions>
        </Menu>
    )
}

export default forwardRef(MenuComponent)