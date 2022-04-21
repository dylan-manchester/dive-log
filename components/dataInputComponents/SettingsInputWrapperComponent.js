import {StyleSheet, View} from 'react-native'
import StringInputComponent from "./StringInputComponent";
import SwitchInputComponent from "./SwitchInputComponent";
import NotesInputComponent from "./NotesInputComponent";

export default function SettingsInputWrapperComponent({props}) {

    return (
        <View style={styles.container}>
            {typeof props.value === "object" ?
                <NotesInputComponent
                    key={props.title.toString()}
                    title={props.title}
                    value={props.value}
                    setterCallback={props.callback}
                />
                : props.value === true || props.value === false ?
                <SwitchInputComponent
                    key={props.title.toString()}
                    title={props.title}
                    value={props.value}
                    setterCallback={props.callback}/>
                    : <StringInputComponent
                        title={props.title}
                        value={props.value}
                        setterCallback={props.callback}/>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 5,
        padding: 5,
        borderWidth: 1,
        borderColor: 'black',
    }
})