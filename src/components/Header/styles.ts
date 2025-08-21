import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    header: {
      backgroundColor: "#fff",
      paddingVertical: 20,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#e0e0e0",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14,
      color: "#666",
      fontStyle: "italic",
    },
    navigation: {
      flexDirection: "row",
      backgroundColor: "#fff",
      borderBottomWidth: 1,
      borderBottomColor: "#e0e0e0",
    },
    navButton: {
      flex: 1,
      paddingVertical: 16,
      alignItems: "center",
      borderBottomWidth: 3,
      borderBottomColor: "transparent",
    },
    navButtonActive: {
      borderBottomColor: "#4caf50",
    },
    navButtonText: {
      fontSize: 16,
      fontWeight: "500",
      color: "#666",
    },
    navButtonTextActive: {
      color: "#4caf50",
      fontWeight: "bold",
    },
  });
  