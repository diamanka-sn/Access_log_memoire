import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { API_URL_AUTH } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import { sortNotifications } from '../context/utils';

export default function Notifications() {
  const [notif, setNotif] = useState([])
  const navigation = useNavigation()
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLargeTitle: true,
      headerSearchBarOptions: {
        placeHolder: "Search",
        cancelButtonText: 'Annuler',
        placeholder: 'Rechercher',
        onChangeText: (event) => recherche(event.nativeEvent.text)
      }
    });
  }, [navigation]);

  const recherche = (rechercheTerm) => {
    setNotif(notif.filter((n) => n.message.toLowerCase().includes(rechercheTerm.trim().toLowerCase())));
  }

  const allNotifications = async () => {
    const value = await AsyncStorage.getItem("role");
    if (value !== null) {
      const roleUser = JSON.parse(value);
      const urlSuper = 'gestion-interne/notification/find-all-unread-notification-superAdmin';
      const urlAdmin = 'gestion-interne/notification/find-all-unread-notification-admin';
      const url = roleUser === 'super' ? urlSuper : urlAdmin;

      try {
        const response = await axios.get(`${API_URL_AUTH}/${url}`);
        console.log(response.data)
        setNotif(sortNotifications(response.data))
      } catch (error) {
        console.error("erreur ", error)
      }
    }
  }

  useEffect(() => {
    allNotifications()
  }, [])

  const getIconName = (type) => {
    switch (type) {
      case 'Entry':
        return <FeatherIcon color="#007600" name="log-in" size={20} />
      case 'Exit':
        return <FeatherIcon color="#ee003c" name="log-out" size={20} />
      case 'Demande':
        return <FeatherIcon color="#ffbf00" name="clock" size={20} />
      case 'Attribution':
        return <FeatherIcon color="#004e00" name="check-circle" size={20} />;
      case 'Rendez-Vous':
        return <FeatherIcon color="#5c2be2" name="calendar" size={20} />;
      case 'Echec':
        return <FeatherIcon color="#b30000" name="shield-off" size={20} />;
      case 'Espace plein':
        return <FeatherIcon color="#b30000" name="x" size={20} />;
      case 'Expiration Profil':
        return <FeatherIcon color="#b30000" name="alert-triangle" size={20} />;
      default:
        return '';
    }
  }

  return (
    <SafeAreaView>
      {notif?.length !== 0 ? (
        <ScrollView contentContainerStyle={styles.container}>
          {Object.values(notif).map((item) => {
            return (
              <View style={styles.card} key={item.id}>
                <View>
                  <Text style={styles.cardTitle}>{item.message}</Text>

                  <View style={styles.cardStats}>
                    <View style={styles.cardStatsItem}>
                      <FeatherIcon color="#636a73" name="calendar" />
                      <Text style={styles.cardStatsItemText}>{item.at !== null ? moment(item.at).locale('fr').format('DD-MM-YYYY HH:MM') : ''}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.cardAction}>
                  {getIconName(item.type)}
                </View>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View>
          <Text style={{ fontSize: 18, textAlign: "center", marginTop: 40 }}>Aucune notification disponible.</Text>
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14
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
});