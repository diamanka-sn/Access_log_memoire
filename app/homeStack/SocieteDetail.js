import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    Animated,
    SafeAreaView,
    TouchableOpacity,
    Image,
    Text,
    ActivityIndicator, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { TextInput } from "react-native-gesture-handler";
import FeatherIcon from 'react-native-vector-icons/Feather';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, API_URL_AUTH } from "../context/AuthContext";
import { HEURES, formatDateToYYYYMMDDHHMM, getBadgeStyles } from "../context/utils";
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from "axios";
import { Dropdown } from "react-native-element-dropdown";
import RBSheet from "react-native-raw-bottom-sheet";
import moment from "moment";


const HEADER_OFFSET = 100;
const HEADER_BACKGROUND = {
    default: 'rgba(255,255,255,0)',
    scroll: 'rgba(255,255,255,1)',
};

export default function Recherche() {

    const route = useRoute();
    const [camion, setCamion] = useState([])
    const refRBSheet = useRef();
    const resumeRBSheet = useRef();
    const [resume, setResumme] = useState([])
    const [heure, setHeure] = useState([])
    const [isAdmin, setIsAdmin] = useState(null)
    const [loading, setLoading] = useState(false);
    const [loadingC, setLoadingC] = useState(false);
    const [form, setForm] = useState({
        immatriculation: '',
        date: new Date(),
        motif: '',
        duration: '',
        showDatePicker: false,
    });

    const [data, setData] = useState({
        immatriculation: '',
        categorie: '',
    });
    const resetForm = () => {
        setForm({
            immatriculation: '',
            date: new Date(),
            motif: '',
            duration: '',
            showDatePicker: false,
        });
    };
    const navigation = useNavigation()
    const { params } = route;
    useEffect(() => {
        navigation.setOptions({

        });
    }, [navigation]);
    const fetchData = async () => {
        try {
            let response;
            if (params.societe?.statut !== 'Locataire') {
                response = await axios.get(`${API_URL}/gestion-interne/camion/find-allCamionInsocieteTierce/${params.societe?.id}`)
            } else {
                response = await axios.get(`${API_URL}/gestion-interne/camion/find-allCamion`,)
            }

            const data = response.data;

            const options = data.map(item => ({
                label: item.immatriculation,
                value: item.id,
            }));
            const o = HEURES.map(item => ({
                label: item.label,
                value: item.value
            }))
            setCamion(options);
            setHeure(o)
        } catch (error) {
            console.error('Erreur lors du chargement des données depuis l\'API :', error);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const u = await AsyncStorage.getItem("role");

                if (u !== null) {
                    const parsedUser = JSON.parse(u);
                    setIsAdmin(parsedUser === 'admin');
                }
            } catch (e) {
                console.error("Erreur lors de la lecture de la valeur :", e);
            }
        })();

        fetchData()
    }, []);

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || form.date;
        setForm({
            ...form,
            date: currentDate,
            showDatePicker: false,
        });
    };

    const handleChange = (key, value) => {
        setData({
            ...data,
            [key]: value,
        });
    };

    const ajouterCamion = async () => {
        if (!data.immatriculation || !data.categorie) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs.")
            return;
        }

        let d = {
            immatriculation: data.immatriculation.trim(),
            categorie: data.categorie.trim()
        }

        Alert.alert(
            "Confirmation",
            "Voulez-vous ajouter le camion " + data.immatriculation + " ?",
            [
                {
                    text: "Annuler",
                    style: "cancel",
                    onPress: () => setLoadingC(false)
                },
                {

                    text: "OK",
                    onPress: async () => {
                        setLoadingC(true);
                        try {
                            let response;
                            if (params.societe?.statut !== 'Locataire') {
                                response = await axios.post(`${API_URL}/gestion-interne/camion/add-camionToSocieteTierce/${params.societe?.id}`, d)
                            } else {
                                response = await axios.post(`${API_URL}/gestion-interne/camion/add-camion`, d)
                            }
                            const a = response.data
                            if (!a.error) {
                                Alert.alert("Succes", a.message)
                                setData({
                                    immatriculation: '',
                                    categorie: ''
                                })
                                await fetchData()
                            } else {
                                Alert.alert("Erreur", a.message)
                            }
                        } catch (error) {
                            console.log("error")
                            console.error('Erreur ', error)
                        } finally {
                            setLoadingC(false)
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    }

    const planifier = async () => {
        if (!form.motif.trim() || !form.duration || !form.date || !form.immatriculation) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs.");
            return;
        }
        let data = {
            motif: form.motif.trim(),
            duration: form.duration.value,
            startedAt: formatDateToYYYYMMDDHHMM(form.date)
        }
        console.log(data)
        Alert.alert(
            "Confirmation",
            "Voulez-vous vraiment planifier ce rendez-vous?",
            [
                {
                    text: "Annuler",
                    style: "cancel",
                    onPress: () => setLoading(false)
                },
                {

                    text: "OK",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const i = parseInt(form.immatriculation.value)
                            let response;
                            if (isLocataire) {
                                response = await axios.post(`${API_URL_AUTH}/commun/rendez-vous/demander-rv-camion/${i}/${params.societe.id}`, data);
                            } else {
                                response = await axios.post(`${API_URL_AUTH}/gestion-interne/rendez-vous/create-rv-camion/${i}`, data);
                            }

                            const a = response.data
                            if (!a.error) {
                               // Alert.alert("Succès", a.message);
                                resetForm()
                                setResumme(form)
                                resumeRBSheet.current.open()
                            } else {
                                Alert.alert("Erreur", a.message);
                            }
                        } catch (error) {
                            console.log(error)
                            Alert.alert("Erreur", "Erreur lors de la planification du rendez-vous.");
                        } finally {
                            setLoading(false)
                        }
                    }
                }
            ],
            { cancelable: false }
        );

    }

    const isLocataire = params.societe.statut === 'Locataire'
    const p = isLocataire ? params.societe.espace.occupe === params.societe.espace.capacite : false;
    const stats = [
        { label: 'Téléphone', icon: 'phone', color: '#007bff', value: params.societe.telephone },
        { label: 'Espace', icon: 'square', color: '#007bff', value: params.societe.statut === 'Locataire' ? params.societe.espace.occupe + '/' + params.societe.espace.capacite + ' places' : 'Pas d\'espace' },
        { label: 'Ninea', icon: 'layers', color: '#007bff', value: params.societe.ninea },
    ];
    const scrollY = React.useRef(new Animated.Value(0)).current;
    const backgroundColor = scrollY.interpolate({
        inputRange: [0, HEADER_OFFSET, HEADER_OFFSET + 10],
        outputRange: [
            HEADER_BACKGROUND.default,
            HEADER_BACKGROUND.default,
            HEADER_BACKGROUND.scroll,
        ],
    });

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Animated.View style={[styles.actions, { backgroundColor }]}>
                <SafeAreaView>
                    <View style={styles.actionWrapper}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.goBack()
                            }}
                            style={{ marginRight: 'auto' }}>
                            <View style={[styles.action, styles.actionFilled]}>
                                <FeatherIcon
                                    color="#4285F4"
                                    name="chevron-left"
                                    size={24} />
                            </View>
                        </TouchableOpacity>


                    </View>
                </SafeAreaView>
            </Animated.View>
            <ScrollView
                style={styles.container}
                onScroll={Animated.event(
                    [
                        {
                            nativeEvent: {
                                contentOffset: {
                                    y: scrollY,
                                },
                            },
                        },
                    ],
                    { useNativeDriver: false },
                )}
                scrollEventThrottle={1}>
                <View style={styles.hero}>
                    <Image
                        alt=""
                        style={styles.heroImg}
                        source={require("../../assets/logo.png")}
                    />
                    {isLocataire && (
                        <View style={[styles.heroStatus, p ? getBadgeStyles('danger') : getBadgeStyles('success')]}>
                            <Text style={styles.heroStatusText}>{p ? 'Indisponible' : 'Disponible'}</Text>
                        </View>
                    )}
                </View>
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <Text style={styles.title}> {params.societe.nom}</Text>
                        <TouchableOpacity
                            onPress={() => refRBSheet.current.open()}
                            style={styles.headerTopAction}>
                            <FeatherIcon color="#4285F4" name="truck" size={24} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.headerLocation}>
                        <FeatherIcon color="#4285F4" name="map-pin" size={14} />

                        <Text style={styles.headerLocationText}>
                            Rue {params.societe.rue + ', ' + params.societe.region + ', ' + params.societe.pays}
                        </Text>
                    </View>
                    <View style={styles.stats}>
                        {stats.map(({ label, value, icon, color }, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.statsItem,
                                    index === 0 && { borderLeftWidth: 0 },
                                ]}>
                                <Text style={styles.statsItemText}>{label}</Text>

                                <View style={styles.statsItemContent}>
                                    <FeatherIcon
                                        color={color}
                                        name={icon}
                                        size={16} />

                                    <Text style={styles.statsItemValue}>{value}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
                <View style={styles.content}>
                    <View style={styles.categoriesHeader}>
                        <Text style={styles.categoriesTitle}>Planifier un rendez-vous</Text>

                    </View>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1, alignItems: 'center', width: '100%' }}
                    >
                        <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 10, position: 'relative', width: '100%' }}>
                            <View style={{ width: '90%', marginTop: 10 }}>

                                <Dropdown
                                    data={camion}
                                    search
                                    labelField="label"
                                    valueField="value"
                                    placeholderStyle={{ color: '#4285F4', fontSize: 15, fontWeight: 'bold' }}
                                    containerStyle={{ width: "90%", borderRadius: 12 }}
                                    placeholder={'Choisir un camion'}
                                    searchPlaceholder="Rechercher"
                                    inputSearchStyle={{ borderRadius: 12, }}
                                    onChange={(immatriculation) => setForm({ ...form, immatriculation })}
                                    style={{
                                        height: 44,
                                        backgroundColor: '#f1f5f9',
                                        paddingHorizontal: 16,
                                        borderRadius: 12,
                                        fontSize: 15,
                                        fontWeight: '500',
                                        color: '#222',
                                    }}
                                />
                            </View>
                            <View style={{ marginTop: 10, width: '90%' }}>
                                <Text style={{ fontSize: 14, marginBottom: 10, color: '#4285F4', fontWeight: 'bold', }}>Motif du rendez-vous</Text>
                                <TextInput
                                    placeholder="Motif du rendez-vous"
                                    placeholderStyle={{ color: 'gray' }}
                                    secureTextEntry={true}
                                    style={{
                                        backgroundColor: '#f1f5f9',
                                        paddingHorizontal: 16,
                                        borderRadius: 12,
                                        fontSize: 15,
                                        fontWeight: '500',
                                        color: '#222',
                                        height: 100,
                                    }}
                                    multiline={true}
                                    onChangeText={(motif) => setForm({ ...form, motif })}
                                    value={form.motif}
                                />
                            </View>
                            <View style={{ width: '90%' }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: 2,
                                        marginTop: 20
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: 14, color: '#4285F4', fontWeight: 'bold',
                                            maxWidth: '60%'
                                        }}>
                                        Date et heure
                                    </Text>
                                    <DateTimePicker
                                        style={{
                                            borderRadius: 12,
                                            fontSize: 15,
                                        }}
                                        minimumDate={new Date()}
                                        minuteInterval={5}
                                        value={form.date}
                                        mode="datetime"
                                        locale="fr"
                                        is24Hour={true}
                                        display="default"
                                        onChange={handleDateChange} />
                                </View>
                            </View>
                            <View style={{ width: '90%' }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: 2,
                                        marginTop: 20,
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
                                            placeholder={'Choisir la marge de retard'}
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
                            <TouchableOpacity
                                style={{
                                    height: 50,
                                    backgroundColor: !loading ? '#4285F4' : 'gray',
                                    width: '90%',
                                    padding: 10,
                                    borderRadius: 10,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: 80,
                                }}
                                onPress={planifier}
                                disabled={loading}
                            >
                                {loading ? (
                                    <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 17 }}> <ActivityIndicator size={17} color="white" style={{ marginRight: 8 }} /> Planifier un rendez-vous</Text>
                                ) : (
                                    <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 17 }}>Planifier un rendez-vous</Text>
                                )}
                            </TouchableOpacity>

                        </View>
                    </KeyboardAvoidingView>
                </View>
            </ScrollView>
            <RBSheet
                customStyles={{ container: styles.sheet }}
                height={320}
                ref={refRBSheet}>
                <View style={styles.headerSheet}>
                    <Text style={styles.headerTitleSheet}>Nouveau camion</Text>
                </View>

                <View style={styles.body}>
                    <View style={styles.input}>
                        <Text style={styles.inputLabel}>Immatriculation</Text>

                        <TextInput
                            style={styles.inputControl}
                            placeholder="Numéro d'immatriculation du camion"
                            value={data.immatriculation}
                            onChangeText={(text) => handleChange('immatriculation', text)}
                        />
                    </View>

                    <View style={styles.input}>
                        <Text style={styles.inputLabel}>Catégorie</Text>

                        <TextInput
                            style={styles.inputControl}
                            placeholder="Catégorie du camion"
                            value={data.categorie}
                            onChangeText={(text) => handleChange('categorie', text)}
                        />
                    </View>
                    <View style={styles.bodyGap} />

                    <TouchableOpacity
                        onPress={ajouterCamion}>
                        <View style={styles.btn}>
                            {loadingC ? (
                                <Text style={styles.btnText}> <ActivityIndicator size={17} color="white" style={{ marginRight: 8 }} /> En cours ... </Text>
                            ) : (
                                <Text style={styles.btnText}>Ajouter un nouveau camion</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            </RBSheet>

            <RBSheet
                customStyles={{ container: styles.sheet }}
                height={600}
                ref={resumeRBSheet}>
                <View style={styles.headerSheet}>
                    <Text style={styles.headerTitleSheet}>Resumé du rendez-vous</Text>
                </View>

                <View style={{ flex: 1 }}>
                    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                        <View style={styles.containerResume}>
                            <View style={styles.rowResume}>
                                <Text style={styles.rowField}>Date</Text>

                                <Text style={styles.rowValue}>{moment(resume.date).locale('fr').format('DD-MM-YYYY HH:mm')}</Text>
                            </View>
                            <View style={styles.rowResume}>
                                <Text style={styles.rowField}>Marge</Text>

                                <Text style={styles.rowValue}>{resume.duration?.label}</Text>
                            </View>

                            <View style={styles.rowResume}>
                                <Text style={styles.rowField}>Société</Text>

                                <View style={styles.badgeResume}>
                                    <Text style={styles.badgeTextResume}>{params.societe?.nom}</Text>
                                </View>
                            </View>

                            <View style={[styles.rowResume, { alignItems: 'flex-start' }]}>
                                <Text style={styles.rowField}>Camions</Text>

                                <View style={styles.rowList}>
                                    <View >
                                        <Text style={styles.rowUserTextResme}>{resume.immatriculation?.label}</Text>
                                    </View>
                                </View>
                            </View>
                            <Text style={styles.subtitleResume}>Motif du rendez-vous</Text>
                            <Text style={styles.paragraphResume}>
                                {resume.motif}
                            </Text>



                        </View>
                    </SafeAreaView>

                    <View style={styles.overlayResume}>
                        <TouchableOpacity
                            onPress={() => {
                                // handle onPress
                            }}
                            style={{ flex: 1, paddingHorizontal: 24 }}>
                            <View style={styles.btnResume}>
                                <Text style={styles.btnTextResume}>Télécharger pdf</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </RBSheet>

        </View>
    );
}

