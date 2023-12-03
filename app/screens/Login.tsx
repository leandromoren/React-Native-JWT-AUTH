import { View, TextInput, Image, Button, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { onLogin, onRegister } = useAuth();

    const login = async () => {
        const result = await onLogin(email, password);
        if (result && result.error) {
            alert(result.msg);
        }
    }

    const register = async () => {
        const result = await onRegister(email, password);
        if (result && result.error) {
            alert(result.msg);
        } else {
            login();
        }
    }

    return (
        <View style={styles.container}>
            <Image source={{ uri: 'https://galaxies.dev/img/logos/logo--blue.png' }} style={styles.image} />
            <View>
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    secureTextEntry
                />
                <Button title="Login" onPress={login} />
                <Button title="Register" onPress={register} />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%'
    },
    input: {
        height: 44,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff'
    },
    form: {
        gap: 10,
        width: '60%'
    },
    image: {
        width: '50%',
        height: '50%',
        resizeMode: 'contain'
    }
})

export default Login;