/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    headerBackground: 'rgb(242, 242, 242)',
    tint: tintColorLight,
    border: '#D3D3D3',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    primary: "#f1d12c",
    primaryBackground: "#ea7a04",
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    headerBackground: 'rgb(1, 1, 1)',
    tint: tintColorDark,
    border: '#F3F3F3',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primary: "#0086e2",
    primaryBackground: "#00459f",
  },
};
