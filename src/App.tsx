import MainTabs from '../src/navigation/main-tabs';
import { MapProvider } from '../src/contexts/map-context';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { RoutesProvider } from '../src/contexts/routes-context';
import AuthStack from '../src/navigation/auth-stack';
import { useGlobalState } from './contexts/global-context';

function App() {

    const { user } = useGlobalState();
    
	return (
		<>
        {user ?
            <MapProvider>
                <RoutesProvider>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <MainTabs />
                    </TouchableWithoutFeedback>
                </RoutesProvider>
            </MapProvider>
            :
            <AuthStack />
            }
        </>
	);
}

export default App;