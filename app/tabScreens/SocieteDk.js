import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Image,
} from 'react-native';
import { API_URL } from '../context/AuthContext';
import axios from 'axios';
import Locataire from '../components/Locataire';
import { FlatList } from 'react-native-gesture-handler';
import Vide from '../empty/Vide';
export default function SocieteDk() {
    const [societe, setSociete] = useState([])
    const navigation = useNavigation()
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLargeTitle: true,
            headerSearchBarOptions: {
                placeHolder: "Search",
                cancelButtonText: 'Annuler',
                placeholder: 'Rechercher',
            }
        });
    }, [navigation]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await axios.get(`${API_URL}/admin/societe/find-allSocieteLocataire`)
                setSociete(response.data)
            } catch (error) {
                console.error("Erreur de recuperation des données.")
            }
        }

        loadData()
    }, [])
    return (
        <SafeAreaView style={{ flex: 1 }}>
            {societe.length !== 0 ? (
                <FlatList
                    data={societe.slice(0, 30)}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <Locataire societe={item} />}
                    ListHeaderComponentStyle={{ backgroundColor: "#ccc" }}
                    // ItemSeparatorComponent={() => <View style={styles.divider} />}
                    // refreshing={isRefreshing}
                    // onRefresh={handleRefresh}
                />
            ) : (
                <Vide message={"Aucune société disponible"}/>
            )}

        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1d1d1d',
        marginBottom: 12,
    },
    /** Card */
    card: {
        position: 'relative',
        borderRadius: 8,
        backgroundColor: '#fff',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    cardLikeWrapper: {
        position: 'absolute',
        zIndex: 1,
        top: 12,
        right: 12,
    },
    cardLike: {
        width: 48,
        height: 48,
        borderRadius: 9999,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTop: {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    cardImg: {
        width: '100%',
        height: 160,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    cardBody: {
        padding: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: '500',
        color: '#232425',
    },
    cardPrice: {
        fontSize: 15,
        fontWeight: '400',
        color: '#232425',
    },
    cardFooter: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    cardStars: {
        marginLeft: 2,
        marginRight: 6,
        fontSize: 14,
        fontWeight: '500',
        color: '#232425',
    },
    cardReviews: {
        fontSize: 14,
        fontWeight: '400',
        color: '#595a63',
    },
});