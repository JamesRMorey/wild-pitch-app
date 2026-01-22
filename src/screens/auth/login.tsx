import { StyleSheet, View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { ASSET, SETTING } from "../../consts";
import Button from "../../components/buttons/button";
import { useGlobalActions } from "../../contexts/global-context";
import { normalise, parseValidationErrors } from "../../utils/helpers";
import { COLOUR, TEXT } from "../../styles";
import TextInput from "../../components/inputs/text-input";
import KeyboardAvoidingView from "../../components/misc/keyboard-avoiding-view";
import Icon from "../../components/misc/icon";
import { useState } from "react";
import { object, string } from "yup";
import { FormErrors } from "../../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WildPitchApi } from "../../services/api/wild-pitch";
import * as Keychain from 'react-native-keychain';

const schema = object({
    email: string().required('Please enter your email').email('Please enter a valid email'),
    password: string().required('Please enter your password')
});

type PropsType = { navigation: any };
export default function LoginScreen({ navigation } : PropsType) {

    const [data, setData] = useState<{ email: string, password: string }>({
        email: '', 
        password: '' 
    });
    const [errors, setErrors] = useState<FormErrors>();
    const { setUser } = useGlobalActions();
    const [loading, setLoading] = useState<boolean>(false);

    const goBack = () => {
        navigation.goBack();
    }

    const navigateToRegister = () => {
        navigation.goBack();
    }

    const login = async () => {
        try {
            await schema.validate(data, { abortEarly: false });

            setLoading(true);
            setErrors(undefined);

            const { token, user } = await WildPitchApi.login(data);

            await AsyncStorage.setItem('user', JSON.stringify(user));
            await Keychain.setGenericPassword(user.email, token, {service: 'wild_pitch'});
            setUser(user);

            navigation.reset({
                index: 0,
                routes: [{ name: 'main' }],
            });
        }
        catch (err: any) {
            console.log(err)
            const errs = parseValidationErrors(err);
            setErrors(errs);
        }
        finally {
            setLoading(false)
        }
    }


    return (
        <KeyboardAvoidingView flex={true}>
            <View style={styles.container}>
                <ImageBackground
                    source={ASSET.BACKGROUND_SMALL_1}
                >
                    <View style={styles.top}>
                        <View>
                            <TouchableOpacity 
                                onPress={goBack}
                                style={styles.backButton}
                            >
                                <Icon
                                    icon="arrow-left"
                                    size={normalise(25)}
                                    colour={COLOUR.white}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.header}>
                            <Text style={styles.title}>Welcome Back</Text>
                            <Text style={styles.subtitle}>Time to plan that trip</Text>
                        </View>
                    </View>
                </ImageBackground>
                <View style={styles.bottom}>
                    <View>
                        <View style={styles.form}>
                            <TextInput
                                label="Email"
                                placeHolder="Email"
                                icon="mail"
                                value={data.email}
                                error={errors?.email?.[0]}
                                onChangeText={(text)=>setData({ ...data, email: text })}
                                onFocus={()=>setErrors({ ...errors, email: undefined })}
                            />
                            <TextInput
                                label="Password"
                                placeHolder="Password"
                                secureTextEntry={true}
                                icon="lock"
                                value={data.password}
                                error={errors?.password?.[0]}
                                onChangeText={(text)=>setData({ ...data, password: text })}
                                onFocus={()=>setErrors({ ...errors, password: undefined })}
                            />
                        </View>
                        <TouchableOpacity style={{ marginTop: normalise(15), marginBottom: normalise(30) }}>
                            <Text style={{ ...TEXT.md, textAlign: 'right' }}>Forgot your password?</Text>
                        </TouchableOpacity>
                        <Button
                            title="Login" 
                            onPress={login}
                            loading={loading}
                        />
                    </View>
                    <TouchableOpacity onPress={navigateToRegister} style={{ paddingTop: normalise(20) }}>
                        <Text style={styles.registerText}>Dont have an account? <Text style={styles.link}>Sign up</Text></Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.wp_brown[100],
        paddingBottom: normalise(30),
    },
    form: {
        gap: normalise(20),
        marginTop: normalise(30)
    },
    title: {
        ...TEXT.xxl,
        color: COLOUR.white
    },
    subtitle: {
        ...TEXT.p,
        color: COLOUR.white
    },
    header: {
        marginTop: normalise(60)
    },
    backButton: {
        paddingBottom: normalise(10),
        paddingRight: normalise(10),
    },
    top: {
        // backgroundColor: COLOUR.wp_brown[200],
        paddingTop: SETTING.TOP_PADDING,
        paddingHorizontal: normalise(20),
        paddingBottom: normalise(15),
    },
    bottom: {
        flex: 1,
        paddingHorizontal: normalise(20),
        justifyContent: 'space-between',
    },
    link: {
        ...TEXT.md,
        ...TEXT.medium
    },
    registerText: {
        ...TEXT.md,
        textAlign: 'center'
    }
});