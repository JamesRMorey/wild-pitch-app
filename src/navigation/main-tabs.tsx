import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabNavigator from '../components/navigation/custom-tab-navigator';
import SavedStack from './saved-stack';
import ProfileScreen from '../screens/profile/profile';
import MapStack from './map-stack';
import HomeScreen from '../screens/explore/home';
import ExploreStack from './explore-stack';
import { NAVIGATOR } from '../consts';

const Tab = createBottomTabNavigator();

const SCREEN_OPTIONS = { headerShown: false }

export default function MainTabs({}) {

    return (
        <Tab.Navigator tabBar={props => <CustomTabNavigator {...props} />} initialRouteName='map' >
            <Tab.Screen name="home" component={HomeScreen} options={{...SCREEN_OPTIONS, tabBarIcon: 'tent-tree', displayName: 'Home', requiresLogin: false}}/>
            <Tab.Screen name={NAVIGATOR.MAIN_TABS.EXPLORE} component={ExploreStack} options={{...SCREEN_OPTIONS, tabBarIcon: 'route', displayName: 'Explore', requiresLogin: false}}/>
            <Tab.Screen name="map" component={MapStack} options={{...SCREEN_OPTIONS, tabBarIcon: 'map', displayName: 'Map', requiresLogin: false}}/>
            <Tab.Screen name={NAVIGATOR.MAIN_TABS.SAVED} component={SavedStack} options={{...SCREEN_OPTIONS, tabBarIcon: 'folder', displayName: 'Saved', requiresLogin: true}}/>
            <Tab.Screen name="account" component={ProfileScreen} options={{...SCREEN_OPTIONS, tabBarIcon: 'user', displayName: 'Profile', requiresLogin: true}}/>
        </Tab.Navigator>
    )
}