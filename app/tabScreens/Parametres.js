import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthContext";

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

const SECTIONS = [
  {
    header: 'Mes informations',
    icon: 'user',
    items: [
      { label: 'Nom complet', value: 'Mouhamadou Diamanka', type: 'input' },
      { label: 'Adresse email', value: 'diamanka.sn@gmail.com', type: 'input' },
      { label: 'Téléphone', value: '778795172', type: 'input' },
    ],
  },
  {
    header: 'Ma société',
    icon: 'layers',
    items: [
      { label: 'Nom', value: 'Delta', type: 'input' },
      { label: 'NINEA', type: 'input', value: '368368' },
      { label: 'Registre de commerce', type: 'input', value: 'jshjhe' },
      { label: 'Adresse email', type: 'input', value: 'delta@delta.com' },
      { label: 'Téléphone', type: 'input', value: '778795172' },
      { label: 'Adresse', type: 'input', value: 'Dakar, senegal' },
    ],
  },
  {
    header: 'Besoin d\'aide',
    icon: 'help-circle',
    items: [
      { label: 'Adresse email', type: 'input', value: 'contact@ads-sn@com' },
      { label: 'Téléphone', type: 'input', value: '77 879 51 72' },
    ],
  },
];

export default function Parametres() {
  const { onLogout } = useAuth()
  const [societe, setSociete] = useState(null);
  const [user, setUser] = useState(null);
  const [value, setValue] = React.useState(0);
  const { tabs, items } = React.useMemo(() => {
    return {
      tabs: SECTIONS.map(({ header, icon }) => ({
        name: header,
        icon,
      })),
      items: SECTIONS[value].items,
    };
  }, [value]);

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem("societe");
        const u = await AsyncStorage.getItem("userConnect")
        if (value !== null && u !== null) {
          setSociete(JSON.parse(value));
          setUser(JSON.parse(u))
        }
      } catch (e) {
        console.error("Error reading value:", e);
      }
    };

    getData()
  }, []);
  const updatedSections = [
    {
      header: 'Mes informations',
      icon: 'user',
      items: [
        { label: 'Nom complet', value: user?.prenom + ' ' + user?.nom || '', type: 'input' },
        { label: 'Adresse email', value: user?.email || '', type: 'input' },
        { label: 'Téléphone', value: user?.telephone || '', type: 'input' },
      ],
    },

    {
      header: 'Ma société',
      icon: 'layers',
      items: [
        { label: 'Nom', value: societe?.nom || '', type: 'input' },
        { label: 'NINEA', type: 'input', value: societe?.ninea || '' },
        { label: 'Registre de commerce', type: 'input', value: societe?.raisonSociale || '' },
        { label: 'Adresse email', type: 'input', value: societe?.email || '' },
        { label: 'Téléphone', type: 'input', value: societe?.telephone || '' },
        { label: 'Adresse', type: 'input', value: 'Rue ' + societe?.rue + ', ' + societe?.region + ', ' + societe?.pays || '' },
      ],
    },
    {
      header: 'Besoin d\'aide',
      icon: 'help-circle',
      items: [
        { label: 'Adresse email', type: 'input', value: 'contact@ads-sn@com' },
        { label: 'Téléphone', type: 'input', value: '77 879 51 72' },
      ],
    },
  ];

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.profile}>
          <View style={styles.profileHeader}>
            <Image
              alt=""
              source={require("../../assets/beto.png")}
              style={styles.profileAvatar} />
            <View>
              <Text style={styles.profileName}>{user?.prenom + ' ' + user?.nom}</Text>

              <Text style={styles.profileHandle}>{user?.email}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={onLogout}>
            <View style={styles.profileAction}>
              <Text style={styles.profileActionText}>Deconnexion</Text>
              <FeatherIcon color="#fff" name="log-out" size={16} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
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
          {updatedSections[value].items.map(({ label, value }, index) => {
            return (
              <View
                key={label}
                style={[
                  styles.rowWrapper,
                  index === 0 && { borderTopWidth: 0 },
                ]}>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>{label}</Text>
                  <View style={styles.rowSpacer} />
                  <Text style={styles.rowValue}>{value}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
  },
  header: {
    paddingLeft: 24,
    paddingRight: 24,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
  },
  content: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#e3e3e3',
  },
  tabs: {
    padding: 16,
    flexDirection: 'row',
  },
  /** Profile */
  profile: {
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#fff',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 12,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#3d3d3d',
  },
  profileHandle: {
    marginTop: 4,
    fontSize: 15,
    color: '#989898',
  },
  profileAction: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    borderRadius: 12,
  },
  profileActionText: {
    marginRight: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  /** Tab */
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
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6b7280',
    marginLeft: 5,
  },
  /** Row */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 50,
    paddingLeft: 24,
    paddingRight: 24,
  },
  rowWrapper: {
    borderTopWidth: 1,
    borderColor: '#e3e3e3',
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '500',
    color: '#2c2c2c',
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  rowValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#7f7f7f',
    marginRight: 4,
  },
});