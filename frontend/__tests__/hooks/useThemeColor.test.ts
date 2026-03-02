import { renderHook } from '@testing-library/react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: jest.fn(),
}));

const mockedUseColorScheme = useColorScheme as jest.MockedFunction<typeof useColorScheme>;

describe('useThemeColor', () => {
  it('returns color from props when light theme', () => {
    mockedUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() =>
      useThemeColor({ light: '#ffffff', dark: '#000000' }, 'text')
    );

    expect(result.current).toBe('#ffffff');
  });

  it('returns color from props when dark theme', () => {
    mockedUseColorScheme.mockReturnValue('dark');

    const { result } = renderHook(() =>
      useThemeColor({ light: '#ffffff', dark: '#000000' }, 'text')
    );

    expect(result.current).toBe('#000000');
  });

  it('returns default color when no prop provided', () => {
    mockedUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() => useThemeColor({}, 'text'));

    expect(result.current).toBeDefined();
    expect(typeof result.current).toBe('string');
  });

  it('handles null theme', () => {
    mockedUseColorScheme.mockReturnValue(null);

    const { result } = renderHook(() =>
      useThemeColor({ light: '#ffffff', dark: '#000000' }, 'text')
    );

    expect(result.current).toBe('#ffffff');
  });
});
