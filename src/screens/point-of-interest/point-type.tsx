import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { COLOUR, TEXT } from "../../styles";
import { normalise } from "../../functions/helpers";
import { usePointTypes } from "../../hooks/usePointType";
import Icon from "../../components/misc/icon";
import { PointType } from "../../types";

type PropsType = { navigation: any, route: any }

export default function PointOfInterestPointTypeScreen({ navigation, route }: PropsType) {

    const { value, onGoBack } = route.params;
    const { pointTypes } = usePointTypes();

    const select = ( pointType: PointType ) => {
        if (onGoBack) {
            onGoBack(pointType);
        }
        navigation.goBack();
    } 
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select a category</Text>
            <View style={styles.optionContainer}>
                {pointTypes.map((pointType: PointType, i: number) => {
                    return (
                        <TouchableOpacity
                            key={i}
                            onPress={() => select(pointType)}
                            style={styles.option}
                        >
                            <View 
                                style={[
                                    styles.optionIcon,
                                    { backgroundColor: pointType.colour }
                                ]}
                            >
                                {value && value == pointType.id && (
                                    <View style={styles.checkmark}>
                                        <Icon
                                            icon={'checkmark-outline'}
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
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: normalise(20),
        paddingBottom: 0
    },
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
    checkmark: {
        position: 'absolute',
        top: -normalise(0),
        right: -normalise(10),
        backgroundColor: COLOUR.green[500],
        borderRadius: normalise(50),
        padding: normalise(3)
    },
})