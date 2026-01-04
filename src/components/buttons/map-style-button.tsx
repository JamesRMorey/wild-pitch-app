import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { COLOUR, SHADOW } from "../../styles";
import Mapbox from "@rnmapbox/maps";
import { ASSET } from "../../consts";
import { normalise } from "../../utils/helpers";

type PropsType = { onPress: Function, disabled?: boolean, active?: boolean, blocked?: boolean, styleURL: Mapbox.StyleURL }
export default function MapStyleButton({ onPress, disabled=false, active=false, blocked=false, styleURL } : PropsType) {

    return (
        <TouchableOpacity
            onPress={() => onPress()}
            style={[
                styles.button,
                styles.shadow
            ]}
            activeOpacity={0.6}
            disabled={disabled || blocked}
        >
            <Image
                style={[
                    styles.image,
                    active && styles.active,
                ]}
                source={
                    styleURL == Mapbox.StyleURL.Outdoors ? ASSET.ICON_OUTDOORS_MAP :
                    styleURL == Mapbox.StyleURL.SatelliteStreet ? ASSET.ICON_SATELLITE_MAP :null
                }
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        
    },
    active: {
        borderColor: COLOUR.green[500]
    },
    iconOnly: {
        padding: 0,
        backgroundColor: COLOUR.transparent
    },
    disabled: {
        opacity: 0.6
    },
    shadow: {
        ...SHADOW.md
    },
    image: {
        aspectRatio: 1,
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: normalise(5),
        borderWidth: normalise(2),
        borderColor: COLOUR.white
    }
})