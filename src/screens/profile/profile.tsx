import { ScrollView, StyleSheet, View, Text } from "react-native"
import { normalise } from "../../functions/helpers"
import { COLOUR, TEXT } from "../../styles";
import { SETTING } from "../../consts";
import SectionItemCard from "../../components/cards/section-item-card";


export default function ProfileScreen() {

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={TEXT.h1}>Profile</Text>
            </View>
            <ScrollView
                contentContainerStyle={styles.scrollContainerContent}
                style={styles.scrollContainer}
            >
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Community</Text>
                    <SectionItemCard
                        title="Follow our adventures"
                        icon="logo-instagram"
                    />
                    <SectionItemCard
                        title="About Wild Pitch"
                        icon="telescope-outline"
                    />
                    <SectionItemCard
                        title="Invite friends"
                        icon="link-outline"
                    />
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Follow us</Text>
                    <SectionItemCard
                        title="Follow us on Instagram"
                        icon="logo-instagram"
                    />
                    <SectionItemCard
                        title="Visit our website"
                        icon="globe-outline"
                    />
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support us</Text>
                    <SectionItemCard
                        title="Provide feedback on the app"
                        icon="chatbox-ellipses-outline"
                    />
                    <SectionItemCard
                        title="Buy me a coffee?"
                        icon="cafe-outline"
                    />
                    <SectionItemCard
                        title="Shop Wild Pitch"
                        icon="storefront-outline"
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
    }
})