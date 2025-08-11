import { Animated, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { normalise } from '../../functions/helpers';
import { COLOUR, TEXT } from '../../styles';

export default function CustomTabView({ navigationState, position, jumpTo }) {

    const { index, routes } = navigationState
    const inputRange = routes.map((x, i) => i);

    return (
        <View style={styles.container}>
            <ScrollView horizontal={true} contentContainerStyle={styles.tabBar}>
                {routes.map((route, i) => {
                    const opacity = position.interpolate({
                        inputRange,
                        outputRange: inputRange.map((inputIndex) => inputIndex === i ? 1 : 0.5),
                    });

                    return (
                        <TouchableOpacity
                            key={i}
                            style={[
                                styles.tabItem,
                                index == i && styles.active
                            ]}
                            onPress={() => jumpTo(route.key)}
                        >
                            <Animated.Text style={[{ opacity }, styles.activeText]}>{route.title}</Animated.Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLOUR.white,
        borderBottomWidth: normalise(1),
        borderBottomColor: COLOUR.gray[300]
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: COLOUR.white,
    },
    tabItem: {
        alignItems: 'center',
        padding: normalise(15),
    },
    active: {
        borderBottomColor: COLOUR.wp_orange[500],
        borderBottomWidth: normalise(3)
    },
    activeText: {
        ...TEXT.medium
    }
})
