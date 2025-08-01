import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SimpleLineIcons as Icon } from "@react-native-vector-icons/simple-line-icons";
import { COLOUR } from '../../styles';

export default function CustomTabNavigator({ state, descriptors, navigation }) {

    return (
        <View style={styles.bottomNavContainer}>
            <View style={styles.bottomNav}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const icon = options.tabBarIcon;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            // The `merge: true` option makes sure that the params inside the tab screen are preserved
                            navigation.navigate({ name: route.name, merge: true });
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    return (
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}
                            key={index}
                        >
                            <Icon 
                                name={icon}
                                color={isFocused ? COLOUR.black : COLOUR.gray[300]}
                                style={[
                                    styles.tabIcon,
                                    isFocused && styles.focused
                                ]} 
                                size={25} />
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: COLOUR.white,
        paddingTop: 20,
        paddingBottom: 25,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0
    },
    bottomNavContainer: {
        backgroundColor: 'white',
    },
    tabIcon: {
    },
    focused: {
    }
})
