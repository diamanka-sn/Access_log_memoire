import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
interface AuthProps {
    authState?: { token: string | null; authenticated: boolean | null }
    onRegister?: (email: string, password: string) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "807605274673228623802113__plateforme-access-token"
export const API_URL = 'http://192.168.1.47:8080/api/v1/access-service'
export const API_URL_AUTH = 'http://192.168.1.47:8080/api/v1/auth-service'
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }: any) => {

    const [authState, setAuthState] = useState<{
        token: string | null;
        authenticated: boolean | null;
    }>({
        token: null,
        authenticated: null
    })

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY)

            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setAuthState({
                    token: token,
                    authenticated: true
                })
            }
        }
        loadToken()
    }, [])

    const register = async (email: string, password: string) => {
        try {
            return await axios.post(`${API_URL}/users`, { email, password })
        } catch (e) {
            return { error: true, msg: (e as any).response.data?.msg }
        }
    }

    const login = async (email: string, password: string) => {
        try {
            const result = await axios.post(`${API_URL}/auth/signin`, { email: email, password: password } )
            const { userConnect, token, refreshToken } = result.data;

            await AsyncStorage.setItem('userConnect', JSON.stringify(userConnect));
            await AsyncStorage.setItem('societe', JSON.stringify(userConnect.societe));
            const role = userConnect.authorities[0].authority;
            let roleuser = role === 'SUPER_ADMIN' ? 'super' : role === 'ADMIN_SOCIETE' ? 'admin' : role === 'ADMIN_GIE' ? 'gie' : role == 'ADMIN_SOCIETE_TIERCE' ? 'tierce' : '';
            await AsyncStorage.setItem('role', JSON.stringify(roleuser));

            const utilisateur = {
                nomC: userConnect.prenom + ' ' + userConnect.nom,
                email: userConnect.email,
                telephone: userConnect.telephone,
                societe: userConnect.societe.nom,
                societeId: userConnect.societe.id,
                profil: role
            };

            await AsyncStorage.setItem('utilisateur', JSON.stringify(utilisateur));

            setAuthState({
                token: token,
                authenticated: true
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            await SecureStore.setItemAsync(TOKEN_KEY, token);

            return result;
        } catch (e) {
            return { error: true, msg: (e as any).response?.detail }
        }
    }

    const logout = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY)
        await AsyncStorage.clear();
        axios.defaults.headers.common['Authorization'] = ''

        setAuthState({
            token: null,
            authenticated: false
        })
    }

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
