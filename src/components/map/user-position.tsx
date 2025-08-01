import { UserLocation } from "@rnmapbox/maps";
import { useEffect, useState } from "react";


export default function UserPosition ({}) {

    const [render, setRender] = useState<boolean>(false);

    useEffect(() => {
        setTimeout(() => setRender(true), 2000);
    });

    if (!render) return;
    return (
        <UserLocation />
    )
}