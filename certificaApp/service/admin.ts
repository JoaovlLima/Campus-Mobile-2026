import { db } from '@/config/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export const AdminService = {
  resetarTudoECriarTrilhas: async () => {
    // 1. TRILHA DE SUSTENTABILIDADE (A principal do MVP)
    await setDoc(doc(db, "trilhas", "sustentabilidade"), {
      id: "sustentabilidade",
      ordem: 1,
      titulo: 'Sustentabilidade e Meio Ambiente',
      subtitulo: 'Trilha Oficial Campus Mobile',
      cor: '#00C853',
      icone: 'globe',
      // DEFININDO VALORES DE HORAS AQUI:
      horasGanha: 10 // O projeto da empresa vale 10h
    });

    // 2. TRILHA DE TECNOLOGIA (Exemplo)
    await setDoc(doc(db, "trilhas", "tecnologia"), {
      id: "tecnologia",
      ordem: 2,
      titulo: 'Tecnologia e Inovação',
      subtitulo: 'IA e Futuro',
      cor: '#2B7FFF',
      icone: 'cpu',
      horasGanha: 20
    });

    alert("Banco resetado com as novas regras de horas!");
  }
};