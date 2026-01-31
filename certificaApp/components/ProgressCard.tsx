import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons'; // Biblioteca de ícones padrão do Expo

export default function ProgressCard() {
  return (
    <LinearGradient
      // As cores exatas do seu print do Figma
      colors={['#2B7FFF', '#9810FA']} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }} // Gradiente horizontal (esquerda p/ direita)
      style={styles.cardContainer}
    >
      {/* Parte de Cima: Porcentagem e Gráfico */}
      <View style={styles.topSection}>
        <View>
          <Text style={styles.label}>Progresso Geral</Text>
          <Text style={styles.percentage}>60%</Text>
        </View>

        {/* Simulação do Gráfico de Rosca com Ícone */}
        <View style={styles.chartContainer}>
           <View style={styles.chartCircle}>
              <Feather name="trending-up" size={24} color="#FFF" />
           </View>
        </View>
      </View>

      {/* Parte de Baixo: Estatísticas */}
      <View style={styles.statsRow}>
        {/* Bloco Conquistadas */}
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Conquistadas</Text>
          <Text style={styles.statValue}>3</Text>
        </View>

        {/* Bloco Em andamento */}
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Em andamento</Text>
          <Text style={styles.statValue}>2</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 24, // Bordas bem arredondadas como na imagem
    padding: 24,
    marginHorizontal: 20, // Margem lateral para não colar na borda da tela
    marginTop: 20,
    minHeight: 180,
    justifyContent: 'space-between',
    // Sombra suave (Android + iOS)
    shadowColor: "#9810FA",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    color: 'rgba(255,255,255,0.9)', // Branco com leve transparência
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  percentage: {
    color: '#FFF',
    fontSize: 48, // Fonte grande para o destaque
    fontWeight: 'bold',
  },
  chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)', // O anel do gráfico
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)', // Fundo sutil dentro do círculo
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16, // Espaço entre os dois blocos
  },
  statItem: {
    flex: 1, // Para ocuparem o mesmo tamanho
    backgroundColor: 'rgba(255,255,255,0.15)', // Efeito "vidro" do design
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  }
});