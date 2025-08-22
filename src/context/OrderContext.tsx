import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from "react";
import {
  Order,
  OrderItem,
  Customer,
  OrderContextType,
  ApiResponse,
} from "../types";
import { api } from "../services/mockApi";
import {
  calculateItemSubtotal,
  calculateOrderTotal,
  sanitizeCustomerData,
} from "../utils/validation";

// Action types
type OrderAction =
  | { type: "ADD_ITEM"; payload: Omit<OrderItem, "id" | "subtotal"> }
  | { type: "REMOVE_ITEM"; payload: { itemId: string } }
  | { type: "UPDATE_QUANTITY"; payload: { itemId: string; quantity: number } }
  | { type: "UPDATE_CUSTOMER"; payload: Customer }
  | { type: "SET_LOADING"; payload: boolean }
  | {
      type: "SET_ERROR";
      payload: string | null;
      meta?: {
        originalError?: string;
        isRetryable?: boolean;
        code?: string;
      };
    }
  | { type: "ORDER_SUBMITTED"; payload: Order }
  | { type: "CLEAR_ORDER" }
  | { type: "CALCULATE_TOTAL" }
  | { type: "SUBMIT_ORDER_START" }
  | { type: "SUBMIT_ORDER_SUCCESS"; payload: Order }
  | { type: "SUBMIT_ORDER_FAILURE"; payload: string }
  | { type: "SET_ORDERS"; payload: Order[] }
  | { type: "SET_CURRENT_TRACKED_ORDER"; payload: Order | null };

// State type
interface OrderState {
  currentOrder: Order;
  orderHistory: Order[];
  orders: Order[]; // For order history
  currentTrackedOrder: Order | null; // For order tracking
  loading: boolean;
  error: string | null;
  errorMetadata?: {
    originalError?: string;
    isRetryable?: boolean;
    code?: string;
  };
}

// Initial state
const initialOrder: Order = {
  items: [],
  customer: { name: "", email: "", phone: "" },
  total: 0,
  status: "pending",
  id: "",
  statusHistory: [],
  createdAt: "",
  updatedAt: "",
  confirmationNumber: "",
};

const initialState: OrderState = {
  currentOrder: initialOrder,
  orderHistory: [],
  orders: [],
  currentTrackedOrder: null,
  loading: false,
  error: null,
};

// Reducer
const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        errorMetadata: action.meta,
      };

    case "ADD_ITEM": {
      const newItem: OrderItem = {
        ...action.payload,
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        subtotal: calculateItemSubtotal(
          action.payload.price,
          action.payload.quantity
        ),
      };

      // Check if item with same beverage and size already exists
      const existingItemIndex = state.currentOrder.items.findIndex(
        (item) =>
          item.beverageId === newItem.beverageId &&
          item.sizeId === newItem.sizeId
      );

      let updatedItems: OrderItem[];

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        updatedItems = state.currentOrder.items.map((item, index) => {
          if (index === existingItemIndex) {
            const newQuantity = item.quantity + newItem.quantity;
            return {
              ...item,
              quantity: newQuantity,
              subtotal: calculateItemSubtotal(item.price, newQuantity),
            };
          }
          return item;
        });
      } else {
        // Add new item
        updatedItems = [...state.currentOrder.items, newItem];
      }

      const updatedOrder = {
        ...state.currentOrder,
        items: updatedItems,
        total: calculateOrderTotal(updatedItems),
      };

      return {
        ...state,
        currentOrder: updatedOrder,
        error: null,
      };
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.currentOrder.items.filter(
        (item) => item.id !== action.payload.itemId
      );

      const updatedOrder = {
        ...state.currentOrder,
        items: updatedItems,
        total: calculateOrderTotal(updatedItems),
      };

      return {
        ...state,
        currentOrder: updatedOrder,
        error: null,
      };
    }

    case "UPDATE_QUANTITY": {
      const { itemId, quantity } = action.payload;

      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        return orderReducer(state, {
          type: "REMOVE_ITEM",
          payload: { itemId },
        });
      }

      const updatedItems = state.currentOrder.items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity,
            subtotal: calculateItemSubtotal(item.price, quantity),
          };
        }
        return item;
      });

      const updatedOrder = {
        ...state.currentOrder,
        items: updatedItems,
        total: calculateOrderTotal(updatedItems),
      };

      return {
        ...state,
        currentOrder: updatedOrder,
        error: null,
      };
    }

    case "UPDATE_CUSTOMER": {
      const sanitizedCustomer = sanitizeCustomerData(action.payload);

      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          customer: sanitizedCustomer,
        },
        error: null,
      };
    }

    case "ORDER_SUBMITTED": {
      return {
        ...state,
        orderHistory: [...state.orderHistory, action.payload],
        currentOrder: initialOrder,
        loading: false,
        error: null,
      };
    }

    case "CLEAR_ORDER": {
      return {
        ...state,
        currentOrder: initialOrder,
        error: null,
      };
    }

    case "CALCULATE_TOTAL": {
      const updatedOrder = {
        ...state.currentOrder,
        total: calculateOrderTotal(state.currentOrder.items),
      };

      return {
        ...state,
        currentOrder: updatedOrder,
        loading: false,
      };
    }

    case "SUBMIT_ORDER_START":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "SUBMIT_ORDER_SUCCESS":
      return {
        ...state,
        orderHistory: [...state.orderHistory, action.payload],
        currentOrder: initialOrder,
        loading: false,
        error: null,
      };

    case "SUBMIT_ORDER_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "SET_CURRENT_TRACKED_ORDER": {
      return {
        ...state,
        currentTrackedOrder: action.payload,
      };
    }

    default:
      return state;
  }
};

