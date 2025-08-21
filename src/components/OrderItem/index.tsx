import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { OrderItem as OrderItemType } from "../../types";
import { formatCurrency } from "../../utils/validation";
import { styles } from "./styles";

interface OrderItemProps {
  item: OrderItemType;
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
  showControls?: boolean;
  testID?: string;
}

export const OrderItem: React.FC<OrderItemProps> = ({
  item,
  onRemove,
  onQuantityChange,
  showControls = true,
  testID,
}) => {
  const handleQuantityChange = (change: number) => {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      onQuantityChange(item.id, newQuantity);
    }
  };

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.header}>
        <Text style={styles.name} testID={`${testID}-name`}>
          {item.beverageName}
        </Text>
        {showControls && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onRemove(item.id)}
            testID={`${testID}-remove`}
          >
            <Text style={styles.removeButtonText}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.size} testID={`${testID}-size`}>
        {item.sizeName}
      </Text>
      <Text style={styles.price} testID={`${testID}-price`}>
        {formatCurrency(item.price)} each
      </Text>

      <View style={styles.quantityRow}>
        <Text style={styles.quantityLabel}>Quantity:</Text>
        {showControls ? (
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(-1)}
              testID={`${testID}-decrease`}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>

            <Text style={styles.quantityText} testID={`${testID}-quantity`}>
              {item.quantity}
            </Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(1)}
              disabled={item.quantity >= 99}
              testID={`${testID}-increase`}
            >
              <Text
                style={[
                  styles.quantityButtonText,
                  item.quantity >= 99 && styles.quantityButtonDisabled,
                ]}
              >
                +
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.quantityText}>{item.quantity}</Text>
        )}
      </View>

      <View style={styles.subtotalRow}>
        <Text style={styles.subtotalLabel}>Subtotal:</Text>
        <Text style={styles.subtotalAmount} testID={`${testID}-subtotal`}>
          {formatCurrency(item.subtotal)}
        </Text>
      </View>
    </View>
  );
};
