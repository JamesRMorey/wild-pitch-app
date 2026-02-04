import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SavedTabsView from '../screens/saved/tab-view';
import AreaBuilderSaveAreaScreen from '../screens/area-builder/save-area';
import AreaBuilderScreen from '../screens/area-builder/builder';
import RouteDetailsScreen from '../screens/routes/route-details';
import RouteNavigationScreen from '../screens/routes/route-navigation';
import RouteBuilderScreen from '../screens/routes/route-builder';
import RouteSaveScreen from '../screens/routes/save';
import RoutesScreen from '../screens/saved/routes';

const Stack = createNativeStackNavigator();

const SCREEN_OPTIONS = { headerShown: false }

export default function SavedStack({}) {

    return (
        <Stack.Navigator>
            <Stack.Screen name="saved" component={SavedTabsView} options={{...SCREEN_OPTIONS }}/>
            <Stack.Screen name="area-builder" component={AreaBuilderScreen} options={{...SCREEN_OPTIONS, presentation: 'fullScreenModal' }}/>
            <Stack.Screen name="area-builder-save-area" component={AreaBuilderSaveAreaScreen} options={{...SCREEN_OPTIONS, presentation: 'pageSheet' }}/>
            <Stack.Screen name="route-builder" component={RouteBuilderScreen} options={{...SCREEN_OPTIONS }}/>
            <Stack.Screen name="route-save" component={RouteSaveScreen} options={{...SCREEN_OPTIONS, presentation: 'pageSheet' }}/>
            <Stack.Screen name="route-import" options={{...SCREEN_OPTIONS, presentation: 'pageSheet' }}>
                {(props) => <RouteSaveScreen {...props} popCount={1}/>}
            </Stack.Screen>
            <Stack.Screen name="route-details" component={RouteDetailsScreen} options={{...SCREEN_OPTIONS }}/>
            <Stack.Screen name="route-navigation" component={RouteNavigationScreen} options={{...SCREEN_OPTIONS, presentation: 'fullScreenModal' }}/>
        </Stack.Navigator>
    )
}