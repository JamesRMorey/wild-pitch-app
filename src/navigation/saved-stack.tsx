import AreaBuilderScreen from '../screens/area-builder/builder';
import PacksScreen from '../screens/saved/packs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SavedTabsView from '../screens/saved/tab-view';

const Stack = createNativeStackNavigator();

const SCREEN_OPTIONS = { headerShown: false }

export default function SavedStack({}) {

    return (
        <Stack.Navigator>
            <Stack.Screen name="saved" component={SavedTabsView} options={{...SCREEN_OPTIONS }}/>
            <Stack.Screen name="area-builder" component={AreaBuilderScreen} options={{...SCREEN_OPTIONS }}/>
        </Stack.Navigator>
    )
}