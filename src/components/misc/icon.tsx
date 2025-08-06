
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { normalise } from "../../functions/helpers";
import { COLOUR } from "../../styles";

export default function Icon ({ icon, size=normalise(22), colour=COLOUR.black } : { icon: string, size?: number, colour?: string }) {
    
    return (
        <Ionicons
            name={icon}
            color={colour}
            size={size}
        />        
    )
}