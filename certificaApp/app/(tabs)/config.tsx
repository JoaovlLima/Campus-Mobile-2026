import React from 'react';
import { View, Text, Button } from 'react-native';
import { AdminService } from '@/service/admin';

export default function Config() {

  function handleCriarTrilhas() {
    AdminService.resetarTudoECriarTrilhas();
  }

  function handleCriarDesafio(){
    AdminService.popularSomenteDesafios();
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Text>Tela de Perfil</Text>

      <Button
        title="ADMIN: Criar Trilhas"
        onPress={handleCriarTrilhas}
      />

      <Button
        title="ADMIN: Criar Desafios"
        onPress={handleCriarDesafio}
      />
    </View>
  );
}
