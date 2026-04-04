import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons'; // IMPORTANTE: Importando os ícones


import HomeScreen from './HomeScreen';
import AttractionsScreen from './AttractionsScreen';
import DetailsScreen from './DetailsScreen';
import InterestScreen from './InterestScreen';
import PassesScreen from './PassesScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


function AttractionsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Lista" 
        component={AttractionsScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Detalhes" 
        component={DetailsScreen} 
        options={{ title: 'Detalhes da Atração' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Início') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Atrações') {
              iconName = focused ? 'map' : 'map-outline';
            } else if (route.name === 'Interesses') {
              iconName = focused ? 'heart' : 'heart-outline';
            } else if (route.name === 'Passes') {
              iconName = focused ? 'ticket' : 'ticket-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          // cores da barra
          tabBarActiveTintColor: '#0984e3', // Azul quando selecionado
          tabBarInactiveTintColor: 'gray',  // Cinza quando não selecionado
          headerShown: true, // Mostra o título no topo da tela
        })}
      >
        <Tab.Screen name="Início" component={HomeScreen} />
        <Tab.Screen name="Atrações" component={AttractionsStack} />
        <Tab.Screen name="Interesses" component={InterestScreen} />
        <Tab.Screen name="Passes" component={PassesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}