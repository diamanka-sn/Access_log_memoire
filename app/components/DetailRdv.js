import moment from 'moment';
import React from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import FeatherIcon from 'react-native-vector-icons/Feather';

export default function DetailRdv({ rdv }) {
    const currentDate = moment();
    return (
        <View style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={styles.container}>


                    <ScrollView
                        contentContainerStyle={styles.receipt}
                        showsVerticalScrollIndicator={false}>
                        <View style={styles.receiptLogo}>
                            <QRCode
                                value={`${rdv?.id}`}
                                size={150}
                                color="black"
                                backgroundColor="white"
                            />
                        </View>
                        <View style={styles.divider}>
                            <View style={styles.dividerInset} />
                        </View>

                        <View style={styles.details}>

                            <View style={styles.detailsRow}>
                                <Text style={styles.detailsField}>Status</Text>

                                <Text style={styles.detailsValue}>
                                    {(currentDate.isBefore(moment(rdv.startedAt)) && !rdv.activo) && (
                                        <FeatherIcon
                                            color="#ffa700"
                                            name="alert-triangle"
                                            size={22} />
                                    )}

                                    {(rdv.activo && rdv.done) && (
                                        <FeatherIcon
                                            color="green"
                                            name="check-circle"
                                            size={22} />
                                    )}

                                    {(!currentDate.isBefore(moment(rdv.startedAt)) && !rdv.activo) && (
                                        <FeatherIcon
                                            color="red"
                                            name="x"
                                            size={22} />
                                    )}
                                </Text>
                            </View>
                            <View style={styles.detailsRow}>
                                <Text style={styles.detailsField}>Date et heure</Text>

                                <Text style={styles.detailsValue}>{rdv?.startedAt}</Text>
                            </View>

                            <View style={styles.detailsRow}>
                                <Text style={styles.detailsField}>Marge de retard</Text>

                                <Text style={styles.detailsValue}>{rdv?.duration} heures</Text>
                            </View>

                            <View style={styles.detailsRow}>
                                <Text style={styles.detailsField}>Immatriculation</Text>

                                <Text style={styles.detailsValue}>{rdv.camionConcernant?.immatriculation}</Text>
                            </View>
                            <View style={styles.detailsRow}>
                                <Text style={styles.detailsField}>Catégorie</Text>

                                <Text style={styles.detailsValue}>{rdv.camionConcernant?.categorie}</Text>
                            </View>

                            <View style={styles.detailsRow}>
                                <Text style={styles.detailsField}>Motif</Text>

                                <Text style={styles.detailsValue}>{rdv?.motif}</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>

            <View style={styles.overlay}>
                <TouchableOpacity
                    onPress={() => {
                        // handle onPress
                    }}>
                    <View style={styles.btnSecondary}>
                        <Text style={styles.btnSecondaryText}>Télécharger en PDF</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 0,
        paddingHorizontal: 16,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        flexDirection: 'column',
        alignItems: 'stretch',
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
        fontSize: 17,
        fontWeight: '600',
        color: '#000',
    },
    /** Receipt */
    receipt: {
        alignItems: 'center',
        paddingTop: 16,
        paddingBottom: 140,
    },
    receiptLogo: {
        // width: 60,
        // height: 60,
        // borderRadius: 9999,
        // marginBottom: 12,
        backgroundColor: '#0e0e0e',
        alignItems: 'center',
        justifyContent: 'center',
    },
    receiptTitle: {
        fontSize: 21,
        fontWeight: '600',
        color: '#151515',
        marginBottom: 2,
    },
    receiptSubtitle: {
        fontSize: 13,
        lineHeight: 20,
        color: '#818181',
        marginBottom: 12,
    },
    receiptPrice: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        marginBottom: 6,
    },
    receiptPriceText: {
        fontSize: 30,
        lineHeight: 38,
        fontWeight: 'bold',
        letterSpacing: 0.35,
        color: '#8338ec',
    },
    receiptDescription: {
        fontSize: 14,
        lineHeight: 22,
        color: '#818181',
        textAlign: 'center',
        marginBottom: 12,
    },
    /** Avatar */
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 9999,
        borderWidth: 3,
        borderColor: '#fff',
    },
    avatarWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    /** Divider */
    divider: {
        overflow: 'hidden',
        width: '100%',
        marginVertical: 24,
    },
    dividerInset: {
        width: '100%',
        borderWidth: 2,
        borderColor: '#e5e5e5',
        borderStyle: 'dashed',
        marginTop: -2,
    },
    /** Details */
    details: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'stretch',
    },
    detailsTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#222',
        marginBottom: 16,
    },
    detailsRow: {
        marginBottom: 14,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    detailsField: {
        fontSize: 16,
        lineHeight: 20,
        fontWeight: '500',
        color: '#8c8c8c',
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    detailsValue: {
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '600',
        color: '#444',
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        textAlign: 'right',
    },
    /** Button */
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        backgroundColor: '#007aff',
        borderColor: '#007aff',
        marginBottom: 12,
    },
    btnText: {
        fontSize: 18,
        lineHeight: 26,
        fontWeight: '600',
        color: '#fff',
    },
    btnSecondary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        backgroundColor: 'transparent',
        borderColor: '#007aff',
    },
    btnSecondaryText: {
        fontSize: 18,
        lineHeight: 26,
        fontWeight: '600',
        color: '#007aff',
    },
});