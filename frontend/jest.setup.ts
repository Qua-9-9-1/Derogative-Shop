import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
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

jest.mock('react-native/Libraries/Animated/Animated', () => {
  const ActualAnimated = jest.requireActual('react-native/Libraries/Animated/Animated');
  return {
    ...ActualAnimated,
    createAnimatedComponent: (Component: any) => Component,
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
