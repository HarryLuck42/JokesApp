import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Appearance } from "react-native";

import { Colors } from "@/constants/Colors";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = Appearance.getColorScheme();

  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    black: require("../assets/fonts/FiraSans-Black.ttf"),
    blackItalic: require("../assets/fonts/FiraSans-BlackItalic.ttf"),
    extraBold: require("../assets/fonts/FiraSans-ExtraBold.ttf"),
    extraBoldItalic: require("../assets/fonts/FiraSans-ExtraBold.ttf"),
    bold: require("../assets/fonts/FiraSans-Bold.ttf"),
    boldItalic: require("../assets/fonts/FiraSans-BoldItalic.ttf"),
    semiBold: require("../assets/fonts/FiraSans-SemiBold.ttf"),
    semiBoldItalic: require("../assets/fonts/FiraSans-SemiBoldItalic.ttf"),
    medium: require("../assets/fonts/FiraSans-Medium.ttf"),
    mediumItalic: require("../assets/fonts/FiraSans-MediumItalic.ttf"),
    regular: require("../assets/fonts/FiraSans-Regular.ttf"),
    italic: require("../assets/fonts/FiraSans-Italic.ttf"),
    light: require("../assets/fonts/FiraSans-Light.ttf"),
    lightItalic: require("../assets/fonts/FiraSans-LightItalic.ttf"),
    extraLight: require("../assets/fonts/FiraSans-ExtraLight.ttf"),
    extraLightItalic: require("../assets/fonts/FiraSans-ExtraLightItalic.ttf"),
    thin: require("../assets/fonts/FiraSans-Thin.ttf"),
    thinItalic: require("../assets/fonts/FiraSans-ThinItalic.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: theme.headerBackground },
            headerTintColor: theme.text,
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen
            name="index"
            options={{ headerShown: false, title: "Home" }}
          />
          <Stack.Screen
            name="[category]/index"
            options={{
              headerShown: true,
              title: "Categories",
              headerTitle: "Joke Categories",
            }}
          />
          <Stack.Screen
            name="contact"
            options={{
              headerShown: true,
              title: "Contact",
              headerTitle: "Contact Us",
            }}
          />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>
      </GestureHandlerRootView>
    </Provider>
  );
}
