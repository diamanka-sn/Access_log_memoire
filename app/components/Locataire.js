import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable } from "react-native";
import RendezVousContent from './RendezVousContent';
import SocieteDkContent from "./SocieteDkContent";

const Locataire = ({ societe }) => {
  const { navigate } = useNavigation();
  return (
    <Pressable
      onPress={() => {
        navigate("LocataireDetail", { societe });
      }}
    >
      <SocieteDkContent societe={societe} />
    </Pressable>
  );
};

export default Locataire;
