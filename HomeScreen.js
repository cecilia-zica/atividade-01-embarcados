import React from 'react';
import { View, Text, Image, ScrollView, Button } from 'react-native';

import { homeStyles as styles } from './styles';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bem-vindo ao FloriPasse!</Text>
      <Text style={styles.subtitle}>O seu passaporte para as melhores atrações da Ilha da Magia.</Text>
      <Image 
        style={styles.image} 
        source={require('./assets/floripasse_hero_banner.png')}
      />

      <View style={styles.buttonContainer}>
        <Button 
          title="Explorar Atrações" 
          onPress={() => navigation.navigate('Atrações')} 
        />
      </View>
    </ScrollView>
  );
}