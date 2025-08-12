import * as React from 'react';
import { StyleSheet, View, useWindowDimensions, Text } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import PacksScreen from './packs';
import PinsScreen from './pins';
import CustomTabView from '../../components/navigation/custom-tab-view';
import { SETTING } from '../../consts';
import { COLOUR, TEXT } from '../../styles';
import { normalise } from '../../functions/helpers';
import IconButton from '../../components/buttons/icon-button';

const renderScene = SceneMap({
    packs: PacksScreen,
    pins: PinsScreen,
});

const routes = [
    { key: 'packs', title: 'Offline maps' },
    { key: 'pins', title: 'Pins' },
];

export default function SavedTabsView({ navigation }) {
    const layout = useWindowDimensions();
    const [index, setIndex] = React.useState(0);

    const navigateToBuilder = () => {
        navigation.navigate('area-builder')
    }

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={TEXT.h1}>Saved</Text>
                <IconButton
                    icon={'add'}
                    onPress={navigateToBuilder}
                    iconOnly={true}
                />
            </View>
            <TabView    
                renderTabBar={props => <CustomTabView {...props} />}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
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