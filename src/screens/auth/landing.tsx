import { StyleSheet, View, Text, Image } from "react-native";
import { ASSET, SETTING } from "../../consts";
import { normalise } from "../../utils/helpers";
import { COLOUR, TEXT } from "../../styles";
import Button from "../../components/buttons/button";


type PropsType = { navigation: any }
export default function LandingScreen({ navigation } : PropsType) {

    const navigateToLogin = () => {
        navigation.navigate('login');
    }
    
    const navigateToRegister = () => {
        navigation.navigate('register');
    }
    
    return (
        <View 
            style={styles.container}
        >
            <Image 
                source={ASSET.LANDING_1} 
                style={styles.background}
                resizeMode="cover"
            />
            <View style={styles.top}>
                <Image
                    source={ASSET.LOGO_TEXT}
                    style={styles.image}
                />
            </View>
            <View style={styles.center}>
                <Text style={styles.title}>Sign up or Log in to access more from Wild Pitch</Text>
                <View style={styles.buttons}>
                    <Button
                        style="white"
                        onPress={navigateToRegister}
                        title="Register"
                    />
                    <Button
                        style="primary"
                        onPress={navigateToLogin}
                        title="Log in"
                    />
                </View>
            </View>
            <View style={styles.bottom}>
                <Text style={styles.privacyText}>Create routes, find new camping spots and download offline maps all for FREE with Wild Pitch.</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.white,
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
    center: {
        width: '100%',
        paddingHorizontal: normalise(70),
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    bottom: {
        width: '100%',
        paddingHorizontal: normalise(30),
        paddingBottom: normalise(40),
    },
    buttons: {
        width: '100%',
        justifyContent: 'center',
        gap: normalise(20),
        marginTop: normalise(30)
    },
    title: {
        ...TEXT.lg,
        ...TEXT.center,
        color: COLOUR.white,
        marginBottom: normalise(10),
        ...TEXT.medium,
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
        backgroundColor: COLOUR.white[500],
        paddingVertical: normalise(25),
        paddingHorizontal: normalise(35),
        borderRadius: normalise(40),
    },
    buttonText: {
        color: COLOUR.white,
        fontWeight: 500,
        ...TEXT.lg
    },
    privacyText: {
        ...TEXT.sm,
        color: COLOUR.white,
        ...TEXT.center
    }
});