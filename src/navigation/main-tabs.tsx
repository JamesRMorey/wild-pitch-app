import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PacksScreen from '../screens/packs';
import MapScreen from '../screens/map';
import CustomTabNavigator from '../components/navigation/custom-tab-navigator';

const Tab = createBottomTabNavigator();

const SCREEN_OPTIONS = { headerShown: false }

export default function MainTabs({}) {

    return (
        <Tab.Navigator tabBar={props => <CustomTabNavigator {...props} />} >
            <Tab.Screen name="map" component={MapScreen} options={{...SCREEN_OPTIONS, tabBarIcon: 'map'}}/>
            <Tab.Screen name="packs" component={PacksScreen} options={{...SCREEN_OPTIONS, tabBarIcon: 'cloud-download'}}/>
        </Tab.Navigator>
    )
}