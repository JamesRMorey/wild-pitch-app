import Mapbox from "@rnmapbox/maps";
import { MapService } from "../../services/map-service";
import { useCallback, useEffect, useMemo } from "react";
import { Route } from "../../models/route";
import { COLOUR, OPACITY } from "../../styles";
import { useMapPackDownload } from "../../hooks/useMapPackDownload";
import { useFocusEffect } from "@react-navigation/native";

type PropsType = { route: Route }
export default function RouteDownloadArea({ route } : PropsType) {
    
    const areaGeoJson = useMemo(() => MapService.squareAreaGeoJson(route.getBounds()), [route]);
    const { downloaded, setPack, checkDownloaded } = useMapPackDownload({
        mapPack: route.getMapPack()
    });

    useEffect(() => {
        setPack(route.getMapPack());
        checkDownloaded();
    }, [route]);

    useFocusEffect(
        useCallback(() => {
            setPack(route.getMapPack());
            checkDownloaded();
        }, [])
    );

    if (!downloaded) return null;
    return (
        <Mapbox.ShapeSource 
            id={route.getMapPackName()}
            shape={areaGeoJson}
        >
            <Mapbox.FillLayer
                id="square-fill"
                style={{
                    fillColor: COLOUR.wp_orange[500] + OPACITY[10],
                    fillOutlineColor: COLOUR.wp_orange[500],
                }}
            />
            <Mapbox.SymbolLayer
                id="square-label"
                style={{
                    textField: "Offline area",
                    textSize: 10,
                    textColor: COLOUR.wp_orange[500],
                    textHaloColor: COLOUR.white,
                    textHaloWidth: 1,
                    textAllowOverlap: true,
                    textIgnorePlacement: true,
                }}
            />
        </Mapbox.ShapeSource>
    )
}