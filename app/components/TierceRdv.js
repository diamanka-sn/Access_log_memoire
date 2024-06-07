import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    ScrollView,
    FlatList,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import moment from 'moment';


export default function TierceRdv({ rdv }) {
    const currentDate = moment();
    const rdvDate = moment(rdv.startedAt);
    const extraireMot = (text) => {
        const words = text?.split(/\s+/);
        const firstTenWords = words?.slice(0, 5).join(' ');
        return firstTenWords;
    };
    return (
        <SafeAreaView style={{ backgroundColor: '#f2f2f2' }}>
            {rdv.length !== 0 ? (
                <FlatList
                    data={rdv.slice(0, 30)}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        <ScrollView contentContainerStyle={styles.container}>

                            <View style={styles.card}>
                                <View style={styles.cardBody}>
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.cardTitle}>{item.societeOrigne.nom}</Text>
                                        <Text style={[styles.cardPrice]}>
                                            {(currentDate.isBefore(rdvDate) && !item.activo) && (
                                                <FeatherIcon
                                                    color="#ffa700"
                                                    name="alert-triangle"
                                                    size={20} />
                                            )}
                                            {(item.activo) && (
                                                <FeatherIcon
                                                    color="green"
                                                    name="check-circle"
                                                    size={20} />
                                            )}
                                            {(!currentDate.isBefore(rdvDate) && !item.activo) && (
                                                <FeatherIcon
                                                    color="red"
                                                    name="x"
                                                    size={20} />
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
                                                {moment(item.startedAt).locale('fr').format('HH:mm')}
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
                        </ScrollView>
                    }}
                    ListHeaderComponentStyle={{ backgroundColor: "#ccc" }}
                />
            ) : (
                <Text>La société n'a pas encore de rendez.</Text>
            )}
        </SafeAreaView>
    );
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
    /** Card */
    card: {
        borderRadius: 10,
        backgroundColor: 'white',
        // marginBottom: 24,
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
});