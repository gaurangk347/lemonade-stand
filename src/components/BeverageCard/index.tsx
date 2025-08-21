// src/components/BeverageCard.tsx

import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import { Beverage, BeverageSize } from "../../types";
import { useOrder } from "../../context/OrderContext";
import { formatCurrency } from "../../utils/validation";
import { styles } from "./styles";

interface BeverageCardProps {
  beverage: Beverage;
  testID?: string;
  isSelected: boolean;
  onSelect: (id: string | null) => void;
}

export const BeverageCard: React.FC<BeverageCardProps> = ({
  beverage,
  testID,
  isSelected,
  onSelect,
}) => {
  // Track selected size internally to handle toggling
  const [selectedSize, setSelectedSize] = useState<BeverageSize | null>(null);

  // Update selected size when isSelected changes from parent
  React.useEffect(() => {
    if (!isSelected) {
      setSelectedSize(null);
    }
  }, [isSelected]);
  const [quantity, setQuantity] = useState<number>(1);
  const { addItem } = useOrder();

  const handleSizeSelect = (size: BeverageSize) => {
    if (selectedSize?.id === size.id) {
      // Deselect if clicking the same size
      setSelectedSize(null);
      onSelect(null);
    } else {
      // Select new size
      setSelectedSize(size);
      onSelect(beverage.id);
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, Math.min(99, quantity + change));
    setQuantity(newQuantity);
  };

  const handleAddToOrder = () => {
    if (!selectedSize) {
      Toast.show({
        type: "error",
        text1: "Size Required",
        text2: "Please select a size before adding to order.",
        position: "bottom",
        visibilityTime: 2000,
      });
      return;
    }

    addItem({
      beverageId: beverage.id,
      beverageName: beverage.name,
      sizeId: selectedSize.id,
      sizeName: selectedSize.name,
      price: selectedSize.price,
      quantity,
    });

    // Reset selections and deselect card
    setSelectedSize(null);
    setQuantity(1);
    onSelect(null);

    Toast.show({
      type: "success",
      text1: "Added to Order",
      text2: `${quantity} ${beverage.name} (${selectedSize.name})`,
      position: "bottom",
      visibilityTime: 3000,
    });
  };

  return (
    <View
      style={[styles.card, isSelected && styles.selectedCard]}
      testID={testID}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{beverage.name}</Text>
        {beverage.category && (
          <Text style={styles.category}>{beverage.category}</Text>
        )}
      </View>

      {/* Description */}
      <Text style={styles.description}>{beverage.description}</Text>

      {/* Size Selection */}
      <Text style={styles.sectionTitle}>Select Size:</Text>
      <View style={styles.sizesContainer}>
        {beverage.sizes.map((size) => (
          <TouchableOpacity
            key={size.id}
            style={[
              styles.sizeButton,
              selectedSize?.id === size.id && styles.sizeButtonSelected,
            ]}
            onPress={() => handleSizeSelect(size)}
            testID={`size-${size.id}`}
          >
            <Text
              style={[
                styles.sizeText,
                selectedSize?.id === size.id && styles.sizeTextSelected,
              ]}
            >
              {size.name}
            </Text>
            <Text
              style={[
                styles.priceText,
                selectedSize?.id === size.id && styles.priceTextSelected,
              ]}
            >
              {formatCurrency(size.price)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quantity and Add to Order */}
      {selectedSize && (
        <View style={styles.orderSection}>
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                testID="decrease-quantity"
              >
                <Text
                  style={[
                    styles.quantityButtonText,
                    quantity <= 1 && styles.quantityButtonDisabled,
                  ]}
                >
                  −
                </Text>
              </TouchableOpacity>

              <Text style={styles.quantityText} testID="quantity-display">
                {quantity}
              </Text>

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(1)}
                disabled={quantity >= 99}
                testID="increase-quantity"
              >
                <Text
                  style={[
                    styles.quantityButtonText,
                    quantity >= 99 && styles.quantityButtonDisabled,
                  ]}
                >
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.addToOrderContainer}>
            <Text style={styles.totalText}>
              Total: {formatCurrency(selectedSize.price * quantity)}
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddToOrder}
              testID="add-to-order"
            >
              <Text style={styles.addButtonText}>Add to Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};
