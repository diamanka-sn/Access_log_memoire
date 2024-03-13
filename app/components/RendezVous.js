import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable } from "react-native";
import RendezVousContent from './RendezVousContent';

const RendezVous = ({ rdv }) => {
  const { navigate } = useNavigation();
  return (
    <Pressable
      onPress={() => {
        navigate("RendezVousDetails", { rdv });
      }}
    >
      <RendezVousContent rdv={rdv} />
    </Pressable>
  );
};

export default RendezVous;
