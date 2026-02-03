import { db } from '@/config/firebaseConfig';
import { ID_USUARIO_ATUAL } from '@/service/progresso';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import React, { useCallback, useState } from 'react';
import { Alert, Image, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PerfilScreen() {
  const [loading, setLoading] = useState(false);

  // Estado do Usuário
  const [usuario, setUsuario] = useState({
    nome: 'Carregando...',
    curso: 'Curso não definido',
    totalHoras: 0,
    metaHoras: 120, // Meta fictícia para a barra de progresso
    avatar: 'https://github.com/shadcn.png' // Avatar placeholder
  });

  // Função para buscar dados do Firestore
  const carregarPerfil = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "usuarios", ID_USUARIO_ATUAL);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUsuario(prev => ({
          ...prev,
          nome: data.nome || 'Estudante Campus Mobile',
          curso: data.curso || 'Engenharia de Software', // Default se não tiver no banco
          totalHoras: data.totalHoras || 0
        }));
      } else {
        // Se o usuário não existir, cria um padrão
        const novoUsuario = {
          nome: 'Estudante Campus Mobile',
          curso: 'Ciência da Computação',
          totalHoras: 0
        };
        await setDoc(docRef, novoUsuario);
        setUsuario(prev => ({ ...prev, ...novoUsuario }));
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarPerfil();
    }, [])
  );

  // --- FUNÇÃO ADMIN PARA A DEMO ---
  // Reseta todo o progresso para você poder apresentar de novo
  const resetarProgresso = async () => {
    Alert.alert(
      "Modo Demo",
      "Tem certeza que deseja zerar as horas e o progresso das trilhas?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Zerar Tudo",
          style: 'destructive',
          onPress: async () => {
            try {
              // 1. Zera as horas do usuário
              await updateDoc(doc(db, "usuarios", ID_USUARIO_ATUAL), { totalHoras: 0 });

              // 2. Reseta o progresso das trilhas (apaga o documento de progresso)
              // No Firestore, o jeito mais fácil é setar um objeto vazio ou os estados iniciais
              await setDoc(doc(db, "progressos", ID_USUARIO_ATUAL), {
                sustentabilidade: { video: 'disponivel', quiz: 'bloqueado', desafio: 'bloqueado', recompensaResgatada: false }
              });

              Alert.alert("Resetado!", "O app está pronto para uma nova demonstração.");
              carregarPerfil(); // Recarrega a tela
            } catch {
              Alert.alert("Erro", "Não foi possível resetar.");
            }
          }
        }
      ]
    );
  };

  // Cálculo da porcentagem da barra
  const progressoPorcentagem = Math.min((usuario.totalHoras / usuario.metaHoras) * 100, 100);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={carregarPerfil} />}
      >

        {/* --- CABEÇALHO DO PERFIL --- */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: usuario.avatar }} style={styles.avatar} />
            <TouchableOpacity style={styles.editIcon}>
              <Feather name="camera" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{usuario.nome}</Text>
          <Text style={styles.userCourse}>{usuario.curso}</Text>
          <View style={styles.badgeUniversidade}>
            <Feather name="check-circle" size={12} color="#FFF" />
            <Text style={styles.badgeText}>Matrícula Ativa</Text>
          </View>
        </View>

        {/* --- CARD DE HORAS (O Placar) --- */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View>
              <Text style={styles.statsLabel}>Horas Acumuladas</Text>
              <Text style={styles.statsValue}>{usuario.totalHoras}h</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.statsLabel}>Meta do Curso</Text>
              <Text style={[styles.statsValue, { color: '#999' }]}>{usuario.metaHoras}h</Text>
            </View>
          </View>

          {/* Barra de Progresso */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressoPorcentagem}%` }]} />
          </View>
          <Text style={styles.progressText}>
            Você completou {Math.round(progressoPorcentagem)}% da carga horária complementar.
          </Text>
        </View>

        {/* --- MENU DE OPÇÕES --- */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
              <Feather name="user" size={20} color="#1565C0" />
            </View>
            <Text style={styles.menuText}>Dados Pessoais</Text>
            <Feather name="chevron-right" size={20} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
              <Feather name="file-text" size={20} color="#2E7D32" />
            </View>
            <Text style={styles.menuText}>Histórico de Atividades</Text>
            <Feather name="chevron-right" size={20} color="#CCC" />
          </TouchableOpacity>

          
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.iconBox, { backgroundColor: '#f3e2fc' }]}>
              <Feather name="file-text" size={20} color="#7300ef" />
            </View>
            <Text style={styles.menuText}>Formulário</Text>
            <Feather name="chevron-right" size={20} color="#CCC" />
          </TouchableOpacity>

          
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
              <Feather name="help-circle" size={20} color="#EF6C00" />
            </View>
            <Text style={styles.menuText}>Ajuda e Suporte</Text>
            <Feather name="chevron-right" size={20} color="#CCC" />
          </TouchableOpacity>

        </View>

        {/* --- ÁREA ADMIN (RESET) --- */}
        <View style={styles.adminSection}>
          <Text style={styles.adminTitle}>Área do Desenvolvedor (Demo)</Text>
          <TouchableOpacity style={styles.resetButton} onPress={resetarProgresso}>
            <Feather name="refresh-cw" size={18} color="#FF5252" />
            <Text style={styles.resetText}>Resetar Progresso e Horas</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FD' },
  scrollContent: { paddingBottom: 30 },

  header: { alignItems: 'center', paddingTop: 40, paddingBottom: 20, backgroundColor: '#FFF' },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#F0F0F0' },
  editIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#1565C0', padding: 8, borderRadius: 20, borderWidth: 2, borderColor: '#FFF' },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  userCourse: { fontSize: 14, color: '#757575', marginTop: 4 },
  badgeUniversidade: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#00C853', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 10, gap: 4 },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

  statsCard: { backgroundColor: '#FFF', marginHorizontal: 20, marginTop: 20, padding: 20, borderRadius: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, elevation: 2 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  statsLabel: { fontSize: 12, color: '#888', textTransform: 'uppercase', marginBottom: 4 },
  statsValue: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A' },
  progressBarBg: { height: 10, backgroundColor: '#F0F2F5', borderRadius: 5, overflow: 'hidden', marginBottom: 10 },
  progressBarFill: { height: 10, backgroundColor: '#1565C0', borderRadius: 5 },
  progressText: { fontSize: 12, color: '#666', textAlign: 'center' },

  menuContainer: { marginTop: 20, paddingHorizontal: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, marginBottom: 10, borderRadius: 12, borderWidth: 1, borderColor: '#F0F0F0' },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuText: { flex: 1, fontSize: 16, color: '#333', fontWeight: '500' },

  adminSection: { marginTop: 30, paddingHorizontal: 20, alignItems: 'center' },
  adminTitle: { fontSize: 12, color: '#AAA', textTransform: 'uppercase', marginBottom: 10 },
  resetButton: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#FFEBEE', borderRadius: 8, gap: 8 },
  resetText: { color: '#FF5252', fontWeight: 'bold' }
});