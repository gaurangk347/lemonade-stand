import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useOrder } from "../../context/OrderContext";
import { Order, OrderStatus } from "../../types";

type RouteParams = {
  OrderTracking: {
    orderId: string;
  };
};

const statusMessages: Record<OrderStatus, string> = {
  pending: "Your order has been received",
  confirmed: "Your order has been confirmed",
  preparing: "Your drinks are being prepared",
  ready: "Your order is ready for pickup",
  out_for_delivery: "Your order is on its way",
  delivered: "Your order has been delivered",
  cancelled: "Your order has been cancelled",
};

const statusOrder: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
];

export const OrderTracking = () => {
  const route = useRoute<RouteProp<RouteParams, "OrderTracking">>();
  const { orderId } = route.params;
  const { trackOrder, currentTrackedOrder, loading, error } = useOrder();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrder = async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    }

    try {
      const orderData = await trackOrder(orderId);
      if (!orderData) {
        throw new Error("Order not found");
      }
    } catch (err) {
      console.error("Error fetching order:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (currentTrackedOrder?.id !== orderId) {
      fetchOrder();
    }

    const interval = setInterval(() => fetchOrder(true), 30000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading && !isRefreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  if (error || !currentTrackedOrder || currentTrackedOrder.id !== orderId) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || "Order not found"}</Text>
        <TouchableOpacity
          onPress={() => fetchOrder()}
          style={styles.retryButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.retryButtonText}>Retry</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  const currentStatusIndex = statusOrder.indexOf(currentTrackedOrder.status);
  const isCancelled = currentTrackedOrder.status === "cancelled";

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.orderNumber}>
          Order #{currentTrackedOrder.confirmationNumber}
        </Text>
        <Text style={styles.statusText}>
          {statusMessages[currentTrackedOrder.status]}
        </Text>
      </View>

      <View style={styles.timelineContainer}>
        {statusOrder.map((status, index) => {
          const isComplete = index < currentStatusIndex;
          const isCurrent = index === currentStatusIndex;
          const statusItem = currentTrackedOrder.statusHistory?.find(
            (s) => s.status === status
          );

          return (
            <View key={status} style={styles.timelineItem}>
              <View style={styles.timelineDotContainer}>
                <View
                  style={[
                    styles.timelineDot,
                    isComplete || isCurrent
                      ? styles.timelineDotComplete
                      : styles.timelineDotIncomplete,
                  ]}
                >
                  {isComplete && <Text style={styles.checkmark}>✓</Text>}
                </View>
                {index < statusOrder.length - 1 && (
                  <View
                    style={[
                      styles.timelineLine,
                      isComplete
                        ? styles.timelineLineComplete
                        : styles.timelineLineIncomplete,
                    ]}
                  />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineStatus}>
                  {status.replace(/_/g, " ")}
                </Text>
                {statusItem?.message && (
                  <Text style={styles.timelineMessage}>
                    {statusItem.message}
                  </Text>
                )}
                {statusItem?.timestamp && (
                  <Text style={styles.timelineTime}>
                    {new Date(statusItem.timestamp).toLocaleString()}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.orderSummary}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        {currentTrackedOrder.items.map((item) => (
          <View key={item.id} style={styles.orderItem}>
            <View style={styles.orderItemInfo}>
              <Text style={styles.itemName}>{item.beverageName}</Text>
              <Text style={styles.itemSize}>{item.sizeName}</Text>
            </View>
            <Text style={styles.itemPrice}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalAmount}>
            ${currentTrackedOrder.total.toFixed(2)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  orderNumber: {
    fontSize: 16,
    color: "#6c757d",
    marginBottom: 4,
  },
  statusText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212529",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6c757d",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  errorText: {
    fontSize: 16,
    color: "#dc3545",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  timelineContainer: {
    padding: 20,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  timelineDotContainer: {
    width: 24,
    alignItems: "center",
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  timelineDotComplete: {
    backgroundColor: "#4CAF50",
  },
  timelineDotIncomplete: {
    backgroundColor: "#e9ecef",
    borderWidth: 2,
    borderColor: "#adb5bd",
  },
  checkmark: {
    color: "#fff",
    fontWeight: "bold",
  },
  timelineLine: {
    flex: 1,
    width: 2,
    marginVertical: 4,
  },
  timelineLineComplete: {
    backgroundColor: "#4CAF50",
  },
  timelineLineIncomplete: {
    backgroundColor: "#e9ecef",
  },
  timelineContent: {
    flex: 1,
    marginLeft: 16,
    paddingBottom: 20,
  },
  timelineStatus: {
    fontSize: 16,
    fontWeight: "500",
    color: "#212529",
    textTransform: "capitalize",
  },
  timelineMessage: {
    fontSize: 14,
    color: "#6c757d",
    marginTop: 2,
  },
  timelineTime: {
    fontSize: 12,
    color: "#adb5bd",
    marginTop: 2,
  },
  orderSummary: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#212529",
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  orderItemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    color: "#212529",
  },
  itemSize: {
    fontSize: 14,
    color: "#6c757d",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "500",
    color: "#212529",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212529",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
});
