import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from '../screens/map/map';
import PointOfInterestStack from './point-of-interest-stack';
import AreaBuilderSaveAreaScreen from '../screens/area-builder/save-area';
import AreaBuilderScreen from '../screens/area-builder/builder';

const Stack = createNativeStackNavigator();

const SCREEN_OPTIONS = { headerShown: false }

export default function MapStack({}) {

    return (
        <Stack.Navigator>
            <Stack.Screen name="map" component={MapScreen} options={{...SCREEN_OPTIONS }}/>
            <Stack.Screen name="map-point-of-interest" component={PointOfInterestStack} options={{...SCREEN_OPTIONS, presentation: 'pageSheet' }}/>
            <Stack.Screen name="area-builder" component={AreaBuilderScreen} options={{...SCREEN_OPTIONS, presentation: 'fullScreenModal' }}/>
            <Stack.Screen name="area-builder-save-area" component={AreaBuilderSaveAreaScreen} options={{...SCREEN_OPTIONS, presentation: 'pageSheet' }}/>
        </Stack.Navigator>
    )
}