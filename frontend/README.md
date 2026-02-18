# Derogative Shop - Frontend Documentation

Welcome to the complete documentation for the Derogative Shop frontend, a cross-platform e-commerce mobile application built with React Native and Expo.

## 📚 Table of Contents

1. [Overview](#overview)
2. [Architecture](./docs/ARCHITECTURE.md)
3. [Getting Started](./docs/GETTING_STARTED.md)
4. [Testing](./docs/TESTING.md)
5. [API & Services](./docs/API.md)
6. [Components](./docs/COMPONENTS.md)
7. [State Management](./docs/STATE_MANAGEMENT.md)

## Overview

Derogative Shop is a cross-platform mobile application that allows users to:

- Browse a product catalog
- Scan barcodes to identify products
- Manage a shopping cart
- Create and manage their user account
- Make online purchases

### Core Technologies

- **Framework**: React Native with Expo ~54.0.33
- **Navigation**: Expo Router 6.0 (file-based routing)
- **State Management**: Zustand 5.0
- **API Client**: Axios 1.13
- **UI Components**: React Native Paper 5.14
- **Forms**: React Hook Form 7.71 + Zod 4.3
- **Testing**: Jest 29.7 + Testing Library
- **Styling**: React Native Reanimated, Gesture Handler
- **Storage**: Expo Secure Store
- **Camera**: Expo Camera

### Project Structure

```
frontend/
├── app/                    # Expo Router routes (file-based)
│   ├── (tabs)/            # Tab navigation
│   ├── _layout.tsx        # Root layout
│   ├── login.tsx          # Login screen
│   └── register.tsx       # Registration screen
├── src/
│   ├── components/        # Reusable components
│   ├── context/          # React Contexts (Auth)
│   ├── hooks/            # Custom hooks
│   ├── screens/          # Screen components
│   ├── services/         # API services
│   ├── store/            # Zustand state
│   ├── utils/            # Utility functions
│   ├── constants/        # Constants and themes
│   └── config.ts         # App configuration
├── __tests__/            # Unit and integration tests
├── docs/                 # Documentation (this folder)
└── assets/               # Images and static resources
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development mode
npm run dev

# or for Android
npm run android

# or for iOS
npm run ios

# or for Web
npm run web
```

## 📖 Detailed Documentation

- **[Architecture](./ARCHITECTURE.md)** - Project architecture, patterns and conventions
- **[Getting Started](./GETTING_STARTED.md)** - Detailed installation and configuration
- **[Testing](./TESTING.md)** - Testing strategy and examples
- **[API & Services](./API.md)** - Services and endpoints documentation
- **[Components](./COMPONENTS.md)** - Reusable components catalog
- **[State Management](./STATE_MANAGEMENT.md)** - Zustand stores and contexts

## 🤝 Contributing

To contribute to the project:

1. Write tests for new features
2. Ensure all tests pass (`npm test`)
3. Check linting (`npm run lint`)
4. Format code (`npm run format`)

## 📝 License

This project is private and confidential.

---

**Version**: 1.0.0  
**Last Updated**: February 2026
