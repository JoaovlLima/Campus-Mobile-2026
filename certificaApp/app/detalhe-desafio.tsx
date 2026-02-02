import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react'; // <--- Adicione useEffect
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { ProgressoService } from '@/service/progresso';
import { doc, getDoc } from 'firebase/firestore'; // <--- Importe o Firestore
import { db } from '@/config/firebaseConfig'; // <--- Importe o banco

export default function DetalheDesafio() {
  const router = useRouter();
  const params = useLocalSearchParams(); 
  
  // ID da trilha (ex: 'sustentabilidade')
  const trilhaId = params.id as string || 'sustentabilidade'; 
  const tituloDesafio = params.titulo as string || 'Desafio Prático';

  const [link, setLink] = useState('');
  const [enviando, setEnviando] = useState(false);
  
  // NOVO ESTADO: Para guardar as horas que vierem do banco
  const [horasRecompensa, setHorasRecompensa] = useState(0); 

  // --- NOVA BUSCA ---
  // Busca quanto vale essa trilha assim que a tela abre
  useEffect(() => {
    const buscarHoras = async () => {
      try {
        const docRef = doc(db, "trilhas", trilhaId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Pega o campo 'horasGanha' do banco
          setHorasRecompensa(docSnap.data().horasGanha || 0);
        }
      } catch (error) {
        console.log("Erro ao buscar horas da trilha", error);
      }
    };
    buscarHoras();
  }, [trilhaId]);

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