const styles = StyleSheet.create({
    actions: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9,
        paddingVertical: 12,
    },
    container: {
        backgroundColor: '#F4F5F6',
    },
    title: {
        fontSize: 32,
        fontWeight: '600',
        lineHeight: 38,
        letterSpacing: -0.015,
        color: '#323142',
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        marginBottom: 6,
    },
    /** Action */
    action: {
        width: 36,
        height: 36,
        borderRadius: 12,
        marginHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginHorizontal: -8,
        paddingHorizontal: 16,
    },
    actionFilled: {
        backgroundColor: '#e8f0f9',
    },
    /** Hero */
    hero: {
        position: 'relative',
    },
    heroImg: {
        width: '100%',
        height: 200,
    },
    heroStatus: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        paddingVertical: 4,
        paddingHorizontal: 12,
        backgroundColor: 'green',
        borderRadius: 50,
    },
    heroStatusText: {
        fontSize: 14,
        lineHeight: 18,
        fontWeight: '600',
        letterSpacing: 0.1,
        color: '#ffffff',
    },
    /** Header */
    header: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    headerTopAction: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        width: 44,
        height: 44,
        maxWidth: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
        backgroundColor: '#f1f3f4',
        borderRadius: 9999,
    },
    headerLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    headerLocationText: {
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: -0.01,
        color: '#323142',
        opacity: 0.7,
        marginLeft: 4,
    },
    /** Stats */
    stats: {
        flexDirection: 'row',
    },
    statsItem: {
        flexDirection: 'column',
        alignItems: 'center',
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    statsItemText: {
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 20,
        color: '#323142',
        opacity: 0.7,
        marginBottom: 4,
    },
    statsItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsItemValue: {
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 24, color: '#778599',
        marginLeft: 4,
    },
    /** Content */
    content: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingVertical: 20,
        marginTop: 8,
    },
    contentTabs: {
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    contentTabsItemWrapper: {
        marginRight: 28,
        borderColor: 'transparent',
        borderBottomWidth: 2,
        borderBottomStyle: 'solid',
    },
    contentTabsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 4,
    },
    contentTabsItemText: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 24,
        color: '#706f7b',
    },
    contentTabsItemBadge: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginLeft: 8,
        backgroundColor: '#ff9801',
        borderRadius: 20,
    },
    contentTabsItemBadgeText: {
        fontWeight: '600',
        fontSize: 11,
        lineHeight: 12,
        color: '#fff',
    },
    /** Categories */

    categoriesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    categoriesTitle: {
        fontWeight: '600',
        fontSize: 20,
        lineHeight: 28,
        color: '#323142',
    },
    categoriesAction: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    categoriesActionText: {
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 20,
        color: '#706f7b',
        marginRight: 2,
    },
    categoriesContent: {
        paddingVertical: 12,
        paddingHorizontal: 14,
    },

    placeholder: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        height: 400,
        marginTop: 0,
        padding: 20,
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
    sheet: {
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
    },
    headerSheet: {
        borderBottomWidth: 1,
        borderColor: '#efefef',
        padding: 16,
    },
    headerTitleSheet: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
    },
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
    /** Button */
    btn: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        backgroundColor: '#4285F4',
        borderColor: '#4285F4',
    },
    btnText: {
        fontSize: 17,
        lineHeight: 24,
        fontWeight: '600',
        color: '#fff',
    },
    btnSecondary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        backgroundColor: 'transparent',
        borderColor: '#dddce0',
    },
    btnSecondaryText: {
        fontSize: 17,
        lineHeight: 24,
        fontWeight: '600',
        color: '#000',
    }, inputLabel: {
        fontSize: 17,
        fontWeight: '600',
        color: '#222',
        marginBottom: 8,
    },
    inputControl: {
        height: 44,
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 10,
        borderRadius: 12,
        fontSize: 15,
        fontWeight: '500',
        color: '#222',
    }



    ,

    containerResume: {
        paddingVertical: 0,
        paddingHorizontal: 16,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    titleResume: {
        fontSize: 23,
        fontWeight: '600',
        color: '#1e1e1e',
        marginTop: 12,
        marginBottom: 10,
    },

    subtitleResume: {
        fontSize: 19,
        fontWeight: '600',
        color: '#1e1e1e',
        marginTop: 10,
        marginBottom: 8,
    },
    paragraphResume: {
        fontSize: 14,
        lineHeight: 20,
        color: '#444444',
        marginBottom: 16,
    },

    overlayResume: {
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

    rowResume: {
        marginVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    rowField: {
        fontSize: 15,
        fontWeight: '600',
        color: '#0e0e0e',
        width: 130,
    },
    rowValue: {
        fontSize: 15,
        fontWeight: '500',
        color: '#171717',
    },
    rowList: {
        flexDirection: 'column',
    },

    /** Badge */
    badgeResume: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffa500',
    },
    badgeTextResume: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
    },

    /** Button */
    btnResume: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        backgroundColor: '#24232A',
        borderColor: '#24232A',
    },
    btnTextResume: {
        fontSize: 18,
        lineHeight: 26,
        fontWeight: '600',
        color: '#fff',
    },
});