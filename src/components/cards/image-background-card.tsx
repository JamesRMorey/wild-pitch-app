import { StyleSheet, TouchableOpacity, ImageBackground, ImageBackgroundProps, View } from "react-native";
import { normalise } from "../../utils/helpers";
import { COLOUR, OPACITY } from "../../styles";

type PropsType = { children: any, background: ImageBackgroundProps, onPress?: ()=>void, style?: any }
export default function ImageBackgroundCard({ children, background, onPress, style={} } : PropsType) {

    return (
        <TouchableOpacity 
            onPress={onPress}
            disabled={!onPress} 
            style={[styles.container, style]}
        >
            <ImageBackground
                source={background}
            >
                <View style={{ padding: normalise(20) }}>
                    <View style={styles.overlay}></View>
                    { children }
                </View>
            </ImageBackground>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: { 
        borderWidth: normalise(2), 
        borderRadius: normalise(25), 
        overflow: "hidden",
        borderColor: COLOUR.wp_green[500]
    },
    overlay: {
        backgroundColor: COLOUR.black + OPACITY[30], 
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
});