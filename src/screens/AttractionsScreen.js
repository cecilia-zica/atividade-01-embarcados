import React, { useMemo } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import attractions from '../data/attractions.json';
import { listStyles as styles } from '../styles/styles';

// Proxy que contorna bloqueios de CORS em imagens externas
const getSafeImageUrl = (url) =>
  `https://images.weserv.nl/?url=${url.replace('https://', '')}`;

export default function AttractionsScreen({ navigation }) {

  // useMemo evita reordenar a lista a cada re-render, só roda quando attractions mudar
  const sortedAttractions = useMemo(() =>
    [...attractions].sort((a, b) => a.name.localeCompare(b.name)),
  [attractions]);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Detalhes', { attraction: item })}
      >
        <Image
          source={{ uri: getSafeImageUrl(item.thumbnail) }}
          style={styles.thumbnail}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.neighborhood}>{item.neighborhood}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedAttractions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listPadding}
      />
    </View>
  );
}
