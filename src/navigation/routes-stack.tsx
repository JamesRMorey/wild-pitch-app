import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RouteBuilderScreen from '../screens/routes/route-builder';
import RouteSaveScreen from '../screens/routes/save';
import RouteDetailsScreen from '../screens/routes/route-details';
import RouteNavigationScreen from '../screens/routes/route-navigation';

const Stack = createNativeStackNavigator();

const SCREEN_OPTIONS = { headerShown: false }

export default function RoutesStack({}) {

    return (
        <Stack.Navigator>
            <Stack.Screen name="route-builder" component={RouteBuilderScreen} options={{...SCREEN_OPTIONS }}/>
            <Stack.Screen name="route-details" component={RouteDetailsScreen} options={{...SCREEN_OPTIONS }}/>
            <Stack.Screen name="route-navigation" component={RouteNavigationScreen} options={{...SCREEN_OPTIONS, presentation: 'fullScreenModal' }}/>
            <Stack.Screen name="route-save" component={RouteSaveScreen} options={{...SCREEN_OPTIONS, presentation: 'pageSheet' }}/>
        </Stack.Navigator>
    )
}