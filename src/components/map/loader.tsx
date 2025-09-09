import LoaderKitView from "react-native-loader-kit";
import { COLOUR, OPACITY } from "../../styles";
import * as Animatable from 'react-native-animatable';

export default function Loader({}) {

    return (
        <Animatable.View animation={'fadeIn'}>
            <LoaderKitView
                style={{ width: 40, height: 40 }}
                name={'BallPulse'}
                animationSpeedMultiplier={0.6}
                color={COLOUR.black + OPACITY[50]}
            />
        </Animatable.View>
    )
}