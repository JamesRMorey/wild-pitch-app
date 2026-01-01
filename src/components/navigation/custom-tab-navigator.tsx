import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { COLOUR, TEXT } from '../../styles';
import { normalise } from '../../utils/helpers';
import Icon from '../misc/icon';
import { useGlobalActions } from '../../contexts/global-context';

export default function CustomTabNavigator({ state, descriptors, navigation }) {

    const { verifyLogin } = useGlobalActions();

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
                    const name = options.displayName;
                    const requiresLogin = options.requiresLogin ?? false;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        if (requiresLogin) {
                            if (!verifyLogin()) return;
                        }
                        
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
                                icon={isFocused ? icon : `${icon}`}
                                colour={isFocused ? COLOUR.wp_green[500] : COLOUR.gray[900]}
                                size={normalise(22)}
                            />
                            {name && (
                                <Text style={[styles.text, isFocused && { color: COLOUR.wp_green[500] }]}>{name}</Text>
                            )}
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
        paddingTop: normalise(10),
        paddingBottom: normalise(30),
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopWidth: normalise(1),
        borderTopColor: COLOUR.gray[200]
    },
    bottomNavContainer: {
        backgroundColor: 'white',
    },
    tabIcon: {
    },
    focused: {
    },
    text: {
        ...TEXT.xs,
        fontWeight: 600,
        color: COLOUR.wp_brown[700]
    }
})
