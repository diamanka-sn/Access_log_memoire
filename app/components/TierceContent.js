import React, { useState } from "react";
import { View, Text, useColorScheme, StyleSheet, Image, TouchableOpacity, Animated } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import AsyncStorage from "@react-native-async-storage/async-storage";
const TierceContent = ({ societe }) => {
    const theme = useColorScheme();

    const [isAdmin, setIsAdmin] = useState(null)


    const styles = StyleSheet.create({
        container: {
            width: '100%',
            margin: 'auto',
            backgroundColor: theme === 'dark' ? 'black' : 'white',
        },
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

    (async () => {
        try {
            const u = await AsyncStorage.getItem("role");

            if (u !== null) {
                const parsedUser = JSON.parse(u);
                setIsAdmin(parsedUser === 'admin');

            }
        } catch (e) {
            console.error("Erreur lors de la lecture de la valeur :", e);
        }
    })();


    const renderRightActions = (progress, dragX) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0],
            extrapolate: "clamp",
        });

        return (
            <View style={styles.leftActionContainer}>
                <TouchableOpacity onPress={null} style={[styles.swipeableAction, styles.swipeDelete]}>
                    <EvilIcons name="trash" size={30} color="#FFF" />
                </TouchableOpacity>
            </View>

        );
    };
    
    return (
        <Swipeable
            renderLeftActions={renderRightActions}
            leftThreshold={30}
            rightThreshold={30}
        >
            <View style={styles.container}>
                <View style={styles.rowContainer}>
                    <View style={styles.textContainer}>
                        <View style={styles.row}>
                            <Text style={styles.societeText}>{societe.nom}</Text>
                        </View>
                        <Text style={styles.dateText}>{societe.email}</Text>
                        <Text style={styles.dateText}>{societe.telephone}</Text>
                        <Text style={styles.motifText}>
                           Rue {societe.rue +', '+societe.region+', '+societe.pays}
                        </Text>
                    </View>
                </View>
            </View>
        </Swipeable>
    );
};

export default TierceContent;
