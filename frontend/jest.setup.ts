import 'react-native-gesture-handler/jestSetup';

global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

jest.mock('axios', () => {
  const mockAxiosInstance = {
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
    interceptors: {
      request: {
        use: jest.fn(),
        eject: jest.fn(),
      },
      response: {
        use: jest.fn(),
        eject: jest.fn(),
      },
    },
  };

  return {
    default: {
      create: jest.fn(() => mockAxiosInstance),
      ...mockAxiosInstance,
    },
    create: jest.fn(() => mockAxiosInstance),
  };
});

jest.mock('@/services/api', () => {
  const mockApiClient = {
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
    interceptors: {
      request: {
        use: jest.fn(),
        eject: jest.fn(),
      },
      response: {
        use: jest.fn(),
        eject: jest.fn(),
      },
    },
  };

  class MockEventEmitter {
    private listeners: { [key: string]: Array<() => void> } = {};
    on(event: string, callback: () => void) {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
      this.listeners[event].push(callback);
    }
    off(event: string, callback: () => void) {
      if (!this.listeners[event]) return;
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
    }
    emit(event: string) {
      if (!this.listeners[event]) return;
      this.listeners[event].forEach((callback) => callback());
    }
  }

  return {
    apiClient: mockApiClient,
    authEventEmitter: new MockEventEmitter(),
    catalogEventEmitter: new MockEventEmitter(),
    default: mockApiClient,
  };
});

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

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

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
  })),
  useLocalSearchParams: jest.fn(() => ({})),
  useSegments: jest.fn(() => []),
  usePathname: jest.fn(() => '/'),
  Link: ({ children }: any) => children,
  Redirect: () => null,
  Stack: ({ children }: any) => children,
  Tabs: ({ children }: any) => children,
}));

jest.mock('expo-image', () => {
  const React = require('react');
  return {
    Image: (props: any) => React.createElement('Image', props),
  };
});

jest.mock('expo-web-browser', () => ({
  openBrowserAsync: jest.fn(() => Promise.resolve({ type: 'cancel' })),
}));

