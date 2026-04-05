import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Linking, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { detailsStyles as styles, btn } from '../styles/styles';

export default function DetailsScreen({ route }) {

  const { attraction } = route.params;

  // Lê a lista salva, verifica duplicata, adiciona e salva de volta
  const handleSaveInterest = async () => {
    try {
      const savedData = await AsyncStorage.getItem('@lista_interesses');
      const currentList = savedData ? JSON.parse(savedData) : [];

      const alreadyExists = currentList.some(item => item.id === attraction.id);
      if (alreadyExists) {
        Alert.alert('Ops!', 'Esta atração já está na sua lista de interesses.');
        return;
      }

      currentList.push(attraction);
      await AsyncStorage.setItem('@lista_interesses', JSON.stringify(currentList));
      Alert.alert('Sucesso!', `${attraction.name} foi adicionada aos seus interesses!`);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a atração.');
      console.error(error);
    }
  };

  // iOS e Android usam esquemas de URL diferentes para abrir o mapa
  const mapUrl = Platform.select({
    ios: `maps:0,0?q=${attraction.coordinates.lat},${attraction.coordinates.lng}`,
    android: `geo:0,0?q=${attraction.coordinates.lat},${attraction.coordinates.lng}`
  });

  return (
    <ScrollView style={styles.container}>

      {/* Scroll horizontal separado do principal pra não misturar os dois eixos */}
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

        {/* tel: → discador, whatsapp:// → WhatsApp, mailto: → e-mail, geo:/maps: → mapa */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={btn.base} activeOpacity={0.8} onPress={() => Linking.openURL(attraction.videoUrl)}>
            <Text style={btn.text}>Assistir Vídeo (YouTube)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={btn.base} activeOpacity={0.8} onPress={() => Linking.openURL(mapUrl)}>
            <Text style={btn.text}>Abrir no Mapa</Text>
          </TouchableOpacity>

          <TouchableOpacity style={btn.base} activeOpacity={0.8} onPress={() => Linking.openURL(`tel:${attraction.phone}`)}>
            <Text style={btn.text}>Ligar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={btn.base} activeOpacity={0.8} onPress={() => Linking.openURL(`whatsapp://send?phone=${attraction.phone}`)}>
            <Text style={btn.text}>Chamar no WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity style={btn.base} activeOpacity={0.8} onPress={() => Linking.openURL(`mailto:${attraction.email}`)}>
            <Text style={btn.text}>✉️ Enviar E-mail</Text>
          </TouchableOpacity>
        </View>

        {/* Botão de reserva só aparece quando requiresReservation é true no JSON */}
        {attraction.requiresReservation && (
          <View style={styles.reservationBox}>
            <Text style={styles.reservationText}>Este local possui capacidade limitada.</Text>
            <TouchableOpacity style={btn.base} activeOpacity={0.8} onPress={() => Alert.alert('Reserva', 'Aqui abriria o sistema de reservas da atração.')}>
              <Text style={btn.text}>Fazer Reserva</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.interestBox}>
          <TouchableOpacity style={btn.wine} activeOpacity={0.8} onPress={handleSaveInterest}>
            <Text style={btn.wineText}>Adicionar aos Interesses</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
