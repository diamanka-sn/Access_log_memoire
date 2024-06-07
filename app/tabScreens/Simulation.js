import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal } from 'react-native';

const Plateforme = () => {
  const [numeroBadge, setNumeroBadge] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleBadgeValidation = () => {
    // Ajoutez ici la logique pour valider le badge
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Contenu de la plateforme */}
      <View style={{ flex: 1, borderWidth: 4, borderColor: '#09090c', padding: 50, alignItems: 'center' }}>
        {/* Barrière principale */}
        <View style={{ width: 10, height: '100%', backgroundColor: 'blue', position: 'absolute', left: -10 }} />

        {/* Hangars */}
        <View style={{ flexDirection: 'row', marginTop: 40 }}>
          {/* Hangar 1 */}
          <View style={{ flex: 1.5, borderWidth: 3, borderColor: '#080000', marginRight: 20 }}>
            <Text>Bloc Hangar 1</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20 }}>
              <Text>A</Text>
              <Text>B</Text>
              <Text>C</Text>
              <Text>D</Text>
            </View>
            {/* Barrière du hangar 1 */}
            <View style={{ width: 10, height: '100%', backgroundColor: 'blue', position: 'absolute', left: -10 }} />
          </View>

          {/* Hangar 2 */}
          <View style={{ flex: 1.5, borderWidth: 3, borderColor: '#080000' }}>
            <Text>Bloc Hangar 2</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20 }}>
              <Text>E</Text>
              <Text>F</Text>
              <Text>G</Text>
              <Text>H</Text>
            </View>
            {/* Barrière du hangar 2 */}
            <View style={{ width: 10, height: '100%', backgroundColor: 'blue', position: 'absolute', left: -10 }} />
          </View>
        </View>

        {/* Voiture */}
        <View style={{ width: 100, height: 80, backgroundColor: 'red', position: 'absolute', bottom: 0 }} />

        {/* Zones */}
        <View style={{ flexDirection: 'row', marginTop: 40 }}>
          <View style={{ flex: 1.5, borderWidth: 3, borderColor: '#080000', marginRight: 20, alignItems: 'center' }}>
            <Text>Parking</Text>
            {/* Barrière du parking */}
            <View style={{ width: 10, height: '100%', backgroundColor: 'blue', position: 'absolute', left: -10 }} />
          </View>
          <View style={{ flex: 1.5, borderWidth: 3, borderColor: '#080000', alignItems: 'center' }}>
            <Text>Dépotage</Text>
            {/* Barrière du dépotage */}
            <View style={{ width: 10, height: '100%', backgroundColor: 'blue', position: 'absolute', left: -10 }} />
          </View>
        </View>

        <View style={{ flexDirection: 'row', marginTop: 40 }}>
          <View style={{ flex: 1.5, borderWidth: 3, borderColor: '#080000', marginRight: 20, alignItems: 'center' }}>
            <Text>Dépot conteneur 1</Text>
            {/* Barrière du dépot conteneur 1 */}
            <View style={{ width: 10, height: '100%', backgroundColor: 'blue', position: 'absolute', left: -10 }} />
          </View>
          <View style={{ flex: 1.5, borderWidth: 3, borderColor: '#080000', alignItems: 'center' }}>
            <Text>Dépot conteneur 2</Text>
            {/* Barrière du dépot conteneur 2 */}
            <View style={{ width: 10, height: '100%', backgroundColor: 'blue', position: 'absolute', left: -10 }} />
          </View>
        </View>
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Validation du badge</Text>
          <TextInput
            style={{ borderWidth: 1, borderColor: 'gray', padding: 10, margin: 10, width: '80%' }}
            placeholder="Numéro du badge"
            value={numeroBadge}
            onChangeText={setNumeroBadge}
          />
          <Button title="Valider" onPress={handleBadgeValidation} />
          <Button title="Fermer" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

export default Plateforme;
