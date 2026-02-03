import { db } from '@/config/firebaseConfig';
import { EstadoTrilha, ProgressoService } from '@/service/progresso';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DetalheTrilha() {
  const router = useRouter();
  
  // 1. Recebe o ID da trilha (ex: 'sustentabilidade' ou 'tecnologia')
  const params = useLocalSearchParams();
  const trilhaId = params.id as string || 'sustentabilidade'; // Fallback se der erro

  const [loading, setLoading] = useState(true);
  const [trilhaData, setTrilhaData] = useState<any>(null); // Dados visuais (Título, Cor)
  const [desafios, setDesafios] = useState<any[]>([]); // Lista de desafios do banco
  const [progresso, setProgresso] = useState<EstadoTrilha | null>(null); // Progresso do user

  useFocusEffect(
    useCallback(() => {
      const carregarTudo = async () => {
        setLoading(true);
        try {
          // A. Busca os dados visuais da Trilha (Título, Cor, Slug)
          const docRef = doc(db, "trilhas", trilhaId);
          const docSnap = await getDoc(docRef);
          
          if (!docSnap.exists()) {
            Alert.alert("Erro", "Trilha não encontrada");
            router.back();
            return;
          }
          const dadosTrilha = docSnap.data();
          setTrilhaData(dadosTrilha);

          // B. Busca o Progresso do Usuário nessa trilha
          const dadosProgresso = await ProgressoService.getProgressoTrilha(trilhaId);
          setProgresso(dadosProgresso);

          // C. Busca os Desafios vinculados a essa trilha (pelo SLUG/Tag)
          // Ex: Se trilha.slug = 'esg', busca desafios com categoriaTrilha = 'esg'
          if (dadosTrilha.slug) {
            const q = query(collection(db, "desafios"), where("categoriaTrilha", "==", dadosTrilha.slug));
            const querySnapshot = await getDocs(q);
            const listaDesafios: any[] = [];
            querySnapshot.forEach((d) => listaDesafios.push({ id: d.id, ...d.data() }));
            setDesafios(listaDesafios);
          }

        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      
      carregarTudo();
    }, [trilhaId, router])
  );

  // Lógica de Bloqueio (Teoria libera Prática)
  const isTeoriaConcluida = progresso?.video === 'concluido' && progresso?.quiz === 'concluido';

  if (loading || !trilhaData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#00C853" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      {/* HEADER DINÂMICO (Usa a cor do banco) */}
      <View style={styles.headerContainer}>
         <LinearGradient
            // Usa a cor da trilha ou um verde padrão
            colors={[trilhaData.cor || '#00C853', '#FFFFFF']} 
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1.5 }} // Gradiente suave descendo
            style={styles.headerBackground}
         >
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{trilhaData.titulo}</Text>
            <Text style={styles.headerSubtitle}>{trilhaData.subtitulo || 'Trilha de Competência'}</Text>
         </LinearGradient>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        
        {/* --- BLOCO 1: FUNDAMENTAÇÃO (Padrão IES) --- */}
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>1. Fundamentação Teórica</Text>
           <Text style={styles.sectionSubtitle}>Conteúdo Curado pela Faculdade</Text>
        </View>

        {/* Card Vídeo (Linka para o ID da trilha atual) */}
        <TouchableOpacity 
          style={styles.cardStandard}
          onPress={() => router.push({ pathname: '/player-video', params: { id: trilhaId } })}
        >
           <View style={styles.iconContainer}>
              <Feather name="video" size={20} color="#666" />
           </View>
           <View style={styles.cardContent}>
              <Text style={styles.activityTitle}>Conteúdo Principal</Text>
              <Text style={styles.activityMeta}>{trilhaData.conteudoLabel || 'Vídeo Aula'}</Text>
           </View>
           {progresso?.video === 'concluido' ? 
              <Feather name="check-circle" size={24} color={trilhaData.cor} /> : 
              <Feather name="circle" size={24} color="#CCC" />
           }
        </TouchableOpacity>

        {/* Card Quiz (Linka para o ID da trilha atual) */}
        <TouchableOpacity 
          style={styles.cardStandard}
          onPress={() => router.push({ pathname: '/tela-quiz', params: { id: trilhaId } })}
        >
           <View style={styles.iconContainer}>
              <Feather name="edit-3" size={20} color="#666" />
           </View>
           <View style={styles.cardContent}>
              <Text style={styles.activityTitle}>Validação de Conhecimento</Text>
              <Text style={styles.activityMeta}>Quiz Avaliativo</Text>
           </View>
           {progresso?.quiz === 'concluido' ? 
              <Feather name="check-circle" size={24} color={trilhaData.cor} /> : 
              <Feather name="circle" size={24} color="#CCC" />
           }
        </TouchableOpacity>


        {/* --- CONECTOR VISUAL --- */}
        <View style={styles.connectorContainer}>
           <View style={[styles.verticalLine, isTeoriaConcluida && {backgroundColor: trilhaData.cor}]} />
           <Feather name="chevron-down" size={24} color={isTeoriaConcluida ? trilhaData.cor : "#DDD"} />
        </View>


        {/* --- BLOCO 2: LISTA DE DESAFIOS (Dinâmico do Banco) --- */}
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>2. Aplicação Prática</Text>
           <Text style={styles.sectionSubtitle}>Desafios de Empresas Parceiras</Text>
        </View>

        {desafios.length > 0 ? (
          desafios.map((desafio) => (
            <TouchableOpacity 
              key={desafio.id}
              style={[styles.cardPartner, !isTeoriaConcluida && styles.cardLocked]} 
              onPress={() => {
                if (isTeoriaConcluida) {
                  router.push({
                    pathname: '/detalhe-desafio',
                    params: { id: trilhaId, desafioId: desafio.id, titulo: desafio.titulo }
                  });
                } else {
                  Alert.alert("Bloqueado", "Conclua a teoria para liberar este desafio.");
                }
              }}
              activeOpacity={0.8}
            >
               <View style={[styles.partnerBadge, !isTeoriaConcluida && {backgroundColor: '#999'}, isTeoriaConcluida && {backgroundColor: trilhaData.cor}]}>
                  <Text style={styles.partnerText}>
                     {isTeoriaConcluida ? 'DESBLOQUEADO' : 'BLOQUEADO'}
                  </Text>
               </View>

               <View style={styles.row}>
                 <View style={[styles.iconContainer, {backgroundColor: isTeoriaConcluida ? '#E3F2FD' : '#EEE'}]}>
                    <Feather name="briefcase" size={20} color={isTeoriaConcluida ? "#1565C0" : "#999"} />
                 </View>
                 
                 <View style={styles.cardContent}>
                    <Text style={[styles.activityTitle, !isTeoriaConcluida && {color: '#888'}]}>
                       {desafio.titulo}
                    </Text>
                    <Text style={[styles.partnerName, isTeoriaConcluida && {color: '#1565C0'}]}>
                       {desafio.empresa}
                    </Text>
                 </View>

                 {/* Status Específico deste Desafio */}
                 {progresso?.desafio === 'concluido' ? (
                    <Feather name="check-circle" size={24} color={trilhaData.cor} />
                 ) : (
                    <Feather 
                       name={isTeoriaConcluida ? "chevron-right" : "lock"} 
                       size={24} 
                       color={isTeoriaConcluida ? trilhaData.cor : "#CCC"} 
                    />
                 )}
               </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
             <Text style={styles.emptyText}>Nenhum desafio disponível para esta competência no momento.</Text>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FD' },
  headerContainer: { borderBottomLeftRadius: 20, borderBottomRightRadius: 20, overflow: 'hidden' },
  headerBackground: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20 },
  backButton: { marginBottom: 15 },
  headerTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  headerSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 14, marginTop: 4 },
  
  sectionHeader: { marginBottom: 15, marginTop: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  sectionSubtitle: { fontSize: 12, color: '#888', marginBottom: 5 },

  cardStandard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#EEE' },
  iconContainer: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardContent: { flex: 1 },
  activityTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  activityMeta: { fontSize: 12, color: '#888', marginTop: 2 },

  connectorContainer: { alignItems: 'center', marginVertical: 5 },
  verticalLine: { width: 2, height: 15, backgroundColor: '#DDD' },

  cardPartner: { backgroundColor: '#FFF', borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#BBDEFB', padding: 16, paddingTop: 28, elevation: 3 },
  cardLocked: { backgroundColor: '#F5F5F5', borderColor: '#E0E0E0', elevation: 0 },
  row: { flexDirection: 'row', alignItems: 'center' },
  
  partnerBadge: { position: 'absolute', top: 0, left: 16, paddingHorizontal: 8, paddingVertical: 2, borderBottomLeftRadius: 4, borderBottomRightRadius: 4 },
  partnerText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  partnerName: { color: '#999', fontSize: 12, fontWeight: '600', marginBottom: 4 },
  
  emptyState: { padding: 20, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#CCC', borderRadius: 10 },
  emptyText: { color: '#999', textAlign: 'center' }
});