import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Modal from "./modal";
import { COLOUR, TEXT } from "../styles";
import { normalise } from "../utils/helpers";
import { usePointTypes } from "../hooks/repositories/usePointType";
import Icon from "../components/misc/icon";
import { PointType } from "../types";

type PropsType = { onClose: ()=>void, onSelect: (pointType: PointType)=>void, value?: number }

export default function PointTypeSelectorModal ({ onClose, onSelect, value }: PropsType) {

    const { pointTypes } = usePointTypes();
    
    return (
        <Modal
            onClose={onClose}
        >
            <Text style={styles.title}>Select a category</Text>
            <View style={styles.optionContainer}>
                {pointTypes.map((pointType, i) => {
                    return (
                        <TouchableOpacity
                            key={i}
                            onPress={() => onSelect(pointType)}
                            style={styles.option}
                        >
                            <View 
                                style={[
                                    styles.optionIcon,
                                    { backgroundColor: pointType.colour }
                                ]}
                            >
                                {value && value == pointType.id && (
                                    <View style={styles.check}>
                                        <Icon
                                            icon={'check'}
                                            colour={COLOUR.white}
                                            size={normalise(17)}
                                        />
                                    </View>
                                )}
                                <Icon
                                    icon={pointType.icon}
                                    colour={COLOUR.white}
                                />
                            </View>
                            <Text style={styles.text}>{pointType.name}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    buttons: {
       marginTop: normalise(15)
    },
    title: {
        ...TEXT.h2,
        textAlign: 'center',
        marginBottom: normalise(15)
    },
    text: {
        ...TEXT.sm,
        textAlign: 'center'
    },
    optionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: normalise(30)
    },
    option: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '33%',
        gap: normalise(10),
    },
    optionIcon: {
        backgroundColor: COLOUR.gray[700],
        borderRadius: normalise(50),
        padding: normalise(15),
    },
    check: {
        position: 'absolute',
        top: -normalise(0),
        right: -normalise(10),
        backgroundColor: COLOUR.green[500],
        borderRadius: normalise(50),
        padding: normalise(3)
    },
})