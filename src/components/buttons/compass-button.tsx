import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLOUR, SHADOW, TEXT } from "../../styles";
import { normalise } from "../../utils/helpers";
import { ASSET } from "../../consts";
import * as Animateable from 'react-native-animatable';

type PropsType = { onPress: Function, disabled?: boolean, shadow?: boolean, heading?: number }
export default function CompassButton ({ onPress, disabled=false, shadow=false, heading=0 } : PropsType) {

    return (
        <Animateable.View animation={'fadeIn'}>
            <TouchableOpacity
                onPress={() => onPress()}
                style={[
                    styles.button,
                    shadow && styles.shadow,
                ]}
                activeOpacity={0.8}
                disabled={disabled}
            >
                <Image
                    source={ASSET.COMPASS_NEEDLE}
                    style={[
                        styles.image,
                        { transform: [{ rotate: `-${heading}deg` }] }
                    ]}
                    resizeMode="contain"
                />
            </TouchableOpacity>
        </Animateable.View>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: COLOUR.white,
        width: normalise(45),
        height: normalise(45),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: normalise(50)
    },
    text: {
        color: COLOUR.white,
        ...TEXT.md,
        fontWeight: 600,
        textAlign: 'center'
    },
    shadow: {
        ...SHADOW.md
    },
    image: { 
        width: normalise(35), 
        height: normalise(35) 
    }
})