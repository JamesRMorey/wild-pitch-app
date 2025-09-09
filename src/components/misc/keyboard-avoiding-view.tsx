import { TouchableWithoutFeedback, KeyboardAvoidingView as RNKeyboardAvoidingView, Keyboard } from "react-native"

export default function KeyboardAvoidingView({ children }: { children: React.ReactNode }) {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <RNKeyboardAvoidingView behavior="padding" enabled>
                {children}
            </RNKeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}
