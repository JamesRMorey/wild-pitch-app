import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SavedTabsView from '../screens/saved/tab-view';
import AreaBuilderSaveAreaScreen from '../screens/saved/area-builder/save-area';
import AreaBuilderScreen from '../screens/saved/area-builder/builder';

const Stack = createNativeStackNavigator();

const SCREEN_OPTIONS = { headerShown: false }

export default function SavedStack({}) {

    return (
        <Stack.Navigator>
            <Stack.Screen name="saved" component={SavedTabsView} options={{...SCREEN_OPTIONS }}/>
            <Stack.Screen name="area-builder" component={AreaBuilderScreen} options={{...SCREEN_OPTIONS }}/>
            <Stack.Screen name="area-builder-save-area" component={AreaBuilderSaveAreaScreen} options={{...SCREEN_OPTIONS, presentation: 'pageSheet' }}/>
        </Stack.Navigator>
    )
}