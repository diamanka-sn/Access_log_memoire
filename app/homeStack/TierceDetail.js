import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    SafeAreaView,
    Text,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import RBSheet from 'react-native-raw-bottom-sheet';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { API_URL, API_URL_AUTH } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { HEURES, formatDateToYYYYMMDDHHMM } from '../context/utils';
import { Dropdown } from 'react-native-element-dropdown';
import RendezVous from '../components/RendezVous';

const items = [
    { name: 'Société' },
    { name: 'Camions' },
];
export default function TierceDetail() {
    const [heure, setHeure] = useState([])
    const [selectedCamion, SetSelectedCamion] = useState([])

    const [loading, setLoading] = useState(false);
    const route = useRoute();
    const [camions, setCamions] = useState([])
    const [rdv, setRdv] = useState([])
    const refRBSheet = useRef();
    const rdvSheet = useRef();
    const modifierSheet = useRef();
    const [value, setValue] = React.useState(0);
    const navigation = useNavigation()
    const { params } = route;
    const [data, setData] = useState({
        immatriculation: '',
        categorie: '',
    });

    const [form, setForm] = useState({
        motif: '',
        duration: '',
        date: new Date()
    })

    const getCamions = async () => {
        const response = await axios.get(`${API_URL}/gestion-interne/camion/find-allCamionInsocieteTierce/${params.societe?.id}`)
        setCamions(response.data)
    }

    const getAllrdv = async () => {
        try {
            const value = await AsyncStorage.getItem("societe");
            const soc = JSON.parse(value)
            const response = await axios.get(`${API_URL_AUTH}/gestion-interne/rendez-vous/all-rendez-vous`)
            const a = await response.data.filter(m => m.societeOrigne.id === params.societe?.id && m.societeLocataireId === soc.id)
            setRdv(a)
            console.log(rdv)
        } catch (error) {
            console.error("Erreur", error)
        }
    }

    const handleChange = (key, value) => {
        setData({
            ...data,
            [key]: value,
        });
    };

    useEffect(() => {
        const o = HEURES.map(item => ({
            label: item.label,
            value: item.value
        }))
        setHeure(o)
        getCamions()
        getAllrdv()
    }, [])

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
                    onPress: () => setLoading(false)
                },
                {

                    text: "OK",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const response = await axios.post(`${API_URL}/gestion-interne/camion/add-camionToSocieteTierce/${params.societe?.id}`, d)

                            const a = response.data
                            if (!a.error) {
                                Alert.alert("Succes", a.message)
                                setData({
                                    immatriculation: '',
                                    categorie: ''
                                })
                                await getCamions()
                            } else {
                                Alert.alert("Erreur", a.message)
                            }
                        } catch (error) {
                            console.error('Erreur ', error)
                        } finally {
                            setLoading(false)
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    }

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || form.date;
        setForm({
            ...form,
            date: currentDate,
            showDatePicker: false,
        });
    };


    const handleSupprimer = async (camion) => {
        Alert.alert(
            "Confirmation",
            "Voulez-vous supprimer le camion " + camion.immatriculation + " ?",
            [
                {
                    text: "NON",
                    style: "cancel",
                },
                {

                    text: "OUI",
                    onPress: async () => {
                        alert('supprimer')
                    }
                }
            ],
            { cancelable: false }
        );
    }

    const handleModifier = async (camion) => {
        SetSelectedCamion(camion)
        modifierSheet.current.open()
    }

    const submitModifierCamion = async () => {
        let d = {
            id: selectedCamion.id,
            immatriculation: data.immatriculation.trim() ? data.immatriculation.trim() : selectedCamion.immatriculation,
            categorie: data.categorie.trim() ? data.categorie.trim() : selectedCamion.categorie
        }

        Alert.alert(
            "Confirmation",
            "Voulez-vous ajouter le camion " + selectedCamion.immatriculation + " ?",
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
                            const response = await axios.put(`${API_URL}/gestion-interne/camion/update-camionInsocieteTierce/${selectedCamion?.id}`, d)


                            const a = response.data
                            if (!a.error) {
                                Alert.alert("Succes", a.message)
                                setData({
                                    immatriculation: '',
                                    categorie: ''
                                })

                                await getCamions()
                                modifierSheet.current.close()
                            } else {
                                Alert.alert("Erreur", a.message)
                            }
                        } catch (error) {
                            console.error('Erreur ', error)
                        } finally {
                            setLoading(false)
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    }

    const planifierRdv = async (camion) => {
        SetSelectedCamion(camion)
        rdvSheet.current.open()
    }

    const handlePlanifierRdv = async () => {
        alert('Bonjour')
        if (!form.date || !form.duration || !form.motif) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs.")
            return;
        }
        let data = {
            motif: form.motif.trim(),
            duration: form.duration.value,
            startedAt: formatDateToYYYYMMDDHHMM(form.date)
        }
        Alert.alert(
            "Confirmation",
            "Voulez-vous vraiment planifier ce rendez-vous?",
            [
                {
                    text: "Annuler",
                    style: "cancel",
                },
                {
                    text: "Confirmer",
                    onPress: async () => {
                        try {
                            const response = await axios.post(`${API_URL_AUTH}/gestion-interne/rendez-vous/create-rv-camion/${selectedCamion.id}`, data);
                            const a = response.data
                            if (!a.error) {
                                // Alert.alert("Succès", a.message);
                                setForm({
                                    motif: '',
                                    date: new Date()
                                })
                                rdvSheet.current.close()
                            } else {
                                Alert.alert("Erreur", a.message);
                            }
                        } catch (error) {
                            Alert.alert("Erreur", "Erreur lors de la planification du rendez-vous." + error);
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
            <View style={styles.actions}>
                <SafeAreaView>
                    <View style={styles.actionWrapper}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.goBack()
                            }}
                            style={{ marginRight: 'auto' }}>
                            <View style={styles.action}>
                                <FeatherIcon
                                    color="#242329"
                                    name="chevron-left"
                                    size={20} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => refRBSheet.current.open()}>
                            <View style={styles.action}>
                                <FeatherIcon
                                    color="#242329"
                                    name="truck"
                                    size={18} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.tabs}>
                        {items.map(({ name }, index) => {
                            const isActive = index === value;
                            return (
                                <TouchableOpacity
                                    key={name}
                                    onPress={() => {
                                        setValue(index);
                                    }}
                                    style={styles.tabsItemWrapper}>
                                    <View style={styles.tabsItem}>
                                        <Text
                                            style={[
                                                styles.tabsItemText,
                                                isActive && { color: '#007bff' },
                                            ]}>
                                            {name}
                                        </Text>
                                    </View>

                                    {isActive && <View style={styles.tabsItemLine} />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </SafeAreaView>
            </View>


            {items[value].name === 'Société' && (
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{params.societe?.nom}</Text>
                    <View style={styles.headerRow}>
                        <View style={styles.headerLocation}>
                            <FeatherIcon
                                color="#7B7C7E"
                                name="map-pin"
                                size={14} />

                            <Text style={styles.headerLocationText}>
                                Rue {params.societe?.rue + ', ' + params.societe?.region + ', ' + params.societe?.pays}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.headerRow}>
                        <View style={styles.headerStars}>

                            <Text style={styles.headerStarsText}>{params.societe?.email}</Text>
                        </View>
                        <Text style={styles.headerDistance}>{params.societe?.telephone}</Text>
                    </View>
                    <View style={styles.headerRow}>
                        <View style={styles.headerStars}>

                            <Text style={styles.headerStarsText}>NINEA</Text>
                        </View>

                        <Text style={styles.headerDistance}>{params.societe?.ninea}</Text>
                    </View>
                    <View style={styles.headerRow}>
                        <View style={styles.headerStars}>

                            <Text style={styles.headerStarsText}>Registre de commerce</Text>
                        </View>

                        <Text style={styles.headerDistance}>{params.societe?.raisonSociale}</Text>
                    </View>
                </View>
            )}

            {items[value].name === 'Camions' && (
                <View style={styles.header}>
                    {camions?.length !== 0 ? (
                        <FlatList
                            data={camions?.slice(0, 30)}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.card}>
                                    <View style={styles.cardBody}>
                                        <View style={styles.cardHeader}>
                                            <Text style={styles.cardTitle}>{item.immatriculation}</Text>
                                            <Text style={[styles.cardPrice]}>

                                                {item.categorie}
                                            </Text>
                                        </View>
                                        <View style={styles.cardFooter}>

                                            <TouchableOpacity onPress={() => handleModifier(item)}>
                                                <FeatherIcon name="edit" size={20} color="#007bff" style={styles.icon} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => planifierRdv(item)}>
                                                <FeatherIcon name="calendar" size={20} color="green" style={styles.icon} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )}
                        />
                    ) : (
                        <View>
                            <Text style={{ color: 'gray', textAlign: 'center' }}>{'La société n\'a pas de camions. \nVous pouvez ajouter un nouveau camion en utilisant le bouton situé en haut à droite.'}</Text>
                        </View>
                    )}
                </View>
            )}

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
                        <View style={styles.btnSecondary}>
                            {loading ? (
                                <Text style={styles.btnSecondaryText}> <ActivityIndicator size={17} color="white" style={{ marginRight: 8 }} /> En cours ... </Text>
                            ) : (
                                <Text style={styles.btnSecondaryText}>Ajouter un nouveau camion</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            </RBSheet>

            {/* Modifier un camion */}
            <RBSheet
                customStyles={{ container: styles.sheet }}
                height={320}
                ref={modifierSheet}>
                <View style={styles.headerSheet}>
                    <Text style={styles.headerTitleSheet}>Modifier un camion</Text>
                </View>

                <View style={styles.body}>
                    <View style={styles.input}>
                        <Text style={styles.inputLabel}>Immatriculation</Text>

                        <TextInput
                            style={styles.inputControl}
                            placeholder="Numéro d'immatriculation du camion"
                            defaultValue={selectedCamion.immatriculation}
                            // value={data.immatriculation}
                            onChangeText={(text) => handleChange('immatriculation', text)}
                        />
                    </View>

                    <View style={styles.input}>
                        <Text style={styles.inputLabel}>Catégorie</Text>

                        <TextInput
                            style={styles.inputControl}
                            placeholder="Catégorie du camion"
                            defaultValue={selectedCamion.categorie}
                            // value={data.categorie}
                            onChangeText={(text) => handleChange('categorie', text)}
                        />
                    </View>
                    <View style={styles.bodyGap} />

                    <TouchableOpacity
                        onPress={submitModifierCamion}>
                        <View style={styles.btnSecondary}>
                            {loading ? (
                                <Text style={styles.btnSecondaryText}> <ActivityIndicator size={17} color="white" style={{ marginRight: 8 }} /> En cours ... </Text>
                            ) : (
                                <Text style={styles.btnSecondaryText}>Modifier</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            </RBSheet>

            {/* planifier un rendez-vous */}
            <RBSheet
                customStyles={{ container: styles.sheet }}
                height={450}
                ref={rdvSheet}>
                <View style={styles.headerSheet}>
                    <Text style={styles.headerTitleSheet}>Planifier un rendez-vous</Text>
                </View>
                <View style={styles.body}>
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
                            onChange={handleDateChange}
                        />
                    </View>
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
                    <View style={styles.bodyGap} />
                    <TouchableOpacity
                        onPress={handlePlanifierRdv}>
                        <View style={styles.btnSecondary}>
                            {loading ? (
                                <Text style={styles.btnSecondaryText}> <ActivityIndicator size={17} color="white" style={{ marginRight: 8 }} /> En cours ... </Text>
                            ) : (
                                <Text style={styles.btnSecondaryText}>Planifier un rendez-vous</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            </RBSheet>
        </View>
    );
}

const styles = StyleSheet.create({

    headerSearch: {
        position: 'relative',
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    headerSearchIcon: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    headerSearchInput: {
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderStyle: 'solid',
        backgroundColor: '#fff',
        width: '100%',
        height: 40,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        fontWeight: '500',
        paddingLeft: 40,
        shadowColor: '#90a0ca',
        shadowOffset: {
            width: 4,
            height: 4,
        },
        // shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 2,
    },

    container: {
        width: '100%',
        margin: 'auto',
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
    actions: {
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
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
    footer: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    /** Action */
    action: {
        width: 36,
        height: 36,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderStyle: 'solid',
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
        marginBottom: 12,
    },
    /** Tabs */
    tabs: {
        flexDirection: 'row',
        paddingHorizontal: 0,
    },
    tabsItemWrapper: {
        marginRight: 28,
    },
    tabsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 4,
    },
    tabsItemText: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 20,
        color: '#7b7c7e',
    },
    tabsItemLine: {
        width: 20,
        height: 3,
        backgroundColor: '#007bff',
        borderRadius: 24,
    },
    /** Photos */
    photos: {
        paddingTop: 6,
        paddingHorizontal: 20,
        marginTop: 12,
        position: 'relative',
        height: 240,
        overflow: 'hidden',
        borderRadius: 12,
    },
    photosPagination: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: '#242329',
        borderRadius: 31,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
    photosPaginationText: {
        fontWeight: '500',
        fontSize: 12,
        lineHeight: 18,
        color: '#ffffff',
    },
    photosImg: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        width: '100%',
        height: 240,
        borderRadius: 12,
    },
    header: {
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontWeight: '700',
        fontSize: 22,
        lineHeight: 32,
        color: '#242329',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // marginTop: 4,
    },
    headerLocation: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLocationText: {
        fontWeight: '500',
        fontSize: 12,
        lineHeight: 20,
        color: '#7b7c7e',
        marginLeft: 4,
    },
    headerPrice: {
        fontWeight: '700',
        fontSize: 22,
        lineHeight: 32,
        textAlign: 'right',
        color: '#f26463',
    },
    headerStars: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerStarsText: {
        marginLeft: 8,
        fontWeight: '500',
        fontSize: 12,
        lineHeight: 20,
        color: '#7b7c7e',
    },
    headerDistance: {
        fontWeight: '500',
        fontSize: 12,
        lineHeight: 20,
        color: '#7b7c7e',
    },
    /** Picker */
    picker: {
        marginTop: 6,
        marginHorizontal: 20,
        paddingVertical: 8,
        paddingHorizontal: 20,
        height: 48,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e3e3e3',
        borderStyle: 'solid',
        borderRadius: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pickerDates: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pickerDatesText: {
        marginLeft: 8,
        fontWeight: '700',
        fontSize: 14,
        lineHeight: 18,
        color: '#242329',
    },
    pickerFilterWrapper: {
        borderLeftWidth: 1,
        borderColor: '#e5e5e5',
        paddingLeft: 12,
    },
    pickerFilter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pickerFilterItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 8,
    },
    pickerFilterItemText: {
        fontWeight: '700',
        fontSize: 14,
        lineHeight: 18,
        textAlign: 'center',
        color: '#242329',
        marginLeft: 4,
    },
    /** Stats */
    stats: {
        marginVertical: 16,
        marginHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statsItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statsItemText: {
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 18,
        color: '#242329',
        marginLeft: 7,
    },
    /** About */
    about: {
        marginHorizontal: 20,
    },
    aboutTitle: {
        fontWeight: '700',
        fontSize: 22,
        lineHeight: 32,
        color: '#242329',
        marginBottom: 4,
    },
    aboutDescription: {
        fontWeight: '500',
        fontSize: 12,
        lineHeight: 20,
        color: '#7b7c7e',
    },
    /** Button */
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 36,
        borderWidth: 1,
        backgroundColor: '#242329',
        borderColor: '#242329',
        height: 52,
    },
    btnText: {
        fontSize: 16,
        lineHeight: 26,
        fontWeight: '700',
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
        backgroundColor: '#007bff',
        borderColor: '#007bff',
        height: 52,
    },
    btnSecondaryText: {
        fontSize: 16,
        lineHeight: 26,
        fontWeight: '700',
        color: '#fff',
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
        // fontSize: 20,
        fontWeight: '500',
        // color: '#444',
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




    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        // borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});