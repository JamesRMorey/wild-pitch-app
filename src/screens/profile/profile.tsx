import { ScrollView, StyleSheet, View, Text, Share, Linking, Image, Alert } from "react-native"
import { delay, normalise } from "../../utils/helpers"
import { COLOUR, TEXT } from "../../styles";
import { ASSET, SETTING } from "../../consts";
import SectionItemCard from "../../components/cards/section-item-card";
import { useGlobalActions, useGlobalState } from "../../contexts/global-context";
import { WildPitchApi } from "../../services/api/wild-pitch";

type PropsType = { navigation: any };
export default function ProfileScreen({ navigation } : PropsType) {

    const { user } = useGlobalState();
    const { logout } = useGlobalActions();
    const wpApi = new WildPitchApi();

    const shareWithFriends = () => {
        Share.share({
            message: 'Check out Wild Pitch Maps! The best app for discovering and sharing walking and hiking routes. Download it now from https://wildpitchmaps.com',
            title: 'Wild Pitch Maps'
        });
    }

    const follow = () => {
        Linking.openURL('https://www.instagram.com/wildpitch_camping/');
    }

    const buyCoffee = () => {
        Linking.openURL('https://buymeacoffee.com/wildpitch');
    }

    const confirmDeleteAccount = async() => {
        try {
            await wpApi.deleteAccount();
        }
        catch (error) {
            console.log(error)
        }
        finally {
            handleLogout();
        }
    }
    
    const deleteAccount = () => {
        Alert.alert(
            'Delete your account?', 
            'Are you sure you want to delete your account? This is irreversible.',
            [
                { text: 'Keep', onPress: () => {}},
                { text: 'Delete', onPress: confirmDeleteAccount},
            ],
        )
    }

    const handleLogout = async () => {
        await navigation.navigate('map');
        await delay(200);
        logout();
    }

    if (!user) return;
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={TEXT.h1}>Profile</Text>
            </View>
            <ScrollView
                contentContainerStyle={styles.scrollContainerContent}
                style={styles.scrollContainer}
            >
                <View style={[styles.section, {alignItems: 'center' }]}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={ASSET.LOGO}
                            style={styles.profileImage}
                        />
                    </View>
                    <View style={{ marginTop: normalise(15)}}>
                        <Text style={styles.name}>{user.name}</Text>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Community</Text>
                    <SectionItemCard
                        title="Follow our adventures"
                        icon="instagram"
                        onPress={follow}
                    />
                    {/* <SectionItemCard
                        title="About Wild Pitch"
                        icon="telescope"
                    /> */}
                    <SectionItemCard
                        title="Invite friends"
                        icon="link"
                        onPress={shareWithFriends}
                        last={true}
                    />
                </View>
                {/* <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Follow us</Text>
                    <SectionItemCard
                        title="Follow us on Instagram"
                        icon="logo-instagram"
                        onPress={follow}
                    />
                    <SectionItemCard
                        title="Visit our website"
                        icon="globe"
                    />
                </View> */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support us</Text>
                    <SectionItemCard
                        title="Provide feedback on the app"
                        icon="message-circle-more"
                        onPress={follow}
                        last={true}
                    />
                    {/* <SectionItemCard
                        title="Buy me a coffee?"
                        icon="coffee"
                        onPress={buyCoffee}
                        last={true}
                    /> */}
                    {/* <SectionItemCard
                        title="Shop Wild Pitch"
                        icon="storefront"
                        last={true}
                    /> */}
                </View>
                <View style={[styles.section]}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <SectionItemCard
                        title="Delete your account"
                        icon="user-x"
                        onPress={deleteAccount}
                    />
                    <SectionItemCard
                        title="Logout"
                        icon="log-out"
                        onPress={handleLogout}
                        last={true}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: SETTING.TOP_PADDING,
        backgroundColor: COLOUR.white,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: normalise(10),
        paddingHorizontal: normalise(20),
        borderBottomWidth: normalise(2),
        borderBottomColor: COLOUR.wp_brown[100]
    },
    scrollContainer: {
        backgroundColor: COLOUR.wp_brown[100]
    },
    scrollContainerContent: {
        gap: normalise(10),
        backgroundColor: COLOUR.wp_brown[100],
        paddingTop: normalise(8)
    },
    sectionTitle: {
        ...TEXT.h3,
        ...TEXT.semiBold,
        marginBottom: normalise(20)
    },
    section: {
        backgroundColor: COLOUR.white,
        padding: normalise(20)
    },
    imageContainer: {
        width: normalise(150),
        height: normalise(150),
        borderWidth: normalise(1),
        borderRadius: normalise(75),
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: COLOUR.wp_brown[200]
    },
    profileImage: {
        aspectRatio: 1,
        height: 'auto',
        width: '60%',
    },
    name: {
        ...TEXT.lg,
        ...TEXT.medium
    }
})