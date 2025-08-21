import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useBeverages } from "../context/BeverageContext";
import { useOrder } from "../context/OrderContext";
import { BeverageList } from "./BeverageList";
import { Order } from "./Order";
import { Checkout } from "./Checkout";
import { Confirmation } from "./Confirmation";
import { View } from "react-native";
import { HeaderButton } from "../components/HeaderButton";

type RootStackParamList = {
  BeverageList: undefined;
  Order: undefined;
  Checkout: undefined;
  Confirmation: { confirmationNumber: string };
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
            <View style={{ marginRight: 16 }}>
              <HeaderButton
                icon="shopping-cart"
                badgeCount={currentOrder.items.reduce(
                  (total: number, item: { quantity: number }) =>
                    total + item.quantity,
                  0
                )}
                onPress={() => navigation.navigate("Order" as never)}
                testID="cart-button"
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
    </Stack.Navigator>
  );
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
