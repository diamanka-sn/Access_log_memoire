import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import {
  View,
  SafeAreaView,
  Text,
} from 'react-native';

export default function Recherche() {
  const navigation = useNavigation()

  const recherche = (rechercheTerm) => {
    console.log(rechercheTerm.trim())
  }
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
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View>
        <Text>Bienvenue dans la recherche d'information</Text>
      </View>
    </SafeAreaView>
  );
}
