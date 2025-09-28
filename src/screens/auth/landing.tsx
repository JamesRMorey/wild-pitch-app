import { ImageBackground, StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { ASSET, SETTING } from "../../consts";
import Button from "../../components/buttons/button";
import { useGlobalActions } from "../../contexts/global-context";
import { normalise } from "../../functions/helpers";
import * as Animatable from 'react-native-animatable';
import { COLOUR, SHADOW, TEXT } from "../../styles";


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
            {/* <Animatable.Image 
                source={ASSET.LANDING_1} 
                style={styles.background}
                resizeMode="cover"
                animation={"fadeIn"}
                duration={2000}
                delay={500}
            /> */}
            <View style={styles.top}>
                {/* <Animatable.View
                    animation="fadeInUp"
                    delay={700}
                >
                    <Image
                        source={ASSET.LOGO_WHITE}
                        style={styles.image}
                    />
                </Animatable.View> */}
            </View>
            <View style={styles.bottom}>
                <Animatable.View 
                    animation="fadeIn" 
                    delay={700}
                >
                    <Text style={styles.title}>Have A Wild Night</Text>
                    <Text style={styles.description}>Discover new places and plan your next adventure with WildPitch Maps.</Text>
                    <View 
                        style={styles.buttons}
                    >
                        <Button 
                            title="Get started" 
                            onPress={navigateToRegister}
                        />
                        <TouchableOpacity onPress={navigateToLogin} activeOpacity={0.7}>
                            <Text style={styles.loginText}>Already have an account? <Text style={styles.loginLink}>Login</Text></Text>
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.wp_brown[200],
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
        paddingTop: SETTING.TOP_PADDING + normalise(40),
        width: '100%',
        alignItems: 'center',
        zIndex: 10,
    },
    bottom: {
        width: '100%',
        padding: normalise(45),
        paddingBottom: normalise(40),
        zIndex: 10,
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
        fontSize: normalise(40),
        // color: COLOUR.white,
        marginBottom: normalise(10),
        textAlign: 'center',
    },
    description: {
        ...TEXT.md,
        // color: COLOUR.white,
        textAlign: 'center',
        marginBottom: normalise(30),
        ...SHADOW.lg,
        paddingHorizontal: normalise(30)
    },
    image: {
        width: '50%',
        aspectRatio: 1,
        height: 'auto'
    }
});