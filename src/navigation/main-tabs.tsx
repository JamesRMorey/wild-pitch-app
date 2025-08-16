import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabNavigator from '../components/navigation/custom-tab-navigator';
import SavedStack from './saved-stack';
import ProfileScreen from '../screens/profile/profile';
import MapStack from './map-stack';

const Tab = createBottomTabNavigator();

const SCREEN_OPTIONS = { headerShown: false }

export default function MainTabs({}) {

    return (
        <Tab.Navigator tabBar={props => <CustomTabNavigator {...props} />} >
            <Tab.Screen name="home" component={ProfileScreen} options={{...SCREEN_OPTIONS, tabBarIcon: 'home', displayName: 'Home'}}/>
            <Tab.Screen name="madp" component={ProfileScreen} options={{...SCREEN_OPTIONS, tabBarIcon: 'play', displayName: 'Track'}}/>
            <Tab.Screen name="map" component={MapStack} options={{...SCREEN_OPTIONS, tabBarIcon: 'map', displayName: 'Map'}}/>
            <Tab.Screen name="saved" component={SavedStack} options={{...SCREEN_OPTIONS, tabBarIcon: 'folder', displayName: 'Saved'}}/>
            <Tab.Screen name="account" component={ProfileScreen} options={{...SCREEN_OPTIONS, tabBarIcon: 'person', displayName: 'Profile'}}/>
        </Tab.Navigator>
    )
}