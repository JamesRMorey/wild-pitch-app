import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from '../screens/map/map';
import MapSearchScreen from '../screens/map/search';
import PointOfInterestOverviewScreen from '../screens/point-of-interest/overview';
import PointOfInterestStack from './point-of-interest-stack';

const Stack = createNativeStackNavigator();

const SCREEN_OPTIONS = { headerShown: false }

export default function MapStack({}) {

    return (
        <Stack.Navigator>
            <Stack.Screen name="map" component={MapScreen} options={{...SCREEN_OPTIONS }}/>
            <Stack.Screen name="map-search" component={MapSearchScreen} options={{...SCREEN_OPTIONS, presentation: 'fullScreenModal' }}/>
            <Stack.Screen name="map-point-of-interest-overview" component={PointOfInterestOverviewScreen} options={{...SCREEN_OPTIONS, presentation: 'formSheet', sheetAllowedDetents: 'fitToContents' }}/>
            <Stack.Screen name="map-point-of-interest" component={PointOfInterestStack} options={{...SCREEN_OPTIONS, presentation: 'modal' }}/>
        </Stack.Navigator>
    )
}