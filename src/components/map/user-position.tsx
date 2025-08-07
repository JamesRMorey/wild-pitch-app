import { UserLocation } from "@rnmapbox/maps";
import { useEffect, useState } from "react";

type PropsType = { onUpdate?: ()=>void }

export default function UserPosition ({ onUpdate=()=>{} } : PropsType) {

    const [render, setRender] = useState<boolean>(false);

    useEffect(() => {
        setTimeout(() => setRender(true), 2000);
    });

    if (!render) return;
    return (
        <UserLocation onUpdate={onUpdate}/>
    )
}