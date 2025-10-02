import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ImageBackground } from "react-native";
import { ASSET, SETTING } from "../../consts";
import Button from "../../components/buttons/button";
import { useGlobalActions } from "../../contexts/global-context";
import { normalise, parseValidationErrors } from "../../functions/helpers";
import { COLOUR, TEXT } from "../../styles";
import TextInput from "../../components/inputs/text-input";
import KeyboardAvoidingView from "../../components/misc/keyboard-avoiding-view";
import Icon from "../../components/misc/icon";
import { useMemo, useState } from "react";
import { object, string, ref } from "yup";
import { FormErrors } from "../../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RadioInput from "../../components/inputs/radio-input";
import { WildPitchApi } from "../../services/api/wild-pitch";
import * as Keychain from 'react-native-keychain';

const schema = object({
    name: string().required('Please enter your name'),
    email: string().required('Please enter your email').email('Please enter a valid email'),
    password: string().required('Please enter your password'),
    password_confirm: string()
        .when('password', {
            is: (password: string) => !!password,
            then: (schema) =>
                schema
                .required('Confirm password is required')
                .oneOf([ref('password')], 'Passwords must match'),
                otherwise: (schema) => schema.notRequired(),
        }),
});

type FormData = { name: string, email: string, password: string, password_confirm: string, gender: string, date_of_birth: string };
type PropsType = { navigation: any };
export default function RegisterScreen({ navigation } : PropsType) {

    const [data, setData] = useState<FormData>({ name: '', email: '', password: '', password_confirm: '', gender: '', date_of_birth: '' });
    const [errors, setErrors] = useState<FormErrors>();
    const { setUser } = useGlobalActions();
    const GENDER_OPTIONS = [
        { label: 'Male', value: 'male', icon: 'male-outline' },
        { label: 'Female', value: 'female', icon: 'female-outline' },
        { label: 'Other', value: 'other', icon: 'person-outline' }
    ];
    const [loading, setLoading] = useState<boolean>(false);
    const wpApi = useMemo(() => new WildPitchApi(), []);

    const goBack = () => {
        navigation.goBack();
    }

    const login = async () => {
        try {
            setLoading(true);
            setErrors(undefined);
            await schema.validate(data, { abortEarly: false });
            const { user, token } = await wpApi.register(data); 

            await AsyncStorage.setItem('user', JSON.stringify(user));
            await Keychain.setGenericPassword(user.email, token, {service: 'wp_api_bearer'});
            setUser(user);
        }
        catch (err: any) {
            const errs = parseValidationErrors(err);
            setErrors(errs);
        }
        finally {
            setLoading(false)
        }
    }


    return (
        <KeyboardAvoidingView style={styles.container}>
            <ImageBackground
                source={ASSET.LANDING_1}
            >
                <View style={styles.top}>
                    <View>
                        <TouchableOpacity 
                            onPress={goBack}
                            style={styles.backButton}
                        >
                            <Icon
                                icon="arrow-back-outline"
                                size={normalise(25)}
                                colour={COLOUR.white}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.header}>
                        <Text style={styles.title}>Get Started</Text>
                        <Text style={styles.subtitle}>Let's sign up and get going</Text>
                    </View>
                </View>
            </ImageBackground>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity activeOpacity={1} style={styles.bottom}>
                    <View>
                        <View style={styles.form}>
                            <TextInput
                                label="Name"
                                placeHolder="Name"
                                icon="person-outline"
                                error={errors?.name?.[0]}
                                onChangeText={(text)=>setData({ ...data, name: text })}
                                onFocus={()=>setErrors({ ...errors, name: undefined })}
                            />
                            <TextInput
                                label="Email"
                                placeHolder="Email"
                                icon="mail-outline"
                                error={errors?.email?.[0]}
                                onChangeText={(text)=>setData({ ...data, email: text })}
                                onFocus={()=>setErrors({ ...errors, email: undefined })}
                            />
                            <RadioInput
                                label="Gender"
                                options={GENDER_OPTIONS}
                                value={data.gender}
                                onChange={(value) => setData({ ...data, gender: value })}
                            />
                            <TextInput
                                label="Password"
                                placeHolder="Password"
                                secureTextEntry={true}
                                icon="lock-closed-outline"
                                error={errors?.password?.[0]}
                                onChangeText={(text)=>setData({ ...data, password: text })}
                                onFocus={()=>setErrors({ ...errors, password: undefined })}
                            />
                            <TextInput
                                label="Confirm Password"
                                placeHolder="Password"
                                secureTextEntry={true}
                                icon="lock-closed-outline"
                                error={errors?.password_confirm?.[0]}
                                onChangeText={(text)=>setData({ ...data, password_confirm: text })}
                                onFocus={()=>setErrors({ ...errors, password_confirm: undefined })}
                            />
                        </View>
                        <TouchableOpacity style={{ marginTop: normalise(15), marginBottom: normalise(30) }}>
                            <Text style={{ ...TEXT.md, textAlign: 'right' }}>Forgot your password?</Text>
                        </TouchableOpacity>
                        <Button
                            title="Register" 
                            onPress={login}
                            loading={loading}
                        />
                    </View>
                    <TouchableOpacity 
                        style={{ paddingTop: normalise(20), marginTop: normalise(20)}} 
                        onPress={() => navigation.navigate('login')}
                    >
                        <Text style={styles.registerText}>Already have an account? <Text style={styles.link}>Login</Text></Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLOUR.wp_brown[100],
        flex: 1
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
        paddingHorizontal: normalise(20),
        paddingBottom: normalise(50),
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