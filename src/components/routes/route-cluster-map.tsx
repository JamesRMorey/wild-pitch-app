import Mapbox from "@rnmapbox/maps"
import { COLOUR } from "../../styles"
import { PositionArray, RouteSearchResult } from "../../types";
import { useRef } from "react";
import Icon from "../misc/icon";
import { ASSET } from "../../consts";


type PropsType = { id?: string, routes: any, onRoutePress?: (route: RouteSearchResult) => void, onClusterPress?: (clusterCoordinates: PositionArray) => void };
export default function RouteClusterMap({ id="routes-cluster", routes, onRoutePress, onClusterPress } : PropsType) {

    const shapeRef = useRef<Mapbox.ShapeSource>(null);

    const handlePress = async (e: any) => {
        const feature = e.features[0];
        const isCluster = feature?.properties?.cluster ?? false;
        
        if (isCluster) {
            if (!onClusterPress || !shapeRef.current) return;

            const clusterPoints = await shapeRef.current.getClusterChildren(feature);
            const clusterCoordinates = clusterPoints.features.map((pt: any) => pt.geometry.coordinates);

            onClusterPress(clusterCoordinates)
            return;
        }
        
        if (!onRoutePress) return;
        onRoutePress({
            id: feature.properties?.id,
            name: 'test',
            slug: feature.properties?.slug,
            latitude: feature.geometry.coordinates[1],
            longitude: feature.geometry.coordinates[0],
        });
    }

    return (
        <>
            <Mapbox.ShapeSource
                id={id}
                shape={routes}
                ref={shapeRef}
                cluster
                clusterRadius={50}
                onPress={handlePress}
            >
                <Mapbox.CircleLayer
                    id="clusteredPoints"
                    filter={["has", "point_count"]}
                    style={{
                        circleColor: COLOUR.blue[500],
                        circleRadius: 20,
                        circleOpacity: 0.8,
                        circleStrokeWidth: 2,
                        circleStrokeColor: COLOUR.white,
                    }}
                />
                <Mapbox.SymbolLayer
                    id="clusterCount"
                    filter={["has", "point_count"]}
                    style={{
                        textField: "{point_count}",
                        textSize: 14,
                        textColor: "#fff",
                        textIgnorePlacement: true,
                        textAllowOverlap: true,
                    }}
                />
                <Mapbox.CircleLayer
                    id="singlePoint"
                    filter={["!", ["has", "point_count"]]}
                    style={{
                        circleColor: COLOUR.blue[500],
                        circleOpacity: 0.8,
                        circleRadius: 15,
                        circleStrokeWidth: 2,
                        circleStrokeColor: COLOUR.white,
                    }}
                />
                <Mapbox.SymbolLayer
                    id="singlePointFlag"
                    filter={["!", ["has", "point_count"]]}
                    style={{
                        iconImage: "flag",
                        iconSize: 0.4,
                        iconAllowOverlap: true,
                        iconIgnorePlacement: true,
                    }}
                />
            </Mapbox.ShapeSource>
        </>
    )
}