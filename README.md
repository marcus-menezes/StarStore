# StarStore - E-commerce Mobile de Star Wars

[English version](README.en.md)

Aplicativo mobile de e-commerce temático de Star Wars construído com React Native (Expo) e Firebase. Projeto desenvolvido com foco em boas práticas de arquitetura, separação de responsabilidades e experiência do usuário.

## Índice

- [Stack Tecnológica](#stack-tecnológica)
- [Arquitetura](#arquitetura)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Dependências Principais](#dependências-principais)
- [Começando](#começando)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Testes](#testes)
- [CI/CD](#cicd)
- [Licença](#licença)

## Stack Tecnológica

### Aplicativo Mobile
- **Framework**: React Native 0.81 com Expo 54 (Expo Router v6)
- **Linguagem**: TypeScript 5.9 (Strict Mode)
- **Gerenciamento de Estado**:
  - TanStack Query — Estado do servidor (produtos, pedidos)
  - Zustand — Estado do cliente (carrinho, UI)
- **Estilização**: StyleSheet do React Native com Design Tokens
- **Navegação**: Expo Router (file-based routing) com Drawer + Tabs
- **Formulários**: React Hook Form + Yup (validação de schemas)
- **Internacionalização**: Sistema próprio de i18n com type-safety

### Backend
- **Plataforma**: Firebase
- **Autenticação**: Firebase Auth (Email/Senha)
- **Banco de Dados**: Cloud Firestore
- **Functions**: Firebase Cloud Functions (TypeScript, Node 20)
- **Analytics**: Firebase Analytics
- **Monitoramento**: Firebase Crashlytics

### Ferramentas de Desenvolvimento
- **Linting/Formatação**: Biome 1.9
- **Testes**: Jest + React Native Testing Library
- **CI/CD**: GitHub Actions (CI + CD com Firebase App Distribution)
- **Gerenciador de Pacotes**: Bun

## Arquitetura

### Visão Geral

O projeto segue uma **arquitetura em camadas** com separação clara de responsabilidades, inspirada em princípios de Clean Architecture e SOLID:

```
┌─────────────────────────────────────────────────┐
│                    UI Layer                      │
│           (Screens / Components)                 │
├─────────────────────────────────────────────────┤
│                  Hooks Layer                     │
│     (useAuth, useProducts, useOrders)            │
├─────────────────────────────────────────────────┤
│              Repository Layer                    │
│   (AuthRepository, ProductRepository, etc.)      │
├─────────────────────────────────────────────────┤
│               Services Layer                     │
│     (Firebase, Storage, Analytics)               │
├─────────────────────────────────────────────────┤
│              External Services                   │
│  (Firebase Auth, Firestore, Crashlytics)         │
└─────────────────────────────────────────────────┘
```

### Repository Pattern com Inversão de Dependência

Cada repositório implementa uma **interface** (Dependency Inversion Principle), permitindo fácil substituição da implementação (ex: mock para testes, troca de backend):

```typescript
// Interface (contrato)
export interface IAuthRepository {
  signIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string, displayName?: string): Promise<void>;
  signOut(): Promise<void>;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}

// Implementação Firebase
export class AuthRepository implements IAuthRepository { ... }

// Singleton exportado
export const authRepository = new AuthRepository();
```

Os hooks consomem os repositórios, e os componentes consomem os hooks — nenhuma camada superior conhece os detalhes do Firebase.

### Estratégia de Gerenciamento de Estado

| Tipo de Dado | Ferramenta | Exemplo | Justificativa |
|---|---|---|---|
| Estado do Servidor | TanStack Query | Produtos, Pedidos, Dados do usuário | Cache automático, revalidação, retry, stale-while-revalidate |
| Estado do Cliente | Zustand | Carrinho, UI | Leve, persistível, sem boilerplate |
| Estado de Auth | Firebase Auth | Sessão do usuário | Listener reativo com `onAuthStateChanged` |
| Estado de Tema | Context API | Tema claro/escuro/sistema | Propagação global sem lib extra |

### Sistema de Feedback (Toast + Modal)

O `FeedbackContext` fornece um sistema unificado de feedback ao usuário com:
- **Toasts** animados (success, error, warning, info) com auto-dismiss
- **Modais** customizados com botões configuráveis (default, cancel, destructive)
- Animações via `react-native-reanimated`

### Sistema de Temas

O `ThemeContext` gerencia a preferência de tema do usuário:
- Suporte a **Light**, **Dark** e **System** (acompanha o SO)
- Persistência da preferência via AsyncStorage
- Design tokens centralizados em `constants/` (Colors, Spacing, Typography)

### Internacionalização (i18n)

Sistema próprio de i18n com **type-safety completo** via TypeScript:
- Chaves tipadas com dot notation (`'login.title'`, `'validation.emailRequired'`)
- Suporte atual: Português (pt-BR)
- Extensível para novos idiomas sem alterar componentes

### Validação de Formulários

Schemas de validação com **Yup** integrados ao **React Hook Form**:
- `loginSchema` — Validação de login (email, senha)
- `registerSchema` — Validação de registro (nome, email, senha, confirmação)
- `checkoutSchema` — Validação de checkout (dados do cartão)

### Segurança

- **Autenticação**: Firebase Auth com gerenciamento seguro de tokens
- **Armazenamento de Dados**:
  - Dados sensíveis (tokens) → `expo-secure-store` (Keychain no iOS / Keystore no Android)
  - Dados não sensíveis (preferências, cache) → AsyncStorage
- **Regras do Firestore**: Segurança a nível de documento baseada no `uid` do usuário
  - Usuários só leem/escrevem seus próprios dados
  - Produtos são públicos para leitura, escrita apenas via Admin SDK
  - Pedidos são legíveis pelo dono e só podem ser criados com `status: 'pending'`

### Monitoramento e Analytics

- **Firebase Analytics**: Rastreamento de eventos de e-commerce (view_item, add_to_cart, purchase, etc.)
- **Firebase Crashlytics**: Relatórios de erros não-fatais com contexto
- **Error Boundary**: Componente que captura erros na árvore de componentes React e reporta ao Crashlytics
- Wrappers centralizados (`Analytics`, `CrashReport`) para evitar imports diretos do SDK

### Suporte Offline

- Cache local de pedidos via AsyncStorage para acesso offline
- Carrinho persistido localmente com Zustand + AsyncStorage
- `useCachedOrders` como fallback quando a rede falha

## Estrutura do Projeto

```
StarStore/
├── mobile/                          # App React Native (Expo)
│   ├── android/                     # Projeto Android (gerado via expo prebuild - NÃO versionado)
│   ├── ios/                         # Projeto iOS (gerado via expo prebuild - NÃO versionado)
│   ├── plugins/                     # Config plugins customizados do Expo
│   │   └── withCrashlyticsConfig.js # Adiciona meta-data do Crashlytics no AndroidManifest
│   ├── app/                         # Páginas (Expo Router - file-based routing)
│   │   ├── _layout.tsx              # Layout raiz (providers, QueryClient, themes)
│   │   ├── (auth)/                  # Telas de autenticação
│   │   │   ├── login.tsx            # Login com email/senha
│   │   │   └── register.tsx         # Registro de novo usuário
│   │   ├── (drawer)/               # Layout com Drawer lateral
│   │   │   ├── _layout.tsx          # Configuração do Drawer
│   │   │   └── (tabs)/             # Tabs principais
│   │   │       ├── index.tsx        # Home (listagem de produtos)
│   │   │       ├── cart.tsx         # Carrinho de compras
│   │   │       └── history.tsx      # Histórico de pedidos
│   │   ├── product/[id].tsx         # Detalhe do produto (deep linking)
│   │   ├── order/[id].tsx           # Detalhe do pedido
│   │   ├── checkout.tsx             # Tela de checkout (modal)
│   │   ├── edit-profile.tsx         # Edição de perfil
│   │   └── help.tsx                 # Tela de ajuda
│   ├── components/                  # Componentes reutilizáveis
│   │   ├── AppHeader.tsx            # Header customizado
│   │   ├── DrawerContent.tsx        # Conteúdo do drawer lateral
│   │   ├── ErrorBoundary.tsx        # Boundary de erros com Crashlytics
│   │   ├── EmptyState.tsx           # Estado vazio genérico
│   │   └── Skeleton.tsx             # Loading skeleton
│   ├── constants/                   # Design tokens
│   │   ├── Colors.ts               # Paleta de cores (light/dark)
│   │   ├── Spacing.ts              # Espaçamentos padronizados
│   │   └── Typography.ts           # Tipografia
│   ├── contexts/                    # React Contexts
│   │   ├── FeedbackContext.tsx      # Sistema de Toast + Modal
│   │   └── ThemeContext.tsx          # Gerenciamento de tema
│   ├── hooks/                       # Custom Hooks
│   │   ├── useAuth.ts              # Autenticação (signIn, signUp, signOut)
│   │   ├── useProducts.ts          # Listagem/detalhe de produtos (TanStack Query)
│   │   └── useOrders.ts            # Pedidos + criação + cache offline
│   ├── i18n/                        # Internacionalização
│   │   ├── index.ts                # Função t() com type-safety
│   │   └── locales/pt-BR.ts        # Traduções em português
│   ├── repositories/               # Camada de dados (Repository Pattern)
│   │   ├── authRepository.ts       # Auth (Firebase Auth)
│   │   ├── productRepository.ts    # Produtos (Firestore)
│   │   └── orderRepository.ts      # Pedidos (Firestore + cache local)
│   ├── schemas/                     # Schemas de validação (Yup)
│   │   ├── loginSchema.ts          # Validação de login
│   │   ├── registerSchema.ts       # Validação de registro
│   │   └── checkoutSchema.ts       # Validação de checkout
│   ├── services/                    # Serviços de infraestrutura
│   │   ├── firebase.ts             # Helpers do Firebase (Auth + Firestore)
│   │   ├── storage.ts              # SecureStorage + AsyncStorage wrappers
│   │   └── analytics.ts            # Analytics + Crashlytics wrappers
│   ├── store/                       # Stores Zustand
│   │   └── cartStore.ts            # Carrinho (persistido em AsyncStorage)
│   ├── styles/                      # Estilos separados por tela
│   └── types/                       # Tipos TypeScript
│       ├── product.ts
│       ├── order.ts
│       └── user.ts
├── functions/                       # Firebase Cloud Functions
│   └── src/
│       ├── index.ts                # Entry point (exporta todas as functions)
│       ├── products/               # CRUD de produtos
│       ├── orders/                 # Gestão de pedidos
│       ├── users/                  # Triggers de criação de usuário
│       └── utils/                  # Helpers (auth, firestore)
├── .github/workflows/              # Pipelines CI/CD
│   ├── ci.yml                      # Lint, type-check, build, testes
│   └── cd.yml                      # Build APK + Firebase App Distribution
├── firebase.json                    # Configuração do Firebase (emuladores, deploy)
├── firestore.rules                  # Regras de segurança do Firestore
├── biome.json                       # Configuração do Biome (lint + format)
└── package.json                     # Scripts raiz do monorepo
```

## Dependências Principais

### Mobile — Runtime

| Dependência | Versão | Justificativa |
|---|---|---|
| **expo** | ~54.0 | Framework que simplifica o desenvolvimento React Native com tooling integrado, OTA updates e build services |
| **expo-router** | ~6.0 | Navegação file-based (como Next.js), suporte a deep linking, typed routes e layouts aninhados |
| **react-native** | 0.81 | Framework base para apps nativos multiplataforma com New Architecture habilitada |
| **@tanstack/react-query** | ^5.90 | Gerenciamento de estado do servidor com cache, retry automático, stale-while-revalidate e invalidação inteligente |
| **zustand** | ^5.0 | Gerenciamento de estado do cliente — minimalista, sem boilerplate, com middleware de persistência |
| **@react-native-firebase/app** | ^23.8 | SDK nativo do Firebase — performance superior ao JS SDK, acesso a APIs nativas |
| **@react-native-firebase/auth** | ^23.8 | Autenticação Firebase nativa com gerenciamento de sessão persistente |
| **@react-native-firebase/firestore** | ^23.8 | Banco de dados em tempo real com sync offline nativo |
| **@react-native-firebase/analytics** | ^23.8 | Analytics de e-commerce com eventos padronizados (GA4) |
| **@react-native-firebase/crashlytics** | ^23.8 | Monitoramento de crashes e erros não-fatais em produção |
| **react-hook-form** | ^7.71 | Gerenciamento de formulários performático — re-renders mínimos, validação integrada |
| **@hookform/resolvers** | ^5.2 | Integração do React Hook Form com schemas de validação externos (Yup/Zod) |
| **yup** | ^1.7 | Validação de schemas declarativa com mensagens de erro i18n |
| **expo-secure-store** | ~15.0 | Armazenamento seguro (Keychain/Keystore) para tokens e dados sensíveis |
| **@react-native-async-storage/async-storage** | 2.2 | Armazenamento local não-sensível (cache, preferências) |
| **@shopify/flash-list** | 2.0 | Lista virtualizada de alta performance — substitui FlatList com reciclagem de cells |
| **expo-image** | ~3.0 | Carregamento de imagens otimizado com cache em disco, placeholders e transições |
| **react-native-reanimated** | ~4.1 | Animações executadas na UI thread — toasts, modais e transições suaves |
| **react-native-gesture-handler** | ~2.28 | Gestos nativos para drawer, swipe e interações touch |
| **@react-navigation/drawer** | ^7.8 | Drawer lateral para navegação secundária (perfil, ajuda, tema) |

### Mobile — Desenvolvimento

| Dependência | Versão | Justificativa |
|---|---|---|
| **typescript** | ~5.9 | Tipagem estática, inferência avançada e type-safety no i18n |
| **jest** | ^29.7 | Framework de testes — snapshot, mocks, coverage |
| **jest-expo** | ^54.0 | Preset do Jest pré-configurado para projetos Expo |
| **@testing-library/react-native** | ^13.3 | Testes de componentes com foco no comportamento do usuário |
| **@biomejs/biome** | 1.9.4 | Linter + formatter ultrarrápido — substitui ESLint + Prettier com uma única ferramenta |

### Functions (Backend)

| Dependência | Versão | Justificativa |
|---|---|---|
| **firebase-functions** | ^5.0 | Runtime para Cloud Functions com triggers HTTP e Firestore |
| **firebase-admin** | ^12.0 | SDK administrativo para acessar Firestore, Auth e outros serviços sem restrições de segurança |

## Começando

### Pré-requisitos

- **Node.js** 18+ (recomendado: 20)
- **Bun** — Gerenciador de pacotes e runtime JavaScript
  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```
- **Firebase CLI**
  ```bash
  bun add -g firebase-tools
  ```
- **Android Studio** (para Android) ou **Xcode** (para iOS, apenas macOS)
- **JDK 17** (para build Android)

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/starstore.git
   cd starstore
   ```

2. **Instale todas as dependências**
   ```bash
   bun run install:all
   ```

   Ou instale individualmente:
   ```bash
   bun install                     # Raiz (Biome)
   cd mobile && bun install        # Mobile (Expo + dependências)
   cd ../functions && bun install  # Functions (Firebase)
   ```

### Configuração do Firebase

O projeto já está configurado para usar o projeto Firebase **starstore-1844c**. Para rodar localmente, basta configurar os arquivos de credenciais:

1. **Obtenha os arquivos de configuração do Firebase**
   - Acesse o [Firebase Console](https://console.firebase.google.com/) e abra o projeto **starstore-1844c**
   - Baixe `google-services.json` (Android) e coloque em `mobile/`
   - Baixe `GoogleService-Info.plist` (iOS) e coloque em `mobile/`

   > **Nota**: Esses arquivos estão no `.gitignore` por conterem chaves de API. Cada desenvolvedor precisa obtê-los separadamente.

2. **Gere os projetos nativos (prebuild)**

   As pastas `android/` e `ios/` **não são versionadas** no repositório — elas são geradas automaticamente pelo Expo prebuild a partir das configurações do `app.json` e dos config plugins.

   ```bash
   cd mobile
   bun run prebuild
   ```

   O prebuild configura automaticamente:
   - Plugins do Firebase (google-services, crashlytics) nos arquivos Gradle
   - Meta-data do Crashlytics no AndroidManifest (via plugin customizado em `plugins/`)
   - Splash screen, deep linking, adaptive icons e backup rules
   - Cópia do `google-services.json` para `android/app/`

   Para regenerar do zero (útil ao atualizar dependências nativas):
   ```bash
   bun run prebuild:clean
   ```

3. **Deploy das Cloud Functions** (opcional para dev local)
   ```bash
   bun run functions:deploy
   ```

### Executando o App

**Build de Desenvolvimento (recomendado — suporte completo ao Firebase)**
```bash
cd mobile
bunx expo run:android  # Para Android
bunx expo run:ios      # Para iOS (apenas macOS)
```

**Desenvolvimento com Expo Go (recursos Firebase limitados)**
```bash
cd mobile
bun start
```

> **Nota**: O Expo Go não suporta os módulos nativos do Firebase (Auth, Firestore, Analytics, Crashlytics). Para desenvolvimento completo, use o build de desenvolvimento.

**Emuladores do Firebase (desenvolvimento local sem custos)**
```bash
# A partir do diretório raiz
bun run firebase:emulators
```

Os emuladores ficam disponíveis em:
- **UI do Emulador**: http://localhost:4000
- **Auth**: porta 9099
- **Firestore**: porta 8080
- **Functions**: porta 5001

## Scripts Disponíveis

### Raiz
| Script | Comando | Descrição |
|---|---|---|
| `lint` | `bun run lint` | Executar linter do Biome |
| `format` | `bun run format` | Formatar código com Biome |
| `check` | `bun run check` | Executar todas as verificações do Biome |
| `install:all` | `bun run install:all` | Instalar dependências de todos os workspaces |
| `firebase:emulators` | `bun run firebase:emulators` | Iniciar emuladores do Firebase |

### Mobile
| Script | Comando | Descrição |
|---|---|---|
| `start` | `bun run mobile:start` | Iniciar servidor de desenvolvimento Expo |
| `android` | `bun run mobile:android` | Build e execução no Android |
| `ios` | `bun run mobile:ios` | Build e execução no iOS |
| `prebuild` | `cd mobile && bun run prebuild` | Gerar pastas nativas (android/ios) via Expo |
| `prebuild:clean` | `cd mobile && bun run prebuild:clean` | Regenerar pastas nativas do zero |
| `test` | `cd mobile && bun run test` | Executar testes unitários |
| `test:watch` | `cd mobile && bun run test:watch` | Testes em modo watch |
| `test:coverage` | `cd mobile && bun run test:coverage` | Testes com relatório de cobertura |

### Functions
| Script | Comando | Descrição |
|---|---|---|
| `build` | `bun run functions:build` | Compilar TypeScript |
| `serve` | `bun run functions:serve` | Build + iniciar emulador local |
| `deploy` | `bun run functions:deploy` | Deploy para o Firebase |

## Testes

O projeto utiliza **Jest** com **React Native Testing Library** para testes unitários e de integração.

### Executando os Testes

```bash
cd mobile

# Executar todos os testes
bun run test

# Modo watch (re-executa ao salvar)
bun run test:watch

# Com relatório de cobertura
bun run test:coverage
```

### Cobertura de Testes

Os testes cobrem as seguintes camadas:

| Camada | Arquivos testados | O que é testado |
|---|---|---|
| **Repositories** | `authRepository.test.ts`, `productRepository.test.ts`, `orderRepository.test.ts` | Interações com Firebase, mapeamento de dados, tratamento de erros |
| **Hooks** | `useAuth.test.ts`, `useProducts.test.ts`, `useOrders.test.ts` | Fluxos de autenticação, queries, mutations |
| **Store** | `cartStore.test.ts` | Adição/remoção de itens, cálculo de totais, persistência |
| **Schemas** | `loginSchema.test.ts`, `registerSchema.test.ts`, `checkoutSchema.test.ts` | Validações de formulários, mensagens de erro |
| **Services** | `storage.test.ts` | SecureStorage e AsyncStorage wrappers |
| **Utils** | `formatCurrency.test.ts` | Formatação monetária |
| **Components** | `ErrorBoundary.test.tsx` | Captura e exibição de erros |

### Configuração dos Mocks

Todos os mocks estão centralizados em `jest.setup.ts`:
- Firebase Auth, Firestore, Analytics e Crashlytics
- Expo Secure Store e Expo Router
- AsyncStorage e React Native Reanimated
- Sistema de i18n e serviços de analytics

## CI/CD

### Integração Contínua (CI)

O pipeline de CI roda em todo **push** e **pull request** para as branches `main` e `develop`:

1. **Lint & Type Check**
   - Biome lint/format check
   - TypeScript type-check (`tsc --noEmit`) no mobile
   - Build das Cloud Functions

2. **Testes**
   - Execução dos testes com coverage
   - Roda após o lint passar (dependência sequencial)

### Entrega Contínua (CD)

O pipeline de CD roda automaticamente após o CI ser concluído com sucesso na branch `main`:

1. **Build Android**
   - `expo prebuild` para gerar projeto nativo
   - Build do APK debug via Gradle

2. **Distribuição**
   - Upload do APK como artefato do GitHub
   - Distribuição via **Firebase App Distribution** para o grupo de testers

## Licença

Este projeto é para fins educacionais/entrevista.

---

Construído com ❤️ para os fãs de Star Wars
