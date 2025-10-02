import LoaderKitView from "react-native-loader-kit";
import { COLOUR, OPACITY } from "../../styles";
import * as Animatable from 'react-native-animatable';
import { normalise } from "../../functions/helpers";

type PropsType = { size?: number, colour?: string }
export default function Loader({ size=normalise(40), colour=COLOUR.black + OPACITY[50] } : PropsType) {

    return (
        <Animatable.View animation={'fadeIn'}>
            <LoaderKitView
                style={{ width: size, height: size }}
                name={'BallPulse'}
                animationSpeedMultiplier={0.6}
                color={colour}
            />
        </Animatable.View>
    )
}