import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import { API_URL_AUTH } from '../context/AuthContext';
import axios from 'axios';
import { AsyncStorage } from '@react-native-async-storage/async-storage';

export default function App() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [showScanner, setShowScanner] = useState(true);
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState(null);
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
           
        })();
    }, []);

    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
        setLoading(true);

        try {
            const role = 'admin'
                const endpoint = role === "admin" ? "verifier-entry-rv" : "valider-entry-rv";
                const response = await axios.get(`${API_URL_AUTH}/admin/autorisation/${endpoint}/${data}/1`);
                const result = response.data;
                const title = role === "admin" ? 'Résultats' : 'Autorisation';
                Alert.alert(title, result.message);
        } catch (error) {
            console.error(error);
            Alert.alert('Erreur', 'Une erreur est survenue lors de la vérification.');
        } finally {
            setLoading(false);
            setShowScanner(false);
        }
    };

    const handleScanAgain = () => {
        setScanned(false);
        setShowScanner(true);
    };

    if (hasPermission === null) {
        return <View style={styles.container} />;
    }

    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Aucun accès à la caméra.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {showScanner && (
                <View style={styles.cameraContainer}>
                    <Camera
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={[StyleSheet.absoluteFill, styles.camera]}
                    />
                    <View style={styles.cameraFrame} />
                </View>
            )}

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>
            )}

            {scanned && (
                <View style={styles.scanResultContainer}>
                    <TouchableOpacity onPress={handleScanAgain}>
                        <Text style={styles.scanAgainText}>Scanner à nouveau</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    cameraContainer: {
        flex: 1,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        flex: 1,
    },
    cameraFrame: {
        width: '70%', // or any other value you prefer
        aspectRatio: 1, // makes it a square frame
        borderColor: '#ffffff',
        borderWidth: 9,
    },
    text: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        marginTop: 16,
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanResultContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanAgainText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bff',
        textAlign: 'center',
        marginTop: 16,
        textDecorationLine: 'underline',
    },
});
