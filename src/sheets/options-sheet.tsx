import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLOUR, OPACITY, TEXT } from "../styles";
import { normalise } from "../utils/helpers";
import Icon from "../components/misc/icon";

type PropsType = { id: string, options: Array<{ label: string, icon: string, colour?: string, showArrow?: boolean, onPress: ()=>void }> }
export default function OptionsSheet ({ id, options } : PropsType ) {

    
    return (
        <ActionSheet
            id={id}
            containerStyle={styles.sheet}
        >
            {options.map((option, i) => {
                return (
                    <TouchableOpacity
                        style={[
                            styles.option,
                            i+1 == options.length && { borderBottomWidth: 0 }
                        ]} 
                        activeOpacity={0.5}
                        onPress={option.onPress}
                        key={i}
                    >
                        <View style={styles.optionNameContainer}>
                            <Icon
                                icon={option.icon}
                                colour={option.colour ?? COLOUR.black}
                                size={normalise(20)}
                            />
                            <Text style={[TEXT.md, { color: option.colour ?? COLOUR.black }]}>{option.label}</Text>
                        </View>
                        {(option.showArrow ?? true) && (
                            <View>
                                <Icon
                                    icon={'chevron-right'}
                                    colour={COLOUR.black}
                                />
                            </View>
                        )}
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
        paddingTop: normalise(10),
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