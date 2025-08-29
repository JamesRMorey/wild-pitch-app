import { StyleSheet, Text, View, TouchableOpacity, Linking, Share } from "react-native"
import { COLOUR, OPACITY, TEXT } from "../../styles"
import { delay, normalise } from "../../functions/helpers";
import { PointOfInterest } from "../../types";
import Icon from "../../components/misc/icon";
import Button from "../../components/buttons/button";
import useModals from "../../hooks/useModals";
import ConfirmModal from "../../modals/confirm";
import { useNavigation } from "@react-navigation/native";
import { SheetManager } from "react-native-actions-sheet";
import { SHEET } from "../../consts";

type PropsType = { point: PointOfInterest, onChangeSection: (section: string)=>void, onUpdatePoint: (poi: PointOfInterest)=>void };
export default function PointOfInterestDetails({ point, onChangeSection, onUpdatePoint } : PropsType) {

    const OPTIONS = [
        {
            icon: 'location-outline',
            title: 'See pin details',
            onPress: () => onChangeSection('navigation')
        },
        {
            icon: 'navigate-outline',
            title: 'Get directions',
            onPress: () => getDirections()
        },
        {
            icon: 'share-outline',
            title: 'Share location',
            onPress: () => shareLocation()
        }
    ];
    const { modals, close: closeModals, open: openModal } = useModals({ delete: false });
    const navigation = useNavigation();


    const getDirections = async () => {
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${point.latitude},${point.longitude}`;

        Linking.openURL(mapsUrl);
    }

    const shareLocation = async () => {
        try {
            await Share.share({
                message: `Here\'s a location i've plotted on Wild Pitch Maps (${point.latitude, point.longitude}) - https://www.google.com/maps/search/?api=1&query=${point.latitude},${point.longitude}`,
            });
        } 
        catch (error: any) {
        }
    }

    const editPoint = async () => {
        await SheetManager.hide(SHEET.MAP_POI_SHEET);
        await delay(100);
        // @ts-ignore
        navigation.navigate('map-point-of-interest', { 
            screen: 'point-of-interest-edit', 
            params: {
                point: point
            }
        });
    }

    return (
        <View>
            <View style={styles.topContainer}>
                <View style={styles.titleContainer}>
                    <Text style={TEXT.h3}>{point.name ?? 'Dropped Pin'}</Text>
                </View>
                {point.notes && (
                    <Text style={styles.notes}>{point.notes}</Text>
                )}
                <Text style={styles.latlng}>{point.latitude.toString().slice(0,10)}, {point.longitude.toString().slice(0,10)}</Text>
            </View>
            <View style={styles.bottomContainer}>
                {OPTIONS.map((option, i) => {
                    return (
                        <TouchableOpacity
                            key={i}
                            style={styles.option}
                            activeOpacity={0.5}
                            onPress={() => option.onPress()}
                        >
                            <View style={styles.optionNameContainer}>
                                <Icon
                                    icon={option.icon}
                                    size={normalise(18)}
                                />
                                <Text style={TEXT.md}>{option.title}</Text>
                            </View>
                            <Icon
                                icon={'chevron-forward-outline'}
                                size={normalise(18)}
                            />
                        </TouchableOpacity>
                    )
                })}
                {point.id && (
                    <TouchableOpacity
                        style={styles.option} 
                        activeOpacity={0.5}
                        onPress={() => openModal('delete')}
                    >
                        <View style={styles.optionNameContainer}>
                            <Icon
                                icon={'trash-outline'}
                                colour={COLOUR.red[500]}
                                size="small"
                            />
                            <Text style={[TEXT.md, { color: COLOUR.red[500] }]}>Delete pin</Text>
                        </View>
                    </TouchableOpacity>
                )}
                <View style={styles.buttons}>
                    <Button
                        title={point.id ? 'Edit pin' : 'Save pin'}
                        onPress={editPoint}
                        style='large'
                    />
                </View>
            </View>
            {modals.delete && (
                <ConfirmModal
                    onClose={closeModals}
                    onConfirm={() => {
                        
                        closeModals()
                    }}
                    text="Are you sure you want to delete this point permanently?"
                    title="Delete Point"
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: normalise(20),
        paddingBottom: 0
    },
    topContainer: {
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    bottomContainer: {
        paddingTop: normalise(5)
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
    buttons: {
        paddingTop: normalise(20)
    },
    notes: {
        ...TEXT.sm,
        marginBottom: normalise(5)
    },
    latlng: {
        ...TEXT.sm, 
        ...TEXT.medium,
        textDecorationLine: 'underline'
    }
})