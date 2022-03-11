import {StyleSheet, Text, TextInput, View, Pressable} from 'react-native'
import {useEffect, useState} from "react";

interface DataInputProps {
    title: string;
    options: Array<string>;
    setterCallback: function;
}

export default function DataInputComponent({title, value, options, setterCallback}: DataInputProps) {
    const [filteredOptions, setFilteredOptions] = useState([])
    const [text, setText] = useState('')

    useEffect(()=>{
        if (value) {
            setText(value.toString())
        }
    }, [value])

    // Typeahead functionality
    const filterOptions = (value) => {
        setText(value)
        setterCallback(value)
        setFilteredOptions(options.filter(o => o.toLowerCase().startsWith(value.toLowerCase())))
    }

    const openDropdown = () => {
        setFilteredOptions(options)
    }

    // Called when an option is selected
    const selectOptionHandler = (value) => {
        setText(value);
        setterCallback(value);
        setFilteredOptions([]);
    }


    return (
        <View style={styles.container}>
            <View style={styles.description}>
                <Text>{title}</Text>
            </View>
            <View style={styles.content}>
                <View style={styles.textInput}>
                    <TextInput
                        placeholder="Placeholder"
                        value={text}
                        onChangeText={filterOptions}/>
                    <Pressable onPress={() => openDropdown()}>
                        <Text style={styles.dropdownOpenner}>v</Text>
                    </Pressable>
                </View>
                <View style={styles.dropdown}>
                    {filteredOptions.map((option) =>
                                <View key={option} style={styles.dropdownItem}>
                                    <Pressable
                                        style={styles.dropdownButton}
                                        onPress={() => selectOptionHandler(option)}>
                                        <Text>{option}</Text>
                                    </Pressable>
                                </View>
                        )
                    }
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

})