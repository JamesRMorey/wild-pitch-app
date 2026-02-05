import { Image, ScrollView, StyleSheet, Text, View, Alert } from "react-native";
import { COLOUR, TEXT } from "../../styles";
import { useGlobalActions, useGlobalState } from "../../contexts/global-context";
import { ASSET, NAVIGATOR, SCREEN, SETTING } from "../../consts";
import { normalise } from "../../utils/helpers";
import { useMemo } from "react";
import LearnCard from "../../components/cards/learn-card";
import ImageBackgroundCard from "../../components/cards/image-background-card";
import { useRoutesActions } from "../../contexts/routes-context";
import Icon from "../../components/misc/icon";
import { RouteData } from "../../types";

type PropsType = { navigation: any }
export default function HomeScreen({ navigation } : PropsType) {

	const { user } = useGlobalState();
	const { verifyLogin } = useGlobalActions();
	const { importFile: importRoute } = useRoutesActions();

	const FEATURES_CARDS = useMemo(() => [
		{ title: 'Explore the map', text: 'Add places, routes & pins to your map.', buttonText: 'Get started', icon: 'flag', colour: COLOUR.wp_green, onPress: ()=>exploreMap },
		{ title: 'Find a route', text: 'Explore our small collection of routes.', buttonText: 'Get started', icon: 'bookmark', colour: COLOUR.blue, onPress: ()=>exploreRoutes() },
		{ title: 'Import a route', text: 'Import GPX route files directly into Wild Pitch!', buttonText: 'Get started', icon: 'import', colour: COLOUR.wp_purple, onPress: ()=>routeImport() },
		{ title: 'Offline things', text: 'Save everything offline. See what you have saved here.', buttonText: 'Get started', icon: 'cloud-download', colour: COLOUR.wp_yellow, onPress: ()=>navigateToSaved() },
	], []);

	
	const exploreRoutes =  async() => {
		navigation.navigate(NAVIGATOR.MAIN_TABS.EXPLORE, { screen: SCREEN.EXPLORE.MAP });
	}

	const navigateToSaved = () => {
		if (!verifyLogin()) return;
		navigation.navigate(NAVIGATOR.MAIN_TABS.SAVED)
	}

	const exploreMap = () => {
		navigation.navigate('map')
	}

	const routeImport = async () => {
		if (!verifyLogin()) return;
		
		const routeData = await importRoute();
		if (!routeData) return;

		Alert.alert(
			'Import GPX file', 
			'Are you sure you want to import this GPX file to your account?',
			[
				{ text: 'Cancel', onPress: () => {}},
				{ text: 'Confirm', onPress: () => confirmRouteImport(routeData)}
			],
		)
	}

	const confirmRouteImport = async ( data: RouteData ) => {
		await navigation.navigate(NAVIGATOR.MAIN_TABS.SAVED);
		await navigation.navigate(NAVIGATOR.MAIN_TABS.SAVED, {
			screen: SCREEN.SAVED.ROUTE_IMPORT,
			params: { route: data }
		});
	}

	// const routeSelected = async (route: Route) => {
	// 	await navigation.navigate('map', { screen: 'map' });
	// 	await delay(500);
	// 	setActiveRoute(route);
	// 	fitToRoute(route);
	// }

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
			<View style={styles.titleContainer}>
				{user ?
				<Text style={TEXT.h1}>Welcome back {user.name.split(' ')[0] ?? null}</Text>
				:
				<Text style={TEXT.h1}>Welcome to Wild Pitch</Text>
				}
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
					<Text style={[TEXT.p, { paddingHorizontal: normalise(20) }]}>A good scout is always prepared</Text>
				</View>
				<ScrollView 
					contentContainerStyle={styles.sectionScroll} 
					horizontal={true} 
					showsHorizontalScrollIndicator={false}
				>
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
			{/* <FeaturedRoutes
				onRouteSelected={(route) => routeSelected(route)}
				title={'Find a wild camping route'}
				subTitle={'A route from the Wild Pitch community. These routes come with great wild camping spots.'}
			/> */}
			<View style={[styles.section]}>
				<View style={styles.sectionTitleContainer}>
					<Text style={[styles.sectionTitle]}>What's New</Text>
					<View style={styles.bullet}>
						<Icon icon="dot"></Icon>
						<View style={styles.bulletDesc}>
							<Text style={[TEXT.p]}>Sync your account with our cloud.</Text>
						</View>
					</View>
					<View style={styles.bullet}>
						<Icon icon="dot"></Icon>
						<View style={styles.bulletDesc}>
							<Text style={[TEXT.p]}>Share your routes publically with other Wild Pitch members.</Text>
						</View>
					</View>
					<View style={styles.bullet}>
						<Icon icon="dot"></Icon>
						<View style={styles.bulletDesc}>
							<Text style={[TEXT.p]}>Discover new routes from other Wild Pitch Members via the explore page.</Text>
						</View>
					</View>
				</View>
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
	},
	bullet: {
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		flexDirection: 'row',
		gap: normalise(5)
	},
	bulletDesc: {
		flex: 1, 
		marginTop: normalise(4)
	}
});