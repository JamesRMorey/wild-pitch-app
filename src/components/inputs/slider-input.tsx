import { TextInput as RNTextInput, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { COLOUR, TEXT } from '../../styles';
import { normalise } from '../../utils/helpers';
import Slider from '@react-native-community/slider';


type PropsType = { label?: string, value: number, step?: number, valueLabel?: string, min: number, max: number, onChange: (value: number)=>void, error?: string, onClear?: ()=>void, autoCorrect?: boolean };

export default function SliderInput ({ value, label, step=1, valueLabel, min, max, onChange, error, onClear } : PropsType) {

    return (
        <View style={{ width: '100%' }}>
            {label && (
            <View style={styles.labelContainer}>
                <Text style={[TEXT.label, {marginBottom: 0 }]}>{label}</Text>
                {valueLabel &&
                <Text style={TEXT.sm}>{valueLabel}</Text>
                }
            </View>
            )}
            <View style={{ position: 'relative', justifyContent: 'center' }}>
                <Slider
                    style={{ width: '100%' }}
                    minimumValue={min}
                    maximumValue={max}
                    minimumTrackTintColor={COLOUR.wp_green[500]}
                    maximumTrackTintColor={COLOUR.gray[200]}
                    value={value}
                    onValueChange={(val) => onChange(val)}
                    step={step}
                />
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
    icon: {
        position: 'absolute',
        left: normalise(15),
        zIndex: 2
    },
    close: {
        position: 'absolute',
        right: normalise(15),
        zIndex: 2
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: normalise(10),
    }
})