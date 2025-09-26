import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingScreen from '../screens/auth/landing';
import LoginScreen from '../screens/auth/login';
import RegisterScreen from '../screens/auth/register';

const Stack = createNativeStackNavigator();

const SCREEN_OPTIONS = { headerShown: false }

export default function AuthStack({}) {

    return (
        <Stack.Navigator>
            <Stack.Screen name="landing" component={LandingScreen} options={{...SCREEN_OPTIONS }}/>
            <Stack.Screen name="login" component={LoginScreen} options={{...SCREEN_OPTIONS }}/>
            <Stack.Screen name="register" component={RegisterScreen} options={{...SCREEN_OPTIONS }}/>
        </Stack.Navigator>
    )
}