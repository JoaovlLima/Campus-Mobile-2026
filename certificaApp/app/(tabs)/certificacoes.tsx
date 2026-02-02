import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { ProgressoService } from '@/service/progresso';

export default function CertificacoesScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Uma única lista para tudo (Carteira Unificada)
  const [meusCertificados, setMeusCertificados] = useState<any[]>([]);

  const carregarCarteira = async () => {
    setLoading(true);
    try {
      // 1. Busca tudo
      const q = query(collection(db, "trilhas"), orderBy("ordem"));
      const querySnapshot = await getDocs(q);
      const progressoGeral = await ProgressoService.getProgressoGeral();

      const lista: any[] = [];

      querySnapshot.forEach((doc) => {
        const trilha = { id: doc.id, ...doc.data() } as any;
        const status = progressoGeral[trilha.id];

        if (!status) return; // Se nem começou, ignora.

        // --- LÓGICA DE STATUS ---
        const desafioFeito = status.desafio === 'concluido';
        const teoriaFeita = status.video === 'concluido' && status.quiz === 'concluido';

        // 1. COMPLETO (Tem o certificado final)
        if (desafioFeito) {
          lista.push({
            id: trilha.id,
            status: 'concluido', // STATUS VERDE
            titulo: trilha.titulo,
            descricao: trilha.parceiro ? `Validado por ${trilha.parceiro}` : 'Certificação Acadêmica',
            data: 'Conquistado',
            cor: trilha.cor || '#00C853',
            icone: 'award'
          });
        } 
        // 2. PENDENTE (Fez a teoria, falta o desafio)
        else if (teoriaFeita) {
          lista.push({
            id: trilha.id,
            status: 'pendente', // STATUS AMARELO
            titulo: trilha.titulo,
            descricao: 'Aguardando envio do Desafio Prático',
            data: 'Em andamento',
            cor: '#FFC107',
            icone: 'clock'
          });
        }
      });

      // Ordena: Pendentes primeiro (para lembrar o aluno), depois Concluídos
      lista.sort((a, b) => (a.status === 'pendente' ? -1 : 1));
      
      setMeusCertificados(lista);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarCarteira();
    }, [])
  );

  // Ação ao clicar no card
  const handlePress = (item: any) => {
    if (item.status === 'concluido') {
      // Se já acabou, vai ver o certificado para baixar/compartilhar
      router.push({
        pathname: '/certificado-digital',
        params: { id: item.id }
      });
    } else {
      // Se está pendente, manda ele lá pro desafio para terminar logo
      Alert.alert(
        "Quase lá! 🚧",
        "Você já tem a base teórica. Complete o Desafio Prático para desbloquear este certificado.",
        [
            { text: "Ir para Desafio", onPress: () => router.push('/detalhe-trilha') },
            { text: "Cancelar", style: "cancel" }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={carregarCarteira} />}
      >
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Minha Carteira</Text>
          <Text style={styles.headerSubtitle}>Competências e Habilidades Validadas</Text>
        </View>

        {loading && <ActivityIndicator size="large" color="#00C853" style={{marginTop: 20}} />}

        {!loading && meusCertificados.length === 0 && (
            <View style={styles.emptyState}>
                <Feather name="folder" size={40} color="#DDD" />
                <Text style={styles.emptyText}>Você ainda não possui certificações.</Text>
            </View>
        )}

        {/* LISTA UNIFICADA */}
        {meusCertificados.map((item, index) => (
          <TouchableOpacity 
            key={index}
            style={[
                styles.card, 
                item.status === 'pendente' && styles.cardPendente // Estilo diferente se pendente
            ]}
            onPress={() => handlePress(item)}
            activeOpacity={0.7}
          >
            {/* Ícone Lateral */}
            <View style={[
                styles.iconBox, 
                { backgroundColor: item.status === 'concluido' ? `${item.cor}20` : '#FFF8E1' } // Fundo clarinho dinâmico
            ]}>
              <Feather 
                name={item.icone} 
                size={24} 
                color={item.status === 'concluido' ? item.cor : '#FFC107'} 
              />
            </View>

            {/* Textos */}
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.titulo}</Text>
              <Text style={styles.cardDesc}>{item.descricao}</Text>
              
              {/* Badgezinha de Status */}
              <View style={[
                  styles.statusBadge, 
                  { backgroundColor: item.status === 'concluido' ? '#E8F5E9' : '#FFF3E0' }
              ]}>
                  <Text style={[
                      styles.statusText,
                      { color: item.status === 'concluido' ? '#2E7D32' : '#EF6C00' }
                  ]}>
                      {item.data}
                  </Text>
              </View>
            </View>

            {/* Seta indicando ação */}
            <Feather 
                name={item.status === 'concluido' ? "chevron-right" : "alert-circle"} 
                size={20} 
                color="#CCC" 
            />

          </TouchableOpacity>
        ))}

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

  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    marginHorizontal: 20, marginBottom: 15, padding: 16, borderRadius: 16,
    borderWidth: 1, borderColor: '#F0F0F0',
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  cardPendente: {
    backgroundColor: '#FAFAFA', borderColor: '#EEE', opacity: 0.9
  },

  iconBox: { width: 50, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  cardDesc: { fontSize: 12, color: '#888', marginBottom: 8 },
  
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: 'bold' },

  emptyState: { alignItems: 'center', marginTop: 50, gap: 10 },
  emptyText: { color: '#999', fontSize: 14 }
});