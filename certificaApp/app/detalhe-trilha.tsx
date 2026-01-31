import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ProgressoService, EstadoTrilha } from '@/service/progresso';

export default function DetalheTrilha() {
  const router = useRouter();
  const [progresso, setProgresso] = useState<EstadoTrilha | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        // Busca só o progresso de sustentabilidade
        const dados = await ProgressoService.getProgressoTrilha('sustentabilidade');
        setProgresso(dados);
      };
      loadData();
    }, [])
  );

  // --- LÓGICA DE BLOQUEIO ---
  // O Desafio só libera se Vídeo E Quiz estiverem concluídos
  const isDesafioLiberado = progresso?.video === 'concluido' && progresso?.quiz === 'concluido';

  const handlePressDesafio = () => {
    if (isDesafioLiberado) {
      router.push('/detalhe-desafio'); // Vai para o upload
    } else {
      Alert.alert(
        "✋ Etapa Bloqueada",
        "Para acessar o Desafio da Natura, você precisa primeiro concluir a fundamentação teórica (Vídeo e Quiz) da faculdade."
      );
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'concluido') return <Feather name="check-circle" size={24} color="#00C853" />;
    return <Feather name="circle" size={24} color="#CCC" />;
  };

  return (
    <View style={styles.container}>
      
      {/* HEADER DA TRILHA */}
      <View style={styles.headerContainer}>
         <LinearGradient
            colors={['#00C853', '#69F0AE']}
            style={styles.headerBackground}
         >
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Sustentabilidade</Text>
            <Text style={styles.headerSubtitle}>Trilha Integrada • IES + Mercado</Text>
         </LinearGradient>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        
        {/* --- BLOCO 1: FUNDAMENTAÇÃO (IES) --- */}
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>1. Fundamentação Teórica</Text>
           <Text style={styles.sectionSubtitle}>Obrigatório pela Faculdade</Text>
        </View>

        {/* Card Vídeo */}
        <TouchableOpacity 
          style={styles.cardStandard}
          onPress={() => router.push('/player-video')}
        >
           <View style={styles.iconContainer}>
              <Feather name="video" size={20} color="#666" />
           </View>
           <View style={styles.cardContent}>
              <Text style={styles.activityTitle}>Fundamentos da Ecologia</Text>
              <Text style={styles.activityMeta}>Vídeo Aula • 2h</Text>
           </View>
           {getStatusIcon(progresso?.video || 'bloqueado')}
        </TouchableOpacity>

        {/* Card Quiz */}
        <TouchableOpacity 
          style={styles.cardStandard}
          onPress={() => router.push('/tela-quiz')}
        >
           <View style={styles.iconContainer}>
              <Feather name="edit-3" size={20} color="#666" />
           </View>
           <View style={styles.cardContent}>
              <Text style={styles.activityTitle}>Validação de Conhecimento</Text>
              <Text style={styles.activityMeta}>Quiz • 1h</Text>
           </View>
           {getStatusIcon(progresso?.quiz || 'bloqueado')}
        </TouchableOpacity>


        {/* --- LINHA CONECTORA VISUAL --- */}
        <View style={styles.connectorContainer}>
           <View style={[styles.verticalLine, isDesafioLiberado && {backgroundColor: '#1565C0'}]} />
           <View style={[styles.arrowDown, isDesafioLiberado && {borderTopColor: '#1565C0'}]} />
        </View>


        {/* --- BLOCO 2: PRÁTICA (MERCADO) --- */}
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>2. Desafio Prático</Text>
           <Text style={styles.sectionSubtitle}>Parceria Empresarial (Premium)</Text>
        </View>

        {/* CARD DO DESAFIO (Muda visualmente se estiver bloqueado ou liberado) */}
        <TouchableOpacity 
          style={[styles.cardPartner, !isDesafioLiberado && styles.cardLocked]} 
          onPress={handlePressDesafio}
          activeOpacity={0.8}
        >
           {/* Badge de Parceiro */}
           <View style={[styles.partnerBadge, !isDesafioLiberado && {backgroundColor: '#999'}]}>
              <Text style={styles.partnerText}>
                 {isDesafioLiberado ? 'DESBLOQUEADO' : 'BLOQUEADO'}
              </Text>
           </View>

           <View style={styles.row}>
             <View style={[
                styles.iconContainer, 
                {backgroundColor: isDesafioLiberado ? '#E3F2FD' : '#EEE'}
             ]}>
                <Feather 
                  name={isDesafioLiberado ? "briefcase" : "lock"} 
                  size={20} 
                  color={isDesafioLiberado ? "#1565C0" : "#999"} 
                />
             </View>
             
             <View style={styles.cardContent}>
                <Text style={[styles.activityTitle, !isDesafioLiberado && {color: '#888'}]}>
                   Desafio ESG Natura
                </Text>
                <Text style={styles.partnerName}>
                   {isDesafioLiberado ? 'Oferecido por Natura & Co.' : 'Complete a etapa anterior'}
                </Text>
                
                {isDesafioLiberado && (
                   <View style={styles.tagReward}>
                      <Feather name="award" size={12} color="#F9A825" />
                      <Text style={styles.tagRewardText}>Gera Badge Premium</Text>
                   </View>
                )}
             </View>

             {/* Ícone de Status da Direita */}
             {progresso?.desafio === 'concluido' ? (
                <Feather name="check-circle" size={24} color="#00C853" />
             ) : (
                <Feather 
                   name={isDesafioLiberado ? "chevron-right" : "lock"} 
                   size={24} 
                   color={isDesafioLiberado ? "#1565C0" : "#CCC"} 
                />
             )}
           </View>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FD' },
  headerContainer: { borderBottomLeftRadius: 20, borderBottomRightRadius: 20, overflow: 'hidden' },
  headerBackground: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20 },
  backButton: { marginBottom: 10 },
  headerTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  headerSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 14 },
  
  sectionHeader: { marginBottom: 10, marginTop: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  sectionSubtitle: { fontSize: 12, color: '#888', marginBottom: 5 },

  // Card Padrão
  cardStandard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#EEE'
  },
  iconContainer: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardContent: { flex: 1 },
  activityTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  activityMeta: { fontSize: 12, color: '#888', marginTop: 2 },

  // Conector Visual (Seta)
  connectorContainer: { alignItems: 'center', marginVertical: 5 },
  verticalLine: { width: 2, height: 20, backgroundColor: '#DDD' },
  arrowDown: { width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 6, borderStyle: 'solid', backgroundColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#DDD' },

  // Card Parceiro (Empresa)
  cardPartner: {
    backgroundColor: '#FFF', borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#BBDEFB',
    padding: 16, paddingTop: 24, elevation: 3, shadowColor: '#000', shadowOffset: {width:0, height:2}, shadowOpacity:0.1
  },
  cardLocked: {
    backgroundColor: '#F5F5F5', borderColor: '#E0E0E0', elevation: 0
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  partnerBadge: {
    position: 'absolute', top: 0, left: 16, backgroundColor: '#1565C0',
    paddingHorizontal: 8, paddingVertical: 2, borderBottomLeftRadius: 4, borderBottomRightRadius: 4,
  },
  partnerText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  partnerName: { color: '#1565C0', fontSize: 12, fontWeight: '600', marginBottom: 4 },
  
  tagReward: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFF9C4', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  tagRewardText: { fontSize: 10, color: '#F9A825', fontWeight: 'bold' }
});