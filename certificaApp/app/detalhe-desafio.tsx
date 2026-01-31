import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function DetalheDesafio() {
  const router = useRouter();
  const [link, setLink] = useState('');

  const handleEnviar = () => {
    if (link.length < 3) {
      Alert.alert("Link necessário", "Por favor, cole um link ou anexe um arquivo.");
      return;
    }
    Alert.alert("Sucesso! 🚀", "Sua evidência foi enviada para validação.");
    router.replace('/(tabs)/certificacoes'); // Manda para a tela de certificados (opcional) ou volta
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header do Desafio */}
        <LinearGradient
          colors={['#2B7FFF', '#9810FA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <SafeAreaView>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color="#FFF" />
              <Text style={styles.backText}>Voltar</Text>
            </TouchableOpacity>

            <View style={styles.headerContent}>
              <View style={styles.tagContainer}>
                <Text style={styles.tagText}>ENTREGA FINAL</Text>
              </View>
              <Text style={styles.title}>Desafio Prático ESG</Text>
              <Text style={styles.partner}>Aplique os conceitos aprendidos</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* Formulário de Envio */}
        <View style={styles.body}>
          <View style={styles.submissionCard}>
            <Text style={styles.submissionLabel}>Cole o link do seu projeto</Text>
            <Text style={styles.submissionHint}>Github, Drive, Figma ou LinkedIn</Text>
            
            <View style={styles.inputContainer}>
              <Feather name="link" size={20} color="#666" style={{marginRight: 10}} />
              <TextInput 
                placeholder="https://..."
                style={styles.input}
                value={link}
                onChangeText={setLink}
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity style={styles.uploadButton}>
              <Feather name="upload" size={20} color="#2B7FFF" />
              <Text style={styles.uploadText}>Ou faça upload de arquivo (PDF/JPG)</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleEnviar}>
              <LinearGradient
                colors={['#00C853', '#69F0AE']} // Botão verde de sucesso
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>ENVIAR ATIVIDADE</Text>
                <Feather name="check-circle" size={20} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FD' },
  header: { paddingBottom: 40, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, paddingHorizontal: 20, paddingTop: 10 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  backText: { color: '#FFF', marginLeft: 8, fontSize: 16 },
  headerContent: { marginTop: 0 },
  headerBackground: { 
    paddingTop: 60, // AUMENTAMOS AQUI PARA EMPURRAR O CONTEÚDO PARA BAIXO
    paddingBottom: 30 
  },
  tagContainer: { backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 10 },
  tagText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  partner: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  body: { padding: 24, marginTop: -30 },
  submissionCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  submissionLabel: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  submissionHint: { fontSize: 12, color: '#999', marginBottom: 15 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F7FA', borderRadius: 12, paddingHorizontal: 15, height: 50, marginBottom: 15, borderWidth: 1, borderColor: '#E0E0E0' },
  input: { flex: 1, color: '#333' },
  uploadButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderWidth: 1, borderColor: '#2B7FFF', borderStyle: 'dashed', borderRadius: 12, marginBottom: 20, gap: 10 },
  uploadText: { color: '#2B7FFF', fontWeight: '600' },
  submitButton: { flexDirection: 'row', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', gap: 10 },
  submitButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});