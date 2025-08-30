import { TextInput as RNTextInput, StyleSheet, Text, View } from 'react-native'
import { COLOUR, TEXT } from '../../styles';
import { normalise } from '../../functions/helpers';


type PropsType = { placeHolder?: string, label?: string, value?: string, onChangeText: (text: string)=>void, onFocus?: ()=>void, error?: string };

export default function TextInput ({ placeHolder, value, label, onChangeText, onFocus=()=>{}, error } : PropsType) {

    return (
        <View>
            {label && (
            <Text style={TEXT.label}>{label}</Text>
            )}
            <RNTextInput
                placeholder={placeHolder}
                style={[
                    styles.input,
                    error && styles.error
                ]}
                value={value}
                placeholderTextColor={COLOUR.gray[500]}
                onChangeText={onChangeText}
                onFocus={onFocus}
            />
            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: COLOUR.gray[200],
        borderRadius: normalise(10),
        padding: normalise(15),
        borderWidth: normalise(1),
        borderColor: COLOUR.gray[200]
    },
    errorText: {
        ...TEXT.xs,
        color: COLOUR.red[500],
        marginTop: normalise(5)
    },
    error: {
        borderColor: COLOUR.red[500]
    }
})