import { SafeAreaView, Text, useColorScheme } from "react-native";

export default function Payments() {
  const theme = useColorScheme();

  return (
    <SafeAreaView>
      <Text style={[
        { color: theme === "dark" ? "#FFF" : "#000" },
      ]}>Bienvenue sur la page de rendez-vous</Text>
    </SafeAreaView>
  );
}
