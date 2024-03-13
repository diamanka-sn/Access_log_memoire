import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable } from "react-native";
import TierceContent from "./TierceContent";

const Tierce = ({ societe }) => {
  const { navigate } = useNavigation();
  return (
    <Pressable
      onPress={() => {
        navigate("TierceDetail", { societe });
      }}
    >
      <TierceContent societe={societe} />
    </Pressable>
  );
};

export default Tierce;
