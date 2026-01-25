import { Position } from "@rnmapbox/maps/lib/typescript/src/types/Position";
import Mapbox from "@rnmapbox/maps";
import { COLOUR, SHADOW } from "../../styles";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { normalise } from "../../utils/helpers";
import Icon from "../misc/icon";

type PropsType = { coordinate: Position, icon: string, colour: string, disabled?: boolean, onPress?: Function, isBookmarked?: boolean }

export default function PointOfInterestMarker ({ coordinate, icon='flag', colour=COLOUR.red[500], disabled=false, onPress=()=>{}, isBookmarked=false } : PropsType ) {

    if (!coordinate) return;
    return (
        <Mapbox.MarkerView
            coordinate={coordinate}
            allowOverlapWithPuck={true}
            allowOverlap={true}
            anchor={{ x: 0.5, y: 0.5 }}
        >
            <TouchableOpacity
                onPress={() => onPress()}
                disabled={disabled}
                style={[
                    styles.container,
                    { backgroundColor: colour }
                ]}
            >
                <Icon
                    icon={icon}
                    size={18}
                    colour={COLOUR.white}
                />
            </TouchableOpacity>
            {isBookmarked && 
            <View style={styles.bookmarked}>
                <Icon
                    icon={'bookmark-check'}
                    size={16}
                    colour={COLOUR.white}
                />
            </View>
            }
        </Mapbox.MarkerView>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: normalise(2),
        borderRadius: normalise(30),
        width: normalise(35),
        height: normalise(35),
        borderColor: COLOUR.white,
        ...SHADOW.sm
    },
    bookmarked: {
        position: 'absolute',
        top: -normalise(12),
        right: -normalise(12),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOUR.red[500],
        borderWidth: normalise(2),
        borderRadius: normalise(30),
        width: normalise(25),
        height: normalise(25),
        borderColor: COLOUR.white,
        ...SHADOW.sm
    }
})