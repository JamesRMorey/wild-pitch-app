import { StyleSheet, Text, View } from "react-native";
import { PointOfInterest } from "../../types";
import { getDistanceBetweenPoints, normalise } from "../../functions/helpers";
import { TEXT } from "../../styles";
import { useEffect, useState } from "react";
import { Format } from "../../services/formatter";
import { MapService } from "../../services/map-service";
import useUserPosition from "../../hooks/useUserPosition";
import Header from "../../components/sheets/header";
import { usePointsOfInterest } from "../../hooks/usePointsOfInterest";


export default function PointOfInterestNavigation({ point, onBack } : { point: PointOfInterest, onBack: ()=>void }) {

    const { userPosition } = useUserPosition();
    const { update } = usePointsOfInterest();
    const [distanceAway, setDistanceAway] = useState<number>();
    const [relativeBearing, setRelativeBearing] = useState<number>();
    const [elevation, setElevation] = useState<number>();
    const [elevationGain, setElevationGain] = useState<number>();
    const [loading, setLoading] = useState<any>({
        distance: false,
        bearing: false,
        elevation: false,
        elevationGain: false
    });

    const calculateDistanceAway = () => {
        if (!userPosition) return;
        const distance = getDistanceBetweenPoints(
            { latitude: userPosition.latitude, longitude: userPosition.longitude },
            { latitude: point.latitude, longitude: point.longitude },
        );
        setDistanceAway(distance)
    }

    const updateHeading = () => {
        if (!userPosition) return;
        const rel = MapService.relativeBearing(userPosition, point);
        setRelativeBearing(rel);
    }

    const calculateElevation = async () => {
        try {
            if (!elevation) {
                setLoading(prev => ({ ...prev, elevation: true }));
            }
            // if (point.elevation) {
            //     setElevation(point.elevation);
            //     return;
            // }

            const elev = await MapService.getPointElevation({ latitude: point.latitude, longitude: point.longitude });
            if (!elev) return;

            setElevation(elev);
            
            if (point.id) {
                update({ ...point, elevation: elev });
            }
        }
        catch(err) {
        }
        finally {
            setLoading(prev => ({ ...prev, elevation: false }));
        }
    }

    const calculateElevationGain = async () => {
        if (!userPosition || !elevation || elevationGain) return;
        
        try {
            setLoading(prev => ({ ...prev, elevationGain: true }));

            const userElev = await MapService.getPointElevation({ latitude: userPosition.latitude, longitude: userPosition.longitude });
            if (!userElev) return;

            const gain = elevation - userElev;
            setElevationGain(gain);
        }
        catch(err) {}
        finally {
            setLoading(prev => ({ ...prev, elevationGain: false }));
        }
    }


    useEffect(() => {
        calculateDistanceAway();
        updateHeading();
    }, [userPosition]);

    useEffect(() => {
        calculateElevation();
    }, [point]);

    useEffect(() => {
        calculateElevationGain();
    }, [userPosition, elevation]);

    return (
        <View style={styles.container}>
            <Header
                title={point.name}
                onBack={onBack}
            />
            <View style={styles.statContainer}>
                <View style={styles.stat}>
                    <Text style={styles.statLabel}>Distance away</Text>
                    <Text style={styles.statText}>{distanceAway ? Format.formatMetersToKM(distanceAway) : '...'}<Text style={styles.statSubText}>km</Text></Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statLabel}>Elevation</Text>
                    {(loading.elevation || !elevation) ?
                    <Text style={styles.statText}>...<Text style={styles.statSubText}></Text></Text>
                    :
                    <View style={styles.elevationBox}>
                        <Text style={styles.statText}>
                            { elevation }
                            <Text style={styles.statSubText}>m</Text>
                        </Text>
                        <View>
                            <View style={styles.elevationGainText}>
                                {loading.elevationGain || !elevationGain ?
                                <Text style={TEXT.xs}>...</Text>
                                :
                                <Text style={TEXT.xs}>{elevationGain > 0 ? '+' : null}{`${elevationGain}m`}</Text>
                                }
                            </View>
                        </View>
                    </View>
                    }
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statLabel}>Bearing</Text>
                    <Text style={styles.statText}>{relativeBearing ? relativeBearing.toFixed(0) : '...' }<Text style={styles.statSubText}>{relativeBearing ? Format.compass(relativeBearing) : null}</Text></Text>
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
    },
    elevationGainText: {
        position: 'absolute',
        bottom: '60%',
        left: normalise(-5),
        width: 40
    },
    elevationBox: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    }
})