import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, Dimensions } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { API_URL } from '../context/AuthContext';
import {
    ProgressChart
} from "react-native-chart-kit";
import { ScrollView } from 'react-native-gesture-handler';
import ChartCamion from '../chart/ChartCamion';

export default function FeedAdmin() {
    const [employe, setEmploye] = useState(0);
    const [camion, setCamion] = useState(0)
    const [cam, setCam] = useState([])
    const [societe, setSociete] = useState(0);
    const [gie, setGie] = useState(0);
    const [espace, setEspace] = useState(0)

    const fetchEspace = async () => {
        try {
            const response = await axios.get(`${API_URL}/administration/societe/find-allSocieteAvecEspace`);
            const e = response.data
            console.log(e)
            let tempTotalSpace = 0;
            let tempTotalOccupiedSpace = 0;
            for (const es of e) {
                tempTotalSpace += es.espaceTotal;
                tempTotalOccupiedSpace += es.espaceOccupe;
            }
            const es = tempTotalOccupiedSpace / tempTotalSpace
            setEspace(es)
        } catch (error) {
            console.error(error);
        }
    }

    const fetchEmploye = async () => {
        const em = 'Employe'
        try {
            const response = await axios.get(`${API_URL}/gestion-interne/personne/find-totalPersonne?statut=${em}`)
            const cam = await axios.get(`${API_URL}/administration/camion/all-camion-by-all-societe`)
            setCamion(cam.data.length)
            setCam(cam.data)
            setEmploye(response.data)
        } catch (error) {
            console.error("Erreur de recuperation des données.")
        }
    }

    useEffect(() => {
        const getNombreSociete = async () => {
            const gie = 'Gie'
            const soc = 'Locataire'
            try {
                const [totalLocataire, totalGie] = await Promise.all([
                    axios.get(`${API_URL}/administration/societe/find-totalSociete?statu=${soc}`),
                    axios.get(`${API_URL}/administration/societe/find-totalSociete?statu=${gie}`),
                ]);
                setSociete(totalLocataire.data);
                setGie(totalGie.data);
            } catch (error) {
                console.error('Erreur de recuperation des données.')
            }
        };
        getNombreSociete();
    }, []);

    useEffect(() => {
        fetchEmploye()
        fetchEspace();
    }, []);

    return (
        <ScrollView>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
                <View style={styles.container}>
                    <View style={styles.stats}>
                        <View style={styles.statsRow}>
                            <View style={styles.statsItem}>
                                <View style={styles.statsItemIcon}>
                                    <FeatherIcon color="#fff" name="truck" size={22} />
                                </View>
                                <View>
                                    <Text style={styles.statsItemLabel}>Camions</Text>
                                    <Text style={styles.statsItemValue}>{camion}</Text>
                                </View>
                            </View>
                            <View style={styles.statsItem}>
                                <View style={styles.statsItemIcon}>
                                    <FeatherIcon color="#fff" name="clock" size={22} />
                                </View>
                                <View>
                                    <Text style={styles.statsItemLabel}>Sociétés</Text>
                                    <Text style={styles.statsItemValue}>{societe}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.statsRow}>
                            <View style={styles.statsItem}>
                                <View style={styles.statsItemIcon}>
                                    <FeatherIcon
                                        color="#fff"
                                        name="codesandbox"
                                        size={22} />
                                </View>
                                <View>
                                    <Text style={styles.statsItemLabel}>GIE</Text>
                                    <Text style={styles.statsItemValue}>{gie}</Text>
                                </View>
                            </View>
                            <View style={styles.statsItem}>
                                <View style={styles.statsItemIcon}>
                                    <FeatherIcon
                                        color="#fff"
                                        name="users"
                                        size={22} />
                                </View>
                                <View>
                                    <Text style={styles.statsItemLabel}>Employés</Text>
                                    <Text style={styles.statsItemValue}>{employe}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.statsRow}>
                            <View style={styles.statsItem}>
                                <View>
                                    <Text style={styles.statsItemLabel}>Espace occupé dans la plateforme</Text>
                                    <ProgressChart
                                        data={[espace ? espace : 0]}
                                        width={Dimensions.get('window').width - 16}
                                        height={220}
                                        chartConfig={{
                                            backgroundGradientFrom: 'white',
                                            backgroundGradientTo: 'white',
                                            decimalPlaces: 1,
                                            color: (opacity = 0.1) => `rgba(255, 0, 0, ${opacity})`,
                                            style: {
                                                borderRadius: 0,
                                            },
                                        }}
                                        style={{
                                            marginLeft: 8,
                                            borderRadius: 16,
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.statsRow}>
                            <View style={styles.statsItem}>
                                <View>
                                    <Text style={styles.statsItemLabel}>Camions par société dans la plateforme</Text>
                                    {cam.length !== 0 ? (<ChartCamion
                                        data={cam} />) : (
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text>Aucune données disponible pour le moment.</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
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
    /** Stats */
    stats: {
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        marginHorizontal: -6,
    },
    statsItem: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#fff',
        marginHorizontal: 6,
        marginBottom: 12,
    },
    statsItemIcon: {
        backgroundColor: '#007bff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 46,
        height: 46,
        marginRight: 8,
        borderRadius: 8,
    },
    statsItemLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: '#8e8e93',
        marginBottom: 2,
    },
    statsItemValue: {
        fontSize: 22,
        fontWeight: '600',
        color: '#081730',
    },
});