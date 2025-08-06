import { TextInput as RNTextInput, StyleSheet, Text, View } from 'react-native'
import { COLOUR, TEXT } from '../../styles';
import { normalise } from '../../functions/helpers';


type PropsType = { placeHolder?: string, label?: string, value?: string, onChangeText: (text: string)=>void };

export default function TextArea ({ placeHolder, value, label, onChangeText } : PropsType) {

    return (
        <View>
            {label && (
            <Text style={TEXT.label}>{label}</Text>
            )}
            <RNTextInput
                placeholder={placeHolder}
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                multiline={true}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: COLOUR.gray[200],
        borderRadius: normalise(10),
        padding: normalise(15),
        minHeight: normalise(130)
    }
})