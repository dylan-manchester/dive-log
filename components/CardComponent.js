import {StyleSheet, Text, View, Pressable, Image} from 'react-native'
import {Menu, MenuOption, MenuOptions, MenuTrigger} from "react-native-popup-menu";
import {useState} from "react";

interface CardProps {
    title: string;
    subtitle1: string;
    subtitle2: string;
    subtitle3: string;
    favorite: boolean;
    pressAction: function;
    editAction: function;
    deleteAction: function;
    favoriteAction: function;
    exportAction: function;
    importAction: function;
}

export default function CardComponent({title, subtitle1, subtitle2, subtitle3, favorite, pressAction, editAction, deleteAction, favoriteAction, exportAction, importAction}: CardProps) {
    const [opened, setOpened] = useState(false)
    return (
        <View key={title} style={styles.container}>
            <Pressable style={({pressed})=>[pressed ? styles.pressed : styles.unpressed ,styles.pressable]}
                       onPress={pressAction}
            onLongPress={()=>setOpened(true)}>
                <View style={styles.title}>
                    <Text style={styles.title}>{title}</Text>
                </View>
                {favorite ?
                    <View>
                        <Image style={styles.image} source={require("../assets/star.png")}/>
                    </View>
                    : <View/>}
                <Menu
                    opened={opened}
                    onBackdropPress={() => setOpened(false)}>
                    <MenuTrigger/>
                    <MenuOptions>
                        {editAction!=null ? <MenuOption onSelect={()=>{
                            setOpened(false)
                            editAction()
                        }}>
                            <Text>Edit</Text>
                        </MenuOption> : null}
                        {deleteAction!=null?
                            <MenuOption onSelect={()=>{
                                setOpened(false)
                                deleteAction()
                            }}>
                                <Text>Delete</Text>
                            </MenuOption> : null }
                        {favoriteAction!=null ?
                            <MenuOption onSelect={() => {
                                setOpened(false)
                                favoriteAction()
                            }}>
                                <Text>Favorite</Text>
                            </MenuOption>
                            : null }
                        {exportAction!=null ?
                            <MenuOption onSelect={() => {
                                setOpened(false)
                                exportAction()
                            }}>
                                <Text>Copy to Clipboard</Text>
                            </MenuOption>
                            : null }
                        {importAction!=null ?
                            <MenuOption onSelect={() => {
                                setOpened(false)
                                importAction()
                            }}>
                                <Text>Create from Clipboard</Text>
                            </MenuOption>
                            : null }
                    </MenuOptions>
                </Menu>
                <View style={styles.subtitles}>
                    <Text style={styles.subtitle}>{subtitle1}</Text>
                    <Text style={styles.subtitle}>{subtitle2}</Text>
                    <Text style={styles.subtitle}>{subtitle3}</Text>
                </View>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 5,
    },
    pressable: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: "95%",
        padding: 5,
        zIndex: 100,
        borderWidth: 1,
        borderBottomColor: 'black',
    },
    pressed: {
        backgroundColor: '#0b3142',
    },
    unpressed: {
        backgroundColor: '#145c7c',
    },
    title: {
        flex: .5,
        fontSize: 30,
        color: 'white',
    },
    subtitles: {
        flex: .5,
        flexDirection: 'column',
    },
    subtitle: {
        textAlign: 'right',
        fontSize: 20,
        color: 'white',
    },
    image: {
        flex: .1
    }
})