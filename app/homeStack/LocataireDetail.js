import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    StatusBar,
    SafeAreaView,
    Text,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { API_URL } from '../context/AuthContext';
import ChartBadge from '../chart/ChartBadge';

export default function LocataireDetail() {
    const navigation = useNavigation();
    const [societe, setSociete] = useState([])
    const [camion, setCamion] = useState([])
    const route = useRoute();
    const { params } = route;
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: params.societe?.nom,
        });
    }, [])

    useEffect(() => {
        const loadDataEmployee = async () => {
            try {
                const response = await axios.get(`${API_URL}/administration/personne/find-all-employe-all-societe`)
                const soc = await response.data.filter(m => m.societe?.id === params.societe?.id)
                setSociete(soc)
            } catch (error) {
                console.log(error)
            }
        }
        const loadDataCamion = async () => {
            try {
                const response = await axios.get(`${API_URL}/administration/camion/all-camion-by-all-societe`)
                const cam = await response.data.filter(m => m.societe?.id === params.societe?.id)
                setCamion(cam)
            } catch (error) {
                console.log(error)
            }
        }
        loadDataEmployee()
        loadDataCamion()
    }, [])
    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={styles.container}>
                    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                        <View style={styles.info}>
                            <Text style={styles.infoTitle}>{params.societe?.nom}</Text>
                            <View style={styles.infoRating}>
                                <Text style={styles.infoRatingLabel}>{params.societe?.email}</Text>
                                <Text style={styles.infoRatingText}>{params.societe?.telephone}</Text>
                            </View>
                            <View style={styles.infoRating}>
                                <Text style={styles.infoRatingText}>{societe?.length} Employés &</Text>
                                <Text style={styles.infoRatingText}>{camion?.length} Camions</Text>
                            </View>
                        </View>
                        <View style={styles.info}>
                            <Text style={styles.infoTitle}>Employés</Text>
                            {societe.length !== 0 ? (<ChartBadge
                                data={societe} />) : (
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>La société n'a pas d'employé.</Text>
                                </View>
                            )}
                        </View>
                        <View style={styles.info}>
                            <Text style={styles.infoTitle}>Camions</Text>
                            {camion.length !== 0 ? (<ChartBadge
                                data={camion} />) : (
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>La société n'a pas de camion.</Text>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 0,
        paddingHorizontal: 14,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    /** Header */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerAction: {
        width: 40,
        height: 40,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 19,
        fontWeight: '600',
        color: '#000',
    },
    /** Photos */
    photos: {
        // marginTop: 12,
        position: 'relative',
        height: 240,
        overflow: 'hidden',
        borderRadius: 12,
    },
    photosTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    photosTopItem: {
        width: 40,
        height: 40,
        borderRadius: 9999,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    photosPagination: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#000',
        borderRadius: 12,
    },
    photosPaginationText: {
        fontWeight: '600',
        fontSize: 14,
        color: '#fbfbfb',
    },
    photosImg: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        width: '100%',
        height: 240,
    },
    /** Picker */
    picker: {
        marginTop: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#f5f5f5',
    },
    pickerDates: {
        marginLeft: 12,
    },
    pickerDatesText: {
        fontSize: 13,
        fontWeight: '500',
    },
    pickerAction: {
        marginLeft: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickerActionText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: '600',
        color: '#4c6cfd',
    },
    /** Info */
    info: {
        marginTop: 12,
        backgroundColor: '#f5f5f5',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    infoTitle: {
        fontSize: 20,
        lineHeight: 25,
        fontWeight: '600',
        letterSpacing: 0.38,
        color: '#000000',
        marginBottom: 6,
    },
    infoRating: {
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoRatingLabel: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#000',
        marginRight: 2,
    },
    infoRatingText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#8e8e93',
        marginLeft: 2,
    },
    infoDescription: {
        fontWeight: '400',
        fontSize: 13,
        lineHeight: 18,
        letterSpacing: -0.078,
        color: '#8e8e93',
    },
    /** Stats */
    stats: {
        marginTop: 12,
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderTopWidth: 1,
        borderColor: '#fff',
    },
    statsItem: {
        flexGrow: 2,
        flexShrink: 1,
        flexBasis: 0,
        paddingVertical: 12,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderLeftWidth: 1,
        borderColor: '#fff',
    },
    statsItemText: {
        fontSize: 13,
        fontWeight: '400',
        lineHeight: 18,
        color: '#8e8e93',
        marginBottom: 4,
    },
    statsItemValue: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 20,
        color: '#000',
    },
    /** Overlay */
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 12,
        paddingHorizontal: 16,
        paddingBottom: 48,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    overlayContent: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    overlayContentTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 2,
    },
    overlayContentPriceBefore: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: '600',
        color: '#8e8e93',
        marginRight: 4,
        textDecorationLine: 'line-through',
        textDecorationColor: '#8e8e93',
        textDecorationStyle: 'solid',
    },
    overlayContentPrice: {
        fontSize: 21,
        lineHeight: 26,
        fontWeight: '700',
        color: '#000',
    },
    overlayContentTotal: {
        fontSize: 13,
        lineHeight: 18,
        fontWeight: '600',
        color: '#4c6cfd',
        letterSpacing: -0.07,
        textDecorationLine: 'underline',
        textDecorationColor: '#4c6cfd',
        textDecorationStyle: 'solid',
    },
    /** Button */
    btn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        backgroundColor: '#007aff',
        borderColor: '#007aff',
    },
    btnText: {
        fontSize: 18,
        lineHeight: 26,
        fontWeight: '600',
        color: '#fff',
    },
});