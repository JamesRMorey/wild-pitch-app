import { StyleSheet, Text, View } from "react-native";
import Mapbox from '@rnmapbox/maps';
import { useRef, useState } from "react";
import UserPosition from "../../components/map/user-position";
import { normalise } from "../../utils/helpers";
import { ASSET, SCREEN, SETTING, SHEET } from "../../consts";
import { Bounds, Filters, PositionArray, RouteSearchResult } from "../../types";
import { Route } from "../../models/route";
import { SheetManager } from "react-native-actions-sheet";
import { COLOUR, TEXT } from "../../styles";
import useHaptic from "../../hooks/useHaptic";
import Button from "../../components/buttons/button";
import { useExploreMapActions, useExploreMapState } from "../../contexts/explore-map-context";
import { useMapSettings } from "../../hooks/useMapSettings";
import RouteLine from "../../components/routes/route-line";
import { RouteService } from "../../services/route-service";
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback";
import Loader from "../../components/map/loader";
import { Position } from "@rnmapbox/maps/lib/typescript/src/types/Position";
import ActiveRouteInformation from "../../components/routes/active-route-information";
import { WildPitchApi } from "../../services/api/wild-pitch";
import RouteClusterMap from "../../components/routes/route-cluster-map";
import IconButton from "../../components/buttons/icon-button";
import FiltersSheet from "../../sheets/filters-sheet";
import { useGlobalActions } from "../../contexts/global-context";

Mapbox.setAccessToken("pk.eyJ1IjoiamFtZXNtb3JleSIsImEiOiJjbHpueHNyb3IwcXd5MmpxdTF1ZGZibmkyIn0.MSmeb9T4wq0VfDwDGO2okw");

