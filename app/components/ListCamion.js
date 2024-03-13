import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import RBSheet from 'react-native-raw-bottom-sheet';
import FeatherIcon from 'react-native-vector-icons/Feather';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';

const ListCamion = ({ camion, getAllCamion }) => {
  const [selectedCamion, SetSelectedCamion] = useState([])
  const camionSheet = useRef();
  const [Loading, setLoading] = useState(false);

  const [data, setData] = useState({
    immatriculation: '',
    categorie: '',
  });

  const handleModifier = async (camion) => {
    SetSelectedCamion(camion)
    camionSheet.current.open()
  }

  const handleChange = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  const submitModifierCamion = async () => {
    let d = {
      id: selectedCamion.id,
      immatriculation: data.immatriculation.trim() ? data.immatriculation.trim() : selectedCamion.immatriculation,
      categorie: data.categorie.trim() ? data.categorie.trim() : selectedCamion.categorie
    }
    Alert.alert(
      "Confirmation",
      "Voulez-vous modifier le camion " + selectedCamion.immatriculation + " ?",
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
              const response = await axios.put(`${API_URL}/gestion-interne/camion/update-camion/${selectedCamion?.id}`, d)
              const a = response.data
              if (!a.error) {
                Alert.alert("Succes", a.message)
                setData({
                  immatriculation: '',
                  categorie: ''
                })
                getAllCamion();
                camionSheet.current.close()
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

  const activerCamion = async (camion) => {
    const { activo, immatriculation, id } = camion;
    const action = activo ? 'la désactivation' : 'l\'activation';
    Alert.alert('Confirmation',
      `Confirmez-vous ${action} de ${immatriculation} ?`,
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {

          text: "OK",
          onPress: async () => {
            try {
              const url = `${API_URL}/gestion-interne/camion/${activo ? 'desactiver' : 'activer'}-camion/${id}`;
              const response = await axios.put(url);

              const a = response?.data || {};

              if (!a.error) {
                Alert.alert("Succès", a.message);
                getAllCamion();
              } else {
                Alert.alert("Erreur", a.message);
              }
            } catch (error) {
              console.error('Erreur ', error)
            }
          }
        }
      ],
      { cancelable: false })
  }

  const renderRightActions = (camion, a) => {
    return (
      <View style={styles.leftActionContainer}>
        <TouchableOpacity onPress={() => handleModifier(camion)} style={[styles.swipeableAction, styles.swipeDelete]}>
          <FeatherIcon name="edit" size={30} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => activerCamion(camion)} style={[styles.swipeableAction, styles.swipeDelete]}>
          <FeatherIcon color={a ? 'red' : 'green'} name={a ? 'x-circle' : 'check-circle'} size={30} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Object.values(camion).map((item) => {
        return (
          <Swipeable
            key={item.id}
            renderRightActions={() => renderRightActions(item, item.activo)}
            leftThreshold={30}
            rightThreshold={30}
          >
            <View style={styles.card}>
              <View>
                <Text style={styles.cardTitle}>{item.immatriculation}</Text>
                <View style={styles.cardStats}>
                  <View style={styles.cardStatsItem}>
                    <Text style={styles.cardStatsItemText}>
                      {item.categorie}
                    </Text>
                  </View>
                  <View style={styles.cardStatsItem}>
                    <FeatherIcon color={item.activo ? 'green' : 'red'} name={item.activo ? 'check-circle' : 'x-circle'} />
                  </View>
                </View>
              </View>
              <View style={styles.cardAction}>
                <FeatherIcon
                  color={item.asBadge ? "green" : "red"}
                  name="award"
                  size={22} />
              </View>
            </View>
          </Swipeable>
        );
      })}

      {/* Modifier un camion */}
      <RBSheet
        customStyles={{ container: styles.sheet }}
        height={320}
        ref={camionSheet}>
        <View style={styles.headerSheet}>
          <Text style={styles.headerTitleSheet}>Modifier camion</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Immatriculation</Text>
            <TextInput
              style={styles.inputControl}
              placeholder="Numéro d'immatriculation du camion"
              defaultValue={selectedCamion.immatriculation}
              onChangeText={(text) => handleChange('immatriculation', text)}
            />
          </View>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Catégorie</Text>
            <TextInput
              style={styles.inputControl}
              placeholder="Catégorie du camion"
              defaultValue={selectedCamion.categorie}
              onChangeText={(text) => handleChange('categorie', text)}
            />
          </View>
          <View style={styles.bodyGap} />
          <TouchableOpacity onPress={submitModifierCamion}>
            <View style={styles.btn}>
              {Loading ? (<Text style={styles.btnText}> <ActivityIndicator size={17} color="white" style={{ marginRight: 8 }} /></Text>) : (
                <Text style={styles.btnText}>Modifier</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </RBSheet>

    </ScrollView>
  );
}

export default ListCamion;

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
  },
  card: {
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cardImg: {
    width: 50,
    height: 50,
    borderRadius: 9999,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  cardStats: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardStatsItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  cardStatsItemText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#636a73',
    marginLeft: 2,
  },
  cardAction: {
    marginLeft: 'auto',
  },

  swipeableAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 2,
    // backgroundColor: '#FF3B30',
  },
  swipeDelete: {
    // backgroundColor: 'gray',

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