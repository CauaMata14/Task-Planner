# Task Planner - Gestão de Tarefas (Local)

Um aplicativo web moderno para gestão de tarefas com design minimalista baseado no estilo planner diário, funcionando **100% local** com **localStorage**.

## 🎨 Design

O projeto utiliza um estilo visual minimalista baseado em planner diário, com:
- Fundo claro com bordas finas bege
- Layout em grade com blocos retangulares organizados
- Títulos em maiúsculas com fonte serifada (Playfair Display)
- Esquema de cores neutro e elegante
- Interface limpa e funcional

## 🚀 Funcionalidades

### ✅ Implementadas
- **Design minimalista** baseado na imagem modelo do planner
- **Estrutura React** com componentes funcionais e hooks
- **Armazenamento local** com localStorage (dados salvos no navegador)
- **Visualizações múltiplas**: Lista, Kanban (drag & drop), Calendário
- **Sistema de pesquisa e filtros** em tempo real
- **CRUD completo** de tarefas com validação
- **Design responsivo** otimizado para desktop e tablets
- **PWA** com service worker e manifest
- **Dados persistentes** entre sessões do navegador

### 🔄 Características
- **Sem configurações externas** - funciona imediatamente
- **Dados salvos localmente** - não requer internet após carregamento inicial
- **Sincronização automática** - alterações salvas automaticamente
- **Interface intuitiva** - criada para máxima produtividade

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** com hooks modernos
- **CSS3** com variáveis CSS e design system
- **React Beautiful DnD** para funcionalidade drag & drop
- **Date-fns** para manipulação de datas
- **LocalStorage** para armazenamento local
- **PWA** com service worker

### Desenvolvimento
- **Create React App** como base
- **ESLint** e **Prettier** para qualidade de código

## 📦 Instalação e Configuração

### 1. Pré-requisitos
```bash
# Node.js 16+ e npm
node --version
npm --version
```

### 2. Instalação
```bash
# Entre no diretório do projeto
cd c:/des/site-planner-de-tarefas

# Instale as dependências
npm install
```

### 3. Executar o Projeto
```bash
# Desenvolvimento
npm start

# Build para produção
npm run build
```

A aplicação estará disponível em `http://localhost:3000`

## 🎯 Como Usar

### Gerenciamento de Tarefas
1. Clique em **"Nova Tarefa"** para criar uma tarefa
2. Preencha título, descrição, prioridade, etc.
3. Use as diferentes visualizações (Lista, Kanban, Calendário)
4. Arraste tarefas no Kanban para alterar status

### Visualizações Disponíveis
- **Lista**: Visualização tradicional com tarefas em formato de lista
- **Kanban**: Sistema estilo Trello com colunas (A Fazer, Em Progresso, Concluída)
- **Calendário**: Visualização mensal com tarefas organizadas por data

## 📁 Estrutura do Projeto

```
/
├── public/
│   ├── index.html          # Template HTML
│   ├── manifest.json       # PWA manifest
│   └── icon-192.svg       # Ícone da aplicação
│
├── src/
│   ├── components/         # Componentes React
│   │   ├── App.jsx        # Componente principal
│   │   ├── Header.jsx     # Cabeçalho da aplicação
│   │   ├── Dashboard.jsx  # Dashboard principal
│   │   ├── TaskList.jsx   # Lista de tarefas
│   │   ├── KanbanBoard.jsx # Quadro Kanban
│   │   ├── Calendar.jsx   # Calendário mensal
│   │   ├── TaskModal.jsx  # Modal de tarefas
│   │   └── Loading.jsx    # Spinner de carregamento
│   │
│   ├── localAuth.js       # Serviço de autenticação local
│   ├── utils.js           # Funções utilitárias
│   ├── App.jsx            # Componente raiz
│   ├── index.js           # Ponto de entrada
│   └── index.css          # Estilos globais
│
├── package.json           # Dependências e scripts
└── README.md             # Documentação
```

## 🔧 Desenvolvimento

### Scripts Disponíveis
```bash
npm start        # Inicia servidor de desenvolvimento
npm run build    # Build para produção
npm test         # Executa testes
npm run eject    # Eject do Create React App
```

### Características Especiais

#### **Armazenamento Local**
- **Dados salvos** automaticamente no navegador
- **Persistência** entre sessões
- **Sem limitações** de uso ou custos
- **Funciona offline** após carregamento inicial

#### **Visual Design**
- **Minimalista elegante** baseado no planner modelo
- **Hierarquia visual clara** com tipografia apropriada
- **Espaçamento consistente** seguindo sistema de design
- **Cores harmoniosas** criando ambiente produtivo

## 🎨 Características Visuais

### Esquema de Cores
- **Fundo principal**: `#F8F8F5` (bege claro)
- **Superfícies**: `#FFFFFF` (branco)
- **Bordas**: `#E6DDD4` (bege médio)
- **Texto principal**: `#2D2D2D` (cinza escuro)
- **Texto secundário**: `#6B6B6B` (cinza médio)
- **Acento**: `#8B7355` (marrom elegante)

### Tipografia
- **Títulos**: Playfair Display (serif)
- **Texto**: Inter (sans-serif)
- **Hierarquia clara** com pesos e tamanhos

### Layout
- **Grid responsivo** com CSS Grid
- **Cards organizados** em blocos retangulares
- **Espaçamento consistente** com sistema de design
- **Touch targets** adequados (mínimo 44px)

## 🚀 Deploy

### Opções de Deploy
- **Netlify** (recomendado)
- **Vercel**
- **GitHub Pages**
- **Servidor próprio**

## 🔒 Segurança e Privacidade

- **Dados locais** - Não envia dados para servidores externos
- **Sem rastreamento** - Não coleta dados de uso
- **Controle total** - Seus dados ficam no seu navegador
- **Sem contas** - Não requer cadastro ou informações pessoais

## 📱 PWA

- **Instalável** no dispositivo móvel/desktop
- **Funciona offline** (recursos em cache)
- **Manifest configurado** com ícones e metadados
- **Service Worker** para performance

## 🔄 Funcionalidades Avançadas

1. ✅ Sistema de tarefas completo
2. ✅ Visualizações múltiplas
3. ✅ Drag & Drop funcional
4. ✅ Busca e filtros
5. ✅ Dados persistentes locais
6. ✅ Design responsivo
7. ✅ PWA completo
8. ✅ Sem configurações externas

---

**🎊 Task Planner Local está pronto!** Aplicativo completo com design minimalista, funcionalidades avançadas e **armazenamento 100% local** - sem necessidade de configurações externas! 🚀
