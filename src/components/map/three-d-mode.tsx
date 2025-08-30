import Mapbox from "@rnmapbox/maps";


export default function ThreeDMode() {
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