import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RoutesScreen from '../screens/routes/routes';
import RouteBuilderScreen from '../screens/routes/route-builder/route-builder';
import RouteSaveScreen from '../screens/routes/route-builder/save';
import RouteDetailsScreen from '../screens/routes/route-details';
import RouteNavigationScreen from '../screens/routes/route-navigation';

const Stack = createNativeStackNavigator();

const SCREEN_OPTIONS = { headerShown: false }

export default function RoutesStack({}) {

    return (
        <Stack.Navigator>
            <Stack.Screen name="routes-map" component={RoutesScreen} options={{...SCREEN_OPTIONS }}/>
            <Stack.Screen name="route-builder" component={RouteBuilderScreen} options={{...SCREEN_OPTIONS }}/>
            <Stack.Screen name="route-details" component={RouteDetailsScreen} options={{...SCREEN_OPTIONS }}/>
            <Stack.Screen name="route-navigation" component={RouteNavigationScreen} options={{...SCREEN_OPTIONS, presentation: 'fullScreenModal' }}/>
            <Stack.Screen name="route-save" component={RouteSaveScreen} options={{...SCREEN_OPTIONS, presentation: 'pageSheet' }}/>
        </Stack.Navigator>
    )
}