import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { SETTING } from "../../consts";
import Button from "../../components/buttons/button";
import { useGlobalActions } from "../../contexts/global-context";
import { normalise, parseValidationErrors } from "../../functions/helpers";
import { COLOUR, TEXT } from "../../styles";
import TextInput from "../../components/inputs/text-input";
import KeyboardAvoidingView from "../../components/misc/keyboard-avoiding-view";
import Icon from "../../components/misc/icon";
import { useState } from "react";
import { object, string } from "yup";
import { FormErrors } from "../../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const schema = object({
    email: string().required('Please enter your email').email('Please enter a valid email'),
    password: string().required('Please enter your password')
});

type PropsType = { navigation: any };
export default function LoginScreen({ navigation } : PropsType) {

    const [data, setData] = useState<{ email: string, password: string }>({ email: '', password: '' });
    const [errors, setErrors] = useState<FormErrors>();
    const { setUser } = useGlobalActions();

    const fakeLogin = () => {
        setUser({ id: '1', name: 'James Morey' });
    }

    const goBack = () => {
        navigation.goBack();
    }

    const navigateToRegister = () => {
        navigation.navigate('register');
    }

    const login = async () => {
        try {
            setErrors(undefined);
            await schema.validate(data, { abortEarly: false });
            const user = { id: '1', name: 'James Morey' };

            await AsyncStorage.setItem('user', JSON.stringify(user));
            fakeLogin();
        }
        catch (err: any) {
            const errs = parseValidationErrors(err);
            setErrors(errs);
        }
        finally {
        }
    }


    return (
        <KeyboardAvoidingView flex={true}>
            <View style={styles.container}>
                <View style={styles.top}>
                    <View>
                        <TouchableOpacity 
                            onPress={goBack}
                            style={styles.backButton}
                        >
                            <Icon
                                icon="arrow-back-outline"
                                size={normalise(25)}
                                colour={COLOUR.gray[800]}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.header}>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={TEXT.p}>Time to plan that trip</Text>
                    </View>
                </View>
                <View style={styles.bottom}>
                    <View>
                        <View style={styles.form}>
                            <TextInput
                                label="Email"
                                placeHolder="Email"
                                icon="mail-outline"
                                error={errors?.email?.[0]}
                                onChangeText={(text)=>setData({ ...data, email: text })}
                                onFocus={()=>setErrors({ ...errors, email: undefined })}
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
                        </View>
                        <TouchableOpacity style={{ marginTop: normalise(15), marginBottom: normalise(30) }}>
                            <Text style={{ ...TEXT.md, textAlign: 'right' }}>Forgot your password?</Text>
                        </TouchableOpacity>
                        <Button
                            title="Login" 
                            onPress={login}
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
        ...TEXT.xxl
    },
    header: {
        marginTop: normalise(60)
    },
    backButton: {
        paddingBottom: normalise(10),
        paddingRight: normalise(10),
    },
    top: {
        backgroundColor: COLOUR.wp_brown[200],
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