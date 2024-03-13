import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { API_URL, API_URL_AUTH } from '../context/AuthContext';
import { FlatList } from 'react-native-gesture-handler';
import Societe from '../components/Societe';

export default function ListeSociete() {
    const [userConnect, setUserConnect] = useState(null);
    const [societes, setSocietes] = useState([]);
    const [societeLocataire, setSocieteLocataire] = useState([]);
    const [isRefreshing, setRefreshing] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [value, setValue] = React.useState(0);
    const tabs = [
        { name: 'Sociétés externes', icon: 'align-center', data: societes },
        { name: 'Sociétés internes', icon: 'layers', data: societeLocataire },
    ];
    const handleRefresh = async () => {
        setRefreshing(true);

        try {
            await fetchSocietes();
        } catch (error) {
            console.error("Error during refresh:", error);
        } finally {
            setRefreshing(false);
        }
    };
  
    const fetchSocietes = async () => {
        try {
            let response, r;
            const u = await AsyncStorage.getItem("role");
            const value = await AsyncStorage.getItem("societe");
            const parsedUser = JSON.parse(u);
            const soc = JSON.parse(value)
            const isAdmin = parsedUser === 'admin'
            if (isAdmin) {
                response = await axios.get(`${API_URL}/gestion-interne/societe/find-allSocieteTierce`);
                r = await axios.get(`${API_URL}/admin/societe/find-allSocieteLocataire`);

                setSocieteLocataire(r.data.filter(m => m.nom !== soc.nom))
            } else {
                response = await axios.get(`${API_URL}/admin/societe/find-allSocieteLocataire`);
            }
            setSocietes(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const value = await AsyncStorage.getItem("userConnect");
                const u = await AsyncStorage.getItem("role");

                if (value !== null) {
                    setUserConnect(JSON.parse(value));
                    const parsedUser = JSON.parse(u);
                    setIsAdmin(parsedUser === 'admin')
                }
            } catch (e) {
                console.error("Error reading value:", e);
            }
        };
        getData();
        fetchSocietes();
    }, []);


    const renderSocieteFlatList = (data, refreshing, onRefresh) => (
        <FlatList
            data={data?.slice(0, 30)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <Societe societe={item} />}
            ListHeaderComponentStyle={{ backgroundColor: "#ccc" }}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
            refreshing={refreshing}
            onRefresh={onRefresh}
        />
    );
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={styles.container}>
                <Text style={styles.title}>Liste de sociétés</Text>
                <View style={styles.tabs}>
                    {tabs.map(({ name, icon }, index) => {
                        const isActive = index === value;

                        return (
                            <View
                                key={name}
                                style={[
                                    styles.tabWrapper,
                                    isActive && { borderBottomColor: '#007bff' },
                                ]}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setValue(index);
                                    }}>
                                    <View style={styles.tab}>
                                        <FeatherIcon
                                            color={isActive ? '#007bff' : '#6b7280'}
                                            name={icon}
                                            size={16} />

                                        <Text
                                            style={[
                                                styles.tabText,
                                                isActive && { color: '#007bff' },
                                            ]}>
                                            {name}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </View>
                {tabs[value].data.length !== 0 ? (
                    renderSocieteFlatList(tabs[value].data, isRefreshing, handleRefresh)

                ) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Aucune {tabs[value].name} disponible.</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        // paddingTop: 24,
        padding: 0,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    title: {
        paddingHorizontal: 16,
        fontSize: 32,
        fontWeight: '700',
        color: '#1d1d1d',
        marginBottom: 12,
    },
    tabs: {
        flexDirection: 'row',
    },
    /** Tab */
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        position: 'relative',
        overflow: 'hidden',
    },
    tabWrapper: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        borderColor: '#e5e7eb',
        borderBottomWidth: 2,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6b7280',
        marginLeft: 5,
    },
    /** Placeholder */
    placeholder: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        height: 400,
        marginTop: 0,
        paddingVertical: 24,
        paddingHorizontal: 16,
        backgroundColor: 'transparent',
    },
    placeholderInset: {
        borderWidth: 4,
        borderColor: '#e5e7eb',
        borderStyle: 'dashed',
        borderRadius: 9,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },

    loadingContainer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "red",
        zIndex: 1,
    },
    loadingText: {
        marginTop: 8,
        color: "black",
    },
});