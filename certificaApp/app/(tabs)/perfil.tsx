import React from 'react';
import { View, Text, Button } from 'react-native';
import { AdminService } from '@/service/admin';

export default function Perfil() {

  function handleCriarTrilhas() {
    AdminService.resetarTudoECriarTrilhas();
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
    </View>
  );
}
