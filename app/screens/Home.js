import { Image, Pressable, StatusBar, View, useColorScheme } from "react-native"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Feed from "../tabScreens/Feed";
import MesRendezVous from "../tabScreens/MesRendezVous";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RendezVousDetails from "../homeStack/RendezVousDetails";
import Recherche from "../homeStack/Recherche";
import { Ionicons, MaterialIcons, Octicons, FontAwesome, FontAwesome5 } from "@expo/vector-icons"
import { createDrawerNavigator } from "@react-navigation/drawer";
import Notifications from "../tabScreens/Notifications";
import Parametres from "../tabScreens/Parametres";
import ListeSociete from "../homeStack/ListeSociete";
import SocieteDetail from "../homeStack/SocieteDetail";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FeatherIcon from 'react-native-vector-icons/Feather';
import SocieteTierce from "../drawerScreens/SocieteTierce";
import TierceDetail from "../homeStack/TierceDetail";
import MaSociete from "../homeStack/MaSociete";
import Scanner from "../drawerScreens/Scanner";
import { useEffect, useState } from "react";
import FeedAdmin from "../tabScreens/FeedAdmin";
import SocieteDk from "../tabScreens/SocieteDk";
import LocataireDetail from "../homeStack/LocataireDetail";
import Vide from "../empty/Vide";


const TopTabs = createMaterialTopTabNavigator()

function TopTabsGroup() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSuper, setIsSuper] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const value = await AsyncStorage.getItem("role");
            if (value !== null) {
                const roleUser = JSON.parse(value);
                setIsAdmin(roleUser === 'admin');
                setIsSuper(roleUser === 'super');
            }
        };
        fetchData();
    }, []);

    return (
        <TopTabs.Navigator
            screenOptions={{
                tabBarLabelStyle: {
                    textTransform: 'none',
                    fontWeight: 'bold'
                },
                tabBarIndicatorStyle: {
                    height: 5,
                }
            }}
        >
            <TopTabs.Screen name="Tableau de bord" component={isAdmin ? Feed : FeedAdmin} />
            {isAdmin && (
                <TopTabs.Screen name="Rendez-vous" component={MesRendezVous} />
            )}
        </TopTabs.Navigator>
    )
}


const HomeStack = createNativeStackNavigator()

function HomeStackGroup() {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name="TabGroup" component={TabGroup} options={{ headerShown: false, headerTitle: 'Accueil', }} />
            <HomeStack.Screen name="RendezVousDetails"
                component={RendezVousDetails}
                options={{ presentation: "modal" }}
            />
            <HomeStack.Screen name="LocataireDetail"
                component={LocataireDetail}
                options={{ presentation: "modal" }}
            />
            <HomeStack.Screen name="SocieteDetail"
                component={SocieteDetail}
                options={{ headerShown: false }}
            />
            <HomeStack.Screen name="TierceDetail"
                component={TierceDetail}
                options={{ headerShown: false }}
            />

            <HomeStack.Screen name="Recherche"
                component={Recherche} options={{ headerShown: true }}
            />
            <HomeStack.Screen name="Notifications"
                component={Notifications}
            />
        </HomeStack.Navigator>
    )
}

const Tab = createBottomTabNavigator()

