import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Pressable,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import RBSheet from 'react-native-raw-bottom-sheet';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { fetchCountriesData } from '../context/utils';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';
import Tierce from '../components/Tierce';

export default function SocieteTierce() {
    const navigation = useNavigation()
    const [pays, setPays] = useState([]);
    const [societe, setSociete] = useState([]);
    const [region, setRegion] = useState([]);
    const [isRefreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);

        try {
            await getAllSocieteTierce();
        } catch (error) {
            console.error("Error during refresh:", error);
        } finally {
            setRefreshing(false);
        }
    };
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Partenaires externes',
            headerRight: () => (
                <Pressable onPress={() => this.RBSheet.open()}>
                    <FeatherIcon color="#007bff" name="plus" size={30} style={{ marginRight: 15 }} />
                </Pressable>)
        });
    }, [navigation]);
    const getAllSocieteTierce = async () => {
        try {
            const r = await axios.get(`${API_URL}/gestion-interne/societe/find-allSocieteTierce`)
            setSociete(r.data);
        } catch (error) {
            console.error('erreur ', error)
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchCountriesData();
                const regionData = await axios.get('https://galsenapi.pythonanywhere.com/api/departements/')
                    .then((res) => res.data);
                setRegion(regionData)

                setPays(data);
            } catch (error) {
                console.error('Error fetching countries data:', error);
            }
        };
        getAllSocieteTierce()
        fetchData();
    }, [])

    const [formData, setFormData] = useState({
        nom: '',
        ninea: '',
        email: '',
        telephone: '',
        raisonSociale: '',
        pays: '',
        region: '',
        rue: '',
        statut: 'Tierce'
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (key, value) => {
        if (key === 'pays') {
            setFormData({
                ...formData,
                [key]: value.value,
            });
        } else {
            setFormData({
                ...formData,
                [key]: value,
            });
        }
    };

    const ajouterSociete = async () => {
        if (formData.nom === '' || formData.ninea === '' || formData.email === '' || formData.pays === '' || formData.region === '' || formData.raisonSociale === '' || formData.rue === '' || !formData.telephone) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }
        Alert.alert(
            "Confirmation",
            "Voulez-vous vraiment ajouter la société " + formData.nom + " ?",
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
                            const response = await axios.post(`${API_URL}/gestion-interne/societe/add-societeTierce`, formData);
                            const a = response.data

                            if (!a.error) {
                                Alert.alert("Succès", a.message);
                                setFormData({
                                    nom: '',
                                    ninea: '',
                                    email: '',
                                    pays: '',
                                    region: '',
                                    raisonSociale: '',
                                    rue: '',
                                    telephone: '',
                                });
                                await getAllSocieteTierce()
                            } else {
                                Alert.alert("Erreur", a.message);
                            }
                        } catch (error) {
                            Alert.alert("Erreur", "Erreur lors de l'ajout de la société.");
                        } finally {
                            setLoading(false)
                        }
                    }
                }
            ],
            { cancelable: false }
        );


    };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            {societe.length !== 0 ? (
                <FlatList
                    data={societe?.slice(0, 30)}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (<Tierce societe={item} />)}
                    ListHeaderComponentStyle={{ backgroundColor: "#ccc" }}
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                />
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Aucune société tiérce disponible.</Text>
                </View>
            )}
            <RBSheet
                customStyles={{ container: styles.sheet }}
                height={650}
                ref={ref => {
                    this.RBSheet = ref;
                }}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Nouvelle société</Text>
                </View>

                <View style={styles.body}>
                    <View style={styles.input}>
                        <Text style={styles.inputLabel}>Nom de la société</Text>

                        <TextInput
                            style={styles.inputControl}
                            placeholder="Nom de la société"
                            value={formData.nom}
                            onChangeText={(text) => handleChange('nom', text)}
                        />
                    </View>
                    <View style={styles.input}>
                        <Text style={styles.inputLabel}>Adresse email</Text>
                        <TextInput
                            keyboardType='email-address'
                            style={styles.inputControl}
                            placeholder="Adresse email"
                            value={formData.email}
                            onChangeText={(text) => handleChange('email', text)}
                        />
                    </View>
                    <View style={styles.input}>
                        <Text style={styles.inputLabel}>Téléphone</Text>
                        <TextInput
                            keyboardType='phone-pad'
                            style={styles.inputControl}
                            placeholder="Numéro de téléphone"
                            value={formData.telephone}
                            onChangeText={(text) => handleChange('telephone', text)}
                        />
                    </View>
                    <View style={styles.input}>
                        <Text style={styles.inputLabel}>Registre de commerce</Text>

                        <TextInput
                            style={styles.inputControl}
                            placeholder="Registre de commerce"
                            value={formData.raisonSociale}
                            onChangeText={(text) => handleChange('raisonSociale', text)}
                        />
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1, marginRight: 5 }}>
                            <Text style={styles.inputLabel}>NINEA</Text>
                            <TextInput
                                keyboardType='numbers-and-punctuation'
                                style={styles.inputControl}
                                placeholder="NINEA"
                                value={formData.ninea}
                                onChangeText={(text) => handleChange('ninea', text)}
                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 5 }}>
                            <Text style={styles.inputLabel}>Pays</Text>
                            <Dropdown
                                data={pays}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholderStyle={{ color: 'gray', }}
                                containerStyle={{ borderRadius: 12, marginTop: 2 }}
                                placeholder={'Choisir un pays'}
                                searchPlaceholder="Rechercher"
                                inputSearchStyle={{ borderRadius: 12, }}
                                onChange={(text) => handleChange('pays', text)}
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
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: 1, marginRight: 5 }}>
                            <Text style={styles.inputLabel}>Région</Text>
                            <TextInput
                                style={styles.inputControl}
                                placeholder="Région"
                                value={formData.region}
                                onChangeText={(text) => handleChange('region', text)}
                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 5 }}>
                            <Text style={styles.inputLabel}>Rue</Text>
                            <TextInput
                                style={styles.inputControl}
                                placeholder="Rue"
                                value={formData.rue}
                                onChangeText={(text) => handleChange('rue', text)}
                            />
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity
                            onPress={ajouterSociete}
                            disabled={loading}
                        >
                            <View style={styles.btn}>
                                {loading ? (
                                    <Text style={styles.btnText}> <ActivityIndicator size={17} color="white" style={{ marginRight: 8 }} />  Ajout en cours</Text>
                                ) : (
                                    <Text style={styles.btnText}> Ajouter une nouvelle société</Text>
                                )}

                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bodyGap} />
                    <TouchableOpacity
                        onPress={() => {
                            this.RBSheet.close();
                        }}>
                        <View style={styles.btnSecondary}>
                            <Text style={styles.btnSecondaryText}>Fermer</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </RBSheet>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    container: {
        width: '100%',
        margin: 'auto',
    },
    sheet: {
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
    }, header: {
        borderBottomWidth: 1,
        borderColor: '#efefef',
        padding: 16,
    },
    headerTitle: {
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
    rowContainer: {
        flexDirection: 'row',
    },
    textContainer: {
        padding: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    societeText: {
        textTransform: 'uppercase',
        fontSize: 13,
        color: '#007bff',
        fontWeight: 'bold',
        marginRight: 10,
    },
    immatriculationText: {
        textTransform: 'uppercase',
        fontSize: 12,
        color: 'gray',
        fontWeight: 'bold',
        marginRight: 0,
    },
    dateText: {
        marginTop: 4,
        fontSize: 11,
        fontWeight: 'bold',
        color: 'gray',
    },
    motifText: {
        marginTop: 8,
        fontSize: 14,
        color: '#718096',
    },
    swipeableAction: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#FF3B30',
    },
    swipeDelete: {
        backgroundColor: '#FF3B30',
    },
    swipeUpdate: {
        backgroundColor: 'green',
    },
    swipeArchive: {
        backgroundColor: '#6573C3',
    },
    swipeableActionText: {
        color: 'white',
        fontWeight: 'bold',
    },
});