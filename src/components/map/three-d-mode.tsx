import Mapbox from "@rnmapbox/maps";
import { useEffect, useState } from "react";


export default function ThreeDMode() {

    const [ready, setReady] = useState(false);

    useEffect(() => {
        setReady(true);
    }, [])

    if (!ready) return null;

    return (
        <Mapbox.RasterDemSource
            id="mapbox-dem"
            url="mapbox://mapbox.mapbox-terrain-dem-v1"
            tileSize={512}
        >
            <Mapbox.Terrain
                exaggeration={3}
                sourceID="mapbox-dem"
            />
        </Mapbox.RasterDemSource>
    )
}