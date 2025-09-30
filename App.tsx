import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import BootSplash from "react-native-bootsplash";
import { useEffect } from 'react';
import { GlobalProvider } from './src/contexts/global-context';
import App from './src/App';

export default function AppWrapper() {

	useEffect(() => {
		setTimeout(() => {
			BootSplash.hide()
		}, 500)
	}, [])

	return (
		<NavigationContainer theme={{...DefaultTheme, colors: {...DefaultTheme.colors, text: "#111827"}}}>
			<GlobalProvider>
				<App />
			</GlobalProvider>
		</NavigationContainer>
	);
}