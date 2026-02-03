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
      slug: 'esg', // Conecta com desafios categoriaTrilha: 'esg'
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
      slug: 'tech', // Conecta com desafios categoriaTrilha: 'tech'
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
      categoriaTrilha: "esg",
      descricao: "Desenvolva um sistema de pontos de coleta comunitária para recolher embalagens em regiões de difícil acesso.",
      recompensa: "Badge Consultor Natura",
      nivel: "Intermediário",
      documentoUrl: "https://www.africau.edu/images/default/sample.pdf",
      documentoTitulo: "Brief Natura - Logística Reversa (PDF)"
    });

    // Desafio Ambev
    const desafioAmbev = doc(db, "desafios", "ambev_agua");
    batch.set(desafioAmbev, {
      titulo: "Gestão Hídrica Industrial",
      empresa: "Ambev",
      categoriaTrilha: "esg",
      descricao: "Proponha uma tecnologia de reuso de água na lavagem de garrafas retornáveis.",
      recompensa: "Badge Guardião da Água",
      nivel: "Avançado",
      documentoUrl: "https://www.africau.edu/images/default/sample.pdf",
      documentoTitulo: "Brief Ambev - Gestão Hídrica (PDF)"
    });

    // ---------------------------------------------------------
    // GRUPO 2: Desafios para Trilha de TECNOLOGIA (slug: 'tech')
    // ---------------------------------------------------------

    // Desafio iFood
    const desafioIfood = doc(db, "desafios", "ifood_ai");
    batch.set(desafioIfood, {
      titulo: "Otimização de Rotas com IA",
      empresa: "iFood",
      categoriaTrilha: "tech",
      descricao: "Utilize algoritmos genéticos para reduzir em 10% o tempo de entrega em dias de chuva.",
      recompensa: "Badge iFood Tech",
      nivel: "Avançado",
      documentoUrl: "https://www.africau.edu/images/default/sample.pdf",
      documentoTitulo: "Brief iFood - Rotas com IA (PDF)"
    });

    // Desafio Nubank
    const desafioNu = doc(db, "desafios", "nubank_fraude");
    batch.set(desafioNu, {
      titulo: "Detecção de Fraudes Pix",
      empresa: "Nubank",
      categoriaTrilha: "tech",
      descricao: "Analise o dataset de transações e crie um padrão de alerta para movimentações suspeitas.",
      recompensa: "Badge Data Science Nu",
      nivel: "Intermediário",
      documentoUrl: "https://www.africau.edu/images/default/sample.pdf",
      documentoTitulo: "Brief Nubank - Detecção de Fraudes (PDF)"
    });

    // Envia tudo pro banco de uma vez
    await batch.commit();
    alert("Desafios criados com sucesso! Verifique as trilhas de Sustentabilidade e Tecnologia.");
  }

};

