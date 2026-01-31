import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
// Ajustando o caminho para voltar duas pastas: de (tabs) -> app -> raiz -> components
import ProgressCard from '../../components/ProgressCard'; 

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, João 👋</Text>
          <Text style={styles.subtitle}>Seu progresso acadêmico</Text>
        </View>
        
        {/* O Card Roxo */}
        <ProgressCard />
        
        {/* Aviso Amarelo */}
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ✨ Você está construindo um futuro brilhante! 🎓
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Conquistas Recentes</Text>
        
        {/* Placeholder para os cards brancos */}
        <View style={{ paddingHorizontal: 24, marginTop: 10 }}>
            <Text style={{color: '#999'}}>Carregando atividades...</Text>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FD' },
  scrollContent: { paddingBottom: 20 },
  header: { paddingHorizontal: 24, paddingTop: 40 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A' },
  subtitle: { fontSize: 14, color: '#757575', marginTop: 4 },
  warningBox: {
    marginHorizontal: 20, marginTop: 20, padding: 12, marginBottom: 30,
    backgroundColor: '#FFF9E6', borderRadius: 12,
    borderWidth: 1, borderColor: '#FFD700', alignItems: 'center',
  },
  warningText: { color: '#B7990D', fontSize: 12, fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginLeft: 24, marginBottom: 10 }
});