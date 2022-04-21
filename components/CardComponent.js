import {StyleSheet, Text, View, Pressable, Image} from 'react-native'
import {useRef} from "react";
import MenuComponent from "./MenuComponent";

export default function CardComponent({title, subtitle1, subtitle2, subtitle3, favorite, pressAction, editAction, deleteAction, favoriteAction, exportAction, importAction}) {
    const menuRef = useRef();
    let options = [];
    if (editAction!=null) options.push({action: editAction, text: "Edit"})
    if (deleteAction!=null) options.push({action: deleteAction, text: "Delete"})
    if (favoriteAction!=null) options.push({action: favoriteAction, text: "Favorite"})
    if (importAction!=null) options.push({action: importAction, text: "Import from Clipboard"})
    if (exportAction!=null) options.push({action: exportAction, text: "Copy to Clipboard"})
    return (
        <View key={title} style={styles.container}>
            <Pressable style={({pressed})=>[pressed ? styles.pressed : styles.unpressed ,styles.pressable]}
                       onPress={pressAction}
            onLongPress={()=>menuRef.current.openMenu()}>
                <View style={styles.title}>
                    <Text style={styles.title}>{title}</Text>
                    <MenuComponent options={options} ref={menuRef}/>
                </View>
                {favorite ?
                    <View>
                        <Image style={styles.image} source={require("../assets/star.png")}/>
                    </View>
                    : <View/>}
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
        borderRadius: 10,
    },
    pressed: {
        backgroundColor: '#0b3142',
    },
    unpressed: {
        backgroundColor: '#145c7c',
    },
    title: {
        flex: .45,
        fontSize: 30,
        color: 'white',
    },
    subtitles: {
        flex: .45,
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