import { TouchableWithoutFeedback, KeyboardAvoidingView as RNKeyboardAvoidingView, Keyboard } from "react-native"

type PropsType = { children: React.ReactNode, flex?: boolean, style?: any}
export default function KeyboardAvoidingView({ children, flex=false, style={}}: PropsType) {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <RNKeyboardAvoidingView behavior="padding" enabled style={[style, flex && { flex: 1 }]}>
                {children}
            </RNKeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}
