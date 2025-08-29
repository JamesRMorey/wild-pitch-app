import { NavigationContainer } from '@react-navigation/native';
import MainTabs from './src/navigation/main-tabs';
import { MapProvider } from './src/contexts/map-context';
import { MapPackProvider } from './src/contexts/map-pack-context';
import BootSplash from "react-native-bootsplash";
import { useEffect } from 'react';

function App() {

	useEffect(() => {
		setTimeout(() => {
			BootSplash.hide()
		}, 1000)
	}, [])

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