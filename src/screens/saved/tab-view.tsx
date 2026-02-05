import { useMemo, useState }from 'react';
import { StyleSheet, View, useWindowDimensions, Text, TouchableOpacity, Alert } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import PacksScreen from './packs';
import PinsScreen from './pins';
import CustomTabView from '../../components/navigation/custom-tab-view';
import { SCREEN, SETTING, SHEET } from '../../consts';
import { COLOUR, TEXT } from '../../styles';
import { delay, normalise } from '../../utils/helpers';
import OptionsSheet from '../../sheets/options-sheet';
import { SheetManager } from 'react-native-actions-sheet';
import RoutesScreen from './routes';
import Icon from '../../components/misc/icon';
import Mapbox from '@rnmapbox/maps';
import { EventBus } from '../../services/event-bus';
import { useGlobalState } from '../../contexts/global-context';
import { useRoutesActions, useRoutesState } from '../../contexts/routes-context';
import { RouteData } from '../../types';
import BookmarkedRoutesScreen from './bookmarked-routes';
import { useBookmarkedRoutesActions, useBookmarkedRoutesState } from '../../contexts/bookmarked-routes-context';
import * as Animateable from 'react-native-animatable';

const renderScene = SceneMap({
    packs: PacksScreen,
    pins: PinsScreen,
    routes: RoutesScreen,
    bookmarkedRoutes: BookmarkedRoutesScreen
});

const ROUTES = [
    { key: 'routes', title: 'My routes' },
    { key: 'pins', title: 'My pins' },
    { key: 'bookmarkedRoutes', title: 'Bookmarks' },
    { key: 'packs', title: 'Maps' },
];

type PropsType = { navigation: any };
export default function SavedTabsView({ navigation } : PropsType) {
    
    const { user } = useGlobalState();
    const { syncing: routesSyncing } = useRoutesState();
    const { syncing: bookmarkedRoutesSyncing } = useBookmarkedRoutesState();
    const { sync: syncBookmarkedRoutes } = useBookmarkedRoutesActions();
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const { sync: syncRoutes, importFile: importRoute } = useRoutesActions();
    const isSyncing: boolean = useMemo(() => bookmarkedRoutesSyncing || routesSyncing, [bookmarkedRoutesSyncing, routesSyncing])

    const openOptionsMenu = () => {
        SheetManager.show(SHEET.SAVED_OPTIONS)
    }

    const openRouteBuilder = () => {
        closeOptions();
        navigation.navigate('route-builder');
    }

    const navigateToBuilder = async () => {
        await closeOptions();
        navigation.navigate('area-builder');
    }

    const closeOptions = async () => {
        await SheetManager.hide(SHEET.SAVED_OPTIONS)
    }

    const clearAllDownloadedMaps = () => {
        Mapbox.offlineManager.resetDatabase();
        EventBus.emit.packsRefresh();
        EventBus.emit.routesRefresh();
        closeOptions();
    }

    const routeImport = async () => {
        await SheetManager.hide(SHEET.SAVED_OPTIONS); 
        await delay(100);
        
        const routeData = await importRoute();
        if (!routeData) return;

        Alert.alert(
            'Import GPX file', 
            'Are you sure you want to import this GPX file to your account?',
            [
                { text: 'Cancel', onPress: () => {}},
                { text: 'Confirm', onPress: () => confirmRouteImport(routeData)}
            ],
        )
    }

    const confirmRouteImport = async ( data: RouteData ) => {
        navigation.navigate(SCREEN.SAVED.ROUTE_IMPORT, {
			route: data
		});
    }

    const syncProfile = () => {
        syncBookmarkedRoutes();
        syncRoutes();
        closeOptions();
    }

    const OPTIONS = [
        { label: 'Sync with cloud', icon: 'cloud-check', onPress: syncProfile },
        { label: 'Download map', icon: 'map', onPress: navigateToBuilder },
        { label: 'Create route', icon: 'route', onPress: openRouteBuilder },
        { label: 'Import route', icon: 'import', onPress: routeImport },
        { label: 'Clear all downloaded maps', icon: 'trash', colour: COLOUR.red[500], showArrow: false, onPress: clearAllDownloadedMaps },
    ];
    
    if (!user) return;
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={TEXT.h1}>Saved</Text>
                <TouchableOpacity 
                    onPress={openOptionsMenu}
                    style={styles.addButton}
                    disabled={isSyncing}
                >
                    {isSyncing ?
                    <Animateable.View animation={'rotate'} iterationCount={'infinite'}>
                        <Icon icon={'refresh-cw'} />
                    </Animateable.View>
                    :
                    <Icon icon={'plus'} />
                    }
                </TouchableOpacity>
            </View>
            <TabView
                renderTabBar={props => <CustomTabView {...props} />}
                navigationState={{ index: index, routes: ROUTES }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
            />
            <OptionsSheet
                id={SHEET.SAVED_OPTIONS}
                options={OPTIONS}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: SETTING.TOP_PADDING,
        backgroundColor: COLOUR.white
    },
    titleContainer: {
        paddingLeft: normalise(20),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    addButton: {
        paddingRight: normalise(20),
        paddingLeft: normalise(10),
    }
})