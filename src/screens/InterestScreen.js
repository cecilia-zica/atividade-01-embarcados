import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { interestStyles as styles } from '../styles/styles';

export default function InterestScreen({ navigation }) {
  const [interests, setInterests] = useState([]);

  // Recarrega a lista toda vez que abre a tela, pois user pode add lá da página de detalhes
  useFocusEffect(
    useCallback(() => {
      loadInterests();
    }, [])
  );

  const loadInterests = async () => {
    try {
      const savedData = await AsyncStorage.getItem('@lista_interesses');
      if (savedData) setInterests(JSON.parse(savedData));
    } catch (error) {
      console.error(error);
    }
  };

  // Filtra localmente e salva a lista sem o item removido
  const handleRemove = async (idToRemove) => {
    try {
      const filteredList = interests.filter(item => item.id !== idToRemove);
      await AsyncStorage.setItem('@lista_interesses', JSON.stringify(filteredList));
      setInterests(filteredList);
      Alert.alert('Removido', 'Atração removida da sua lista.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível remover.');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Detalhes', { attraction: item })}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.neighborhood}>{item.neighborhood}</Text>

        <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(item.id)}>
          <Text style={styles.removeText}>Remover</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {interests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Você ainda não salvou nenhuma atração.</Text>
        </View>
      ) : (
        <FlatList
          data={interests}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listPadding}
        />
      )}
    </View>
  );
}
