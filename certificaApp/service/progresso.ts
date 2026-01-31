import { db } from '@/config/firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, increment, arrayUnion } from 'firebase/firestore';

// ID FIXO PARA TESTES (Mude aqui para testar outro user)
export const ID_USUARIO_ATUAL = 'aluno_campus_01';

export interface EstadoTrilha {
  video: 'bloqueado' | 'disponivel' | 'concluido';
  quiz: 'bloqueado' | 'disponivel' | 'concluido';
  desafio: 'bloqueado' | 'disponivel' | 'concluido';
}

export const ProgressoService = {
  

  // ADICIONE ESTA NOVA FUNÇÃO:
  getProgressoGeral: async () => {
    const docRef = doc(db, "progressos", ID_USUARIO_ATUAL);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data(); // Retorna o objeto completo { sustentabilidade: {...}, tecnologia: {...} }
    }
    return {};
  },

  // Pega o progresso de UMA trilha específica
  getProgressoTrilha: async (trilhaId: string): Promise<EstadoTrilha> => {
    const docRef = doc(db, "progressos", ID_USUARIO_ATUAL);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data()[trilhaId]) {
      return docSnap.data()[trilhaId] as EstadoTrilha;
    }
    
    // Se não existir ainda, retorna o padrão
    return { video: 'disponivel', quiz: 'bloqueado', desafio: 'bloqueado' };
  },

  // Pega o saldo total de horas do aluno
  getTotalHoras: async () => {
    const docRef = doc(db, "usuarios", ID_USUARIO_ATUAL);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().totalHoras || 0;
    }
    return 0;
  },

  // A MÁGICA: Conclui etapa, atualiza status E soma horas
  concluirEtapa: async (trilhaId: string, etapa: 'video' | 'quiz' | 'desafio', horasGanhas: number) => {
    const userRef = doc(db, "progressos", ID_USUARIO_ATUAL);
    const perfilRef = doc(db, "usuarios", ID_USUARIO_ATUAL);

    // 1. Busca o estado atual para não perder o que já foi feito
    const snap = await getDoc(userRef);
    let dadosAtuais = snap.exists() ? snap.data() : {};
    
    // Se essa trilha não existe no progresso, cria o objeto dela
    if (!dadosAtuais[trilhaId]) {
      dadosAtuais[trilhaId] = { video: 'disponivel', quiz: 'bloqueado', desafio: 'bloqueado' };
    }

    const estadoTrilha = dadosAtuais[trilhaId];

    // 2. Lógica de atualização do Status
    if (etapa === 'video') {
      estadoTrilha.video = 'concluido';
      estadoTrilha.quiz = 'disponivel'; // Desbloqueia o próximo
    } else if (etapa === 'quiz') {
      estadoTrilha.quiz = 'concluido';
      estadoTrilha.desafio = 'disponivel'; // Desbloqueia o desafio
    } else if (etapa === 'desafio') {
      estadoTrilha.desafio = 'concluido';
    }

    // 3. Salva o progresso atualizado (usando merge para não apagar outras trilhas)
    await setDoc(userRef, { [trilhaId]: estadoTrilha }, { merge: true });

    // 4. SOMA AS HORAS NA CARTEIRA DO ALUNO
    // Se o documento do usuário não existir, cria ele com 0 horas primeiro
    const perfilSnap = await getDoc(perfilRef);
    if (!perfilSnap.exists()) {
      await setDoc(perfilRef, { totalHoras: 0, nome: "Estudante" });
    }

    // Usa 'increment' do Firebase para somar com segurança
    await updateDoc(perfilRef, {
      totalHoras: increment(horasGanhas)
    });

    console.log(`Sucesso! ${horasGanhas} horas adicionadas para a trilha ${trilhaId}`);
  }
};