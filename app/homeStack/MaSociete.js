import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { API_URL, API_URL_AUTH } from '../context/AuthContext';
import { validateEmail } from '../context/utils';
import ListEmploye from '../components/ListEmploye';
import ListCamion from '../components/ListCamion';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListRendezVous from '../components/ListRendezVous';
import Vide from '../empty/Vide';
export default function MaSociete() {
    const [value, setValue] = React.useState(0);
    const employeSheet = useRef();
    const camionSheet = useRef();
    const [rdv, setRdv] = useState([]);
    const [employe, setEmploye] = useState([])
    const [camion, setCamion] = useState([])
    const [Loading, setLoading] = useState(false)
    const [data, setData] = useState({
        immatriculation: '',
        categorie: '',
    });
    const [form, setForm] = useState({
        prenom: '',
        nom: '',
        email: '',
        telephone: ''
    })
    const handleChangeCamion = (key, value) => {
        setData({
            ...data,
            [key]: value,
        });
    };
    const handleChangeForm = (key, value) => {
        setForm({
            ...form,
            [key]: value,
        });
    };

    const fetchRdv = async () => {
        try {
            const value = await AsyncStorage.getItem("societe");
            const soc = JSON.parse(value)
            const response = await axios.get(`${API_URL_AUTH}/gestion-interne/rendez-vous/all-rendez-vous`);
            const rdv = await response.data.filter(m => m.societeOrigne?.id === soc?.id)
            setRdv(rdv)
        } catch (error) {
            setRdv([])
            console.log(error)
        }
    };

    const getAllCamion = async () => {
        try {
            const response = await axios.get(`${API_URL}/gestion-interne/camion/find-allCamion`)
            setCamion(response.data)
        } catch (error) {
            console.error("Erreur de recuperation ", error)
        }

    }

    const getAllEmploye = async () => {
        try {
            const response = await axios.get(`${API_URL}/gestion-interne/personne/find-allPersonneBySociete`);
            setEmploye(response.data)

        } catch (error) {
            console.error("Erreur de recuperation ", error)
        }
    }

    useEffect(() => {
        getAllEmploye()
        getAllCamion()
        fetchRdv()
    }, [])

    const tabs = [
        {
            name: 'Employés', icon: 'users', data: employe?.length !== 0 ? (<ListEmploye employe={employe} getAllEmploye={getAllEmploye} />) : (<Vide message={'La société n\'a pas d\'employé. \nVous pouvez ajouter un nouveau en utilisant le bouton situé en haut à gauche.'}/>)
        },
        {
            name: 'Camions', icon: 'truck', data: camion?.length !== 0 ? (<ListCamion camion={camion} getAllCamion={getAllCamion} />) : (<Vide message={'La société n\'a pas de camions. \nVous pouvez ajouter un nouveau en utilisant le bouton situé en haut à droite.'}/>)
        },
        {
            name: 'Rendez-vous', icon: 'calendar', data: rdv?.length !== 0 ? (<ListRendezVous rdv={rdv} />) : (<Vide message={'La société n\'a pas de rendez-vous avec les autres sociétés locataires.'}/>)
        },
    ];

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
                            const response = await axios.post(`${API_URL}/gestion-interne/camion/add-camion`, d)

                            const a = response.data
                            if (!a.error) {

                                setData({
                                    immatriculation: '',
                                    categorie: ''
                                })
                                Alert.alert("Succés", a.message)
                                await getAllCamion()
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

    const ajouterEmploye = async () => {
        if (!form.email || !form.nom || !form.prenom || !form.telephone) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs.")
            return;
        }
        let d = {
            email: form.email.trim(),
            nom: form.nom.trim(),
            prenom: form.prenom.trim(),
            telephone: form.telephone.trim(),
            statut: 'Employe'
        }
        if (!validateEmail(d.email)) {
            Alert.alert("Erreur", "Format adresse email incorrect.")
            return;
        }
        Alert.alert(
            "Confirmation",
            "Voulez-vous ajouter " + form.prenom +" "+ form.nom + " ?",
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
                            const response = await axios.post(`${API_URL}/gestion-interne/personne/add-personne`, d)

                            const a = response.data
                            if (!a.error) {
                                Alert.alert("Succes", form.prenom + ' ' + form.nom + " a été ajouté avec succès")
                                setForm({
                                    prenom: '',
                                    nom: '',
                                    email: '',
                                    telephone: ''
                                })
                                await getAllEmploye()
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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => employeSheet.current.open()} style={styles.title}>
                        <FeatherIcon color={'#007bff'} name='user-plus' size={25} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => camionSheet.current.open()} style={styles.title}>
                        <FeatherIcon color={'#007bff'} name='plus' size={25} />
                    </TouchableOpacity>
                </View>
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
                {tabs[value].data}
            </View>

            <RBSheet
                customStyles={{ container: styles.sheet }}
                height={320}
                ref={camionSheet}>
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
                            onChangeText={(text) => handleChangeCamion('immatriculation', text)}
                        />
                    </View>

                    <View style={styles.input}>
                        <Text style={styles.inputLabel}>Catégorie</Text>

                        <TextInput
                            style={styles.inputControl}
                            placeholder="Catégorie du camion"
                            value={data.categorie}
                            onChangeText={(text) => handleChangeCamion('categorie', text)}
                        />
                    </View>
                    <View style={styles.bodyGap} />

                    <TouchableOpacity onPress={ajouterCamion}>
                        <View style={styles.btn}>
                            {Loading ? (<Text style={styles.btnText}> <ActivityIndicator size={17} color="white" style={{ marginRight: 8 }} /> Nouveau camion</Text>) : (
                                <Text style={styles.btnText}>Nouveau camion</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            </RBSheet >

            <RBSheet
                customStyles={{ container: styles.sheet }}
                height={450}
                ref={employeSheet}>
                <View style={styles.headerSheet}>
                    <Text style={styles.headerTitleSheet}>Nouveau employé</Text>
                </View>

                <View style={styles.body}>
                    <View style={styles.input}>
                        <Text style={styles.inputLabel}>Prénom</Text>

                        <TextInput
                            style={styles.inputControl}
                            placeholder="Prénom de l'employé"
                            value={form.prenom}
                            onChangeText={(text) => handleChangeForm('prenom', text)}
                        />
                    </View>
                    <View style={styles.input}>
                        <Text style={styles.inputLabel}>Nom</Text>
                        <TextInput
                            style={styles.inputControl}
                            placeholder="Nom de l'employé"
                            value={form.nom}
                            onChangeText={(text) => handleChangeForm('nom', text)}
                        />
                    </View>
                    <View style={styles.input}>
                        <Text style={styles.inputLabel}>Adresse email</Text>
                        <TextInput
                            keyboardType='email-address'
                            style={styles.inputControl}
                            placeholder="Adresse email"
                            value={form.email}
                            onChangeText={(text) => handleChangeForm('email', text)}
                        />
                    </View>

                    <View style={styles.input}>
                        <Text style={styles.inputLabel}>Téléphone</Text>

                        <TextInput
                            keyboardType='numeric'
                            style={styles.inputControl}
                            placeholder="Numéro de téléphone"
                            value={form.telephone}
                            onChangeText={(text) => handleChangeForm('telephone', text)}
                        />
                    </View>
                    <View>
                        <TouchableOpacity onPress={ajouterEmploye}>
                            <View style={styles.btn}>
                                {Loading ? (<Text style={styles.btnText}> <ActivityIndicator size={17} color="white" style={{ marginRight: 8 }} /> Nouveau employé</Text>) : (
                                    <Text style={styles.btnText}>Nouveau employé</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bodyGap} />
                </View>
            </RBSheet>
        </SafeAreaView >
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
        flexDirection: 'row',
        paddingHorizontal: 16,
        fontSize: 32,
        fontWeight: '700',
        color: '#1d1d1d',
        marginBottom: 12,
        // textAlign: 'right'
    },
    titleEmploye: {
        paddingHorizontal: 16,
        fontSize: 32,
        fontWeight: '700',
        color: '#1d1d1d',
        marginBottom: 12,
    },
    tabs: {
        flexDirection: 'row',
    },
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


    dropdownContainer: {
        position: 'absolute',
        top: 35, // Adjust this value based on your layout
        right: 10, // Adjust this value based on your layout
        backgroundColor: '#fff',
        elevation: 5,
        borderRadius: 5,
    },
    button: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
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
});