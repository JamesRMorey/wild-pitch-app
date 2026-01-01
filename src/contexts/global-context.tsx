import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { useNavigation } from '@react-navigation/native';

type GlobalState = {
    user: User,
    isLoading: boolean;
};

type GlobalActions = {
    setUser: (user: User) => void;
    setLoading: (loading: boolean) => void;
    logout: () => Promise<void>;
    verifyLogin: () => boolean;
};

const StateContext = createContext<GlobalState | undefined>(undefined);
const ActionsContext = createContext<GlobalActions | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User>();
    const [isLoading, setLoading] = useState<boolean>(false);
    const navigation = useNavigation();

    const getUser = async () => {
        const u = await AsyncStorage.getItem('user');
        if (u) setUser(JSON.parse(u));
    }

    const logout = async () => {
        await AsyncStorage.removeItem('user');
        setUser(undefined);
    }

    const verifyLogin = (): boolean => {
        const loggedIn = user ? true : false;

        if (!loggedIn) {
            navigation.navigate('auth');
        }

        return loggedIn
    }

    
    useEffect(() => {
        getUser();
    }, []);

    return (
        <StateContext.Provider 
            value={{ 
                user, 
                isLoading 
            }}
        >
            <ActionsContext.Provider 
                value={{ 
                    setUser, 
                    setLoading, 
                    logout,
                    verifyLogin
                }}
            >
                {children}
            </ActionsContext.Provider>
        </StateContext.Provider>
    );
};

export const useGlobalState = (): GlobalState => {
    const context = useContext(StateContext);
    if (!context) throw new Error('useGlobalState must be used within a GlobalProvider');
    return context;
};

export const useGlobalActions = (): GlobalActions => {
    const context = useContext(ActionsContext);
    if (!context) throw new Error('useGlobalActions must be used within a GlobalProvider');
    return context;
};