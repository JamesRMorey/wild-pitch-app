import { useEffect, useRef } from 'react';
import { GPX } from './services/gpx';
import { Linking } from 'react-native';
import { useRoutesActions } from './contexts/routes-context';
import { RouteService } from './services/route-service';
import { useNavigation } from '@react-navigation/native';

type PropsType = { children: any }
export default function Linker ({ children } : PropsType) {

    const { create: createRoute } = useRoutesActions();
    const navigation = useNavigation();
    const initialURLProcessed = useRef<boolean>(false);

    const importRoute = async (event: any) => {
        if (!event.url) return;

        const url = event.url;
        if (!url || !url.endsWith('.gpx')) return;

        const data = await GPX.readFile(url);
        const routeData = RouteService.parseGPX(data);
        console.log(routeData);
        const route = await createRoute(routeData);

        //@ts-ignore
        navigation.navigate('saved', {
            screen: 'saved'
        });
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