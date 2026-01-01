import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import BootSplash from "react-native-bootsplash";
import { useEffect, useState } from 'react';
import { GlobalProvider } from './src/contexts/global-context';
import App from './src/App';
import migrations from './src/migrations'; 
import { Migration } from './src/migrations/migration';

export default function AppWrapper() {

	const [ready, setReady] = useState<boolean>(false);

	const runMigrations = async (): Promise<void> => {
		for (const migration of migrations) {
			const mig = new Migration(migration);
			mig.run();
		}
	}
	
	const hideBootSpash = () => {
		setTimeout(() => BootSplash.hide({ fade: true }), 3000)
	}

	const setup = async (): Promise<void> => {
		await runMigrations();
		setReady(true);
		hideBootSpash();
	}

	useEffect(() => {
		setup();
	}, [])

	if (!ready) return null;
	return (
		<NavigationContainer theme={{...DefaultTheme, colors: {...DefaultTheme.colors, text: "#111827"}}}>
			<GlobalProvider>
				<App />
			</GlobalProvider>
		</NavigationContainer>
	);
}