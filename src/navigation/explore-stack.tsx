import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RouteBuilderScreen from '../screens/routes/route-builder';
import RouteSaveScreen from '../screens/routes/save';
import RouteDetailsScreen from '../screens/routes/route-details';
import RouteNavigationScreen from '../screens/routes/route-navigation';
import { SCREEN } from '../consts';
import ExploreMapScreen from '../screens/explore/explore-map';

const Stack = createNativeStackNavigator();

const SCREEN_OPTIONS = { headerShown: false }

export default function ExploreStack({}) {

    return (
        <Stack.Navigator>
            <Stack.Screen name={SCREEN.EXPLORE.MAP} component={ExploreMapScreen} options={{...SCREEN_OPTIONS }}/>
            <Stack.Screen name={SCREEN.EXPLORE.ROUTE_DETAILS}component={RouteDetailsScreen} options={{...SCREEN_OPTIONS }}/>
            <Stack.Screen name={SCREEN.EXPLORE.ROUTE_NAVIGATION} component={RouteNavigationScreen} options={{...SCREEN_OPTIONS, presentation: 'fullScreenModal' }}/>
            <Stack.Screen name={SCREEN.EXPLORE.ROUTE_BUILDER} component={RouteBuilderScreen} options={{...SCREEN_OPTIONS }}/>
            <Stack.Screen name={SCREEN.EXPLORE.ROUTE_SAVE} component={RouteSaveScreen} options={{...SCREEN_OPTIONS, presentation: 'pageSheet' }}/>
        </Stack.Navigator>
    )
}