import { ProgressoService } from '@/service/progresso';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TelaQuiz() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const trilhaId = params.id ?? 'sustentabilidade';

  const handleAnswer = async (isCorrect: boolean) => {
    if (isCorrect) {
      await ProgressoService.concluirEtapa(trilhaId, 'quiz', 0);
      
      Alert.alert(
        "Parabéns! 🎯",
        "Você garantiu +1 hora complementar e desbloqueou o Desafio!",
        [{ text: "Voltar", onPress: () => router.back() }]
      );
    }else {
      // 3. Feedback de Erro
      Alert.alert("Resposta Incorreta", "A Economia Circular não foca em descarte, tente novamente.");
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#00C853', '#009624']} style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.stepText}>Questão 1 de 1</Text>
            <View style={{width: 24}} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.cardQuestion}>
        <Text style={styles.questionTitle}>Validação de Conhecimento</Text>
        <Text style={styles.questionText}>
          Qual é o principal objetivo da Economia Circular em relação aos produtos?
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {/* OPÇÃO ERRADA A */}
        <TouchableOpacity style={styles.optionButton} onPress={() => handleAnswer(false)}>
          <View style={styles.circle}>
            <Text style={styles.optionLetter}>A</Text>
          </View>
          <Text style={styles.optionText}>Aumentar a produção de plástico descartável.</Text>
        </TouchableOpacity>

        {/* OPÇÃO CORRETA B */}
        <TouchableOpacity style={styles.optionButton} onPress={() => handleAnswer(true)}>
          <View style={[styles.circle, {borderColor: '#00C853'}]}>
            <Text style={[styles.optionLetter, {color: '#00C853'}]}>B</Text>
          </View>
          <Text style={styles.optionText}>Manter produtos e materiais em uso pelo maior tempo possível.</Text>
        </TouchableOpacity>

        {/* OPÇÃO ERRADA C */}
        <TouchableOpacity style={styles.optionButton} onPress={() => handleAnswer(false)}>
          <View style={styles.circle}>
            <Text style={styles.optionLetter}>C</Text>
          </View>
          <Text style={styles.optionText}>Queimar todo o lixo para gerar energia térmica.</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FD' },
  header: { height: 150, paddingHorizontal: 20, paddingTop: 40, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stepText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  
  cardQuestion: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: -40, // Sobe em cima do header
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
    marginBottom: 30
  },
  questionTitle: { color: '#00C853', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase', marginBottom: 10 },
  questionText: { fontSize: 18, fontWeight: 'bold', color: '#333', lineHeight: 26 },

  optionsContainer: { paddingHorizontal: 20, gap: 12 },
  optionButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 12,
    borderWidth: 1, borderColor: '#EEE', elevation: 1
  },
  circle: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: '#DDD', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  optionLetter: { fontSize: 14, fontWeight: 'bold', color: '#999' },
  optionText: { flex: 1, fontSize: 14, color: '#555', lineHeight: 20 }
});