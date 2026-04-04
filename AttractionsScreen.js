import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { attractions } from './data';
import { listStyles as styles } from './styles';

export default function AttractionsScreen({ navigation }) {
  
  const sortedAttractions = [...attractions].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  const renderItem = ({ item }) => {
    const safeImageUrl = `https://images.weserv.nl/?url=${item.thumbnail.replace('https://', '')}`;

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('Detalhes', { attraction: item })}
      >
        <Image 
          source={{ uri: safeImageUrl }} 
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