import { AdminService } from '@/service/admin';
import React from 'react';
import { Button, Text, View } from 'react-native';

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
      <Text>Tela de Config</Text>

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
