import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      backgroundColor: "#f8f9fa",
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      borderLeftWidth: 4,
      borderLeftColor: "#4caf50",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 4,
    },
    name: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
      flex: 1,
    },
    removeButton: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: "#ff5252",
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 8,
    },
    removeButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#fff",
      lineHeight: 20,
    },
    size: {
      fontSize: 14,
      color: "#666",
      marginBottom: 2,
    },
    price: {
      fontSize: 14,
      color: "#666",
      marginBottom: 8,
    },
    quantityRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    quantityLabel: {
      fontSize: 14,
      color: "#333",
      fontWeight: "500",
    },
    quantityControls: {
      flexDirection: "row",
      alignItems: "center",
    },
    quantityButton: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: "#ddd",
      justifyContent: "center",
      alignItems: "center",
    },
    quantityButtonText: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#333",
    },
    quantityButtonDisabled: {
      color: "#ccc",
    },
    quantityText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
      marginHorizontal: 12,
      minWidth: 20,
      textAlign: "center",
    },
    subtotalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    subtotalLabel: {
      fontSize: 14,
      color: "#333",
      fontWeight: "500",
    },
    subtotalAmount: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#4caf50",
    },
  });
  