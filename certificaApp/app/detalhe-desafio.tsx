import { db } from '@/config/firebaseConfig';
import { ProgressoService } from '@/service/progresso';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface DadosDesafio {
  titulo?: string;
  empresa?: string;
  descricao?: string;
  recompensa?: string;
  nivel?: string;
  documentoUrl?: string;
  documentoTitulo?: string;
}

export default function DetalheDesafio() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; desafioId?: string; titulo?: string }>();

  const trilhaId = params.id ?? 'sustentabilidade';
  const desafioId = params.desafioId;
  const tituloDesafio = params.titulo ?? 'Desafio Prático';

  const [link, setLink] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [horasRecompensa, setHorasRecompensa] = useState(0);
  const [desafio, setDesafio] = useState<DadosDesafio | null>(null);
  const [carregandoDesafio, setCarregandoDesafio] = useState(!!desafioId);

  // Busca horas da trilha e dados completos do desafio (documento da empresa)
  useEffect(() => {
    const carregar = async () => {
      try {
        const [trilhaSnap, desafioSnap] = await Promise.all([
          getDoc(doc(db, 'trilhas', trilhaId)),
          desafioId ? getDoc(doc(db, 'desafios', desafioId)) : null,
        ]);

        if (trilhaSnap.exists()) {
          setHorasRecompensa(trilhaSnap.data().horasGanha ?? 0);
        }
        if (desafioSnap?.exists()) {
          setDesafio(desafioSnap.data() as DadosDesafio);
        }
      } catch (error) {
        console.log('Erro ao carregar dados:', error);
      } finally {
        setCarregandoDesafio(false);
      }
    };
    carregar();
  }, [trilhaId, desafioId]);

  const handleBaixarDocumento = async () => {
    const url = desafio?.documentoUrl;
    if (!url) {
      Alert.alert('Documento indisponível', 'Este desafio ainda não possui documento para download.');
      return;
    }
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Erro', 'Não foi possível abrir o documento.');
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível abrir o documento. Verifique sua conexão.');
    }
  };

  const handleEnviar = async () => {
    if (link.length < 3) {
      Alert.alert("Link necessário", "Por favor, cole um link ou anexe um arquivo.");
      return;
    }

    setEnviando(true);

    try {
      // O Service já sabe buscar as horas internamente para somar na conta do usuário.
      // A gente não precisa passar 'horasRecompensa' aqui, o Service é autônomo.
      await ProgressoService.concluirEtapa(trilhaId, 'desafio', horasRecompensa);

      Alert.alert(
        "Sucesso! 🚀", 
        // Usamos a variável de estado só para mostrar na mensagem bonitinha
        `Você garantiu +${horasRecompensa} horas complementares!`,
        [
            { 
                text: "Ver Carteira", 
                onPress: () => router.replace('/(tabs)/certificacoes') 
            }
        ]
      );

    } catch (error) {
      Alert.alert("Erro", "Não foi possível enviar. Tente novamente.");
      console.error(error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
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
              <View style={styles.rowTags}>
                <View style={styles.tagContainer}>
                  <Text style={styles.tagText}>ENTREGA FINAL</Text>
                </View>
                
                {/* --- VISUALIZAÇÃO DAS HORAS AQUI --- */}
                {horasRecompensa > 0 && (
                    <View style={styles.hoursTag}>
                        <Feather name="clock" size={10} color="#FFD700" />
                        <Text style={styles.hoursText}>VALE {horasRecompensa}H</Text>
                    </View>
                )}
              </View>

              <Text style={styles.title}>{tituloDesafio}</Text>
              <Text style={styles.partner}>
                 {horasRecompensa > 0 
                   ? `Complete para garantir suas ${horasRecompensa} horas.` 
                   : 'Esta etapa libera sua certificação.'}
              </Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.body}>
          {/* Documento do Desafio (brief da empresa) */}
          {carregandoDesafio ? (
            <View style={styles.docCard}>
              <ActivityIndicator size="small" color="#2B7FFF" />
              <Text style={styles.docLoadingText}>Carregando detalhes do desafio...</Text>
            </View>
          ) : desafio ? (
            <View style={styles.docCard}>
              <View style={styles.docHeader}>
                <View style={styles.docIconBox}>
                  <Feather name="file-text" size={24} color="#2B7FFF" />
                </View>
                <View style={styles.docHeaderText}>
                  <Text style={styles.docLabel}>Documento do Desafio</Text>
                  <Text style={styles.docEmpresa}>{desafio.empresa ?? 'Parceiro'}</Text>
                </View>
              </View>
              <Text style={styles.docTitle}>{desafio.titulo ?? tituloDesafio}</Text>
              {desafio.descricao ? (
                <Text style={styles.docDescricao}>{desafio.descricao}</Text>
              ) : null}
              <View style={styles.docMeta}>
                {desafio.nivel ? (
                  <View style={styles.docBadge}>
                    <Feather name="bar-chart-2" size={12} color="#666" />
                    <Text style={styles.docBadgeText}>{desafio.nivel}</Text>
                  </View>
                ) : null}
                {desafio.recompensa ? (
                  <View style={[styles.docBadge, styles.docBadgeReward]}>
                    <Feather name="award" size={12} color="#2B7FFF" />
                    <Text style={styles.docBadgeTextReward}>{desafio.recompensa}</Text>
                  </View>
                ) : null}
              </View>
              {desafio.documentoUrl ? (
                <TouchableOpacity style={styles.docDownloadButton} onPress={handleBaixarDocumento} activeOpacity={0.8}>
                  <Feather name="download" size={20} color="#2B7FFF" />
                  <Text style={styles.docDownloadText}>
                    {desafio.documentoTitulo ?? 'Baixar documento do desafio (PDF)'}
                  </Text>
                  <Feather name="external-link" size={16} color="#2B7FFF" />
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}

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
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity style={styles.uploadButton} onPress={() => Alert.alert("Upload", "Abriria o seletor de arquivos.")}>
              <Feather name="upload" size={20} color="#2B7FFF" />
              <Text style={styles.uploadText}>Ou faça upload de arquivo (PDF/JPG)</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleEnviar} disabled={enviando}>
              <LinearGradient
                colors={['#00C853', '#69F0AE']} 
                style={styles.submitButton}
              >
                {enviando ? (
                    <ActivityIndicator color="#FFF" />
                ) : (
                    <>
                        <Text style={styles.submitButtonText}>ENVIAR E RECEBER HORAS</Text>
                        <Feather name="check-circle" size={20} color="#FFF" />
                    </>
                )}
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
  
  // Estilos novos para as tags
  rowTags: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  tagContainer: { backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  hoursTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.3)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#FFD700' },
  hoursText: { color: '#FFD700', fontSize: 10, fontWeight: 'bold' },

  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  partner: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  body: { padding: 24, marginTop: -30 },
  docCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#2B7FFF',
  },
  docHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  docIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  docHeaderText: { flex: 1 },
  docLabel: { fontSize: 11, color: '#888', textTransform: 'uppercase', fontWeight: '600', letterSpacing: 0.5 },
  docEmpresa: { fontSize: 14, color: '#2B7FFF', fontWeight: 'bold', marginTop: 2 },
  docTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 12 },
  docDescricao: { fontSize: 15, color: '#444', lineHeight: 22, marginBottom: 14 },
  docMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  docBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  docBadgeText: { fontSize: 12, color: '#666', fontWeight: '500' },
  docBadgeReward: { backgroundColor: '#E8F0FE' },
  docBadgeTextReward: { fontSize: 12, color: '#2B7FFF', fontWeight: '600' },
  docDownloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#E8F0FE',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2B7FFF',
    borderStyle: 'dashed',
  },
  docDownloadText: { fontSize: 14, color: '#2B7FFF', fontWeight: '600' },
  docLoadingText: { fontSize: 14, color: '#888', marginTop: 8 },
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