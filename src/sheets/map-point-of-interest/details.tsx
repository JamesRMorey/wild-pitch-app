import { StyleSheet, Text, View } from "react-native";
import { PointOfInterest } from "../../types";
import { normalise } from "../../functions/helpers";
import { TEXT } from "../../styles";
import Header from "../header";


export default function Details({ point, onBack } : { point: PointOfInterest, onBack: ()=>void }) {

    return (
        <View style={styles.container}>
            <Header 
                title={point.name}
                onBack={() => onBack()}
            />
            <View style={styles.statContainer}>
                <View style={styles.stat}>
                    <Text style={styles.statLabel}>Distance away</Text>
                    <Text style={styles.statText}>5.5<Text style={styles.statSubText}>km</Text></Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statLabel}>Bearing</Text>
                    <Text style={styles.statText}>160<Text style={styles.statSubText}>NW</Text></Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statLabel}>Point elevation</Text>
                    <Text style={styles.statText}>287<Text style={styles.statSubText}>m</Text></Text>
                </View>
            </View>
            <View>
                <Text style={styles.statLabel}>Latitude/Longitude</Text>
                <Text style={styles.latLng}>{point.latitude.toString().slice(0,8)}, {point.longitude.toString().slice(0,8)}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: normalise(20),
        gap: normalise(20),
        paddingBottom: normalise(35)
    },
    statContainer: {
        flexDirection: 'row',
        gap: normalise(10),
        justifyContent: 'space-evenly'
    },
    stat: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: normalise(5)
    },
    statLabel: {
        ...TEXT.sm,
        textAlign: 'center'
    },
    statText: {
        ...TEXT.xl,
        textAlign: 'center'
    },
    statSubText: {
        ...TEXT.sm
    },
    latLng: {
        ...TEXT.lg,
        textAlign: 'center',
        marginTop: normalise(5),
        ...TEXT.medium
    }
})