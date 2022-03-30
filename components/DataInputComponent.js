import {StyleSheet, View} from 'react-native'
import NumericInputComponent from "./NumericInputComponent";
import OptionsInputComponent from "./OptionsInputComponent";
import StringInputComponent from "./StringInputComponent";
import LocationInputComponent from "./LocationInputComponent";

export default function ({props}) {

    return (
        props.toggle == null || props.toggle === true ?
        <View style={styles.container}>
            {props.intervals != null ?
                <NumericInputComponent
                    title={props.title}
                    intervals={props.intervals}
                    value={props.value}
                    setterCallback={props.callback}/>
                : props.options != null ?
                    <OptionsInputComponent
                        title={props.title}
                        options={props.options}
                        value={props.value}
                        setterCallback={props.callback}/>
                    : props.latitude != null ?
                        <LocationInputComponent
                            title={props.title}
                            latitude={props.latitude}
                            longitude={props.longitude}
                            latitudeCallback={props.latitudeCallback}
                            longitudeCallback={props.longitudeCallback}/>
                        : <StringInputComponent
                            title={props.title}
                            value={props.value}
                            setterCallback={props.callback}/>}
        </View> : null
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