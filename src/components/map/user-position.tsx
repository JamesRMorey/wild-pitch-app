import { UserLocation } from "@rnmapbox/maps";
import { useEffect, useState } from "react";
import { Permission } from "../../services/permissions";

type PropsType = { onUpdate?: ( e: any )=>void }

export default function UserPosition ({ onUpdate=()=>{} } : PropsType) {

    const [render, setRender] = useState<boolean>(false);

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

    useEffect(() => {
        checkLocationPermission();
    }, []);

    if (!render) return;
    return (
        <UserLocation 
            onUpdate={onUpdate}
            // showsUserHeadingIndicator={true}
            key={'user-location'}
        />
    )
}