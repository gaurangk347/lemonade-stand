import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import { useOrder } from "../../context/OrderContext";
import { Order } from "../../types";

export const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getCustomerOrders, currentOrder } = useOrder();
  const navigation = useNavigation();

  const fetchOrders = async () => {
    try {
      setRefreshing(true);
      // Get email from the current order's customer info if available
      const userEmail = currentOrder.customer?.email;

      // Get orders, passing email only if it exists
      const orders = await getCustomerOrders(userEmail || undefined);
      setOrders(orders);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load order history");
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => navigation.navigate("OrderTracking", { orderId: item.id })}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>
          Order #
          {item.confirmationNumber || item.id?.substring(0, 8).toUpperCase()}
        </Text>
        <Text
          style={[
            styles.orderStatus,
            item.status === "cancelled" && styles.statusCancelled,
            item.status === "delivered" && styles.statusDelivered,
          ]}
        >
          {item.status
            .split("_")
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </Text>
      </View>
      <Text style={styles.orderDate}>
        {item.createdAt
          ? format(new Date(item.createdAt), "MMM d, yyyy h:mm a")
          : "N/A"}
      </Text>
      <Text style={styles.orderTotal}>${item.total?.toFixed(2)}</Text>
      <Text style={styles.trackText}>Tap to track →</Text>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading order history...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchOrders}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Orders</Text>
      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No orders found</Text>
          <Text style={styles.emptySubtext}>
            Your order history will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id || String(Math.random())}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchOrders}
              colors={["#4CAF50"]}
              tintColor="#4CAF50"
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    color: "#666",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  orderItem: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderNumber: {
    fontWeight: "600",
    fontSize: 16,
  },
  orderStatus: {
    textTransform: "capitalize",
    color: "#4CAF50",
    fontWeight: "500",
  },
  statusCancelled: {
    color: "#F44336",
  },
  statusDelivered: {
    color: "#2196F3",
  },
  orderDate: {
    color: "#757575",
    marginBottom: 4,
  },
  orderTotal: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 8,
  },
  trackText: {
    color: "#4CAF50",
    marginTop: 8,
    textAlign: "right",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  emptySubtext: {
    color: "#757575",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  errorText: {
    color: "#F44336",
    textAlign: "center",
    margin: 20,
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    margin: 20,
    alignItems: "center",
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default OrderHistory;
