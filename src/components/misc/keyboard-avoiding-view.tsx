import { TouchableWithoutFeedback, KeyboardAvoidingView as RNKeyboardAvoidingView, Keyboard } from "react-native"

type PropsType = { children: React.ReactNode, flex?: boolean }
export default function KeyboardAvoidingView({ children, flex=false }: PropsType) {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <RNKeyboardAvoidingView behavior="padding" enabled style={{ flex: flex ? 1 : undefined }}>
                {children}
            </RNKeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}
