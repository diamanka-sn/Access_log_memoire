import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';


const Camion = () => {
    const navigation = useNavigation()

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLargeTitle:true,
            headerSearchBarOptions:{
                placeholder: 'Recherche '
            }
        })
    }, [navigation])
    return (
        <ScrollView>
            <Text>Bonjour et bienvenue sur la page des camions pour les differentes societes tierces</Text>
        </ScrollView>
    );
};

export default Camion;
