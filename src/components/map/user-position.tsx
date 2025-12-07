import { UserLocation } from "@rnmapbox/maps";
import { useEffect, useState } from "react";
import { Permission } from "../../services/permissions";

type PropsType = { onUpdate?: ( e: any )=>void }

export default function UserPosition ({ onUpdate=()=>{} } : PropsType) {

    const [render, setRender] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<number>(1);

    const checkLocationPermission = async () => {
        try {
            await Permission.location();
            setRender(true);
        } 
        catch (error) {
            setRender(false);
            console.error("Error checking location permission:", error);
        }
    }

    const triggerRefresh = () => {
        setRefresh(prev => prev + 1);
    }

    useEffect(() => {
        checkLocationPermission();
        setInterval(() => {
            triggerRefresh()
        }, 30000)
    }, []);

    if (!render) return;
    return (
        <UserLocation 
            onUpdate={onUpdate}
            showsUserHeadingIndicator={true}
            key={'user-location'}
        />
    )
}