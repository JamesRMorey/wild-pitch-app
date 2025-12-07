import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { ASSET, SETTING } from "../../consts";
import { normalise } from "../../utils/helpers";
import * as Animatable from 'react-native-animatable';
import { COLOUR, OPACITY, SHADOW, TEXT } from "../../styles";
import Icon from "../../components/misc/icon";


type PropsType = { navigation: any }
export default function LandingScreen({ navigation } : PropsType) {

    const navigateToLogin = () => {
        navigation.navigate('login');
    }
    
    const navigateToRegister = () => {
        navigation.navigate('register');
    }
    
    return (
        <View style={styles.container}>
            <Animatable.Image 
                source={ASSET.LANDING_1} 
                style={styles.background}
                resizeMode="cover"
                animation={"fadeIn"}
                duration={2000}
                delay={300}
            />
            <View style={styles.top}>
                <Animatable.View
                    animation="fadeIn"
                    delay={700}
                >
                    <Image
                        source={ASSET.LOGO_TEXT}
                        style={styles.image}
                    />
                </Animatable.View>
            </View>
            <View style={styles.bottom}>
                <Animatable.View 
                    animation="fadeIn" 
                    delay={700}
                >
                    <Text style={styles.title}>Have a wild night</Text>
                    <Text style={styles.description}>Discover new places, download offline maps, and plan your next adventure with WildPitch maps.</Text>
                    <View 
                        style={styles.buttons}
                    >
                        <TouchableOpacity
                            style={styles.button}
                            activeOpacity={0.8}
                            onPress={navigateToRegister}
                        >
                            <Text style={styles.buttonText}>Get started</Text>
                            <View style={{ flexDirection: 'row', gap: normalise(7)}}>
                                <Icon
                                    icon="chevron-right"
                                    colour={COLOUR.white + OPACITY[40]}
                                    size={normalise(18)}
                                />
                                <Icon
                                    icon="chevron-right"
                                    colour={COLOUR.white + OPACITY[60]}
                                    size={normalise(18)}
                                />
                                <Icon
                                    icon="chevron-right"
                                    colour={COLOUR.white}
                                    size={normalise(18)}
                                />
                            </View>
                        </TouchableOpacity>
                        {/* <TouchableOpacity onPress={navigateToLogin} activeOpacity={0.7}>
                            <Text style={styles.loginText}>Already have an account? <Text style={styles.loginLink}>Login</Text></Text>
                        </TouchableOpacity> */}
                    </View>
                </Animatable.View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.wp_green[500],
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    background: {
        height: '100%',
        width: 'auto',
        position: 'absolute',
        zIndex: 0,
        aspectRatio: 900/1550,
        top: 0,
        left: 0,
    },
    top: {
        paddingTop: SETTING.TOP_PADDING + normalise(30),
        width: '100%',
        alignItems: 'center',
        zIndex: 10,
    },
    bottom: {
        width: '100%',
        padding: normalise(30),
        paddingBottom: normalise(40),
        zIndex: 10,
        // backgroundColor: COLOUR.white,
        borderTopLeftRadius: normalise(40),
        borderTopRightRadius: normalise(40),
        ...SHADOW.xl
    },
    buttons: {
        width: '100%',
        justifyContent: 'center',
        gap: normalise(20),
    },
    loginLink: {
        ...TEXT.h4,
        // color: COLOUR.white,
        ...TEXT.medium,
        textAlign: 'center',
    },
    loginText: {
        ...TEXT.md,
        // color: COLOUR.white,
        textAlign: 'center',
    },
    title: {
        fontSize: normalise(36),
        color: COLOUR.white,
        marginBottom: normalise(10),
        // ...TEXT.medium,
    },
    description: {
        ...TEXT.md,
        color: COLOUR.white,
        marginBottom: normalise(30),
    },
    image: {
        width: '40%',
        aspectRatio: 400/130,
        height: 'auto'
    },
    button: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: COLOUR.wp_green[500],
        paddingVertical: normalise(25),
        paddingHorizontal: normalise(35),
        borderRadius: normalise(40),
    },
    buttonText: {
        color: COLOUR.white,
        fontWeight: 500,
        ...TEXT.lg
    }
});