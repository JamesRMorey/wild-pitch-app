import * as React from 'react';
import { StyleSheet, View, useWindowDimensions, Text } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import PacksScreen from './packs';
import PinsScreen from './pins';
import CustomTabView from '../../components/navigation/custom-tab-view';
import { SETTING, SHEET } from '../../consts';
import { COLOUR, TEXT } from '../../styles';
import { normalise } from '../../functions/helpers';
import IconButton from '../../components/buttons/icon-button';
import OptionsSheet from '../../sheets/options-sheet';
import { SheetManager } from 'react-native-actions-sheet';

const renderScene = SceneMap({
    packs: PacksScreen,
    pins: PinsScreen,
});

const ROUTES = [
    { key: 'packs', title: 'Offline maps' },
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

    const navigateToBuilder = () => {
        closeOptions();
        navigation.navigate('area-builder');
    }

    const closeOptions = () => {
        SheetManager.hide(SHEET.SAVED_OPTIONS)
    }

    const OPTIONS = [
        { label: 'Create Area', icon: 'map-outline', onPress: navigateToBuilder },
        { label: 'Create Pin', icon: 'location-outline', onPress: createPin },
    ];
    

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={TEXT.h1}>Saved</Text>
                <IconButton
                    icon={'add'}
                    onPress={openOptionsMenu}
                    iconOnly={true}
                />
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
        paddingHorizontal: normalise(20),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})