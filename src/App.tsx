import MainTabs from '../src/navigation/main-tabs';
import { MapProvider } from '../src/contexts/map-context';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { RoutesProvider } from './contexts/routes-context';
import { PointsOfInterestProvider } from './contexts/pois-context';
import { MapPackGroupsProvider } from './contexts/map-pack-group-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './navigation/auth-stack';
import { useGlobalState } from './contexts/global-context';
import Linker from './Linker';
import { BookmarkedRoutesProvider } from './contexts/bookmarked-routes-context';

const Stack = createNativeStackNavigator();

const SCREEN_OPTIONS = { headerShown: false }

function App() {

    const { user } = useGlobalState();
    
	return (
        <View key={user?.id} style={{ flex: 1 }}>
            <PointsOfInterestProvider >
                <RoutesProvider>
                    <BookmarkedRoutesProvider>
                        <MapPackGroupsProvider>
                            <MapProvider>
                                <Linker>
                                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                        <Stack.Navigator initialRouteName="main">
                                            <Stack.Screen name="auth" component={AuthStack} options={{...SCREEN_OPTIONS, presentation: 'pageSheet' }}/>
                                            <Stack.Screen name="main" component={MainTabs} options={{...SCREEN_OPTIONS }}/>
                                        </Stack.Navigator>
                                    </TouchableWithoutFeedback>
                                </Linker>
                            </MapProvider>
                        </MapPackGroupsProvider>
                    </BookmarkedRoutesProvider>
                </RoutesProvider>
            </PointsOfInterestProvider>
        </View>
	);
}

export default App;