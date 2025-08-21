import React, { useState, useRef } from "react";
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { BeverageCard } from "../../components/BeverageCard";
import { styles } from "./styles";
import { commonStyles } from "../styles";

interface BeverageListProps {
  beverages: any[];
  beveragesLoading: boolean;
  beveragesError: string | null;
  currentOrder: any;
  refreshBeverages: () => void;
  onViewOrder: () => void;
}

export const BeverageList: React.FC<BeverageListProps> = ({
  beverages,
  beveragesLoading,
  beveragesError,
  currentOrder,
  refreshBeverages,
  onViewOrder,
}) => {
  const [selectedBeverageId, setSelectedBeverageId] = useState<string | null>(
    null
  );
  const scrollViewRef = useRef<ScrollView>(null);
  const cardRefs = useRef<{ [key: string]: any }>({});

  const handleRetryBeverages = () => {
    refreshBeverages();
  };

  const handleBeverageSelect = (id: string | null) => {
    setSelectedBeverageId(id);
  };

  if (beveragesLoading && beverages.length === 0) {
    return (
      <View style={commonStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#4caf50" />
        <Text style={commonStyles.loadingText}>
          Loading delicious beverages...
        </Text>
      </View>
    );
  }

  if (beveragesError) {
    return (
      <View style={commonStyles.errorContainer}>
        <Text style={commonStyles.errorTitle}>Oops! Something went wrong</Text>
        <Text style={commonStyles.errorMessage}>{beveragesError}</Text>
        <TouchableOpacity
          style={commonStyles.retryButton}
          onPress={handleRetryBeverages}
          testID="retry-button"
        >
          <Text style={commonStyles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.baverageListContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={beveragesLoading}
          onRefresh={refreshBeverages}
          colors={["#4caf50"]}
          tintColor="#4caf50"
        />
      }
      ref={scrollViewRef}
    >
      <Text style={styles.sectionTitle}>Our Fresh Beverages</Text>
      <Text style={styles.sectionSubtitle}>
        All beverages made fresh to order with premium ingredients
      </Text>

      {beverages.map((beverage) => (
        <View
          key={beverage.id}
          ref={(ref) => {
            if (ref) {
              cardRefs.current[beverage.id] = ref;
            } else {
              delete cardRefs.current[beverage.id];
            }
          }}
        >
          <BeverageCard
            beverage={beverage}
            testID={`beverage-${beverage.id}`}
            isSelected={selectedBeverageId === beverage.id}
            onSelect={handleBeverageSelect}
          />
        </View>
      ))}
    </ScrollView>
  );
};

export default BeverageList;
