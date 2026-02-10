# StarStore - Star Wars E-commerce Mobile App

[Versão em Português](README.md)

A Star Wars themed e-commerce mobile application built with React Native (Expo) and Firebase. Developed with a focus on architectural best practices, separation of concerns, and user experience.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Main Dependencies](#main-dependencies)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [CI/CD](#cicd)
- [License](#license)

## Tech Stack

### Mobile App
- **Framework**: React Native 0.81 with Expo 54 (Expo Router v6)
- **Language**: TypeScript 5.9 (Strict Mode)
- **State Management**:
  - TanStack Query — Server state (products, orders)
  - Zustand — Client state (cart, UI)
- **Styling**: React Native StyleSheet with Design Tokens
- **Navigation**: Expo Router (file-based routing) with Drawer + Tabs
- **Forms**: React Hook Form + Yup (schema validation)
- **Internationalization**: Custom type-safe i18n system

### Backend
- **Platform**: Firebase
- **Authentication**: Firebase Auth (Email/Password)
- **Database**: Cloud Firestore
- **Functions**: Firebase Cloud Functions (TypeScript, Node 20)
- **Analytics**: Firebase Analytics
- **Monitoring**: Firebase Crashlytics

### Development Tools
- **Linting/Formatting**: Biome 1.9
- **Testing**: Jest + React Native Testing Library
- **CI/CD**: GitHub Actions (CI + CD with Firebase App Distribution)
- **Package Manager**: Bun

## Architecture

### Overview

The project follows a **layered architecture** with clear separation of concerns, inspired by Clean Architecture and SOLID principles:

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

### Repository Pattern with Dependency Inversion

Each repository implements an **interface** (Dependency Inversion Principle), enabling easy implementation swapping (e.g., mocks for testing, backend replacement):

```typescript
// Interface (contract)
export interface IAuthRepository {
  signIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string, displayName?: string): Promise<void>;
  signOut(): Promise<void>;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}

// Firebase implementation
export class AuthRepository implements IAuthRepository { ... }

// Exported singleton
export const authRepository = new AuthRepository();
```

Hooks consume repositories, and components consume hooks — no upper layer knows about Firebase internals.

### State Management Strategy

| Data Type | Tool | Example | Rationale |
|---|---|---|---|
| Server State | TanStack Query | Products, Orders, User data | Automatic caching, revalidation, retry, stale-while-revalidate |
| Client State | Zustand | Cart, UI | Lightweight, persistable, zero boilerplate |
| Auth State | Firebase Auth | User session | Reactive listener with `onAuthStateChanged` |
| Theme State | Context API | Light/dark/system theme | Global propagation without extra libraries |

### Feedback System (Toast + Modal)

The `FeedbackContext` provides a unified user feedback system with:
- Animated **toasts** (success, error, warning, info) with auto-dismiss
- Customizable **modals** with configurable buttons (default, cancel, destructive)
- Animations via `react-native-reanimated`

### Theme System

The `ThemeContext` manages user theme preference:
- Support for **Light**, **Dark**, and **System** (follows OS setting)
- Preference persistence via AsyncStorage
- Centralized design tokens in `constants/` (Colors, Spacing, Typography)

### Internationalization (i18n)

Custom i18n system with **full type-safety** via TypeScript:
- Typed keys with dot notation (`'login.title'`, `'validation.emailRequired'`)
- Current support: Portuguese (pt-BR)
- Extensible to new languages without modifying components

### Form Validation

Validation schemas with **Yup** integrated with **React Hook Form**:
- `loginSchema` — Login validation (email, password)
- `registerSchema` — Registration validation (name, email, password, confirmation)
- `checkoutSchema` — Checkout validation (card data)

### Security

- **Authentication**: Firebase Auth with secure token management
- **Data Storage**:
  - Sensitive data (tokens) → `expo-secure-store` (Keychain on iOS / Keystore on Android)
  - Non-sensitive data (preferences, cache) → AsyncStorage
- **Firestore Rules**: Document-level security based on user `uid`
  - Users can only read/write their own data
  - Products are publicly readable, writes only via Admin SDK
  - Orders are readable by the owner and can only be created with `status: 'pending'`

### Monitoring and Analytics

- **Firebase Analytics**: E-commerce event tracking (view_item, add_to_cart, purchase, etc.)
- **Firebase Crashlytics**: Non-fatal error reports with context
- **Error Boundary**: Component that catches errors in the React component tree and reports to Crashlytics
- Centralized wrappers (`Analytics`, `CrashReport`) to avoid direct SDK imports

### Offline Support

- Local order caching via AsyncStorage for offline access
- Cart persisted locally with Zustand + AsyncStorage
- `useCachedOrders` as fallback when network fails

### Deep Linking

The app supports **deep linking** for direct navigation to specific products via URL, allowing users to share and access products from outside the app.

**URL Scheme**: `starstore://`

| Route | URL | Description |
|---|---|---|
| Product | `starstore://product/{id}` | Opens the product detail screen |

**How it works**:
- **Expo Router** automatically resolves URLs based on file-based routing (`app/product/[id].tsx`)
- The `deepLinking.ts` utility generates consistent URLs via `expo-linking`
- The **share button** on the product detail screen uses the native Share API to send the deep link
- **Intent Filters** configured in `app.json` ensure Android registers the app to intercept `starstore://product/*` links

**Testing deep links**:

```bash
# Android (via adb)
adb shell am start -a android.intent.action.VIEW -d "starstore://product/PRODUCT_ID"

# iOS (via xcrun)
xcrun simctl openurl booted "starstore://product/PRODUCT_ID"
```

## Project Structure

```
StarStore/
├── mobile/                          # React Native App (Expo)
│   ├── android/                     # Android project (generated via expo prebuild - NOT versioned)
│   ├── ios/                         # iOS project (generated via expo prebuild - NOT versioned)
│   ├── plugins/                     # Custom Expo config plugins
│   │   └── withCrashlyticsConfig.js # Adds Crashlytics meta-data to AndroidManifest
│   ├── app/                         # Pages (Expo Router - file-based routing)
│   │   ├── _layout.tsx              # Root layout (providers, QueryClient, themes)
│   │   ├── (auth)/                  # Authentication screens
│   │   │   ├── login.tsx            # Email/password login
│   │   │   └── register.tsx         # New user registration
│   │   ├── (drawer)/               # Drawer layout
│   │   │   ├── _layout.tsx          # Drawer configuration
│   │   │   └── (tabs)/             # Main tabs
│   │   │       ├── index.tsx        # Home (product listing)
│   │   │       ├── cart.tsx         # Shopping cart
│   │   │       └── history.tsx      # Order history
│   │   ├── product/[id].tsx         # Product detail (deep linking)
│   │   ├── order/[id].tsx           # Order detail
│   │   ├── checkout.tsx             # Checkout screen (modal)
│   │   ├── edit-profile.tsx         # Profile editing
│   │   └── help.tsx                 # Help screen
│   ├── components/                  # Reusable components
│   │   ├── AppHeader.tsx            # Custom header
│   │   ├── DrawerContent.tsx        # Drawer sidebar content
│   │   ├── ErrorBoundary.tsx        # Error boundary with Crashlytics
│   │   ├── EmptyState.tsx           # Generic empty state
│   │   └── Skeleton.tsx             # Loading skeleton
│   ├── constants/                   # Design tokens
│   │   ├── Colors.ts               # Color palette (light/dark)
│   │   ├── Spacing.ts              # Standardized spacing
│   │   └── Typography.ts           # Typography
│   ├── contexts/                    # React Contexts
│   │   ├── FeedbackContext.tsx      # Toast + Modal system
│   │   └── ThemeContext.tsx          # Theme management
│   ├── hooks/                       # Custom Hooks
│   │   ├── useAuth.ts              # Authentication (signIn, signUp, signOut)
│   │   ├── useProducts.ts          # Product listing/detail (TanStack Query)
│   │   └── useOrders.ts            # Orders + creation + offline cache
│   ├── i18n/                        # Internationalization
│   │   ├── index.ts                # t() function with type-safety
│   │   └── locales/pt-BR.ts        # Portuguese translations
│   ├── repositories/               # Data layer (Repository Pattern)
│   │   ├── authRepository.ts       # Auth (Firebase Auth)
│   │   ├── productRepository.ts    # Products (Firestore)
│   │   └── orderRepository.ts      # Orders (Firestore + local cache)
│   ├── schemas/                     # Validation schemas (Yup)
│   │   ├── loginSchema.ts          # Login validation
│   │   ├── registerSchema.ts       # Registration validation
│   │   └── checkoutSchema.ts       # Checkout validation
│   ├── services/                    # Infrastructure services
│   │   ├── firebase.ts             # Firebase helpers (Auth + Firestore)
│   │   ├── storage.ts              # SecureStorage + AsyncStorage wrappers
│   │   └── analytics.ts            # Analytics + Crashlytics wrappers
│   ├── store/                       # Zustand stores
│   │   └── cartStore.ts            # Cart (persisted in AsyncStorage)
│   ├── styles/                      # Styles separated by screen
│   └── types/                       # TypeScript types
│       ├── product.ts
│       ├── order.ts
│       └── user.ts
├── functions/                       # Firebase Cloud Functions
│   └── src/
│       ├── index.ts                # Entry point (exports all functions)
│       ├── products/               # Product CRUD
│       ├── orders/                 # Order management
│       ├── users/                  # User creation triggers
│       └── utils/                  # Helpers (auth, firestore)
├── .github/workflows/              # CI/CD Pipelines
│   ├── ci.yml                      # Lint, type-check, build, tests
│   └── cd.yml                      # APK build + Firebase App Distribution
├── firebase.json                    # Firebase configuration (emulators, deploy)
├── firestore.rules                  # Firestore security rules
├── biome.json                       # Biome configuration (lint + format)
└── package.json                     # Monorepo root scripts
```

## Main Dependencies

### Mobile — Runtime

| Dependency | Version | Rationale |
|---|---|---|
| **expo** | ~54.0 | Framework that simplifies React Native development with integrated tooling, OTA updates, and build services |
| **expo-router** | ~6.0 | File-based navigation (like Next.js), deep linking support, typed routes, and nested layouts |
| **react-native** | 0.81 | Base framework for cross-platform native apps with New Architecture enabled |
| **@tanstack/react-query** | ^5.90 | Server state management with caching, automatic retry, stale-while-revalidate, and smart invalidation |
| **zustand** | ^5.0 | Client state management — minimalist, zero boilerplate, with persistence middleware |
| **@react-native-firebase/app** | ^23.8 | Native Firebase SDK — superior performance over JS SDK, access to native APIs |
| **@react-native-firebase/auth** | ^23.8 | Native Firebase authentication with persistent session management |
| **@react-native-firebase/firestore** | ^23.8 | Real-time database with native offline sync |
| **@react-native-firebase/analytics** | ^23.8 | E-commerce analytics with standardized events (GA4) |
| **@react-native-firebase/crashlytics** | ^23.8 | Production crash monitoring and non-fatal error reporting |
| **react-hook-form** | ^7.71 | Performant form management — minimal re-renders, integrated validation |
| **@hookform/resolvers** | ^5.2 | React Hook Form integration with external validation schemas (Yup/Zod) |
| **yup** | ^1.7 | Declarative schema validation with i18n error messages |
| **expo-secure-store** | ~15.0 | Secure storage (Keychain/Keystore) for tokens and sensitive data |
| **@react-native-async-storage/async-storage** | 2.2 | Non-sensitive local storage (cache, preferences) |
| **@shopify/flash-list** | 2.0 | High-performance virtualized list — replaces FlatList with cell recycling |
| **expo-image** | ~3.0 | Optimized image loading with disk caching, placeholders, and transitions |
| **react-native-reanimated** | ~4.1 | UI-thread animations — smooth toasts, modals, and transitions |
| **react-native-gesture-handler** | ~2.28 | Native gestures for drawer, swipe, and touch interactions |
| **@react-navigation/drawer** | ^7.8 | Sidebar drawer for secondary navigation (profile, help, theme) |

### Mobile — Development

| Dependency | Version | Rationale |
|---|---|---|
| **typescript** | ~5.9 | Static typing, advanced inference, and type-safety in i18n |
| **jest** | ^29.7 | Testing framework — snapshots, mocks, coverage |
| **jest-expo** | ^54.0 | Pre-configured Jest preset for Expo projects |
| **@testing-library/react-native** | ^13.3 | Component testing focused on user behavior |
| **@biomejs/biome** | 1.9.4 | Ultra-fast linter + formatter — replaces ESLint + Prettier with a single tool |

### Functions (Backend)

| Dependency | Version | Rationale |
|---|---|---|
| **firebase-functions** | ^5.0 | Cloud Functions runtime with HTTP and Firestore triggers |
| **firebase-admin** | ^12.0 | Admin SDK to access Firestore, Auth, and other services without security restrictions |

## Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 20)
- **Bun** — JavaScript package manager and runtime
  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```
- **Firebase CLI**
  ```bash
  bun add -g firebase-tools
  ```
- **Android Studio** (for Android) or **Xcode** (for iOS, macOS only)
- **JDK 17** (for Android builds)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/starstore.git
   cd starstore
   ```

2. **Install all dependencies**
   ```bash
   bun run install:all
   ```

   Or install individually:
   ```bash
   bun install                     # Root (Biome)
   cd mobile && bun install        # Mobile (Expo + dependencies)
   cd ../functions && bun install  # Functions (Firebase)
   ```

### Firebase Setup

The project is already configured to use the Firebase project **starstore-1844c**. To run locally, you just need to set up the credential files:

1. **Obtain the Firebase configuration files**
   - Go to [Firebase Console](https://console.firebase.google.com/) and open the **starstore-1844c** project
   - Download `google-services.json` (Android) and place in `mobile/`
   - Download `GoogleService-Info.plist` (iOS) and place in `mobile/`

   > **Note**: These files are in `.gitignore` as they contain API keys. Each developer needs to obtain them separately.

2. **Generate native projects (prebuild)**

   The `android/` and `ios/` folders **are not version-controlled** — they are automatically generated by Expo prebuild from `app.json` settings and config plugins.

   ```bash
   cd mobile
   bun run prebuild
   ```

   Prebuild automatically configures:
   - Firebase plugins (google-services, crashlytics) in Gradle files
   - Crashlytics meta-data in AndroidManifest (via custom plugin in `plugins/`)
   - Splash screen, deep linking, adaptive icons, and backup rules
   - Copies `google-services.json` to `android/app/`

   To regenerate from scratch (useful when updating native dependencies):
   ```bash
   bun run prebuild:clean
   ```

3. **Deploy Cloud Functions** (optional for local dev)
   ```bash
   bun run functions:deploy
   ```

### Running the App

**Development Build (recommended — full Firebase support)**
```bash
cd mobile
bunx expo run:android  # For Android
bunx expo run:ios      # For iOS (macOS only)
```

**Development with Expo Go (limited Firebase features)**
```bash
cd mobile
bun start
```

> **Note**: Expo Go does not support native Firebase modules (Auth, Firestore, Analytics, Crashlytics). For full development, use the development build.

**Firebase Emulators (local development with no costs)**
```bash
# From root directory
bun run firebase:emulators
```

Emulators are available at:
- **Emulator UI**: http://localhost:4000
- **Auth**: port 9099
- **Firestore**: port 8080
- **Functions**: port 5001

## Available Scripts

### Root
| Script | Command | Description |
|---|---|---|
| `lint` | `bun run lint` | Run Biome linter |
| `format` | `bun run format` | Format code with Biome |
| `check` | `bun run check` | Run all Biome checks |
| `install:all` | `bun run install:all` | Install dependencies for all workspaces |
| `firebase:emulators` | `bun run firebase:emulators` | Start Firebase emulators |

### Mobile
| Script | Command | Description |
|---|---|---|
| `start` | `bun run mobile:start` | Start Expo dev server |
| `android` | `bun run mobile:android` | Build and run on Android |
| `ios` | `bun run mobile:ios` | Build and run on iOS |
| `prebuild` | `cd mobile && bun run prebuild` | Generate native folders (android/ios) via Expo |
| `prebuild:clean` | `cd mobile && bun run prebuild:clean` | Regenerate native folders from scratch |
| `test` | `cd mobile && bun run test` | Run unit tests |
| `test:watch` | `cd mobile && bun run test:watch` | Tests in watch mode |
| `test:coverage` | `cd mobile && bun run test:coverage` | Tests with coverage report |

### Functions
| Script | Command | Description |
|---|---|---|
| `build` | `bun run functions:build` | Build TypeScript |
| `serve` | `bun run functions:serve` | Build + start local emulator |
| `deploy` | `bun run functions:deploy` | Deploy to Firebase |

## Testing

The project uses **Jest** with **React Native Testing Library** for unit and integration tests.

### Running Tests

```bash
cd mobile

# Run all tests
bun run test

# Watch mode (re-runs on save)
bun run test:watch

# With coverage report
bun run test:coverage
```

### Test Coverage

Tests cover the following layers:

| Layer | Test Files | What's Tested |
|---|---|---|
| **Repositories** | `authRepository.test.ts`, `productRepository.test.ts`, `orderRepository.test.ts` | Firebase interactions, data mapping, error handling |
| **Hooks** | `useAuth.test.ts`, `useProducts.test.ts`, `useOrders.test.ts` | Auth flows, queries, mutations |
| **Store** | `cartStore.test.ts` | Item add/remove, total calculation, persistence |
| **Schemas** | `loginSchema.test.ts`, `registerSchema.test.ts`, `checkoutSchema.test.ts` | Form validations, error messages |
| **Services** | `storage.test.ts` | SecureStorage and AsyncStorage wrappers |
| **Utils** | `formatCurrency.test.ts` | Currency formatting |
| **Components** | `ErrorBoundary.test.tsx` | Error capture and display |

### Mock Configuration

All mocks are centralized in `jest.setup.ts`:
- Firebase Auth, Firestore, Analytics, and Crashlytics
- Expo Secure Store and Expo Router
- AsyncStorage and React Native Reanimated
- i18n system and analytics services

## CI/CD

### Continuous Integration (CI)

The CI pipeline runs on every **push** and **pull request** to `main` and `develop` branches:

1. **Lint & Type Check**
   - Biome lint/format check
   - TypeScript type-check (`tsc --noEmit`) on mobile
   - Cloud Functions build

2. **Tests**
   - Test execution with coverage
   - Runs after lint passes (sequential dependency)

### Continuous Delivery (CD)

The CD pipeline runs automatically after CI succeeds on the `main` branch:

1. **Android Build**
   - `expo prebuild` to generate native project
   - Debug APK build via Gradle

2. **Distribution**
   - APK upload as GitHub artifact
   - Distribution via **Firebase App Distribution** to the testers group

## License

This project is for educational/interview purposes.

---

Built with ❤️ for Star Wars fans
