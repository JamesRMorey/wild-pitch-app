import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { COLOUR, TEXT } from "../../styles";
import { useGlobalState } from "../../contexts/global-context";
import { ASSET, SETTING, SHEET } from "../../consts";
import { delay, normalise } from "../../utils/helpers";
import { useMemo } from "react";
import LearnCard from "../../components/cards/learn-card";
import ImageBackgroundCard from "../../components/cards/image-background-card";
import PillCard from "../../components/cards/pill";
import { SheetManager } from "react-native-actions-sheet";

type PropsType = { navigation: any }
export default function ExploreScreen({ navigation } : PropsType) {

	const { user } = useGlobalState();
	const FEATURES_CARDS = useMemo(() => [
		{ title: 'Plan a route', text: 'Plan & plot your own routes.', buttonText: 'Get started', icon: 'route', colour: COLOUR.blue, onPress: ()=>navigation.navigate('map') },
		{ title: 'Download a map', text: 'Don\'t get lost when signal runs out.', buttonText: 'Get started', icon: 'cloud-download', colour: COLOUR.wp_purple, onPress: ()=>navigation.navigate('map') },
		{ title: 'Save a route', text: 'Explore our small collection of routes.', buttonText: 'Get started', icon: 'bookmark', colour: COLOUR.wp_yellow, onPress: ()=>exploreRoutes() },
		{ title: 'Explore the map', text: 'Add places & pins to your map.', buttonText: 'Get started', icon: 'flag', colour: COLOUR.wp_green, onPress: ()=>navigation.navigate('map') },
	], []);
	const LEARN_PILLS = useMemo(() => [
		{ text: 'Maps', onPress: ()=>{}, colour: COLOUR.wp_purple[500] },
		{ text: 'Routes', onPress: ()=>{}, colour: COLOUR.blue[500] },
		{ text: 'Pins', onPress: ()=>{}, colour: COLOUR.wp_green[500] },
	], []);

	const exploreRoutes =  async() => {
		navigation.navigate('map');
		await delay(300);
		SheetManager.show(SHEET.MAP_SEARCH)
	}


    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
			<View style={styles.titleContainer}>
				<Text style={TEXT.h1}>Welcome back {user.name.split(' ')[0] ?? null}</Text>
				<ImageBackgroundCard
					background={ASSET.LANDING_1}
					style={{ marginTop: normalise(15) }}
				>
					<Image
						source={ASSET.LOGO_TEXT_WHITE}
						style={styles.logo}
					/>
					<Text style={[TEXT.p, { color: COLOUR.white, marginTop: normalise(10) }]}>Download offline routes & maps for FREE, so you don't get lost when signal runs out.</Text>
				</ImageBackgroundCard>
			</View>
			<View style={[styles.section, { paddingHorizontal: 0 }]}>
				<View style={styles.sectionTitleContainer}>
					<Text style={[styles.sectionTitle, { paddingLeft: normalise(20) }]}>Plan your adventure</Text>
					<Text style={[TEXT.p, { paddingLeft: normalise(20) }]}>A good scout is always prepared</Text>
				</View>
				<ScrollView contentContainerStyle={styles.sectionScroll} horizontal={true} showsHorizontalScrollIndicator={false}>
					{FEATURES_CARDS.map((card, i) => {
						return (
							<LearnCard
								key={i}
								title={card.title}
								text={card.text}
								icon={card.icon}
								buttonText={card.buttonText}
								colour={card.colour}
								onPress={card.onPress}
							/>
						)
					})}
				</ScrollView>
			</View>
			<View style={[styles.section, { paddingLeft: 0 }]}>
				<View style={styles.sectionTitleContainer}>
					<Text style={[styles.sectionTitle, { paddingLeft: normalise(20) }]}>Coming Soon</Text>
					<Text style={[TEXT.p, { paddingLeft: normalise(20) }]}>We're building a collection or routes and wild camping spots from the WP community. Help us by creating public routes and camping points in the app map.</Text>
					<Text style={[TEXT.p, { paddingLeft: normalise(20) }]}>All your routes and pins are private at the moment, but you'll have the option to share these with others soon :)</Text>
				</View>
				{/* <ScrollView contentContainerStyle={styles.sectionScroll} horizontal={true} showsHorizontalScrollIndicator={false}>
					{LEARN_PILLS.map((pill, i) => {
						return (
							<PillCard
								key={i}
								text={pill.text}
								colour={pill.colour}
								onPress={pill.onPress}
							/>
						)
					})}
				</ScrollView> */}
			</View>
		</ScrollView>            
    )
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: COLOUR.wp_brown[100],
		gap: normalise(15)
	},
	titleContainer: {
		paddingTop: SETTING.TOP_PADDING + normalise(20),
		backgroundColor: COLOUR.white,
		paddingHorizontal: normalise(20),
		paddingBottom: normalise(20)
	},
	sectionTitle: {
		...TEXT.h3,
	},
	section: {
		padding: normalise(20),
		backgroundColor: COLOUR.white,
		gap: normalise(15)
	},
	sectionScroll: {
		gap: normalise(15),
		paddingHorizontal: normalise(20)
	},
	logo: {
		width: '40%',
		height: 'auto',
		aspectRatio: 400/130
	},
	sectionTitleContainer: {
		gap: normalise(5)
	}
});