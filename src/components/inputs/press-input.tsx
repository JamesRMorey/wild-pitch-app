import { TouchableOpacity, StyleSheet, Text, View } from 'react-native'
import { COLOUR, TEXT } from '../../styles';
import { normalise } from '../../functions/helpers';


type PropsType = { placeHolder?: string, label?: string, value?: string, onPress: ()=>void, error?: string };

export default function PressInput ({ placeHolder, value, label, onPress, error } : PropsType) {
    

    return (
        <View>
            {label && (
            <Text style={TEXT.label}>{label}</Text>
            )}
            <TouchableOpacity
                style={[
                    styles.input,
                    error && styles.error
                ]}
                onPress={onPress}
                activeOpacity={0.8}
            >
                {value ?
                    <Text style={styles.value}>{value}</Text>
                :placeHolder ?
                    <Text style={styles.placeHolder}>{placeHolder}</Text>
                :null}
            </TouchableOpacity>
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
        marginTop: normalise(5),
    },
    error: {
        borderColor: COLOUR.red[500]
    },
    value: {

    },
    placeHolder: {
        color: COLOUR.gray[500],
    }
})