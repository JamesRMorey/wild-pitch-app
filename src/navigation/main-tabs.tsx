import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabNavigator from '../components/navigation/custom-tab-navigator';
import SavedStack from './saved-stack';
import ProfileScreen from '../screens/profile/profile';
import MapStack from './map-stack';
import RoutesStack from './routes-stack';

const Tab = createBottomTabNavigator();

const SCREEN_OPTIONS = { headerShown: false }

export default function MainTabs({}) {

    return (
        <Tab.Navigator tabBar={props => <CustomTabNavigator {...props} />} initialRouteName='map' >
            <Tab.Screen name="home" component={ProfileScreen} options={{...SCREEN_OPTIONS, tabBarIcon: 'search', displayName: 'Explore'}}/>
            <Tab.Screen name="routes" component={RoutesStack} options={{...SCREEN_OPTIONS, tabBarIcon: 'walk', displayName: 'Routes'}}/>
            <Tab.Screen name="map" component={MapStack} options={{...SCREEN_OPTIONS, tabBarIcon: 'map', displayName: 'Map'}}/>
            <Tab.Screen name="saved" component={SavedStack} options={{...SCREEN_OPTIONS, tabBarIcon: 'folder', displayName: 'Saved'}}/>
            <Tab.Screen name="account" component={ProfileScreen} options={{...SCREEN_OPTIONS, tabBarIcon: 'person', displayName: 'Profile'}}/>
        </Tab.Navigator>
    )
}