function TabGroup({ navigation }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSuper, setIsSuper] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const value = await AsyncStorage.getItem("role");
            if (value !== null) {
                const roleUser = JSON.parse(value);
                setIsAdmin(roleUser === 'admin');
                setIsSuper(roleUser === 'super');
            }
        };
        fetchData();
    }, []);

    return (
        <Tab.Navigator
            screenOptions={({ route, navigation }) => ({
                tabBarIcon: ({ color, focused, size }) => {
                    let iconName;
                    if (route.name == "Feed") {
                        iconName = focused ? "home" : "home"
                        return <Octicons name={iconName} size={size} color={color} />
                    } else if (route.name == "Notifications") {
                        iconName = focused ? "notifications-sharp" : "notifications-outline"
                    } else if (route.name == "Parametres") {
                        iconName = focused ? "user-alt" : "user"
                        return <FontAwesome5 name={iconName} size={size} color={color} />
                    } else if (route.name == "Scanner") {
                        iconName = "qr-code-scanner"
                        return <MaterialIcons name={iconName} size={size} color={color} />
                    } else if (route.name == "Rendez-vous") {
                        return <FontAwesome name="calendar-plus-o" size={size} color={color} />
                    } else if (route.name === "Société") {
                        return <FeatherIcon name="layers" size={size} color={color} />
                    } else if (route.name === "Ma société") {
                        return <FeatherIcon name="activity" size={size} color={color} />
                    }
                    else if (route.name === "Sociétés") {
                        return <FeatherIcon name="layers" size={size} color={color} />
                    } else if (route.name === "Paramétres") {
                        return <FeatherIcon name="sliders" size={size} color={color} />
                    }
                    return <Ionicons name={iconName} size={size} color={color} />
                },
                tabBarActiveTintColor: "#007bff",
                tabBarInactiveTintColor: "gray",
                tabBarLabelStyle: {
                    textTransform: 'capitalize',
                    fontWeight: 'bold'
                },
            }
            )}
        >
            <Tab.Screen name="Feed" component={TopTabsGroup} options={{
                headerTitle: 'Accueil',
                tabBarLabel: "Accueil", headerLeft: () => (
                    <Pressable onPress={() => navigation.openDrawer()}>
                        <Image
                            source={require("../../assets/log.png")}
                            style={{ width: 60, height: 60, borderRadius: 100, marginLeft: 15 }}
                        />
                    </Pressable>
                ), headerRight: () => (
                    <View style={{ flexDirection: 'row', marginRight: 15 }}>
                        <Pressable onPress={() => navigation.navigate('Recherche')}>
                            <Ionicons name="search-sharp" size={30} color="gray" style={{ marginRight: 15 }} />
                        </Pressable>
                        <Pressable onPress={() => navigation.navigate('Notifications')}>
                            <FeatherIcon color="gray" name="bell" size={30} />
                            <View style={{
                                position: 'absolute',
                                right: 11,
                                backgroundColor: 'red',
                                borderRadius: 100,
                                width: 10,
                                height: 10,
                            }} />
                        </Pressable>

                    </View>
                ),
            }} />

            {isSuper && (
                <><Tab.Screen name="Sociétés" component={SocieteDk} options={{headerTitle:"Les sociétés locataires"}}/>
                    <Tab.Screen name="Paramétres" component={Vide} /></>
            )}
            {isAdmin && (<><Tab.Screen name="Rendez-vous" component={ListeSociete} options={{ headerShown: false }} />
                <Tab.Screen name="Ma société" component={MaSociete} options={{ tabBarLabel: "Ma société", headerShown: false }} />
                <Tab.Screen name="Société" component={SocieteTierce} options={{ tabBarLabel: "Partenaires" }} /></>)}
            <Tab.Screen name="Parametres" component={Parametres} options={{ tabBarLabel: "Mon compte", headerShown: false }} />
        </Tab.Navigator >
    )
}

const Drawer = createDrawerNavigator()

function DrawerGroup() {
    return (
        <Drawer.Navigator screenOptions={{
            headerShown: false, drawerLabelStyle: {
                textTransform: 'none',
                fontWeight: 'bold'
            },

        }}>
            <Drawer.Screen name="HomeStackGroup" component={HomeStackGroup} options={{ drawerLabel: 'Accueil' }} />
            <Drawer.Screen name="Scanner" component={Scanner} />
        </Drawer.Navigator>
    )
}

const Home = () => {
    const theme = useColorScheme();
    return (
        <><StatusBar style="auto" /><DrawerGroup /></>
    );
}

export default Home;