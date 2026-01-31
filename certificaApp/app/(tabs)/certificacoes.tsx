import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CertificacoesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Microcertificações</Text>
          <Text style={styles.headerSubtitle}>Suas conquistas verificadas</Text>
        </View>

        {/* Seção 1: Concluídas (Clicáveis) */}
        <Text style={styles.sectionTitle}>✅ Disponíveis (1)</Text>
        
        <TouchableOpacity 
          style={styles.certCard}
          onPress={() => router.push('/certificado-digital')} // LEVA PARA A NOVA TELA
        >
          <View style={styles.certIconBg}>
            <Feather name="award" size={24} color="#D4AF37" />
          </View>
          <View style={styles.certContent}>
            <Text style={styles.certTitle}>Sustentabilidade e Meio Ambiente</Text>
            <Text style={styles.certIssuer}>Universidade Federal • 40h</Text>
            <Text style={styles.certDate}>Emitido em 29/01/2026</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#CCC" />
        </TouchableOpacity>

        {/* Seção 2: Em Andamento (Bloqueadas) */}
        <Text style={[styles.sectionTitle, {marginTop: 30}]}>⏳ Em Validação (1)</Text>
        
        <View style={[styles.certCard, styles.certCardLocked]}>
          <View style={[styles.certIconBg, {backgroundColor: '#E0E0E0'}]}>
            <Feather name="clock" size={24} color="#999" />
          </View>
          <View style={styles.certContent}>
            <Text style={[styles.certTitle, {color: '#999'}]}>Desafio Prático ESG</Text>
            <Text style={styles.certIssuer}>Aguardando validação do professor</Text>
            <View style={styles.statusBadge}>
               <Text style={styles.statusText}>Enviado hoje</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FD' },
  scrollContent: { paddingBottom: 20 },
  header: { paddingHorizontal: 24, paddingTop: 40, marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A' },
  headerSubtitle: { fontSize: 14, color: '#757575', marginTop: 4 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#666', marginLeft: 24, marginBottom: 10, textTransform: 'uppercase' },
  
  certCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    // Sombra
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  certCardLocked: { backgroundColor: '#F9F9F9', opacity: 0.8 },
  certIconBg: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#FFF9C4', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  certContent: { flex: 1 },
  certTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  certIssuer: { fontSize: 12, color: '#777', marginTop: 2 },
  certDate: { fontSize: 10, color: '#D4AF37', fontWeight: 'bold', marginTop: 4 },
  
  statusBadge: { backgroundColor: '#E3F2FD', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
  statusText: { fontSize: 10, color: '#2196F3', fontWeight: '600' }
}); 