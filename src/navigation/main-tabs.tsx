import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabNavigator from '../components/navigation/custom-tab-navigator';
import SavedStack from './saved-stack';
import ProfileScreen from '../screens/profile/profile';
import MapStack from './map-stack';
import ExploreScreen from '../screens/explore/explore';

const Tab = createBottomTabNavigator();

const SCREEN_OPTIONS = { headerShown: false }

export default function MainTabs({}) {

    return (
        <Tab.Navigator tabBar={props => <CustomTabNavigator {...props} />} initialRouteName='map' >
            <Tab.Screen name="home" component={ExploreScreen} options={{...SCREEN_OPTIONS, tabBarIcon: 'tent-tree', displayName: 'Explore', requiresLogin: false}}/>
            <Tab.Screen name="map" component={MapStack} options={{...SCREEN_OPTIONS, tabBarIcon: 'map', displayName: 'Map', requiresLogin: false}}/>
            <Tab.Screen name="saved" component={SavedStack} options={{...SCREEN_OPTIONS, tabBarIcon: 'folder', displayName: 'Saved', requiresLogin: true}}/>
            <Tab.Screen name="account" component={ProfileScreen} options={{...SCREEN_OPTIONS, tabBarIcon: 'user', displayName: 'Profile', requiresLogin: true}}/>
        </Tab.Navigator>
    )
}