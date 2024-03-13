import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet
} from "react-native";
import RendezVous from "../components/RendezVous";
import { API_URL_AUTH } from "../context/AuthContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Vide from "../empty/Vide";

export default function MesRendezVous() {
  const [isRefreshing, setRefreshing] = useState(false);
  const [rdv, setRdv] = useState([]);
  const [societe, setSociete] = useState(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchRdv();
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchRdv = async () => {
    try {
      const value = await AsyncStorage.getItem("societe");
      if (value !== null) {
        setSociete(JSON.parse(value));
        const response = await axios.get(`${API_URL_AUTH}/gestion-interne/rendez-vous/all-rendez-vous`);
        const rdv = await response.data.filter(m => m.societeLocataireId === societe?.id)
        setRdv(rdv)
      }
    } catch (error) {
      setRdv([])
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRdv();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {rdv.length !== 0 ? (
        <FlatList
          data={rdv.slice(0, 30)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RendezVous rdv={item} />}
          ListHeaderComponentStyle={{ backgroundColor: "#ccc" }}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
      ) : (
        <Vide message={"Aucun rendez-vous disponible."} />
      )}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  divider: {
    width: "100%",
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#DDD",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 1,
  },
  loadingText: {
    marginTop: 8,
    color: "black",
  },
});

