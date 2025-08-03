import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from '../screens/map';
import CustomTabNavigator from '../components/navigation/custom-tab-navigator';
import SavedStack from './saved-stack';

const Tab = createBottomTabNavigator();

const SCREEN_OPTIONS = { headerShown: false }

export default function MainTabs({}) {

    return (
        <Tab.Navigator tabBar={props => <CustomTabNavigator {...props} />} >
            <Tab.Screen name="map" component={MapScreen} options={{...SCREEN_OPTIONS, tabBarIcon: 'map'}}/>
            <Tab.Screen name="saved" component={SavedStack} options={{...SCREEN_OPTIONS, tabBarIcon: 'folder'}}/>
        </Tab.Navigator>
    )
}