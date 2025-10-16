import * as React from 'react';
import { StyleSheet, View, useWindowDimensions, Text, TouchableOpacity } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import PacksScreen from './packs';
import PinsScreen from './pins';
import CustomTabView from '../../components/navigation/custom-tab-view';
import { SETTING, SHEET } from '../../consts';
import { COLOUR, TEXT } from '../../styles';
import { normalise } from '../../functions/helpers';
import OptionsSheet from '../../sheets/options-sheet';
import { SheetManager } from 'react-native-actions-sheet';
import RoutesScreen from './routes';
import Icon from '../../components/misc/icon';
import Mapbox from '@rnmapbox/maps';
import { EventBus } from '../../services/event-bus';
import { useMapPackGroupsActions } from '../../contexts/map-pack-group-context';
import { useRoutesActions } from '../../contexts/routes-context';

const renderScene = SceneMap({
    packs: PacksScreen,
    pins: PinsScreen,
    routes: RoutesScreen
});

const ROUTES = [
    { key: 'packs', title: 'Offline maps' },
    { key: 'routes', title: 'Routes' },
    { key: 'pins', title: 'Pins' },
];

type PropsType = { navigation: any };
export default function SavedTabsView({ navigation } : PropsType) {
    
    const layout = useWindowDimensions();
    const [index, setIndex] = React.useState(0);

    const openOptionsMenu = () => {
        SheetManager.show(SHEET.SAVED_OPTIONS)
    }

    const createPin = () => {
        closeOptions();
        navigation.navigate('map');
    }

    const createRoute = () => {
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

    const OPTIONS = [
        { label: 'Download map', icon: 'map-outline', onPress: navigateToBuilder },
        { label: 'Add pin', icon: 'location-outline', onPress: createPin },
        { label: 'Create route', icon: 'walk-outline', onPress: createRoute },
        { label: 'Clear all downloaded maps', icon: 'trash-outline', colour: COLOUR.red[500], showArrow: false, onPress: clearAllDownloadedMaps },
    ];
    

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={TEXT.h1}>Saved</Text>
                <TouchableOpacity 
                    onPress={openOptionsMenu}
                    style={styles.addButton}
                >
                    <Icon
                        icon={'add'}
                    />
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