
import { Lucide } from "@react-native-vector-icons/lucide";
import { normalise } from "../../utils/helpers";
import { COLOUR } from "../../styles";

type PropsType = { icon: string, size?: number|string, colour?: string }
export default function Icon ({ icon, size=normalise(22), colour=COLOUR.black } : PropsType ) {
    
    return (
        <Lucide
            name={icon}
            color={colour}
            size={size}
        />        
    )
}