type PropsType = { navigation: any , route: any }
export default function ExploreMapScreen({ navigation } : PropsType) {

	const { verifyLogin } = useGlobalActions();
	const { styleURL, cameraRef, enable3DMode, activeRoute, filters } = useExploreMapState();
	const { flyTo, fitToRoute, fitToBounds, setActiveRoute, setFilters } = useExploreMapActions();
    const { initialRegion, updateUserPosition, loaded } = useMapSettings();
	const { tick } = useHaptic();
	const mapRef = useRef<Mapbox.MapView>(null);
	const [lineKey, setLineKey] = useState<number>(0);
	const [routes, setRoutes] = useState<{ type: string, features: Array<any>}>({
		type: 'FeatureCollection',
		features: []
	});
	const { debounce, cancel: cancelDebounce } = useDebouncedCallback();
	const [loading, setLoading] = useState<boolean>(false);
	const [currentBounds, setCurrentBounds] = useState<{ bounds: Bounds, zoom: number }>();
	const mapSearchEnabled = useRef<boolean>(true);
	
	const updateActiveRoute = ( route: Route, fit:boolean=true ) => {
		setActiveRoute(route);
		reDrawRoute();

		if (fit) {
			fitToRoute(route);
		}
	}

	const navigateToRoute = ( route: Route ) => {
		if (!verifyLogin()) return;
		navigation.navigate(SCREEN.EXPLORE.ROUTE_DETAILS, { route: route });
	}

	const reDrawRoute = () => {
		setLineKey((prev) => prev + 1);
	}

	const openFilters = () => {
		SheetManager.show(SHEET.EXPLORE_FILTERS)
	}

	const handleRouteSearchPress = async ( route: RouteSearchResult, fit:boolean=true ) => {
		try {
			mapSearchEnabled.current = false;
			setLoading(true);
			
			const data = await WildPitchApi.findRoute(route.server_id);			
			updateActiveRoute(new Route(data), fit);
		}
		catch(err) {
			console.error(err);
		}
		finally {
			setTimeout(() => setLoading(false), 300);
			setTimeout(() => mapSearchEnabled.current = true, 1000);
		}
	}

	const updateClusters = ( routesSearchResults: Array<RouteSearchResult> ) => {
		const clustered = routesSearchResults.map(r => {
			return {
				id: r.server_id,
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [r.longitude, r.latitude]
				},
				properties: {
					name: r.name,
					id: r.server_id,
				}
			}
		});
		
		setRoutes({
			type: 'FeatureCollection',
			features: clustered
		});
	}
	
	const handleMapRegionChange = async ( bounds: Bounds, zoom: number ) => {
		if (!mapSearchEnabled.current) return;

		const { ne, sw } = bounds;
		if (currentBounds && RouteService.boundsInsideBounds({ ne: ne, sw: sw }, currentBounds.bounds) && zoom < (currentBounds.zoom + 2)) return;

		const updatedFilters = {...filters, bounds: { ne: ne, sw: sw }};
		setFilters(updatedFilters);
		search(updatedFilters);

		setCurrentBounds({ bounds: { ne: ne, sw: sw }, zoom: zoom });
	}

	const search = async ( filt: Filters ) => {
		try {
			setLoading(true);
			const data = await WildPitchApi.searchRoutes({
				...filt,
				max_distance: filt.max_distance ? filt.max_distance * 1000 : undefined,
			});
			updateClusters(data);
		}
		catch (error) {
			console.error(error);
		}
		finally {
			setTimeout(() => {
				setLoading(false)
				tick();
			}, 300);
		}
	}

	const debouncedHandleMapRegionChange = debounce(handleMapRegionChange, 300);

	const handleClusterPress = ( points: Array<Position> ) => {
		if (points.length == 1) {
			flyTo([points[0][0], points[0][1]], SETTING.MAP_MARKER_ZOOM);
			return;
		}

		const bounds = RouteService.calculateBoundingBox(points.map(pt => ({ latitude: pt[1], longitude: pt[0] })));
		if (!bounds) return;

		fitToBounds(bounds.ne, bounds.sw, 100);
	}


    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
				<Mapbox.MapView
					style={styles.map}
					styleURL={styleURL}
					pitchEnabled={enable3DMode}
					ref={mapRef}
					attributionEnabled={true}
					attributionPosition={{ bottom: 6, left: 90 }}
					scaleBarPosition={{ bottom: 40,left: 15 }}
					onRegionIsChanging={(e) => {
						if (!mapSearchEnabled.current || activeRoute) {
							cancelDebounce();
							return;
						};

						debouncedHandleMapRegionChange({ ne: e.properties.visibleBounds[0], sw: e.properties.visibleBounds[1] }, e.properties.zoomLevel);
					}}
				>
					<Mapbox.Images images={{arrow: ASSET.ROUTE_LINE_ARROW, flag: ASSET.ROUTE_ICON}} />
					{initialRegion &&
						<Mapbox.Camera
							ref={(ref) => {
								if (ref) cameraRef.current = ref;
							}}
							centerCoordinate={[initialRegion.longitude, initialRegion.latitude]}
							zoomLevel={SETTING.ROUTE_DEFAULT_ZOOM}
							animationDuration={loaded ? 500 : 0}
						/>
					}
					{routes &&
						<RouteClusterMap
							id="routes-cluster"
							routes={routes}
							onRoutePress={(result: RouteSearchResult) => handleRouteSearchPress(result, false)}
							onClusterPress={(points: PositionArray) => handleClusterPress(points)}
						/>
					}
					{activeRoute &&
						<RouteLine
							key={`line-${lineKey}`}
							start={{ latitude: activeRoute.latitude, longitude: activeRoute.longitude }}
							end={activeRoute.markers[activeRoute.markers.length - 1]}
							markers={activeRoute.markers}
							lineKey={lineKey}
						/>
					}
					<UserPosition
						onUpdate={(e) => updateUserPosition(e.coords.latitude, e.coords.longitude)}
					/>
				</Mapbox.MapView>
				{loading && 
					<View style={[styles.controlsContainer, { left: '50%', top: SETTING.TOP_PADDING + normalise(30), transform: [{ translateX: '-50%' }]}]}>
						<Loader />
					</View>
				}
				{activeRoute &&
					<View style={styles.activeRouteContainer}>
						<View style={styles.activeRouteControls}>
							<IconButton
								icon={'expand'}
								onPress={() => fitToRoute(activeRoute)}
								shadow={true}
							/>
						</View>
						<ActiveRouteInformation
							route={activeRoute}
							onPress={() => navigateToRoute(activeRoute)}
							onClose={() => setActiveRoute()}
						/>
					</View>
				}
			</View>
            <View style={styles.bottomBar}>
				<View style={styles.resultsBox}>
					<View style={styles.resultsBoxResult}>
						<Text style={TEXT.md}>{routes?.features?.length ?? 0}</Text>
						<Text style={TEXT.xs}>Routes</Text>
					</View>
				</View>
                <View style={{ flex: 1 }}>
					<Button
						title="Filters"
						onPress={openFilters}
					/>
				</View>
            </View>
			<FiltersSheet
				id={SHEET.EXPLORE_FILTERS}
				onSearch={() => search(filters)}
			/>
        </View>
    )
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLOUR.wp_brown[100]
	},
	map: {
		flex: 1
	},
	controlsContainer: {
		position: 'absolute',
		gap: normalise(8),
		alignItems: 'flex-start',
		zIndex: 10,
	},
	controls: {
		gap: normalise(8),
	},
    bottomBar: {
        width: '100%',
        backgroundColor: COLOUR.white,
        paddingVertical: normalise(10),
        paddingHorizontal: normalise(15),
        borderTopWidth: normalise(1),
        borderTopColor: COLOUR.gray[200],
		flexDirection: 'row',
		gap: normalise(5)
	},
	activeRouteContainer: {
		position: 'absolute',
		bottom: normalise(20),
		left: 0,
		borderRadius: normalise(15),
		paddingHorizontal: normalise(20),
		width: '100%',
	},
	resultsBox: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		gap: normalise(5)
	},
	resultsBoxResult: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1
	},
	activeRouteControls: { 
		position: 'absolute', 
		right: normalise(20), 
		bottom: '100%', 
		paddingBottom: normalise(10)
	}
});