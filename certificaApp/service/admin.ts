import { db } from '@/config/firebaseConfig';
import { doc, setDoc, writeBatch } from 'firebase/firestore';

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
  },

  popularSomenteDesafios: async () => {
    const batch = writeBatch(db);

    console.log("Iniciando criação dos desafios...");

    // ---------------------------------------------------------
    // GRUPO 1: Desafios para Trilha de SUSTENTABILIDADE (slug: 'esg')
    // ---------------------------------------------------------
    
    // Desafio Natura
    const desafioNatura = doc(db, "desafios", "natura_logistica");
    batch.set(desafioNatura, {
      titulo: "Logística Reversa Amazônia",
      empresa: "Natura & Co.",
      categoriaTrilha: "esg", // <--- O IMPORTANTE: Conecta com a trilha ESG
      descricao: "Desenvolva um sistema de pontos de coleta comunitária para recolher embalagens em regiões de difícil acesso.",
      recompensa: "Badge Consultor Natura",
      nivel: "Intermediário"
    });

    // Desafio Ambev
    const desafioAmbev = doc(db, "desafios", "ambev_agua");
    batch.set(desafioAmbev, {
      titulo: "Gestão Hídrica Industrial",
      empresa: "Ambev",
      categoriaTrilha: "esg", // <--- Conecta com a trilha ESG
      descricao: "Proponha uma tecnologia de reuso de água na lavagem de garrafas retornáveis.",
      recompensa: "Badge Guardião da Água",
      nivel: "Avançado"
    });

    // ---------------------------------------------------------
    // GRUPO 2: Desafios para Trilha de TECNOLOGIA (slug: 'tech')
    // ---------------------------------------------------------

    // Desafio iFood
    const desafioIfood = doc(db, "desafios", "ifood_ai");
    batch.set(desafioIfood, {
      titulo: "Otimização de Rotas com IA",
      empresa: "iFood",
      categoriaTrilha: "tech", // <--- Conecta com a trilha TECH
      descricao: "Utilize algoritmos genéticos para reduzir em 10% o tempo de entrega em dias de chuva.",
      recompensa: "Badge iFood Tech",
      nivel: "Avançado"
    });

    // Desafio Nubank
    const desafioNu = doc(db, "desafios", "nubank_fraude");
    batch.set(desafioNu, {
      titulo: "Detecção de Fraudes Pix",
      empresa: "Nubank",
      categoriaTrilha: "tech", // <--- Conecta com a trilha TECH
      descricao: "Analise o dataset de transações e crie um padrão de alerta para movimentações suspeitas.",
      recompensa: "Badge Data Science Nu",
      nivel: "Intermediário"
    });

    // Envia tudo pro banco de uma vez
    await batch.commit();
    alert("Desafios criados com sucesso! Verifique as trilhas de Sustentabilidade e Tecnologia.");
  }

};

