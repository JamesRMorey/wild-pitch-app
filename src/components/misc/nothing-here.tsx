import { Image, StyleSheet, Text, View } from "react-native"
import { normalise } from "../../functions/helpers"
import { TEXT } from "../../styles"
import { ASSET } from "../../consts"
import Button from "../buttons/button"

type PropsType = { title: string, text: string, onPress?: ()=>void, buttonText?: string }
export default function NothingHere ({ title, text, onPress, buttonText } : PropsType) {
    return (
       <View style={styles.container}>
            <Image
                source={ASSET.LOGO}
                style={styles.logo}
            />
            <Text style={TEXT.h2}>{title}</Text>
            <Text style={styles.text}>{text}</Text>
            {onPress && buttonText && (
                <View style={styles.buttons}>
                    <Button
                        title={buttonText}
                        onPress={onPress}
                    />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
   container: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: normalise(10),
        paddingTop: normalise(30)
    },
    buttons: {
        marginTop: normalise(15),
    },
    logo: {
        aspectRatio: 1,
        height: 'auto',
        width: '50%',
        marginBlock: normalise(20)
    },
    text: {
        ...TEXT.p,
        textAlign: 'center'
    }
})