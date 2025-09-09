import { TextInput as RNTextInput, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { COLOUR, TEXT } from '../../styles';
import { normalise } from '../../functions/helpers';
import Icon from '../misc/icon';


type PropsType = { placeHolder?: string, icon?: string, label?: string, value?: string, onChangeText: (text: string)=>void, onFocus?: ()=>void, error?: string, onClear?: ()=>void, autoCorrect?: boolean };

export default function TextInput ({ placeHolder, icon, value, label, onChangeText, onFocus=()=>{}, error, onClear, autoCorrect=false } : PropsType) {

    return (
        <View style={{ width: '100%' }}>
            {label && (
            <Text style={TEXT.label}>{label}</Text>
            )}
            <View style={{ position: 'relative', justifyContent: 'center' }}>
                {icon && (
                    <View style={styles.icon}>
                        <Icon icon={icon} size={normalise(20)} colour={COLOUR.gray[600]} />
                    </View>
                )}
                <RNTextInput
                    placeholder={placeHolder}
                    style={[
                        styles.input,
                        error && styles.error,
                        icon && { paddingLeft: normalise(40) },
                        onClear && { paddingRight: normalise(40) }
                    ]}
                    value={value}
                    placeholderTextColor={COLOUR.gray[500]}
                    onChangeText={onChangeText}
                    onFocus={onFocus}
                    autoCorrect={autoCorrect}
                />
                {onClear && (
                    <TouchableOpacity style={styles.close} onPress={onClear}>
                        <Icon icon={'close-outline'} size={normalise(20)} colour={COLOUR.gray[600]} />
                    </TouchableOpacity>
                )}
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
    }
})