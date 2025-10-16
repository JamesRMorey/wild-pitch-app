import MainTabs from '../src/navigation/main-tabs';
import { MapProvider } from '../src/contexts/map-context';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import AuthStack from '../src/navigation/auth-stack';
import { useGlobalState } from './contexts/global-context';
import { RoutesProvider } from './contexts/routes-context';
import { PointsOfInterestProvider } from './contexts/pois-context';
import { MapPackGroupsProvider } from './contexts/map-pack-group-context';

function App() {

    const { user } = useGlobalState();
    
	return (
		<>
        {user ?
            <PointsOfInterestProvider>
                <RoutesProvider>
                    <MapPackGroupsProvider>
                        <MapProvider>
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                <MainTabs />
                            </TouchableWithoutFeedback>
                        </MapProvider>
                    </MapPackGroupsProvider>
                </RoutesProvider>
            </PointsOfInterestProvider>
            :
            <AuthStack />
            }
        </>
	);
}

export default App;