// Context
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Provider component
interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  // Get all orders  // Fetch customer orders by email or phone
  const getCustomerOrders = useCallback(
    async (
      identifier?: string | { email?: string; phone?: string }
    ): Promise<Order[]> => {
      try {
        dispatch({ type: "SET_ERROR", payload: null });

        // Handle both string (email) and object (email/phone) parameters
        const params =
          typeof identifier === "string"
            ? { email: identifier }
            : identifier || {};

        // Call the mock API directly
        const response = await api.get("/api/orders");

        if (!response.success) {
          throw new Error(response.message || "Failed to fetch orders");
        }

        const orders = (response.data || []) as Order[];
        dispatch({ type: "SET_ORDERS", payload: orders });
        return orders;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch orders";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        return [];
      }
    },
    []
  );

  // Add item to order
  const addItem = useCallback((item: Omit<OrderItem, "id" | "subtotal">) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  }, []);

  // Remove item from order
  const removeItem = useCallback((itemId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { itemId } });
  }, []);

  // Update item quantity
  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (quantity < 1) {
        removeItem(itemId);
        return;
      }
      dispatch({ type: "UPDATE_QUANTITY", payload: { itemId, quantity } });
    },
    [removeItem]
  );

  // Update customer information
  const updateCustomer = useCallback((customer: Customer) => {
    dispatch({ type: "UPDATE_CUSTOMER", payload: customer });
  }, []);

  // Submit the current order
  const submitOrder = useCallback(async (): Promise<Order | null> => {
    try {
      dispatch({ type: "SUBMIT_ORDER_START" });

      // Call the mock API directly
      const response = await api.post("/api/orders", state.currentOrder);

      if (!response.success) {
        throw new Error(response.message || "Failed to submit order");
      }

      const submittedOrder = response.data;
      if (!submittedOrder) {
        throw new Error("No order data returned from server");
      }

      dispatch({ type: "SUBMIT_ORDER_SUCCESS", payload: submittedOrder });
      return submittedOrder;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to submit order";
      dispatch({ type: "SUBMIT_ORDER_FAILURE", payload: errorMessage });
      return null;
    }
  }, [state.currentOrder]);

  // Clear the current order
  const clearOrder = useCallback(() => {
    dispatch({ type: "CLEAR_ORDER" });
  }, []);

  // Track an order by ID or confirmation number
  const trackOrder = useCallback(
    async (identifier?: string): Promise<Order | null> => {
      if (!identifier) {
        dispatch({
          type: "SET_ERROR",
          payload: "No order identifier provided",
        });
        return null;
      }
      try {
        dispatch({ type: "SET_CURRENT_TRACKED_ORDER", payload: null });
        dispatch({ type: "SET_ERROR", payload: null });

        let order: Order | null = null;

        // First try by order ID
        try {
          const response = (await api.get(
            `/api/orders/${identifier}`
          )) as ApiResponse<Order>;

          console.log("response: ", JSON.stringify(response));
          if (response.success && response.data) {
            order = response.data;
          }
        } catch (error) {
          // Ignore error and try confirmation number
        }

        if (!order) {
          throw new Error("Order not found");
        }

        dispatch({ type: "SET_CURRENT_TRACKED_ORDER", payload: order });
        return order;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch order";

        dispatch({
          type: "SET_ERROR",
          payload: errorMessage,
        });
        return null;
      }
    },
    []
  );

  return (
    <OrderContext.Provider
      value={{
        // Order state
        currentOrder: state.currentOrder,
        orders: state.orders,
        currentTrackedOrder: state.currentTrackedOrder,
        loading: state.loading,
        error: state.error,

        // Order actions
        addItem,
        removeItem,
        updateQuantity,
        updateCustomer,
        submitOrder,
        clearOrder,

        // Order tracking
        trackOrder,
        getCustomerOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook
export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
