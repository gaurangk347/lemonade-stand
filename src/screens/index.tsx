import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useBeverages } from "../context/BeverageContext";
import { useOrder } from "../context/OrderContext";
import { BeverageList } from "./BeverageList";
import { Order } from "./Order";
import { Checkout } from "./Checkout";
import { Confirmation } from "./Confirmation";
import { OrderTracking } from "./OrderTracking";
import { OrderHistory } from "./OrderHistory";
import { View, StyleSheet } from "react-native";
import { HeaderButton } from "../components/HeaderButton";

type RootStackParamList = {
  BeverageList: undefined;
  Order: undefined;
  Checkout: undefined;
  Confirmation: { confirmationNumber: string };
  OrderTracking: { orderId: string };
  OrderHistory: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation = () => {
  const {
    beverages,
    loading: beveragesLoading,
    error: beveragesError,
    refreshBeverages,
  } = useBeverages();
  const { currentOrder, clearOrder } = useOrder();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BeverageList"
        options={({ navigation }) => ({
          headerRight: () => (
            <View style={styles.headerButtons}>
              <HeaderButton
                icon="history"
                onPress={() => navigation.navigate("OrderHistory" as never)}
                testID="order-history-button"
                style={styles.headerButton}
              />
              <HeaderButton
                icon="shopping-cart"
                badgeCount={currentOrder.items.reduce(
                  (total: number, item: { quantity: number }) =>
                    total + item.quantity,
                  0
                )}
                onPress={() => navigation.navigate("Order" as never)}
                testID="cart-button"
                style={styles.headerButton}
              />
            </View>
          ),
        })}
      >
        {({ navigation }) => (
          <BeverageList
            beverages={beverages}
            beveragesLoading={beveragesLoading}
            beveragesError={beveragesError}
            currentOrder={currentOrder}
            refreshBeverages={refreshBeverages}
            onViewOrder={() => navigation.navigate("Order" as never)}
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name="Order"
        options={{
          title: "Your Order",
        }}
      >
        {({ navigation }) => (
          <Order
            onCheckout={() => navigation.navigate("Checkout")}
            testID="order-screen"
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name="Checkout"
        options={{
          title: "Checkout",
        }}
      >
        {({ navigation }) => (
          <Checkout
            onOrderSubmitted={() => {
              navigation.navigate("Confirmation", {
                confirmationNumber: Math.random()
                  .toString(36)
                  .substr(2, 9)
                  .toUpperCase(),
              });
              clearOrder();
            }}
            testID="checkout-screen"
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name="Confirmation"
        options={{
          title: "Order Confirmation",
          headerLeft: () => null,
          gestureEnabled: false,
          headerBackVisible: false,
        }}
      >
        {({ route, navigation }) => (
          <Confirmation
            confirmationNumber={route.params.confirmationNumber}
            onNewOrder={() => {
              // Reset the navigation stack to only include BeverageList
              navigation.reset({
                index: 0,
                routes: [{ name: "BeverageList" }],
              });
              refreshBeverages();
            }}
            testID="confirmation-screen"
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="OrderTracking"
        component={OrderTracking}
        options={{
          title: "Track Order",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistory}
        options={{
          title: "Order History",
          headerBackTitle: "Back",
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: "row",
    marginRight: 8,
  },
  headerButton: {
    marginLeft: 8,
  },
});

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
