
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { normalise } from "../../functions/helpers";
import { COLOUR } from "../../styles";

type PropsType = { icon: string, size?: number|string, colour?: string }
export default function Icon ({ icon, size=normalise(22), colour=COLOUR.black } : PropsType ) {
    
    return (
        <Ionicons
            name={icon}
            color={colour}
            size={size}
        />        
    )
}