import 'react-native-gesture-handler/jestSetup';

// Supprimer les warnings de console pour les tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  // Mock value pour Animated
  class MockAnimatedValue {
    constructor(value: number) {
      this._value = value;
    }
    setValue = jest.fn();
    setOffset = jest.fn();
    flattenOffset = jest.fn();
    extractOffset = jest.fn();
    addListener = jest.fn(() => '1');
    removeListener = jest.fn();
    removeAllListeners = jest.fn();
    stopAnimation = jest.fn();
    resetAnimation = jest.fn();
    interpolate = jest.fn(() => this);
    animate = jest.fn();
    _isUsingNativeDriver = () => false;
  }

  // Mock pour les animations
  const mockAnimation = {
    start: jest.fn((callback) => {
      if (callback) callback({ finished: true });
    }),
    stop: jest.fn(),
    reset: jest.fn(),
    _isUsingNativeDriver: () => false,
  };

  RN.Animated.Value = MockAnimatedValue;
  RN.Animated.ValueXY = class MockValueXY {
    x = new MockAnimatedValue(0);
    y = new MockAnimatedValue(0);
  };

  RN.Animated.timing = jest.fn(() => mockAnimation);
  RN.Animated.spring = jest.fn(() => mockAnimation);
  RN.Animated.decay = jest.fn(() => mockAnimation);
  RN.Animated.sequence = jest.fn(() => mockAnimation);
  RN.Animated.parallel = jest.fn(() => mockAnimation);
  RN.Animated.stagger = jest.fn(() => mockAnimation);
  RN.Animated.loop = jest.fn(() => mockAnimation);

  RN.Animated.createAnimatedComponent = (Component: any) => Component;

  return RN;
});

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn(({ children }) => children),
    SafeAreaView: jest.fn(({ children }) => children),
    useSafeAreaInsets: jest.fn(() => inset),
  };
});

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      dispatch: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

jest.mock('react-native-paper', () => {
  const RealModule = jest.requireActual('react-native-paper');
  const React = require('react');
  return {
    ...RealModule,
    PaperProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement('View', {}, children),
  };
});

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    Ionicons: (props: any) => React.createElement('Text', {}, `Icon: ${props.name}`),
  };
});

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));
