import React from 'react';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Remove o cabeçalho padrão (feio) do topo
        tabBarActiveTintColor: '#2B7FFF', // A cor azul do seu design quando ativo
        tabBarInactiveTintColor: 'gray', // Cor cinza quando inativo
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60, // Altura confortável para o dedo
          borderTopWidth: 0, // Remove a linha divisória para um look mais limpo
          elevation: 5, // Sombra suave no Android
        },
      }}
    >
      {/* Aba 1: Início (Aponta para index.tsx) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
        }}
      />

      {/* Aba 2: Certificações */}
      <Tabs.Screen
        name="certificacoes"
        options={{
          title: 'Certificações',
          tabBarIcon: ({ color }) => <Feather name="award" size={24} color={color} />,
        }}
      />

      {/* Aba 3: Trilhas */}
      <Tabs.Screen
        name="trilhas"
        options={{
          title: 'Trilhas',
          tabBarIcon: ({ color }) => <Feather name="layers" size={24} color={color} />,
        }}
      />

      {/* Aba 4: Perfil */}
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
        }}
      />

    {/* CONFIG */}
      <Tabs.Screen
        name="config"
        options={{
          title: 'Config',
          tabBarIcon: ({ color }) => <Feather name="settings" size={24} color={color} />,
        }}
      />
    </Tabs>

  );
}