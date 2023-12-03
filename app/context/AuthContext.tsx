import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store'; //Almacenamiento seguro

interface AuthProps {
    authState?: {
        token: string | null;
        isAuthenticated: boolean | null;
    }
    onRegister: (email: string, password: string) => Promise<any>;
    onLogin: (email: string, password: string) => Promise<any>;
    onLogout: () => Promise<void>;
}

const TOKEN_KEY = '';
export const API_URL = 'https://api.developbetterapps.com';
const AuthContext = createContext<AuthProps>({} as AuthProps);

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<{
        token: string | null,
        isAuthenticated: boolean | null
    }>({
        token: null,
        isAuthenticated: null
    });

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            if (token) {
                setAuthState({
                    token,
                    isAuthenticated: true
                });
            }
        }
        loadToken();
    }, []);

    const register = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, { email, password });
            return response;
        } catch (error) {
            return { error: true, msg: (error as any).responde.data.msg };
        }
    }

    /*
    Este código define una función asíncrona llamada 'login' que toma como parámetros
    un correo electrónico y una contraseña. Dentro de la función, se envía una solicitud POST
    a un punto final de autenticación utilizando axios, pasando el correo electrónico y 
    la contraseña como cuerpo de la solicitud. Si la solicitud es exitosa, se actualiza el estado
    de autenticación estableciendo las propiedades 'token' y 'isAuthenticated'.
    También se establece la cabecera de Autorización para futuras solicitudes utilizando el token 
    obtenido y se almacena el token de forma segura utilizando SecureStore. 
    Si ocurre un error durante la solicitud, se devuelve un objeto con la propiedad 'error' establecida 
    como 'true' y el mensaje de error extraído de la respuesta.
    */
    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${API_URL}/auth`, { email, password });

            setAuthState({
                token: response.data.token,
                isAuthenticated: true
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            await SecureStore.setItemAsync(TOKEN_KEY, response.data.token);

            return response;
        } catch (error) {
            return { error: true, msg: (error as any).responde.data.msg };
        }
    }

    const logout = async () => {

        await SecureStore.deleteItemAsync(TOKEN_KEY);

        axios.defaults.headers.common['Authorization'] = '';

        setAuthState({
            token: null,
            isAuthenticated: false
        });
    }

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout
    };
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

