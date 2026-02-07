# StarStore - E-commerce Mobile de Star Wars

[English version](README.en.md)

Aplicativo mobile de e-commerce temático de Star Wars construído com React Native (Expo) e Firebase.

## Stack Tecnológica

### Aplicativo Mobile
- **Framework**: React Native com Expo (Expo Router)
- **Linguagem**: TypeScript (Strict Mode)
- **Gerenciamento de Estado**:
  - TanStack Query - Estado do servidor (produtos, pedidos)
  - Zustand - Estado do cliente (carrinho, UI)
- **Estilização**: StyleSheet do React Native com Design Tokens
- **Navegação**: Expo Router (file-based routing)

### Backend
- **Plataforma**: Firebase
- **Autenticação**: Firebase Auth
- **Banco de Dados**: Cloud Firestore
- **Functions**: Firebase Cloud Functions (TypeScript)

### Ferramentas de Desenvolvimento
- **Linting/Formatação**: Biome
- **CI/CD**: GitHub Actions
- **Gerenciador de Pacotes**: Bun

## Estrutura do Projeto

```
StarStore/
├── mobile/                    # App React Native
│   ├── app/                   # Páginas do Expo Router
│   │   ├── (auth)/            # Telas de autenticação (login, registro)
│   │   ├── (tabs)/            # Tabs principais (home, carrinho, histórico, perfil)
│   │   ├── product/[id].tsx   # Detalhe do produto (deep linking)
│   │   └── checkout.tsx       # Tela de checkout
│   ├── components/            # Componentes reutilizáveis
│   ├── constants/             # Design tokens (Colors, Spacing, Typography)
│   ├── hooks/                 # Hooks customizados (useAuth, useProducts, useOrders)
│   ├── services/              # Helpers do Firebase, storage
│   ├── store/                 # Stores do Zustand
│   └── types/                 # Tipos TypeScript
├── functions/                 # Firebase Cloud Functions
│   └── src/
│       ├── products/          # Endpoints de produtos
│       ├── orders/            # Endpoints de pedidos
│       └── users/             # Triggers de usuário
├── firebase.json              # Configuração do Firebase
├── firestore.rules            # Regras de segurança
└── biome.json                 # Configuração de linting
```

## Começando

### Pré-requisitos

- Node.js 18+
- Bun (`curl -fsSL https://bun.sh/install | bash`)
- Firebase CLI (`bun add -g firebase-tools`)
- Android Studio (para Android) ou Xcode (para iOS)

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/starstore.git
   cd starstore
   ```

2. **Instale todas as dependências (recomendado)**
   ```bash
   bun run install:all
   ```

   Ou instale individualmente:
   ```bash
   bun install                     # Raiz
   cd mobile && bun install        # Mobile
   cd ../functions && bun install  # Functions
   ```

### Configuração do Firebase

1. **Crie um projeto no Firebase**
   - Acesse o [Firebase Console](https://console.firebase.google.com/)
   - Crie um novo projeto
   - Ative Authentication (Email/Senha)
   - Crie um banco de dados Firestore

2. **Configure o Firebase**
   - Atualize `.firebaserc` com o ID do seu projeto
   - Baixe `google-services.json` (Android) e coloque em `mobile/android/app/`
   - Baixe `GoogleService-Info.plist` (iOS) e coloque em `mobile/ios/`

3. **Gere os projetos nativos**
   ```bash
   cd mobile
   bunx expo prebuild
   ```

### Executando o App

**Desenvolvimento (com Expo Go - recursos limitados do Firebase)**
```bash
cd mobile
bun start
```

**Build de Desenvolvimento (suporte completo ao Firebase)**
```bash
cd mobile
bunx expo run:android  # Para Android
bunx expo run:ios      # Para iOS (apenas macOS)
```

**Emuladores do Firebase (para desenvolvimento local)**
```bash
# A partir do diretório raiz
bun run firebase:emulators
```

## Scripts Disponíveis

### Raiz
- `bun run lint` - Executar linter do Biome
- `bun run format` - Formatar código com Biome
- `bun run check` - Executar todas as verificações do Biome
- `bun run install:all` - Instalar todas as dependências

### Mobile
- `bun run mobile:start` - Iniciar servidor de desenvolvimento do Expo
- `bun run mobile:android` - Executar no Android
- `bun run mobile:ios` - Executar no iOS

### Functions
- `bun run functions:build` - Compilar TypeScript
- `bun run functions:serve` - Iniciar emulador local
- `bun run functions:deploy` - Deploy para o Firebase

## Arquitetura

### Estratégia de Gerenciamento de Estado

| Tipo de Dados | Ferramenta | Exemplo |
|---------------|------------|---------|
| Estado do Servidor | TanStack Query | Produtos, Pedidos, Dados do usuário |
| Estado do Cliente | Zustand | Carrinho, Estado da UI |
| Estado de Auth | Firebase Auth | Sessão do usuário |

### Segurança

- **Autenticação**: Firebase Auth com gerenciamento seguro de tokens
- **Armazenamento de Dados**: 
  - Dados sensíveis (tokens) → Expo SecureStore (Keychain/Keystore)
  - Dados não sensíveis → AsyncStorage
- **Regras do Firestore**: Segurança a nível de linha baseada no ID do usuário

## Licença

Este projeto é para fins educacionais/entrevista.

---

Construído com ❤️ para os fãs de Star Wars
