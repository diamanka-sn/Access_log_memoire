import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, Dimensions } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { API_URL, API_URL_AUTH } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ProgressChart,
} from "react-native-chart-kit";
import { ScrollView } from 'react-native-gesture-handler';
import ChartComponent from '../chart/ChartComponent';
export default function Feed() {
  const [employe, setEmploye] = useState(0);
  const [tierce, setTierce] = useState(0);
  const [camion, setCamion] = useState(0)
  const [societe, setSociete] = useState(null);
  const [rdv, setRdv] = useState(0)
  const [espace, setEspace] = useState(0)
  const [rdvStat, setRdvStat] = useState([])

  const fetchEspace = async () => {
    try {
      const response = await axios.get(`${API_URL}/administration/societe/find-allSocieteAvecEspace`);
      const e = await response.data.filter(m => m.societe === societe?.nom)
      const es = e[0].espaceTotal !== 0 ? (e[0].espaceOccupe / e[0].espaceTotal) : 0
      setEspace(es)
    } catch (error) {
      console.error(error);
    }
  }

  const fetchRdv = async () => {
    try {
      const response = await axios.get(`${API_URL_AUTH}/gestion-interne/rendez-vous/all-rendez-vous`);
      const rdv = await response.data.filter(m => m.societeLocataireId === societe?.id)
      setRdv(rdv.length)
      const transactionsByOrigin = {};

      await rdv.forEach(transaction => {
        const societeOrigineNom = transaction.societeOrigne.nom;

        if (transactionsByOrigin[societeOrigineNom]) {
          transactionsByOrigin[societeOrigineNom]++;
        } else {
          transactionsByOrigin[societeOrigineNom] = 1;
        }
      });

      setRdvStat(transactionsByOrigin)
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem("societe");
        if (value !== null) {
          setSociete(JSON.parse(value));
        }
      } catch (e) {
        console.error("Error reading value:", e);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    if (societe) {
      fetchEspace()
      fetchRdv();
    }
  }, [societe]);

  const getDataCard = async () => {
    try {
      const [response, tierce, cam] = await Promise.all([
        axios.get(`${API_URL}/gestion-interne/personne/find-allPersonneBySociete`),
        axios.get(`${API_URL}/gestion-interne/societe/find-allSocieteTierce`),
        axios.get(`${API_URL}/gestion-interne/camion/find-allCamion`),
      ]);

      setEmploye(response.data.length);
      setTierce(tierce.data.length);
      setCamion(cam.data.length);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getDataCard();
  }, []);

  return (
    <ScrollView>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
        <View style={styles.container}>

          <View style={styles.stats}>
            <View style={styles.statsRow}>
              <View style={styles.statsItem}>
                <View style={styles.statsItemIcon}>
                  <FeatherIcon color="#fff" name="truck" size={22} />
                </View>
                <View>
                  <Text style={styles.statsItemLabel}>Camions</Text>
                  <Text style={styles.statsItemValue}>{camion}</Text>
                </View>
              </View>
              <View style={styles.statsItem}>
                <View style={styles.statsItemIcon}>
                  <FeatherIcon color="#fff" name="clock" size={22} />
                </View>
                <View>
                  <Text style={styles.statsItemLabel}>Rendez-vous</Text>
                  <Text style={styles.statsItemValue}>{rdv}</Text>
                </View>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statsItem}>
                <View style={styles.statsItemIcon}>
                  <FeatherIcon
                    color="#fff"
                    name="activity"
                    size={22} />
                </View>
                <View>
                  <Text style={styles.statsItemLabel}>Partenaires</Text>
                  <Text style={styles.statsItemValue}>{tierce}</Text>
                </View>
              </View>
              <View style={styles.statsItem}>
                <View style={styles.statsItemIcon}>
                  <FeatherIcon
                    color="#fff"
                    name="users"
                    size={22} />
                </View>
                <View>
                  <Text style={styles.statsItemLabel}>Employés</Text>
                  <Text style={styles.statsItemValue}>{employe}</Text>
                </View>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statsItem}>
                <View>
                  <Text style={styles.statsItemLabel}>Espace occupé</Text>
                  <ProgressChart
                    data={[espace]}
                    width={Dimensions.get('window').width - 16}
                    height={220}
                    chartConfig={{
                      backgroundGradientFrom: 'white',
                      backgroundGradientTo: 'white',
                      decimalPlaces: 1,
                      color: (opacity = 0.1) => `rgba(255, 0, 0, ${opacity})`,
                      style: {
                        borderRadius: 0,
                      },
                    }}
                    style={{
                      marginLeft: 8,
                      borderRadius: 16,
                    }}
                  />
                </View>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statsItem}>
                <View>
                  <Text style={styles.statsItemLabel}>Rendez-vous société</Text>
                  {rdvStat.length !== 0 ? (<ChartComponent
                    data={rdvStat} />) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <Text>Aucune données disponible pour le moment.</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

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
  /** Stats */
  stats: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: -6,
  },
  statsItem: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginHorizontal: 6,
    marginBottom: 12,
  },
  statsItemIcon: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 46,
    height: 46,
    marginRight: 8,
    borderRadius: 8,
  },
  statsItemLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#8e8e93',
    marginBottom: 2,
  },
  statsItemValue: {
    fontSize: 22,
    fontWeight: '600',
    color: '#081730',
  },
});