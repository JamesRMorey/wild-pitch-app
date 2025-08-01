import { NavigationContainer } from '@react-navigation/native';
import MainTabs from './src/navigation/main-tabs';
import { MapProvider } from './src/contexts/map-context';
import { MapPackProvider } from './src/contexts/map-pack-context';

function App() {

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
