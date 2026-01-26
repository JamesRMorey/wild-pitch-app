import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { COLOUR, ROUNDED, TEXT } from '../../styles';
import { normalise } from '../../utils/helpers';
import Icon from '../misc/icon';

type PropsType = { label?: string, options: Array<{ label: string, value: string, icon?: string }>, value?: string, onChange: (value: any) => void, onFocus?: ()=>void, error?: string };
export default function PillSelectInput ({ value, label, options, onChange, onFocus=()=>{}, error } : PropsType) {

    return (
        <View style={styles.container}>
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
                            {option.icon && 
                            <Icon icon={option.icon} size={normalise(20)} colour={COLOUR.gray[800]} />
                            }
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
    container: { 
        width: '100%'
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
        flexWrap: 'wrap'
    },
    option: {
        backgroundColor: COLOUR.gray[200],
        ...ROUNDED.full,
        paddingVertical: normalise(10),
        paddingHorizontal: normalise(10),
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