# 🚀 Certifica+ - Campus Mobile MVP

> **Transformando a Extensão Universitária em Ativo de Carreira.**
> *Conectando atividades acadêmicas a desafios reais do mercado de trabalho.*

![Badge Status](https://img.shields.io/badge/Status-MVP%20Development-blueviolet)
![Badge Tech](https://img.shields.io/badge/Tech-React%20Native%20%7C%20Expo-blue)
![Badge Event](https://img.shields.io/badge/Event-Campus%20Mobile-orange)

---

## 📸 Visão Geral do Produto

A **Certifica+** é uma plataforma mobile que resolve a desconexão entre a obrigatoriedade da **Curricularização da Extensão** e a necessidade de experiência prática exigida pelo mercado.

Ao invés de "cumprir horas" burocráticas, o aluno realiza **Jornadas Práticas** validadas por empresas e pela IES, gerando **Microcertificações Verificáveis** (Blockchain-ready).

### 🎯 A Proposta de Valor

| O Problema (Antes) ❌ | A Solução Certifica+ (Depois) ✅ |
| :--- | :--- |
| Atividades burocráticas e chatas | Gamificação e progresso visual |
| "Cumprir tabela" para o MEC | Portfólio real para o LinkedIn |
| Certificados de papel (gaveta) | Microcertificações digitais verificáveis |
| Desconexão com o mercado | Desafios propostos por empresas reais |

---

## 📱 Funcionalidades do MVP (Jornada do Usuário)

O MVP desenvolvido para o Campus Mobile foca 100% na **Experiência do Aluno**:

### 1. 🏠 Dashboard de Progresso
Uma visão clara e imediata de quanto falta para cumprir a meta semestral, com gráficos de engajamento e conquistas recentes.

### 2. 🗺️ Trilhas de Competências
Uma lista curada de trilhas (ex: Sustentabilidade, Tech, Social). O aluno não escolhe apenas uma "atividade", ele escolhe uma **competência** para desenvolver.

### 3. 🛠️ Mão na Massa (Hands-on)
A educação aqui é prática. Cada trilha possui fases:
- **Fundamentos:** Vídeo/Conteúdo.
- **Validação:** Quiz rápido.
- **Desafio Prático:** Upload de evidência (Link do Github, Figma, PDF) para provar a habilidade.

### 4. 🏆 Carteira de Certificações
O "Gran Finale". Um repositório seguro de conquistas onde cada certificado possui:
- **Hash de Validação:** Simulando registro em Blockchain.
- **QR Code:** Para verificação pública.
- **Botão de Compartilhamento:** Integração direta com redes sociais/LinkedIn.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com as tecnologias mais modernas do ecossistema mobile:

- **Core:** [React Native](https://reactnative.dev/)
- **Framework:** [Expo](https://expo.dev/) (SDK 50+)
- **Roteamento:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing v3)
- **Estilização:** `StyleSheet` + [Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)
- **Ícones:** [Feather Icons](https://icons.expo.fyi/)
- **Linguagem:** TypeScript / JavaScript

---

## 📂 Estrutura do Projeto

O projeto segue a arquitetura moderna do **Expo Router**:

```bash
Certifica/
├── app/                    # Telas e Rotas (File-based routing)
│   ├── (tabs)/             # Navegação por Abas (Bottom Tabs)
│   │   ├── index.tsx       # Tela Home (Dashboard)
│   │   ├── trilhas.tsx     # Lista de Trilhas
│   │   ├── certificacoes.tsx # Carteira Digital
│   │   └── _layout.tsx     # Configuração da Barra de Navegação
│   ├── detalhe-trilha.tsx  # Tela de Fases (Mapa da Jornada)
│   ├── detalhe-desafio.tsx # Tela de Upload (Mão na Massa)
│   └── certificado-digital.tsx # Visualização do Certificado Premium
├── components/             # Componentes Reutilizáveis
│   └── ProgressCard.js     # Card Principal com Gradiente
├── assets/                 # Imagens e Fontes
└── package.json            # Dependências
```
## 🚀 Como Rodar o Projeto

### 1️⃣ Pré-requisitos
Tenha o **Node.js** instalado e o app **Expo Go** no seu celular.



### 2️⃣ Instale as dependências
```bash
npm install
```

### 3️⃣ Inicie o servidor de desenvolvimento
```bash
npx expo start
```

### 📱 Teste no celular
Leia o **QR Code** exibido no terminal:
- iOS: câmera do celular
- Android: app **Expo Go**

---

## 🔮 Próximos Passos (Roadmap)

- [ ] Integração com Backend real (Node.js / Firebase)
- [ ] Painel do Gestor da IES (Web)
- [ ] Implementação real de Smart Contract em Blockchain (Polygon / Ethereum) para emissão dos hashes
- [ ] Marketplace de empresas parceiras para oferta de desafios

---

## ✍️ Autoria

Projeto desenvolvido para o **Campus Mobile**, com foco em **Inovação na Educação**.
