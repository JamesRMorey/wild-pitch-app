import { StyleSheet, View } from "react-native"
import IconButton from "../buttons/icon-button"
import { COLOUR, OPACITY, SHADOW } from "../../styles"
import * as Animatable from 'react-native-animatable';

type PropsType = { items: Array<{ icon: string, onPress: () => void, disabled?: boolean }> }
export default function MultiButtonControl({ items } : PropsType) {
    
    return (
        <Animatable.View style={styles.container} animation={'fadeIn'}>
            {items.map((item, index) => {
                return (
                    <View key={index}>
                        <IconButton
                            icon={item.icon}
                            onPress={item.onPress}
                            iconOnly={true}
                            disabled={item.disabled ?? false}
                        />
                        {index < items.length - 1 && (
                            <View style={styles.break} />
                        )}
                    </View>
                )
            })}
        </Animatable.View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: COLOUR.white,
        borderRadius: 100,
        ...SHADOW.md
    },
    break : {
        height: 1,
        backgroundColor: COLOUR.black + OPACITY[50]
    }
})