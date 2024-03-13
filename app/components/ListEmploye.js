import axios from 'axios';
import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { API_URL } from '../context/AuthContext';
import RBSheet from 'react-native-raw-bottom-sheet';


const ListEmploye = ({ employe, getAllEmploye }) => {
  const employeSheet = useRef()
  const [selectedEmploye, SetSelectedEmploye] = useState([])
  const [Loading, setLoading] = useState(false)

  const [data, setData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: ''
  });

  const handleModifier = async (employe) => {
    SetSelectedEmploye(employe)
    employeSheet.current.open()
  }

  const handleChange = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };


  const activerEmploye = async (emp) => {
    const { activo, prenom, nom, id } = emp;
    const action = activo ? 'la désactivation' : 'l\'activation';
    Alert.alert('Confirmation',
      `Confirmez-vous ${action} de ${prenom + " " + nom} ?`,
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              const url = `${API_URL}/gestion-interne/personne/${activo ? 'desactiver' : 'activer'}-personne/${id}`;
              const response = await axios.put(url);

              const a = response?.data || {};

              if (!a.error) {
                Alert.alert("Succès", a.message);
                getAllEmploye();
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

  const submitModifier = async () => {
    let d = {
      id: selectedEmploye.id,
      prenom: data.prenom.trim() ? data.prenom.trim() : selectedEmploye.prenom,
      nom: data.nom.trim() ? data.nom.trim() : selectedEmploye.nom,
      email: data.email.trim() ? data.email.trim() : selectedEmploye.email,
      telephone: data.telephone.trim() ? data.telephone.trim() : selectedEmploye.telephone,
    }
    Alert.alert(
      "Confirmation",
      "Voulez-vous modifier " + selectedEmploye.prenom + " " + selectedEmploye.nom + " ?",
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
              const response = await axios.put(`${API_URL}/gestion-interne/personne/update-personne/${selectedEmploye?.id}`, d)
              const a = response.data
              if (!a.error) {
                Alert.alert("Succes", "Employé modifier avec succés")
                setData({
                  prenom: '',
                  nom: '',
                  email: '',
                  telephone: '',
                })
                getAllEmploye();
                employeSheet.current.close()
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

  const renderRightActions = (employe, a) => {
    return (
      <View style={styles.leftActionContainer}>
        <TouchableOpacity onPress={() => handleModifier(employe)} style={[styles.swipeableAction, styles.swipeDelete]}>
          <FeatherIcon name="edit" size={30} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => activerEmploye(employe)} style={[styles.swipeableAction, styles.swipeDelete]}>
          <FeatherIcon color={a ? 'red' : 'green'} name={a ? 'x-circle' : 'check-circle'} size={30} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Object.values(employe).map((item) => {
        return (
          <Swipeable
            key={item.id}
            renderRightActions={() => renderRightActions(item, item.activo)}
            leftThreshold={30}
            rightThreshold={30} >
            <View style={styles.card}>
              <View style={[styles.cardImg, styles.cardAvatar]}>
                <Text style={styles.cardAvatarText}>{item.prenom[0] + '' + item.nom[0]}</Text>
              </View>
              <View>
                <Text style={styles.cardTitle}>{item.prenom + ' ' + item.nom}</Text>
                <View style={styles.cardStats}>
                  <View style={styles.cardStatsItem}>
                    <Text style={styles.cardStatsItemText}>
                      {item.email}
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

      <RBSheet
        customStyles={{ container: styles.sheet }}
        height={450}
        ref={employeSheet}>
        <View style={styles.headerSheet}>
          <Text style={styles.headerTitleSheet}>Modifier employé</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Prénom</Text>

            <TextInput
              style={styles.inputControl}
              placeholder="Prénom de l'employé"
              defaultValue={selectedEmploye.prenom}
              onChangeText={(text) => handleChange('prenom', text)}
            />
          </View>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Nom</Text>
            <TextInput
              style={styles.inputControl}
              placeholder="Nom de l'employé"
              defaultValue={selectedEmploye.nom}
              onChangeText={(text) => handleChange('nom', text)}
            />
          </View>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Adresse email</Text>
            <TextInput
              keyboardType='email-address'
              style={styles.inputControl}
              placeholder="Adresse email"
              defaultValue={selectedEmploye.email}
              onChangeText={(text) => handleChange('email', text)}
            />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Téléphone</Text>

            <TextInput
              keyboardType='numeric'
              style={styles.inputControl}
              placeholder="Numéro de téléphone"
              defaultValue={selectedEmploye.telephone}
              onChangeText={(text) => handleChange('telephone', text)}
            />
          </View>
          <View>
            <TouchableOpacity onPress={submitModifier}>
              <View style={styles.btn}>
                {Loading ? (<Text style={styles.btnText}> <ActivityIndicator size={17} color="white" style={{ marginRight: 8 }} /> </Text>) : (
                  <Text style={styles.btnText}>Modifier</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.bodyGap} />
        </View>
      </RBSheet>
    </ScrollView>
  );
}

export default ListEmploye;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
  },
  /** Card */
  card: {
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cardImg: {
    marginRight: 5,
    width: 42,
    height: 42,
    borderRadius: 12,
  },
  cardAvatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9ca1ac',
  },
  cardAvatarText: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#fff',
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