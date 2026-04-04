import React from 'react';
import { View, Text, Image, ScrollView, Button, Linking, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { detailsStyles as styles } from './styles';

export default function DetailsScreen({ route }) {

  const { attraction } = route.params;

  // logica pra salvar na lista interesses
  const handleSaveInterest = async () => {
    try {
      // pega a lista que já existe salva no celular
      const savedData = await AsyncStorage.getItem('@lista_interesses');
      const currentList = savedData ? JSON.parse(savedData) : [];

      // verifica se o usuário já não adicionou essa atração antes
      const alreadyExists = currentList.some(item => item.id === attraction.id);
      
      if (alreadyExists) {
        Alert.alert('Ops!', 'Esta atração já está na sua lista de interesses.');
        return;
      }

      // adiciona a nova atração na lista e salva de novo
      currentList.push(attraction);
      await AsyncStorage.setItem('@lista_interesses', JSON.stringify(currentList));
      
      Alert.alert('Sucesso!', `${attraction.name} foi adicionada aos seus interesses!`);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a atração.');
      console.error(error);
    }
  };

  const mapUrl = Platform.select({
    ios: `maps:0,0?q=${attraction.coordinates.lat},${attraction.coordinates.lng}`,
    android: `geo:0,0?q=${attraction.coordinates.lat},${attraction.coordinates.lng}`
  });

  return (
    <ScrollView style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
        {attraction.images.map((imgUrl, index) => (
          <Image key={index} source={{ uri: imgUrl }} style={styles.image} />
        ))}
      </ScrollView>

      <View style={styles.content}>
        <Text style={styles.title}>{attraction.name}</Text>
        <Text style={styles.neighborhood}>{attraction.neighborhood}</Text>
        
        <Text style={styles.sectionTitle}>Sobre a atração</Text>
        <Text style={styles.description}>{attraction.description}</Text>

        <Text style={styles.sectionTitle}>Funcionamento</Text>
        <Text style={styles.info}>{attraction.schedule}</Text>

        <Text style={styles.sectionTitle}>Endereço</Text>
        <Text style={styles.info}>{attraction.address}</Text>

        {/* botões do youtube, mapa, contatos*/}
        <View style={styles.buttonsContainer}>
          <Button title="Assistir Vídeo (YouTube)" onPress={() => Linking.openURL(attraction.videoUrl)} />
          <View style={styles.space} />
          
          <Button title="Abrir no Mapa" onPress={() => Linking.openURL(mapUrl)} />
          <View style={styles.space} />
          
          <Button title="Chamar no WhatsApp" onPress={() => Linking.openURL(`whatsapp://send?phone=${attraction.phone}`)} />
          <View style={styles.space} />
          
          <Button title="✉️ Enviar E-mail" onPress={() => Linking.openURL(`mailto:${attraction.email}`)} />
        </View>

        {/* condicional: só mostra o botão de reserva se a atração exigir */}
        {attraction.requiresReservation && (
          <View style={styles.reservationBox}>
            <Text style={styles.reservationText}> Este local possui capacidade limitada.</Text>
            <Button 
              title="Fazer Reserva" 
              color="#e17055" 
              onPress={() => Alert.alert('Reserva', 'Aqui abriria o sistema de reservas da atração.')} 
            />
          </View>
        )}

        {/* botão de lista de interesse salva*/}
        <View style={styles.interestBox}>
          <Button 
            title="Adicionar aos Interesses" 
            color="#d63031" 
            onPress={handleSaveInterest} 
          />
        </View>
      </View>
    </ScrollView>
  );
}