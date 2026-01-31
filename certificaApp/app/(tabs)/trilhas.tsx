import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { ProgressoService } from '@/service/progresso'; // Ajuste o caminho se necessário

export default function TrilhasScreen() {
  const router = useRouter();
  
  const [listaTrilhas, setListaTrilhas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Agora guardamos o objeto geral (todas as trilhas do user)
  const [progressoGeral, setProgressoGeral] = useState<any>({}); 

  useFocusEffect(
    useCallback(() => {
      const carregarTudo = async () => {
        setLoading(true);
        try {
          // A. Busca TUDO que o usuário já fez
          const progresso = await ProgressoService.getProgressoGeral();
          setProgressoGeral(progresso);

          // B. Busca as trilhas disponíveis (Título, Cor...)
          const q = query(collection(db, "trilhas"), orderBy("ordem"));
          const querySnapshot = await getDocs(q);
          
          const trilhasDoBanco: any[] = [];
          querySnapshot.forEach((doc) => {
            trilhasDoBanco.push({ id: doc.id, ...doc.data() });
          });
          
          setListaTrilhas(trilhasDoBanco);
        } catch (e) {
          console.error("Erro ao carregar:", e);
        } finally {
          setLoading(false);
        }
      };

      carregarTudo();
    }, [])
  );

  // --- LÓGICA CORRIGIDA ---
  const calcularProgresso = (trilhaId: string) => {
    // 1. Pega os dados ESPECÍFICOS dessa trilha dentro do objeto geral
    const dadosTrilha = progressoGeral[trilhaId];

    // Se o usuário nunca tocou nessa trilha, retorna 0
    if (!dadosTrilha) return 0;

    let concluidos = 0;
    if (dadosTrilha.video === 'concluido') concluidos++;
    if (dadosTrilha.quiz === 'concluido') concluidos++;
    if (dadosTrilha.desafio === 'concluido') concluidos++;
    
    return concluidos / 3; // Supondo 3 etapas por trilha
  };

  const descobrirProxima = (trilhaId: string) => {
    const dadosTrilha = progressoGeral[trilhaId];

    if (!dadosTrilha) return 'Iniciar Trilha'; // Se não começou
    
    if (dadosTrilha.video !== 'concluido') return 'Vídeo: Fundamentos';
    if (dadosTrilha.quiz !== 'concluido') return 'Quiz de Validação';
    if (dadosTrilha.desafio !== 'concluido') return 'Desafio Prático';
    
    return 'Concluída! 🏆';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Trilhas de Competências</Text>
          <Text style={styles.headerSubtitle}>Organize seu aprendizado por temas</Text>
        </View>

        {loading ? (
            <ActivityIndicator size="large" color="#00C853" style={{marginTop: 50}} />
        ) : (
            <View style={styles.listContainer}>
            {listaTrilhas.map((trilha) => {
                
                const percentual = calcularProgresso(trilha.id);
                const proximaAtividade = descobrirProxima(trilha.id);

                return (
                    <TouchableOpacity 
                    key={trilha.id} 
                    style={styles.card}
                    onPress={() => {
                        // Verifica se é a trilha que já criamos as telas
                        if (trilha.id === 'sustentabilidade') {
                            router.push('/detalhe-trilha' as any);
                        } else {
                            alert(`A trilha de ${trilha.titulo} estará disponível em breve!`);
                        }
                    }}
                    activeOpacity={0.9}
                    >
                    <View style={styles.cardTop}>
                        <View style={[styles.iconBox, { backgroundColor: trilha.cor }]}>
                           <Feather name={trilha.icone || 'box'} size={24} color="#FFF" />
                        </View>

                        <View style={styles.cardTexts}>
                        <Text style={styles.cardTitle}>{trilha.titulo}</Text>
                        <Text style={styles.cardSubtitle}>{trilha.subtitulo}</Text>
                        </View>
                    </View>

                    <View style={styles.progressSection}>
                        <View style={styles.progressLabels}>
                        <Text style={styles.progressLabel}>Progresso da trilha</Text>
                        <Text style={styles.progressPercent}>{Math.round(percentual * 100)}%</Text>
                        </View>
                        <View style={styles.progressBarBg}>
                        <View 
                            style={[
                            styles.progressBarFill, 
                            { width: `${percentual * 100}%`, backgroundColor: trilha.cor }
                            ]} 
                        />
                        </View>
                    </View>

                    <View style={styles.cardFooter}>
                        <View>
                        <Text style={styles.footerLabel}>
                            {percentual === 1 ? 'Status' : 'Próxima atividade'}
                        </Text>
                        <Text style={[
                            styles.footerValue,
                            percentual === 1 && { color: '#00C853' }
                        ]}>
                            {proximaAtividade}
                        </Text>
                        </View>
                        <Feather name={percentual === 1 ? "check-circle" : "chevron-right"} size={20} color="#999" />
                    </View>

                    </TouchableOpacity>
                );
            })}
            </View>
        )}

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
  listContainer: { paddingHorizontal: 20, gap: 20 },
  card: {
    backgroundColor: '#FFF', borderRadius: 20, padding: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
    borderWidth: 1, borderColor: '#F0F0F0',
  },
  cardTop: { flexDirection: 'row', marginBottom: 16, gap: 16 },
  iconBox: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  cardTexts: { flex: 1, justifyContent: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  cardSubtitle: { fontSize: 12, color: '#888' },
  progressSection: { marginBottom: 20 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 12, color: '#888' },
  progressPercent: { fontSize: 12, fontWeight: 'bold', color: '#333' },
  progressBarBg: { height: 8, backgroundColor: '#F0F2F5', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: 8, borderRadius: 4 },
  cardFooter: { backgroundColor: '#F8F9FD', padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerLabel: { fontSize: 10, color: '#888', marginBottom: 4, textTransform: 'uppercase' },
  footerValue: { fontSize: 14, fontWeight: '600', color: '#333' }
});