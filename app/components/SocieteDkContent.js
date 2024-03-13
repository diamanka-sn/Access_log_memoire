import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Image,
} from 'react-native';

export default function SocieteDkContent({ societe }) {
    const navigation = useNavigation()
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLargeTitle: true,
            headerSearchBarOptions: {
                placeHolder: "Search",
                cancelButtonText: 'Annuler',
                placeholder: 'Rechercher',
            }
        });
    }, [navigation]);
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <SafeAreaView style={{ backgroundColor: '#f2f2f2' }}>
                <View style={styles.card}>
                    <View style={styles.cardBody}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>{societe.nom}</Text>
                            <Text style={styles.cardPrice}>
                                <Text>{societe.telephone} </Text>
                            </Text>
                        </View>
                        <View style={styles.cardFooter}>
                            <Text style={styles.cardReviews}>{societe.email}</Text>
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
    card: {
        position: 'relative',
        borderRadius: 8,
        backgroundColor: '#fff',
        // marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    cardLikeWrapper: {
        position: 'absolute',
        zIndex: 1,
        top: 12,
        right: 12,
    },
    cardLike: {
        width: 48,
        height: 48,
        borderRadius: 9999,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTop: {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    cardImg: {
        width: '100%',
        height: 160,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    cardBody: {
        padding: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: '500',
        color: '#232425',
    },
    cardPrice: {
        fontSize: 15,
        fontWeight: '400',
        color: '#232425',
    },
    cardFooter: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    cardStars: {
        marginLeft: 2,
        marginRight: 6,
        fontSize: 14,
        fontWeight: '500',
        color: '#232425',
    },
    cardReviews: {
        fontSize: 14,
        fontWeight: '400',
        color: '#595a63',
    },
});