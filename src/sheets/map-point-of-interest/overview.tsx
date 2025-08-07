import { StyleSheet, Text, View, TouchableOpacity, Linking, Share } from "react-native"
import { COLOUR, OPACITY, TEXT } from "../../styles"
import { normalise } from "../../functions/helpers";
import { PointOfInterest } from "../../types";
import Icon from "../../components/misc/icon";
import Button from "../../components/buttons/button";
import useModals from "../../hooks/useModals";
import ConfirmModal from "../../modals/confirm";


export default function OverView({ point, onSeeDetails=()=>{}, onEdit=()=>{}, onDelete=(point: PointOfInterest) => point, } : { point: PointOfInterest, onSeeDetails?:()=>void, onSave?: ()=>void, onEdit?: ()=>void, onDelete?: (point: PointOfInterest)=>PointOfInterest }) {

    const OPTIONS = [
        {
            icon: 'location',
            title: 'See pin details',
            onPress: () => onSeeDetails()
        },
        {
            icon: 'navigate-outline',
            title: 'Get directions',
            onPress: () => getDirections()
        },
        {
            icon: 'share',
            title: 'Share location',
            onPress: () => shareLocation()
        }
    ];
    const { modals, close: closeModals, open: openModal } = useModals({ delete: false })


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

    return (
        <View style={styles.container}>
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
                                icon={'trash'}
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
                        onPress={() => onEdit()}
                        style='large'
                    />
                </View>
            </View>
            {modals.delete && (
                <ConfirmModal
                    onClose={closeModals}
                    onConfirm={() => {
                        onDelete(point);
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
    sheet: {
        backgroundColor: COLOUR.white,
    },
    container: {
        
    },
    topContainer: {
        padding: normalise(20)
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    bottomContainer: {
        padding: normalise(20),
        backgroundColor: COLOUR.gray[100],
        paddingBottom: normalise(35),
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
});