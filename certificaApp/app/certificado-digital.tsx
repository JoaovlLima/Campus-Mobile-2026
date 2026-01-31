import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Share, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function CertificadoDigital() {
  const router = useRouter();

  // Simula o compartilhamento nativo do celular
  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Confira minha nova microcertificação em Sustentabilidade validada via Blockchain! 🎓 #Certifica+ #CampusMobile',
      });
    } catch (error) {
      Alert.alert("Error: "+error);
    }
  };

  return (
    <View style={styles.container}>
      
      {/* 1. Header Premium */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['#1A1A1A', '#333']} // Preto Premium
          style={styles.headerBackground}
        >
          <SafeAreaView>
            <View style={styles.headerTop}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Feather name="x" size={24} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Certificado Digital</Text>
              <TouchableOpacity onPress={handleShare}>
                <Feather name="share-2" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        {/* 2. O Documento (O "Papel" do Certificado) */}
        <View style={styles.certificatePaper}>
          
          {/* Borda Decorativa */}
          <View style={styles.borderFrame}>
            
            {/* Cabeçalho do Documento */}
            <View style={styles.docHeader}>
               <Feather name="award" size={40} color="#D4AF37" />
               <Text style={styles.uniName}>UNIVERSIDADE xxxxxx</Text>
               <Text style={styles.programName}>PROGRAMA DE EXTENSÃO</Text>
            </View>

            <View style={styles.divider} />

            {/* Texto Legal */}
            <Text style={styles.certifyText}>CERTIFICAMOS QUE</Text>
            <Text style={styles.studentName}>JOÃO VICTOR DE LIMA</Text>
            <Text style={styles.bodyText}>
              concluiu com êxito a trilha prática de <Text style={styles.bold}>Sustentabilidade e Meio Ambiente</Text>, 
              demonstrando competências em economia circular e gestão de resíduos, 
              com carga horária total de <Text style={styles.bold}>40 horas</Text>.
            </Text>

            {/* Área de Verificação (O Diferencial Tecnológico) */}
            <View style={styles.verificationBox}>
              <View style={styles.qrPlaceholder}>
                <Feather name="grid" size={60} color="#333" /> 
                {/* Aqui seria uma imagem real de QR Code depois */}
              </View>
              <View style={styles.hashInfo}>
                <Text style={styles.hashLabel}>HASH DE VALIDAÇÃO (BLOCKCHAIN)</Text>
                <Text style={styles.hashCode}>0x7f9a2b3c4d5e6f...8a9b</Text>
                <View style={styles.verifiedBadge}>
                  <Feather name="check-circle" size={12} color="#00C853" />
                  <Text style={styles.verifiedText}>Autenticidade Verificada</Text>
                </View>
              </View>
            </View>

            {/* Data e Assinatura */}
            <View style={styles.footerRow}>
              <View>
                <Text style={styles.dateLabel}>Data de Emissão</Text>
                <Text style={styles.dateValue}>29/01/2026</Text>
              </View>
              <View style={styles.signatureBox}>
                <Text style={styles.signatureText}>Prof. Dr. Silva</Text>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureLabel}>Coordenação</Text>
              </View>
            </View>

          </View>
        </View>

        {/* 3. Botões de Ação */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleShare}>
            <LinearGradient
               colors={['#D4AF37', '#C5A028']} // Dourado
               style={styles.gradientBtn}
            >
              <Text style={styles.primaryBtnText}>ADICIONAR AO LINKEDIN</Text>
              <Feather name="linkedin" size={20} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryBtnText}>Baixar PDF (Versão Impressão)</Text>
            <Feather name="download" size={20} color="#666" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1A' }, // Fundo escuro para destacar o papel
  headerContainer: { overflow: 'hidden' },
  headerBackground: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  backButton: { padding: 5 },
  
  // O Papel do Certificado
  certificatePaper: {
    backgroundColor: '#FFFDF5', // Um off-white, cor de papel nobre
    margin: 20,
    borderRadius: 12,
    padding: 15,
    minHeight: 500,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5}
  },
  borderFrame: {
    borderWidth: 2,
    borderColor: '#D4AF37', // Borda Dourada
    borderStyle: 'solid',
    flex: 1,
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  docHeader: { alignItems: 'center', marginBottom: 20 },
  uniName: { fontSize: 14, fontWeight: 'bold', color: '#333', marginTop: 10, letterSpacing: 1 },
  programName: { fontSize: 10, color: '#666', letterSpacing: 2, marginTop: 2 },
  divider: { width: 40, height: 2, backgroundColor: '#D4AF37', marginBottom: 20 },
  
  certifyText: { fontSize: 12, color: '#666', marginBottom: 5 },
  studentName: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 15, textAlign: 'center' },
  bodyText: { fontSize: 14, color: '#444', textAlign: 'center', lineHeight: 22, marginBottom: 30 },
  bold: { fontWeight: 'bold', color: '#000' },
  
  // Área Blockchain
  verificationBox: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    marginBottom: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  qrPlaceholder: {
    width: 60, height: 60,
    backgroundColor: '#FFF',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 15,
  },
  hashInfo: { flex: 1 },
  hashLabel: { fontSize: 8, color: '#999', fontWeight: 'bold' },
  hashCode: { fontSize: 10, color: '#333', fontFamily: 'monospace', marginVertical: 2 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  verifiedText: { fontSize: 10, color: '#00C853', fontWeight: 'bold' },

  // Rodapé
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 'auto' },
  dateLabel: { fontSize: 10, color: '#999' },
  dateValue: { fontSize: 12, fontWeight: 'bold', color: '#333' },
  signatureBox: { alignItems: 'center' },
  signatureText: { fontFamily: 'serif', fontStyle: 'italic', fontSize: 14 },
  signatureLine: { width: 80, height: 1, backgroundColor: '#333', marginVertical: 2 },
  signatureLabel: { fontSize: 10, color: '#666' },

  // Botões
  actionsContainer: { paddingHorizontal: 20, gap: 15 },
  primaryButton: { borderRadius: 12, overflow: 'hidden', height: 56 },
  gradientBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  primaryBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  secondaryButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, padding: 15, backgroundColor: '#333', borderRadius: 12 },
  secondaryBtnText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
});