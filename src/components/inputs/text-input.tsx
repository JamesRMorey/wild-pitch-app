import { TextInput as RNTextInput, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { COLOUR, TEXT } from '../../styles';
import { normalise } from '../../utils/helpers';
import Icon from '../misc/icon';
import { useState } from 'react';


type PropsType = { placeHolder?: string, icon?: string, label?: string, secureTextEntry?: boolean, value?: string, onChangeText: (text: string)=>void, onFocus?: ()=>void, error?: string, onClear?: ()=>void, autoCorrect?: boolean };

export default function TextInput ({ placeHolder, icon, value, label, secureTextEntry=false, onChangeText, onFocus=()=>{}, error, onClear, autoCorrect=false } : PropsType) {

    const [showSecureText, setShowSecureText] = useState<boolean>(secureTextEntry);

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
                    secureTextEntry={showSecureText}
                    value={value}
                    placeholderTextColor={COLOUR.gray[500]}
                    onChangeText={onChangeText}
                    onFocus={onFocus}
                    autoCorrect={autoCorrect}
                />
                {onClear ? 
                <TouchableOpacity style={styles.close} onPress={onClear}>
                    <Icon icon={'close-outline'} size={normalise(20)} colour={COLOUR.gray[600]} />
                </TouchableOpacity>
                :secureTextEntry ?
                <TouchableOpacity style={styles.close} onPress={()=>setShowSecureText(!showSecureText)}>
                    <Icon icon={showSecureText ? 'eye-off-outline' : 'eye-outline'} size={normalise(20)} colour={COLOUR.gray[600]} />
                </TouchableOpacity>
                :null}
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