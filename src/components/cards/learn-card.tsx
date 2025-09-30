import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Colour } from "../../types";
import { COLOUR, TEXT } from "../../styles";
import { normalise } from "../../functions/helpers";
import { SETTING } from "../../consts";
import Icon from "../misc/icon";

type PropsType = { title: string, text: string, icon: string, buttonText: string, onPress: ()=>void, colour: Colour }
export default function LearnCard({ title, text, icon, buttonText, onPress, colour } : PropsType) {

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.container}>
            <View style={{ alignItems: 'flex-start' }}>
                <View style={[
                    styles.iconContainer,
                    { backgroundColor: colour[200], borderColor: colour[100]}
                ]}>
                    <Icon
                        icon={icon}
                        colour={colour[700]}
                    />
                </View>
                <Text style={[TEXT.h4, { marginBottom: normalise(5), marginTop: normalise(10) }]}>{ title }</Text>
                <Text style={TEXT.p}>{ text }</Text>
            </View>
            <View style={[styles.learnButton, { backgroundColor: colour[500] }]}>
                <Text style={styles.learnButtonText}>{ buttonText }</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        paddingTop: SETTING.TOP_PADDING + normalise(20),
        backgroundColor: COLOUR.white,
        paddingHorizontal: normalise(20),
        paddingBottom: normalise(20)
    },
    sectionTitle: {
        ...TEXT.h3,
        marginBottom: normalise(15)
    },
    section: {
        padding: normalise(20),
        backgroundColor: COLOUR.white
    },
    container: {
        padding: normalise(20),
        borderRadius: normalise(25),
        borderWidth: normalise(1),
        borderColor: COLOUR.wp_brown[200],
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: normalise(210)
    },
    sectionScroll: {
        gap: normalise(20)
    },
    iconContainer: {
        borderWidth: normalise(5),
        padding: normalise(5),
        borderRadius: normalise(50)
    },
    learnButton: {
        borderRadius: normalise(30),
        paddingHorizontal: normalise(10),
        paddingVertical: normalise(5),
        marginTop: normalise(20)
    },
    learnButtonText: {
        ...TEXT.sm,
        color: COLOUR.white
    }
});