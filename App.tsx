import { NavigationContainer } from '@react-navigation/native';
import MainTabs from './src/navigation/main-tabs';
import { MapProvider } from './src/contexts/map-context';
import { MapPackProvider } from './src/contexts/map-pack-context';
// import SplashScreen from 'react-native-splash-screen'

function App() {

	// SplashScreen.show()

	return (
		<NavigationContainer>
			<MapProvider>
				<MapPackProvider>
					<MainTabs />
				</MapPackProvider>
			</MapProvider>
		</NavigationContainer>
	);
}

export default App;