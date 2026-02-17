# Getting Started

This guide walks you through installation and configuration of the Derogative Shop frontend project.

## Prerequisites

### Required Software

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher
- **Git**: To clone the repository

### For Mobile Development

**Android**:
- Android Studio (with Android SDK)
- Java Development Kit (JDK) 11 or higher
- An Android emulator or physical device

**iOS** (macOS only):
- Xcode 14 or higher
- CocoaPods
- An iOS simulator or physical device

### Verify Prerequisites

```bash
# Check Node.js
node --version
# Should display v18.x.x or higher

# Check npm
npm --version
# Should display 9.x.x or higher

# Check Expo CLI (installs automatically)
npx expo --version
```

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Derogative-shop/frontend
```

### 2. Install dependencies

```bash
npm install
```

This command installs all dependencies listed in `package.json`, including:
- React Native and Expo
- Navigation libraries
- State management (Zustand)
- Development utilities

### 3. Environment Configuration

Create a `.env` file at the root of the `frontend` folder:

```bash
# Copy the template
cp .env.example .env
```

Contents of the `.env` file:

```env
# Backend API URL
EXPO_PUBLIC_API_URL=http://localhost:3000

# Other configurations if needed
EXPO_PUBLIC_ENV=development
```

**Important**:
- Variables must start with `EXPO_PUBLIC_` to be accessible in the code
- Never commit the `.env` file (added to `.gitignore`)
- For production, use environment variables from your hosting service

### 4. Backend Configuration

Make sure the backend is started and accessible:

```bash
# From project root
cd ../backend
npm run dev
# Backend must run on http://localhost:3000
```

## Starting the Application

### Development Mode

#### Option 1: Expo Go (recommended for beginners)

```bash
npm run start
# or
npm run dev
# or
npx expo start
```

A QR code appears in the terminal:
1. Install **Expo Go** on your mobile device (iOS/Android)
2. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app
3. The app loads on your device

#### Option 2: Android Emulator

```bash
npm run android
```

**Prerequisites**:
- Android Studio installed
- An Android emulator created and started
- Android environment variables configured

**Android Studio Configuration**:
1. Open Android Studio
2. Tools → Device Manager
3. Create a virtual device (e.g., Pixel 5, API 33)
4. Start the emulator

#### Option 3: iOS Simulator (macOS only)

```bash
npm run ios
```

**Prerequisites**:
- Xcode installed
- iOS simulator configured
- First time: `sudo gem install cocoapods`

#### Option 4: Web

```bash
npm run web
```

Opens the app in a web browser (limited features).

### Advanced Development Mode

```bash
# Development mode with cache clear
npx expo start --clear

# Development mode with tunnel (test on external network)
npx expo start --tunnel

# Development mode with localhost (local network)
npx expo start --localhost
```

## Structure After Installation

```
frontend/
├── node_modules/          # Installed dependencies
├── .expo/                 # Expo cache (auto-generated)
├── .env                   # Environment variables (NOT COMMITTED)
├── app/                   # Application routes
├── src/                   # Source code
├── __tests__/            # Tests
├── assets/               # Images and resources
├── docs/                 # Documentation
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Available Scripts

### Development

| Script | Command | Description |
|--------|----------|-------------|
| **start** | `npm run start` | Start Expo server |
| **dev** | `npm run dev` | Alias for `start` |
| **android** | `npm run android` | Launch on Android emulator |
| **ios** | `npm run ios` | Launch on iOS simulator |
| **web** | `npm run web` | Launch in browser |

### Code Quality

| Script | Command | Description |
|--------|----------|-------------|
| **lint** | `npm run lint` | Check code with ESLint |
| **format** | `npm run format` | Format code with Prettier |

### Testing

| Script | Command | Description |
|--------|----------|-------------|
| **test** | `npm test` | Run Jest tests |
| **test:coverage** | `npm run test:coverage` | Run tests with coverage |
| **test:watch** | `npm test -- --watch` | Run tests in watch mode |

### Utilities

| Script | Command | Description |
|--------|----------|-------------|
| **reset-project** | `npm run reset-project` | Reset the project |

## Tool Configuration

### VS Code (recommended)

Recommended extensions:
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "expo.vscode-expo-tools",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

VS Code settings (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

### TypeScript Configuration

The project uses TypeScript in strict mode. Configuration in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### ESLint Configuration

ESLint uses the Expo Universe configuration:
```javascript
module.exports = {
  extends: ['expo', 'universe'],
  // ...
}
```

### Prettier Configuration

Prettier automatically formats code:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100
}
```

## Troubleshooting

### Common Issues

#### 1. "Metro bundler cannot start"

```bash
# Clear cache
npx expo start --clear

# Or delete cache folders
rm -rf .expo node_modules
npm install
```

#### 2. "Network error" during API call

Check:
- Backend is started
- URL in `.env` is correct
- For Android emulator: use `10.0.2.2:3000` instead of `localhost:3000`

```env
# For Android emulator
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000
```

#### 3. "Unable to resolve module"

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Restart with cache clear
npx expo start --clear
```

#### 4. TypeScript errors

```bash
# Check configuration
npx tsc --noEmit

# Rebuild
npm run dev
```

#### 5. Android Studio doesn't detect emulator

```bash
# Check environment variables
echo $ANDROID_HOME
# Should point to Android SDK

# Add to ~/.bashrc or ~/.zshrc
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Logs and Debugging

```bash
# View complete logs
npx expo start --dev-client

# Android logs
adb logcat

# iOS logs
xcrun simctl spawn booted log stream
```

## Next Steps

Once installation is successful:

1. **Explore the app**: Test different features
2. **Read the documentation**:
   - [Architecture](./ARCHITECTURE.md) - Understand the structure
3. **Create your first feature**: Follow project conventions

## Useful Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Need help?** Check [Troubleshooting](#troubleshooting) or contact the development team.

**Next step**: [Testing Guide](./TESTING.md)
