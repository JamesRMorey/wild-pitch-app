import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { MapPackGroup } from "../types";
import { SHEET } from "../consts";
import { COLOUR, OPACITY, TEXT } from "../styles";
import { normalise } from "../functions/helpers";
import Icon from "../components/misc/icon";

type PropsType = { id: string, options: Array<{ label: string, icon: string, onPress: ()=>void }> }
export default function OptionsSheet ({ id, options } : PropsType ) {

    
    return (
        <ActionSheet
            id={id}
            containerStyle={styles.sheet}
        >
            {options.map((option, i) => {
                return (
                    <TouchableOpacity
                        style={styles.option} 
                        activeOpacity={0.5}
                        onPress={option.onPress}
                    >
                        <View style={styles.optionNameContainer}>
                            <Icon
                                icon={option.icon}
                                colour={COLOUR.black}
                            />
                            <Text style={TEXT.md}>{option.label}</Text>
                        </View>
                        <View>
                            <Icon
                                icon={'chevron-forward-outline'}
                                colour={COLOUR.black}
                            />
                        </View>
                    </TouchableOpacity>
                )
            })}
        </ActionSheet>
    )
}


const styles = StyleSheet.create({
    sheet: {
        backgroundColor: COLOUR.white,
        padding: normalise(20),
        paddingBottom: normalise(35)
    },
    container: {
        gap: normalise(15),
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: normalise(20),
        borderBottomWidth: normalise(1),
        borderBottomColor: COLOUR.black + OPACITY[20]
    },
    optionNameContainer: {
        flexDirection: 'row',
        gap: normalise(10),
        alignItems: 'center'
    },
});