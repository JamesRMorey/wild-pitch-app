import { TouchableOpacity, StyleSheet, Text, View } from 'react-native'
import { COLOUR, TEXT } from '../../styles';
import { normalise } from '../../utils/helpers';
import Icon from '../misc/icon';


type PropsType = { placeHolder?: string, label?: string, value?: string, onPress: ()=>void, onFocus?: () => void, error?: string };

export default function PressInput ({ placeHolder, value, label, onPress, onFocus=()=>{}, error } : PropsType) {


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
                onPress={() => {
                    onPress();
                    onFocus();
                }}
                activeOpacity={0.8}
            >
                {value ?
                    <Text style={styles.value}>{value}</Text>
                :placeHolder ?
                    <Text style={styles.placeHolder}>{placeHolder}</Text>
                :null}
                <Icon icon="chevron-forward-outline" size={normalise(20)} colour={COLOUR.black} />
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
        borderColor: COLOUR.gray[200],
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
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