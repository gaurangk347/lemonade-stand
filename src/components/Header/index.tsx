import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { styles } from "./styles";

interface HeaderProps {
  currentScreen: "beverateList" | "order" | "confirmation";
  currentOrderLength: number;
  onNavigate: (screen: "beverateList" | "order") => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  currentOrderLength,
  onNavigate,
}) => {
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🍋 Digital Lemonade Stand</Text>
        <Text style={styles.headerSubtitle}>
          Fresh • Delicious • Made to Order
        </Text>
      </View>

      {currentScreen !== "confirmation" && (
        <View style={styles.navigation}>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentScreen === "beverateList" && styles.navButtonActive,
            ]}
            onPress={() => onNavigate("beverateList")}
            testID="beverateList-header"
          >
            <Text
              style={[
                styles.navButtonText,
                currentScreen === "beverateList" && styles.navButtonTextActive,
              ]}
            >
              Menu
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              currentScreen === "order" && styles.navButtonActive,
            ]}
            onPress={() => onNavigate("order")}
            testID="order-header"
          >
            <Text
              style={[
                styles.navButtonText,
                currentScreen === "order" && styles.navButtonTextActive,
              ]}
            >
              Order ({currentOrderLength})
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};
