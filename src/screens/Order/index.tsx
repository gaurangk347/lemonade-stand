import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useOrder } from "../../context/OrderContext";
import { formatCurrency } from "../../utils/validation";
import { OrderItem as OrderItemComponent } from "../../components/OrderItem";
import { OrderItem } from "../../types";
import { styles } from "./styles";

interface OrderProps {
  onCheckout: () => void;
  testID?: string;
}

export const Order: React.FC<OrderProps> = ({ onCheckout, testID }) => {
  const { currentOrder, removeItem, updateItemQuantity } = useOrder();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateItemQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  };

  const renderOrderItem = ({ item }: { item: OrderItem }) => (
    <OrderItemComponent
      item={item}
      onRemove={handleRemoveItem}
      onQuantityChange={handleQuantityChange}
      testID={`order-item-${item.id}`}
    />
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No items in your order yet</Text>
      <Text style={styles.emptySubtext}>
        Add some delicious beverages to get started!
      </Text>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <TouchableOpacity
        style={[
          styles.checkoutButton,
          currentOrder.items.length === 0 && styles.checkoutButtonDisabled,
        ]}
        onPress={onCheckout}
        testID="checkout-button"
        disabled={currentOrder.items.length === 0}
      >
        <Text style={styles.checkoutButtonText}>
          {currentOrder.items.length > 0
            ? `Proceed to Checkout (${currentOrder.items.reduce(
                (sum, item) => sum + item.quantity,
                0
              )} items)`
            : "Add items to continue"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (currentOrder.items.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]} testID={testID}>
        <Text style={styles.emptyText}>No items in your order yet</Text>
        <Text style={styles.emptySubtext}>
          Add some delicious beverages to get started!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.content}>
        <Text style={styles.header}>Your Order</Text>

        <FlatList
          data={currentOrder.items}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
        {currentOrder.items.length > 0 && (
          <View style={styles.totalContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount} testID="order-total">
                {formatCurrency(currentOrder.total)}
              </Text>
            </View>
            <Text style={styles.itemCount}>
              {currentOrder.items.length} item
              {currentOrder.items.length !== 1 ? "s" : ""}
            </Text>
          </View>
        )}
      </View>

      {renderFooter()}
    </View>
  );
};

export default Order;
