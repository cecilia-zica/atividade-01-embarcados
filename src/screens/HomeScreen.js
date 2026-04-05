import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { homeStyles as styles, btn } from '../styles/styles';
import attractions from '../data/attractions.json';

// Carrossel mostra só as primeiras 8 atrações 
const PREVIEW = attractions.slice(0, 8);

// Alguns nomes de atração são longos demais pro cards do carrossel, essa função encurta e adiciona reticências 
const shortName = (name) => name.length > 28 ? name.slice(0, 26) + '…' : name;

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        style={styles.image}
        source={require('../../assets/Image_fx (10) copy.png')}
      />

      <Text style={styles.title}>Bem-vindo ao FloriPasse!</Text>
      <Text style={styles.subtitle}>O seu passaporte para as melhores atrações da Ilha da Magia.</Text>

      {/* Carrossel horizontal: FlatList horizontal pra aproveitar a virtualização das imagens das atrações na home: renderiza
          os cards que estão visíveis, não todos os 8 de uma vez */}
      <FlatList
        data={PREVIEW}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.carouselCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Atrações')}
          >
            <Image source={{ uri: item.thumbnail }} style={styles.carouselImage} />
            <Text style={styles.carouselName}>{shortName(item.name)}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={btn.wine}
          onPress={() => navigation.navigate('Atrações')}
          activeOpacity={0.8}
        >
          <Text style={btn.wineText}>Explorar Atrações</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
