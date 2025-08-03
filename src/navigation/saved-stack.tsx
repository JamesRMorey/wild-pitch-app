import AreaBuilderScreen from '../screens/area-builder/builder';
import PacksScreen from '../screens/saved/packs';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const SCREEN_OPTIONS = { headerShown: false }

export default function SavedStack({}) {

    return (
        <Stack.Navigator>
            <Stack.Screen name="packs" component={PacksScreen} options={{...SCREEN_OPTIONS, headerShown: true, title: "Saved" }}/>
            <Stack.Screen name="area-builder" component={AreaBuilderScreen} options={{...SCREEN_OPTIONS}}/>
        </Stack.Navigator>
    )
}