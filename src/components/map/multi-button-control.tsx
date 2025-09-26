import { StyleSheet, View } from "react-native"
import IconButton from "../buttons/icon-button"
import { COLOUR, OPACITY, SHADOW } from "../../styles"

type PropsType = { items: Array<{ icon: string, onPress: () => void }> }
export default function MultiButtonControl({ items } : PropsType) {
    
    return (
        <View style={styles.container}>
            {items.map((item, index) => {
                return (
                    <View key={index}>
                        <IconButton
                            icon={item.icon}
                            onPress={item.onPress}
                            iconOnly={true}
                        />
                        {index < items.length - 1 && (
                            <View style={styles.break} />
                        )}
                    </View>
                )
            })}
        </View>
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