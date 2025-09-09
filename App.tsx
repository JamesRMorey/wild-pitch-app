import { NavigationContainer } from '@react-navigation/native';
import MainTabs from './src/navigation/main-tabs';
import { MapProvider } from './src/contexts/map-context';
import BootSplash from "react-native-bootsplash";
import { useEffect } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { RoutesProvider } from './src/contexts/routes-context';

function App() {

	useEffect(() => {
		setTimeout(() => {
			BootSplash.hide()
		}, 2000)
	}, [])

	return (
		<NavigationContainer>
			<MapProvider>
				<RoutesProvider>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<MainTabs />
					</TouchableWithoutFeedback>
				</RoutesProvider>
			</MapProvider>
		</NavigationContainer>
	);
}

export default App;