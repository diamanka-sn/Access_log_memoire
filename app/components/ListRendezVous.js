import React, { useRef, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import moment from 'moment';
import RBSheet from 'react-native-raw-bottom-sheet';
import QRCode from 'react-native-qrcode-svg';
import DetailRdv from './DetailRdv';


export default function ListRendezVous({ rdv }) {
    const [selectedRdv, setSelectedRdv] = useState([])
    const rdvSheet = useRef()
    const currentDate = moment();
    const rdvDate = moment(rdv.startedAt);
    const extraireMot = (text) => {
        const words = text?.split(/\s+/);
        const firstTenWords = words?.slice(0, 5).join(' ');
        return firstTenWords;
    };

    const handleDetails = (rdv) => {
        setSelectedRdv(rdv)
        rdvSheet.current.open()
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {Object.values(rdv).map((item) => {
                return (
                    <TouchableOpacity key={item.id} onPress={() => handleDetails(item)}>
                        <View style={styles.card}>
                            <View style={styles.cardBody}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.cardTitle}>{item.societeDestinataire.nom}</Text>
                                    <Text style={[styles.cardPrice]}>
                                        {(currentDate.isBefore(moment(item.startedAt)) && !item.activo) && (
                                            <FeatherIcon
                                                color="#ffa700"
                                                name="alert-triangle"
                                                size={22} />
                                        )}

                                        {(item.activo) && (
                                            <FeatherIcon
                                                color="green"
                                                name="check-circle"
                                                size={22} />
                                        )}

                                        {(!currentDate.isBefore(moment(item.startedAt)) && !item.activo) && (
                                            <FeatherIcon
                                                color="red"
                                                name="x"
                                                size={22} />
                                        )}
                                    </Text>
                                </View>

                                <View style={styles.cardStats}>
                                    <View style={styles.cardStatsItem}>
                                        <FeatherIcon
                                            color="#4285F4"
                                            name="zap"
                                            size={14} />

                                        <Text style={styles.cardStatsItemText}>{item.duration} heures</Text>
                                    </View>

                                    <View style={styles.cardStatsItem}>
                                        <FeatherIcon
                                            color="#4285F4"
                                            name="truck"
                                            size={14} />

                                        <Text style={styles.cardStatsItemText}>
                                            {item.camionConcernant.immatriculation}
                                        </Text>
                                    </View>

                                    <View style={styles.cardStatsItem}>
                                        <FeatherIcon
                                            color="#4285F4"
                                            name="clock"
                                            size={14} />

                                        <Text style={styles.cardStatsItemText}>
                                            {moment(item.startedAt).locale('fr').format('HH:MM')}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.cardFooter}>
                                    <Text style={styles.cardFooterText}>{extraireMot(item?.motif) + ' ...'}</Text>
                                    <Text style={styles.cardFooterText}>
                                        {moment(item.startedAt).locale('fr').format('DD-MM-YYYY')}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            })}
            <RBSheet
                customStyles={{ container: styles.sheet }}
                height={700}
                ref={rdvSheet}>
                <View style={styles.headerSheet}>
                    <Text style={styles.headerTitleSheet}>Détails Rendez-vous : {selectedRdv.societeDestinataire?.nom}</Text>
                </View>
                {/* <View style={styles.body}>
                    <View style={styles.avatar}>
                        {codeQR(selectedRdv?.id)}
                    </View>
                    <Text>{selectedRdv.societeDestinataire?.nom}</Text>

                </View> */}
                <DetailRdv rdv={selectedRdv}/>
            </RBSheet>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 3,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1d1d1d',
        marginBottom: 12,
    },
    card: {
        borderRadius: 10,
        backgroundColor: 'white',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        // elevation: 4,
    },
    cardTop: {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    cardImg: {
        width: '100%',
        height: 180,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    cardBody: {
        paddingVertical: 16,
        paddingHorizontal: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 19,
        fontWeight: '600',
        color: '#2d2d2d',
    },
    cardPrice: {
        fontSize: 20,
        fontWeight: '700',
        color: '#444',
        borderRadius: 50,
    },
    cardStats: {
        paddingBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: -12,
    },
    cardStatsItem: {
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardStatsItemText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#2d2d2d',
        marginLeft: 4,
    },
    cardFooter: {
        paddingTop: 8,
        borderTopWidth: 1,
        borderColor: '#e9e9e9',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardFooterText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#909090',
    },
    sheet: {
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
    }, headerSheet: {
        borderBottomWidth: 1,
        borderColor: '#efefef',
        padding: 16,
    },
    headerTitleSheet: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
    },
    /** Body */
    body: {
        padding: 24,
    },
    bodyText: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400',
        color: '#0e0e0e',
        marginBottom: 24,
        textAlign: 'center',
    },
    bodyGap: {
        marginBottom: 12,
    },
});