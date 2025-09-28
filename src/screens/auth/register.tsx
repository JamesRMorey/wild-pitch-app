import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
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
import RadioInput from "../../components/inputs/radio-input";

const schema = object({
    email: string().required('Please enter your email').email('Please enter a valid email'),
    password: string().required('Please enter your password')
});

type FormData = { name: string, email: string, password: string, confirmPassword: string, gender: string, date_of_birth: string };
type PropsType = { navigation: any };
export default function RegisterScreen({ navigation } : PropsType) {

    const [data, setData] = useState<FormData>({ name: '', email: '', password: '', confirmPassword: '', gender: '', date_of_birth: '' });
    const [errors, setErrors] = useState<FormErrors>();
    const { setUser } = useGlobalActions();
    const GENDER_OPTIONS = [
        { label: 'Male', value: 'male', icon: 'male-outline' },
        { label: 'Female', value: 'female', icon: 'female-outline' },
        { label: 'Other', value: 'other', icon: 'person-outline' }
    ];

    const fakeLogin = () => {
        setUser({ id: '1', name: 'James Morey' });
    }

    const goBack = () => {
        navigation.goBack();
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
        <KeyboardAvoidingView>
            <ScrollView style={styles.container} stickyHeaderIndices={[0]} showsVerticalScrollIndicator={false}>
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
                        <Text style={styles.title}>Get Started</Text>
                        <Text style={TEXT.p}>Let's sign up and get going</Text>
                    </View>
                </View>
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
                                error={errors?.confirmPassword?.[0]}
                                onChangeText={(text)=>setData({ ...data, confirmPassword: text })}
                                onFocus={()=>setErrors({ ...errors, confirmPassword: undefined })}
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
                    <TouchableOpacity 
                        style={{ paddingTop: normalise(20), marginTop: normalise(20) }} 
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
        paddingHorizontal: normalise(20),
        paddingBottom: normalise(50)
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