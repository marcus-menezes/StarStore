# StarStore - Star Wars E-commerce Mobile App

[Versão em Português](README.md)

A Star Wars themed e-commerce mobile application built with React Native (Expo) and Firebase.

## Tech Stack

### Mobile App
- **Framework**: React Native with Expo (Expo Router)
- **Language**: TypeScript (Strict Mode)
- **State Management**:
  - TanStack Query - Server state (products, orders)
  - Zustand - Client state (cart, UI)
- **Styling**: React Native StyleSheet with Design Tokens
- **Navigation**: Expo Router (file-based routing)

### Backend
- **Platform**: Firebase
- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore
- **Functions**: Firebase Cloud Functions (TypeScript)

### Development Tools
- **Linting/Formatting**: Biome
- **CI/CD**: GitHub Actions
- **Package Manager**: Bun

## Project Structure

```
StarStore/
├── mobile/                    # React Native app
│   ├── app/                   # Expo Router pages
│   │   ├── (auth)/            # Auth screens (login, register)
│   │   ├── (tabs)/            # Main tabs (home, cart, history, profile)
│   │   ├── product/[id].tsx   # Product detail (deep linking)
│   │   └── checkout.tsx       # Checkout screen
│   ├── components/            # Reusable components
│   ├── constants/             # Design tokens (Colors, Spacing, Typography)
│   ├── hooks/                 # Custom hooks (useAuth, useProducts, useOrders)
│   ├── services/              # Firebase helpers, storage
│   ├── store/                 # Zustand stores
│   └── types/                 # TypeScript types
├── functions/                 # Firebase Cloud Functions
│   └── src/
│       ├── products/          # Product endpoints
│       ├── orders/            # Order endpoints
│       └── users/             # User triggers
├── firebase.json              # Firebase config
├── firestore.rules            # Security rules
└── biome.json                 # Linting config
```

## Getting Started

### Prerequisites

- Node.js 18+
- Bun (`curl -fsSL https://bun.sh/install | bash`)
- Firebase CLI (`bun add -g firebase-tools`)
- Android Studio (for Android) or Xcode (for iOS)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/starstore.git
   cd starstore
   ```

2. **Install all dependencies (recommended)**
   ```bash
   bun run install:all
   ```

   Or install individually:
   ```bash
   bun install                     # Root
   cd mobile && bun install        # Mobile
   cd ../functions && bun install  # Functions
   ```

### Firebase Setup

1. **Create a Firebase project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Create a Firestore database

2. **Configure Firebase**
   - Update `.firebaserc` with your project ID
   - Download `google-services.json` (Android) and place in `mobile/android/app/`
   - Download `GoogleService-Info.plist` (iOS) and place in `mobile/ios/`

3. **Generate native projects**
   ```bash
   cd mobile
   bunx expo prebuild
   ```

### Running the App

**Development (with Expo Go - limited Firebase features)**
```bash
cd mobile
bun start
```

**Development Build (full Firebase support)**
```bash
cd mobile
bunx expo run:android  # For Android
bunx expo run:ios      # For iOS (macOS only)
```

**Firebase Emulators (for local development)**
```bash
# From root directory
bun run firebase:emulators
```

## Available Scripts

### Root
- `bun run lint` - Run Biome linter
- `bun run format` - Format code with Biome
- `bun run check` - Run all Biome checks
- `bun run install:all` - Install all dependencies

### Mobile
- `bun run mobile:start` - Start Expo dev server
- `bun run mobile:android` - Run on Android
- `bun run mobile:ios` - Run on iOS

### Functions
- `bun run functions:build` - Build TypeScript
- `bun run functions:serve` - Start local emulator
- `bun run functions:deploy` - Deploy to Firebase

## Architecture

### State Management Strategy

| Data Type | Tool | Example |
|-----------|------|---------|
| Server State | TanStack Query | Products, Orders, User data |
| Client State | Zustand | Cart, UI state |
| Auth State | Firebase Auth | User session |

### Security

- **Authentication**: Firebase Auth with secure token management
- **Data Storage**: 
  - Sensitive data (tokens) → Expo SecureStore (Keychain/Keystore)
  - Non-sensitive data → AsyncStorage
- **Firestore Rules**: Row-level security based on user ID

## License

This project is for educational/interview purposes.

---

Built with ❤️ for Star Wars fans
