import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import {
    StyleSheet,
    View,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    Text,
    ScrollView,
    Image,
    useColorScheme,
    Alert,
    Platform,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import FeatherIcon from 'react-native-vector-icons/Feather';
import moment from 'moment';
import { Dropdown } from 'react-native-element-dropdown';
import { HEURES, formatDateToYYYYMMDDHHMM } from "../context/utils";
import axios from 'axios';
import { API_URL_AUTH } from '../context/AuthContext';
import { useDispatch } from 'react-redux';

const CARD_WIDTH = Math.min(Dimensions.get('screen').width * 0.75, 400);

export default function RendezVousDetails() {
    const dispatch = useDispatch();
    const [autorisation, setAutorisation] = useState([]);
    const [isAdmin, setIsAdmin] = useState();
    const [heure, setHeure] = useState([])
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        date: '',
        motif: '',
        duration: '',
        showDatePicker: false,
    });

    const theme = useColorScheme();
    const navigation = useNavigation();
    const route = useRoute();
    const { params } = route;
    const [rdv, setRdv] = useState(params.rdv)
    const rdvH = moment(rdv.startedAt).locale('fr').format('DD-MM-YYYY HH:MM')
    const currentDate = moment();
    const rdvDate = moment(rdv.startedAt);
    const stats = [
        { label: 'Camion', value: rdv?.camionConcernant.immatriculation },
        { label: 'Catégorie', value: rdv?.camionConcernant.categorie },
        { label: 'Rendez-vous', value: rdvH },
    ];
    const getBadgeStyles = (status) => {
        let backgroundColor, textColor;

        switch (status) {
            case 'success':
                backgroundColor = '#28a745';
                textColor = '#ffffff';
                break;
            case 'warning':
                backgroundColor = '#ffc107';
                textColor = '#1d1d1d';
                break;
            case 'danger':
                backgroundColor = '#dc3545';
                textColor = '#ffffff';
                break;
            default:
                backgroundColor = '#e7e7e7';
                textColor = '#1d1d1d';
        }

        return {
            backgroundColor,
            paddingVertical: 4,
            paddingHorizontal: 10,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
        };
    };

    const mod = (currentDate.isBefore(rdvDate) && rdv?.activo) || (!rdv?.activo && !currentDate.isBefore(rdvDate)) || !rdv.activo
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: rdv?.societeOrigne.nom,
            headerRight: () => (
                <View style={{ marginRight: 10 }}>

                    <TouchableOpacity onPress={mod ? modifier : null}>
                        <Text style={{ color: mod ? '#007bff' : 'gray', fontWeight: '700', fontSize: 16 }}>
                            {rdv?.activo ? 'Modifier' : 'Valider'}
                        </Text>
                    </TouchableOpacity>
                </View >
            ),
            headerLeft: () => (
                <View style={{ marginRight: 10 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={{ color: '#007bff', fontSize: 16 }}>Annuler</Text>
                    </TouchableOpacity>
                </View>
            ),
        });
    }, []);
    useEffect(() => {
        const getData = async () => {
            try {
                console.log(rdv)
                const value = await AsyncStorage.getItem("role");
                console.log(rdv)
                if (value === 'admin') {

                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }

            } catch (error) {
                console.error("Erreur lors de la lecture de la valeur :", error);
            }
        };
        getData();
    }, []);

    useEffect(() => {
        const o = HEURES.map(item => ({
            label: item.label,
            value: item.value
        }))
        setHeure(o)
    }, [isAdmin]);

    const handleDateChange = (event, selectedDate) => {
        setForm({
            ...form,
            date: selectedDate,
            showDatePicker: false,
        });
    };

    const confirmationRdv = async (url, donnees, message) => {
        Alert.alert(
            "Confirmation",
            message,
            [
                {
                    text: "Annuler",
                    style: "cancel",
                    onPress: () => setLoading(false),
                },
                {
                    text: "Confirmer",
                    style: 'default',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const response = await axios.put(url, donnees);
                            const rdv = await axios.get(`${API_URL_AUTH}/gestion-interne/rendez-vous/find-rendez-vous/${donnees.id}`);
                            const a = response.data;
                            if (!a.error) {
                                Alert.alert("Succès", a.message);
                                dispatch({ type: 'UPDATE_RDV', payload: rdv.data });
                                navigation.goBack()

                            } else {
                                Alert.alert("Erreur", a.message);
                            }
                        } catch (error) {
                            Alert.alert("Erreur", "Erreur lors de la " + rdv?.activo ? "modification" : "Validation" + " du rendez-vous." + error);
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };

    const modifier = async () => {
        let data = {
            activo: true,
            id: rdv.id,
            createur: rdv.createur,
            societeLocataireId: rdv.societeLocataireId,
            beneficiaireType: rdv.beneficiaireType,
            beneficaireId: rdv.beneficaireId,
            createdAt: rdv.createdAt,
            motif: form.motif ? form.motif.trim() : rdv.motif,
            duration: form.duration.value ? form.duration.value : rdv.duration,
            startedAt: form.date ? formatDateToYYYYMMDDHHMM(form.date) : rdv.startedAt
        };

        if (rdv?.activo) {
            await confirmationRdv(
                `${API_URL_AUTH}/gestion-interne/rendez-vous/update-rendez-vous/${params.rdv?.id}`, data,
                "Voulez-vous vraiment modifier ce rendez-vous?"
            );
        } else {
            await confirmationRdv(
                `${API_URL_AUTH}/gestion-interne/rendez-vous/valider-rendez-vous/${params.rdv?.id}`, data,
                "Voulez-vous vraiment valider ce rendez-vous ?"
            );
        }
    };

    const codeQR = () => (

        <View style={styles.qrCodeContainer}>
            <QRCode
                value={`RendezVousID:${rdv?.id}`}
                size={150}
                color="black"
                backgroundColor="white"
            />
        </View>
    );

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
            <SafeAreaView>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={styles.profile}>
                            <View style={styles.profileTop}>
                                <View style={styles.avatar}>
                                    {codeQR()}
                                </View>
                                {isAdmin && (
                                    <View style={styles.avatar}>
                                        {codeQR()}
                                    </View>
                                )}
                                <View style={styles.profileBody}>
                                    <Text style={styles.profileTitle}>{rdv?.societeOrigne.nom}</Text>

                                    <Text style={styles.profileSubtitle}>
                                        {rdv?.societeOrigne.email + '\n'}
                                        {rdv?.societeOrigne.telephone + '\n'}
                                        Rue {rdv?.societeOrigne.rue + ', ' + rdv?.societeOrigne.region + ', ' + rdv?.societeOrigne.pays + '\n'}
                                        <View style={styles.badge}>
                                            {(currentDate.isBefore(rdvDate) && !rdv?.activo) && (
                                                <View style={[getBadgeStyles('warning')]}>
                                                    <Text style={styles.badgeText}>Attente</Text>
                                                </View>
                                            )}
                                            {(rdv?.activo) && (
                                                <View style={[getBadgeStyles('success')]}>
                                                    <Text style={styles.badgeText}>Valider</Text>
                                                </View>
                                            )}
                                            {(!currentDate.isBefore(rdvDate) && !rdv?.activo) && (<View style={[getBadgeStyles('danger')]}>
                                                <Text style={styles.badgeText}>Expiré</Text>
                                            </View>)
                                            }
                                        </View>
                                    </Text>
                                </View>
                            </View>

                            <Text style={styles.profileDescription}>
                                {rdv?.motif}
                            </Text>
                            <View
                                style={{
                                    marginTop: 10,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: 8,
                                }}>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        fontWeight: '500',
                                        maxWidth: '80%',
                                        color: theme === 'dark' ? 'white' : 'black',
                                    }}>
                                    Marge de retard
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        fontWeight: '500',
                                        color: theme === 'dark' ? 'white' : 'black',
                                    }}>
                                    +/- {rdv?.duration} heures
                                </Text>
                            </View>
                        </View>

                        <View style={styles.stats}>
                            {stats.map(({ label, value }, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.statsItem,
                                        index === 0 && { borderLeftWidth: 0 },
                                    ]}>
                                    <Text style={styles.statsItemText}>{label}</Text>

                                    <Text style={styles.statsItemValue}>{value}</Text>
                                </View>
                            ))}
                        </View>
                        {((currentDate.isBefore(rdvDate) && rdv?.activo) || (!rdv?.activo && !currentDate.isBefore(rdvDate)) || !rdv.activo) && (
                            <View style={{ marginTop: 10 }}>
                                <View>
                                    <Text style={{ fontSize: 14, marginBottom: 5, color: '#4285F4', fontWeight: 'bold', }}>Motif du rendez-vous</Text>
                                    <TextInput
                                        // placeholder={rdv?.motif}
                                        placeholderStyle={{ color: 'black' }}
                                        secureTextEntry={true}
                                        style={{
                                            // height: 44,
                                            backgroundColor: '#f1f5f9',
                                            paddingHorizontal: 16,
                                            borderRadius: 12,
                                            fontSize: 15,
                                            fontWeight: '500',
                                            color: '#222',
                                            height: 100,
                                            // marginLeft: '5%'
                                        }}
                                        multiline={true}
                                        defaultValue={rdv?.motif}
                                        onChangeText={(motif) => setForm({ ...form, motif })}
                                    // value={form.motif}
                                    />
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: 2,
                                        marginTop: 10
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: 14, color: '#4285F4', fontWeight: 'bold',
                                            maxWidth: '60%'
                                        }}>
                                        Date et heure
                                    </Text>
                                    {Platform.OS === 'ios' ? (
                                        <DateTimePicker
                                        style={{
                                            borderRadius: 12,
                                            fontSize: 15,
                                        }}
                                        minimumDate={new Date()}
                                        minuteInterval={5}
                                        value={new Date(rdv.startedAt)}
                                        mode="datetime"
                                        locale="fr"
                                        is24Hour={true}
                                        display="default"
                                        onChange={handleDateChange}
                                    />
                                    ): (
                                        <DateTimePickerAndroid
                                        style={{
                                            borderRadius: 12,
                                            fontSize: 15,
                                        }}
                                        minimumDate={new Date()}
                                        minuteInterval={5}
                                        value={new Date(rdv.startedAt)}
                                        mode="datetime"
                                        locale="fr"
                                        is24Hour={true}
                                        display="default"
                                        onChange={handleDateChange}
                                    />
                                    )}
                                    
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: 2,
                                        marginTop: 10,
                                    }}>

                                    <View style={{ flex: 1, paddingRight: 5, }}>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: '#4285F4',
                                                fontWeight: 'bold',
                                                maxWidth: '100%',
                                            }}>
                                            Marge de retard
                                        </Text>
                                    </View>

                                    <View style={{ flex: 1, paddingLeft: 5 }}>
                                        <Dropdown
                                            data={heure}
                                            maxHeight={300}
                                            labelField="label"
                                            valueField="value"
                                            placeholderStyle={{ color: 'gray', }}
                                            containerStyle={{ borderRadius: 12, marginTop: 2 }}
                                            placeholder={rdv?.duration + ' heures'}
                                            onChange={(duration) => setForm({ ...form, duration })}
                                            style={{
                                                height: 44,
                                                backgroundColor: '#f1f5f9',
                                                paddingHorizontal: 16,
                                                borderRadius: 12,
                                                fontSize: 15,
                                                color: '#222',
                                            }}
                                        />
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>

                </View>
            </SafeAreaView>
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        paddingHorizontal: 0,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    content: {
        paddingHorizontal: 24,
    },

    badge: {
        backgroundColor: 'white',
        marginLeft: 2,
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 8,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    badgeText: {
        fontSize: 13,
        fontWeight: '600',
        color: 'white',
    },
    profile: {
        paddingVertical: 18,
    },
    profileTop: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    profileBody: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        // paddingLeft: 16,
    },
    profileTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        lineHeight: 32,
        color: '#121a26',
        marginBottom: 6,
    },
    profileSubtitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#778599',
    },
    profileDescription: {
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 18,
        // color: '#778599',
    },
    profileTags: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    profileTagsItem: {
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 18,
        color: '#266ef1',
        marginRight: 4,
    },
    avatar: {
        position: 'relative',
        paddingRight: 16
    },
    avatarImg: {
        width: 80,
        height: 80,
        borderRadius: 9999,
    },
    stats: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#90a0ca',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 1,
    },
    statsItem: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        borderLeftWidth: 1,
        borderColor: 'rgba(189, 189, 189, 0.32)',
    },
    statsItemText: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 18,
        color: '#778599',
        marginBottom: 5,
    },
    statsItemValue: {
        fontSize: 12,
        fontWeight: '500',
        lineHeight: 18,
        textAlign: 'center',
        color: '#121a26',
    },
    card: {
        width: CARD_WIDTH,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: '#fff',
        marginHorizontal: 6,
        shadowColor: '#90a0ca',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 1,
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardIcon: {
        width: 44,
        height: 44,
        borderRadius: 9999,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eff1f5',
    },
    cardBody: {
        paddingLeft: 12,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '600',
        lineHeight: 18,
        color: '#121a26',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 18,
        color: '#778599',
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 18,
    },
    cardFooterText: {
        fontSize: 13,
        fontWeight: '500',
        lineHeight: 18,
        color: '#778599',
    },
    qrCodeContainer: {
        alignItems: "center",
        marginVertical: 10,
    },
});