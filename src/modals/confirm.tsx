import { StyleSheet, Text, View } from "react-native";
import Modal from "./modal";
import { TEXT } from "../styles";
import Button from "../components/buttons/button";
import { normalise } from "../functions/helpers";

type PropsType = { onClose: ()=>void, onConfirm: ()=>void, text?: string, title?: string }

export default function ConfirmModal ({ onClose, onConfirm, text, title }: PropsType) {

    return (
        <Modal
            onClose={onClose}
        >
            {title && (
                <Text style={styles.title}>{title}</Text>
            )}
            {text && (
                <Text style={styles.text}>{text}</Text>
            )}
            <View style={styles.buttons}>
                <View style={{ flex: 1 }}>
                     <Button
                        title="Cancel"
                        onPress={onClose}
                        style='large'
                    />
                </View>
                <View style={{ flex: 1 }}>
                     <Button
                        title="Confirm"
                        onPress={onConfirm}
                        style='large'
                    />
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    buttons: {
       marginTop: normalise(15),
       flexDirection: 'row',
       gap: normalise(10),
    },
    title: {
        ...TEXT.h2,
        textAlign: 'center'
    },
    text: {
        ...TEXT.md,
        textAlign: 'center'
    }
})