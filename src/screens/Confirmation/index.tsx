import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { commonStyles } from "../styles";

export interface ConfirmationProps {
  confirmationNumber: string;
  onNewOrder: () => void;
  testID?: string;
}

export const Confirmation: React.FC<ConfirmationProps> = ({
  confirmationNumber,
  onNewOrder,
  testID,
}) => {
  return (
    <View style={styles.confirmationContainer} testID={testID}>
      <View style={styles.confirmationCard}>
        <Text style={styles.confirmationIcon}>✅</Text>
        <Text style={styles.confirmationTitle}>Thank You For Your Order!</Text>
        <Text style={styles.confirmationMessage}>
          Thank you for your order. We're preparing your delicious beverages
          now!
        </Text>

        <View style={styles.confirmationDetails}>
          <Text style={styles.confirmationLabel}>Confirmation Number:</Text>
          <Text style={styles.confirmationNumber} testID="confirmation-number">
            {confirmationNumber}
          </Text>
        </View>

        <Text style={styles.confirmationNote}>
          Please save this confirmation number for your records. Your order will
          be ready for pickup in 5-10 minutes.
        </Text>

        <TouchableOpacity
          style={styles.newOrderButton}
          onPress={onNewOrder}
          testID="new-order-button"
        >
          <Text style={styles.newOrderButtonText}>Start New Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  confirmationContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  confirmationCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmationIcon: {
    fontSize: 50,
    marginBottom: 15,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  confirmationMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24,
  },
  confirmationDetails: {
    width: "100%",
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  confirmationLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  confirmationNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  confirmationNote: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 20,
  },
  newOrderButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },
  newOrderButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Confirmation;
