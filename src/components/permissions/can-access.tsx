import { useEffect, useState } from "react";
import { useGlobalState } from "../../contexts/global-context";

type PropsType = { children: any, permission: string }
export default function CanAccess({ children, permission } : PropsType) {

    const { user } = useGlobalState();
    const [granted, setGranted] = useState<boolean>(canAccess());

    function canAccess (): boolean {
        return user.role == permission;
    }

    useEffect(() => {
        if (user) setGranted(user.role === permission);
    }, [user, permission]);
    
    if (!granted) return;
    return children;
}