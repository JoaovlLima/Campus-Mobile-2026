import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { ProgressoService } from '@/service/progresso';

export default function CertificacoesScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Listas separadas para as seções
  const [disponiveis, setDisponiveis] = useState<any[]>([]);
  const [emAndamento, setEmAndamento] = useState<any[]>([]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      // 1. Pega as trilhas do banco
      const q = query(collection(db, "trilhas"), orderBy("ordem"));
      const querySnapshot = await getDocs(q);
      
      // 2. Pega o progresso do aluno
      const progressoGeral = await ProgressoService.getProgressoGeral();

      const listaDisponiveis: any[] = [];
      const listaPendentes: any[] = [];
      

      querySnapshot.forEach((doc) => {
        const trilha = { id: doc.id, ...doc.data() } as any;
        const status = progressoGeral[trilha.id];

        // Se o aluno nunca começou essa trilha, não mostra nada
        if (!status) return;

        // --- LÓGICA DE SEPARAÇÃO ---

        // CASO 1: PARTE TEÓRICA CONCLUÍDA (Gera Certificado Acadêmico)
        if (status.video === 'concluido' && status.quiz === 'concluido') {
          listaDisponiveis.push({
            id: trilha.id,
            tipo: 'certificado',
            titulo: trilha.titulo,
            subtitulo: `Universidade Federal • ${trilha.horasVideo + trilha.horasQuiz || 5}h`,
            data: 'Emitido hoje',
            corIcone: '#FFF9C4',
            corIconeFundo: '#D4AF37'
          });
        } 
        // Se começou mas não acabou a teoria, poderia entrar em pendente, 
        // mas vamos focar no Desafio como pendência principal.

        // CASO 2: DESAFIO EMPRESA
        if (status.desafio === 'concluido') {
           // Se concluiu, ganha a Badge na lista de disponíveis
           listaDisponiveis.push({
             id: trilha.id + '_badge',
             tipo: 'badge',
             titulo: `Badge: Consultor ${trilha.parceiro || 'Parceiro'}`,
             subtitulo: 'Competência Prática Validada',
             data: 'Verificado',
             corIcone: '#E3F2FD',
             corIconeFundo: '#1565C0'
           });
        } else if (status.video === 'concluido' && status.quiz === 'concluido' && status.desafio !== 'concluido') {
           // Se fez a teoria mas FALTA o desafio -> Vai para "Em Validação"
           listaPendentes.push({
             id: trilha.id,
             titulo: `Desafio Prático: ${trilha.titulo}`,
             subtitulo: 'Aguardando envio ou validação',
             status: 'Pendente'
           });
        }
      });

      setDisponiveis(listaDisponiveis);
      setEmAndamento(listaPendentes);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={carregarDados} />}
      >
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Microcertificações</Text>
          <Text style={styles.headerSubtitle}>Suas conquistas verificadas</Text>
        </View>

        {loading && <ActivityIndicator size="large" color="#00C853" />}

        {/* --- SEÇÃO 1: CONCLUÍDAS (Disponíveis) --- */}
        <Text style={styles.sectionTitle}>✅ Disponíveis ({disponiveis.length})</Text>
        
        {disponiveis.length > 0 ? (
           disponiveis.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.certCard}
              // Passamos o ID e o Tipo para a tela de pré-visualização saber o que mostrar
              onPress={() => router.push({
                  pathname: '/certificado-digital',
                  params: { id: item.id, tipo: item.tipo } 
              })} 
            >
              <View style={[styles.certIconBg, { backgroundColor: item.corIcone }]}>
                <Feather name={item.tipo === 'badge' ? "briefcase" : "award"} size={24} color={item.corIconeFundo} />
              </View>
              <View style={styles.certContent}>
                <Text style={styles.certTitle}>{item.titulo}</Text>
                <Text style={styles.certIssuer}>{item.subtitulo}</Text>
                <Text style={styles.certDate}>{item.data}</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#CCC" />
            </TouchableOpacity>
           ))
        ) : (
           <Text style={styles.emptyText}>Nenhuma certificação emitida ainda.</Text>
        )}


        {/* --- SEÇÃO 2: EM ANDAMENTO (Bloqueadas) --- */}
        <Text style={[styles.sectionTitle, {marginTop: 30}]}>⏳ Em Validação ({emAndamento.length})</Text>
        
        {emAndamento.length > 0 ? (
           emAndamento.map((item, index) => (
            <View key={index} style={[styles.certCard, styles.certCardLocked]}>
              <View style={[styles.certIconBg, {backgroundColor: '#E0E0E0'}]}>
                <Feather name="clock" size={24} color="#999" />
              </View>
              <View style={styles.certContent}>
                <Text style={[styles.certTitle, {color: '#999'}]}>{item.titulo}</Text>
                <Text style={styles.certIssuer}>{item.subtitulo}</Text>
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
            </View>
           ))
        ) : (
           <Text style={styles.emptyText}>Nenhuma pendência ativa.</Text>
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
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  certCardLocked: { backgroundColor: '#F9F9F9', opacity: 0.8 },
  certIconBg: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  certContent: { flex: 1 },
  certTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  certIssuer: { fontSize: 12, color: '#777', marginTop: 2 },
  certDate: { fontSize: 10, color: '#D4AF37', fontWeight: 'bold', marginTop: 4 },
  
  statusBadge: { backgroundColor: '#E3F2FD', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
  statusText: { fontSize: 10, color: '#2196F3', fontWeight: '600' },
  emptyText: { marginLeft: 24, color: '#999', fontStyle: 'italic', marginBottom: 10 }
});