import { useNavigation, useRoute } from "@react-navigation/native";
import  { useLayoutEffect } from "react";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";

import RendezVousContent from './../../components/RendezVousContent';

export default function TweetDetailScreen(){
  const navigation = useNavigation()
  const route = useRoute()
  const { params } = route;
  // const {
  //   params: { tweet },
  // } = useRoute();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: params.rdv.societe.nom,
})
  }, [])
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <RendezVousContent rdv={params.rdv} />
    </SafeAreaView>

    // <View testID="TweetDetailScreen" style={styles.container}>
    //   <StatusBar barStyle={"light-content"} />
    //   <TweetContent tweet={tweet} />
    // </View>
  );
};
