import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable } from "react-native";
import SocieteContent from "./SocieteContent";

const Societe = ({ societe }) => {
  const { navigate } = useNavigation();
  return (
    <Pressable
      onPress={() => {
        navigate("SocieteDetail", { societe });
      }}
    >
      <SocieteContent societe={societe} />
    </Pressable>
  );
};

export default Societe;
