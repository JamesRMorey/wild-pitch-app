import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { COLOUR, TEXT } from '../../styles';
import { normalise } from '../../functions/helpers';
import Icon from '../misc/icon';


type PropsType = { label?: string, value?: string, options: Array<{ label: string, value: string|number, icon: string }>, onSelect: (value: string|number)=>void, error?: string };

export default function HorizontalSelect ({ value, label, options, onSelect, error } : PropsType) {

    return (
        <View style={{ gap: normalise(10)}}>
            {label && (
            <Text style={TEXT.label}>{label}</Text>
            )}
            <ScrollView
                horizontal={true}
                contentContainerStyle={styles.optionContainer}
                showsHorizontalScrollIndicator={false}
            >
                {options.map((option, i) => {
                    return (
                        <TouchableOpacity
                            key={option.value}
                            onPress={() => onSelect(option.value)}
                            style={styles.option}
                        >
                            <View style={styles.optionIcon}>
                                {value == option.value && (
                                    <View style={styles.checkmark}>
                                        <Icon
                                            icon={'checkmark-outline'}
                                            colour={COLOUR.white}
                                            size={normalise(17)}
                                        />
                                    </View>
                                )}
                                <Icon
                                    icon={option.icon}
                                    colour={COLOUR.white}
                                />
                            </View>
                            <Text style={styles.text}>{option.label}</Text>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    optionContainer: {
        gap: normalise(5),
    },
    option: {
        justifyContent: 'center',
        alignItems: 'center',
        width: normalise(100),
        gap: normalise(10)
    },
    optionIcon: {
        backgroundColor: COLOUR.gray[700],
        borderRadius: normalise(50),
        padding: normalise(15),
    },
    text: {
        ...TEXT.sm,
        textAlign: 'center'
    },
    checkmark: {
        position: 'absolute',
        top: -normalise(0),
        right: -normalise(10),
        backgroundColor: COLOUR.green[500],
        borderRadius: normalise(50),
        padding: normalise(3)
    },
    errorText: {
        ...TEXT.xs,
        color: COLOUR.red[500],
    },
})