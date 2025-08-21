import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import { StatusBar, useColorScheme, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { BeverageProvider } from "./context/BeverageContext";
import { OrderProvider } from "./context/OrderContext";
import { Navigation } from "./screens";

// Load assets
const assets = [
  require("./assets/newspaper.png"),
  require("./assets/bell.png"),
];

// Preload assets
const loadAssets = async () => {
  await Promise.all(assets.map((asset) => Asset.loadAsync(asset)));
};

// Initialize the app
const AppContent: React.FC = () => {
  const [isReady, setIsReady] = React.useState(false);
  const colorScheme = useColorScheme();
  const theme = {
    ...(colorScheme === "dark" ? DarkTheme : DefaultTheme),
    colors: {
      ...(colorScheme === "dark" ? DarkTheme.colors : DefaultTheme.colors),
      background: "#f5f5f5", // Set your desired background color
    },
  };

  React.useEffect(() => {
    async function prepare() {
      try {
        await loadAssets();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer theme={theme}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
          backgroundColor="transparent"
          translucent
        />
        <Navigation />
        <Toast />
      </SafeAreaView>
    </NavigationContainer>
  );
};

// Main App Component with Providers
export function App() {
  return (
    <SafeAreaProvider>
      <BeverageProvider>
        <OrderProvider>
          <AppContent />
        </OrderProvider>
      </BeverageProvider>
    </SafeAreaProvider>
  );
}
