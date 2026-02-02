import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview'; // O componente que roda o YouTube
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { ProgressoService } from '@/service/progresso'; // Chama o seu banco

export default function PlayerVideo() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleConcluir = async () => {
    setLoading(true);
    
    // AGORA PASSAMOS: 
    // 1. O ID da trilha ('sustentabilidade')
    // 2. A etapa ('video')
    // 3. As horas que vale (2 horas - isso poderia vir do banco, mas hardcoded no MVP é ok)
    await ProgressoService.concluirEtapa('sustentabilidade', 'video', 0);
    
    setLoading(false);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Simples */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="x" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aula 01: Fundamentos</Text>
        <View style={{width: 24}} />
      </View>

      {/* O Vídeo do YouTube */}
      <View style={styles.videoContainer}>
        <WebView 
          style={{ flex: 1 }}
          javaScriptEnabled={true}
          source={{ uri: 'https://www.youtube.com/watch?v=r9AEI6INDQQ' }}
        />
      </View>

      {/* Conteúdo de Texto + Botão de Ação */}
      <View style={styles.content}>
        <Text style={styles.title}>O que é Economia Circular?</Text>
        <Text style={styles.description}>
          Assista ao vídeo para entender como transformar resíduos em insumos. 
          Isso é a base para o Desafio da Natura.
        </Text>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleConcluir}
          disabled={loading}
        >
          {loading ? (
             <ActivityIndicator color="#FFF" />
          ) : (
             <>
               <Text style={styles.buttonText}>CONCLUIR AULA</Text>
               <Feather name="check" size={20} color="#FFF" />
             </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' }, // Fundo escuro (Cinema)
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  videoContainer: { height: 250, width: '100%', backgroundColor: '#000' },
  content: { padding: 20, flex: 1 },
  title: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  description: { color: '#AAA', fontSize: 16, lineHeight: 24, marginBottom: 30 },
  button: { 
    backgroundColor: '#00C853', 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 12, 
    gap: 10,
    marginTop: 'auto' // Empurra pro final da tela
  },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});