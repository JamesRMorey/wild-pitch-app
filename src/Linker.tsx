import { useEffect, useRef } from 'react';
import { GPX } from './services/gpx';
import { Linking, Alert } from 'react-native';
import { useRoutesActions } from './contexts/routes-context';
import { RouteService } from './services/route-service';
import { useNavigation } from '@react-navigation/native';
import { Route } from './types';
import { delay } from './utils/helpers';
import { useMapActions } from './contexts/map-context';

type PropsType = { children: any }
export default function Linker ({ children } : PropsType) {

    const { create: createRoute } = useRoutesActions();
    const { setActiveRoute, fitToRoute } = useMapActions();
    const navigation = useNavigation();
    const initialURLProcessed = useRef<boolean>(false);

    const confirmImport = async ( data: Route ) => {
        const route = await createRoute(data);
        //@ts-ignore
        navigation.navigate('map');
        await delay(500);
        setActiveRoute(route);
        fitToRoute(route);
    }

    const importRoute = async (event: any) => {
        if (!event.url) return;

        const url = event.url;
        if (!url || !url.endsWith('.gpx')) return;

        const data = await GPX.readFile(url);
        const routeData = RouteService.parseGPX(data);
        
        if (routeData) {
            Alert.alert(
                'Import GPX file', 
                'Are you sure you want to import this GPX file to your account?',
                [
                    { text: 'Cancel', onPress: () => {}},
                    { text: 'Confirm', onPress: () => confirmImport(routeData)}
                ],
            )
        }
        else {
            Alert.alert('Error', 'Looks like the import wasn\'t in the right format.');
        }
    }

    useEffect(() => {
        const urlListener = Linking.addEventListener("url", importRoute);
        
        Linking.getInitialURL().then(async (url) => {
            if (url != null && !initialURLProcessed.current) {
                await importRoute({ url });
                initialURLProcessed.current = true;
            }
        });

        return () => {
            urlListener.remove();
        }
    }, [])
    
	return (
        <>
        {children}
        </>
	);
}