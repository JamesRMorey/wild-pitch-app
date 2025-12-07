import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { COLOUR, TEXT } from '../../styles';
import { normalise } from '../../utils/helpers';
import Icon from '../misc/icon';


type PropsType = { label?: string, options: Array<{ label: string, value: string, icon: string }>, value?: string, onChange: (value: string) => void, onFocus?: ()=>void, error?: string };
export default function RadioInput ({ value, label, options, onChange, onFocus=()=>{}, error } : PropsType) {

    return (
        <View style={{ width: '100%' }}>
            {label && (
            <Text style={TEXT.label}>{label}</Text>
            )}
            <View style={styles.options}>
                {options.map((option, index) => {
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.option,
                                value === option.value ? styles.optionSelected : null,
                            ]}
                            onPress={() => onChange(option.value)}
                        >
                            <Icon icon={option.icon} size={normalise(20)} colour={COLOUR.gray[800]} />
                            <Text style={styles.optionLabel}>{option.label}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
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
    },
    errorText: {
        ...TEXT.xs,
        color: COLOUR.red[500],
        marginTop: normalise(5)
    },
    error: {
        borderColor: COLOUR.red[500]
    },
    options: {
        flexDirection: 'row',
        gap: normalise(10),
    },
    option: {
        flex: 1,
        backgroundColor: COLOUR.gray[200],
        borderRadius: normalise(10),
        paddingVertical: normalise(15),
        justifyContent: 'center',
        alignItems: 'center',
        gap: normalise(5),
        borderWidth: normalise(2),
        borderColor: COLOUR.gray[200],
    },
    optionSelected: {
        backgroundColor: COLOUR.wp_green[200],
        borderColor: COLOUR.wp_green[500],
    },
})