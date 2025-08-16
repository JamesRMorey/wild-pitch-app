import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PointOfInterestEditScreen from '../screens/point-of-interest/edit';
import PointOfInterestPointTypeScreen from '../screens/point-of-interest/point-type';

const Stack = createNativeStackNavigator();

const SCREEN_OPTIONS = { headerShown: false }

export default function PointOfInterestStack({}) {

    return (
        <Stack.Navigator>
            <Stack.Screen name="point-of-interest-edit" component={PointOfInterestEditScreen} options={{...SCREEN_OPTIONS, presentation: 'pageSheet' }}/>
            <Stack.Screen name="point-of-interest-point-type-selector" component={PointOfInterestPointTypeScreen} options={{...SCREEN_OPTIONS, presentation: 'card'}}/>
        </Stack.Navigator>
    )
}