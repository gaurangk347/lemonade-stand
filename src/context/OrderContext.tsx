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
  | { type: "CALCULATE_TOTAL" };

// State type
interface OrderState {
  currentOrder: Order;
  orderHistory: Order[];
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
};

const initialState: OrderState = {
  currentOrder: initialOrder,
  orderHistory: [],
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

  const addItem = useCallback((item: Omit<OrderItem, "id" | "subtotal">) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { itemId } });
  }, []);

  const updateItemQuantity = useCallback((itemId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { itemId, quantity } });
  }, []);

  const updateCustomer = useCallback((customer: Customer) => {
    dispatch({ type: "UPDATE_CUSTOMER", payload: customer });
  }, []);

  const MAX_RETRY_ATTEMPTS = 3;
  const INITIAL_RETRY_DELAY = 1000; // 1 second

  const submitOrder = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    let attempt = 0;
    let lastError: Error | null = null;

    const isTransientError = (error: Error): boolean => {
      const transientErrors = [
        "network error",
        "timeout",
        "server error",
        "service unavailable",
        "try again",
        "rate limit",
      ];

      const errorMessage = error.message.toLowerCase();
      return transientErrors.some((term) => errorMessage.includes(term));
    };

    const calculateBackoff = (attempt: number): number => {
      // Exponential backoff with jitter
      const baseDelay = Math.min(
        INITIAL_RETRY_DELAY * Math.pow(2, attempt),
        10000
      );
      const jitter = Math.random() * 1000; // Add up to 1s of jitter
      return baseDelay + jitter;
    };

    while (attempt < MAX_RETRY_ATTEMPTS) {
      try {
        const response: ApiResponse<Order> = await api.post(
          "/api/orders",
          state.currentOrder
        );

        if (response.success && response.data) {
          dispatch({ type: "ORDER_SUBMITTED", payload: response.data });
          dispatch({ type: "SET_LOADING", payload: false });
          return {
            confirmationNumber: response.data.confirmationNumber || null,
            error: null,
          };
        } else {
          dispatch({ type: "SET_LOADING", payload: false });
          throw new Error(response.message || "Failed to submit order");
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // If it's not a transient error or we've reached max attempts, break the retry loop
        if (
          !isTransientError(lastError) ||
          attempt === MAX_RETRY_ATTEMPTS - 1
        ) {
          break;
        }

        // Calculate backoff and wait before retrying
        const backoff = calculateBackoff(attempt);
        await new Promise((resolve) => setTimeout(resolve, backoff));
        attempt++;
      }
    }

    // If we get here, all attempts failed
    const errorMessage = lastError?.message || "An unexpected error occurred";
    const isNetworkError = lastError?.message
      ?.toLowerCase()
      .includes("network");
    const userFriendlyMessage = isNetworkError
      ? "Unable to connect to the server. Please check your internet connection and try again."
      : `Failed to submit order: ${errorMessage}`;

    const isRetryable = isTransientError(lastError || new Error(""));

    dispatch({
      type: "SET_ERROR",
      payload: userFriendlyMessage,
      meta: {
        originalError: errorMessage,
        isRetryable,
      },
    });

    // Make sure to set loading to false when done
    dispatch({ type: "SET_LOADING", payload: false });

    const result: {
      confirmationNumber: string | null;
      error: string | null;
      originalError?: string;
      isRetryable?: boolean;
    } = {
      confirmationNumber: null,
      error: userFriendlyMessage,
      originalError: errorMessage,
      isRetryable,
    };

    return result;
  }, [state.currentOrder]);

  const clearOrder = useCallback(() => {
    dispatch({ type: "CLEAR_ORDER" });
  }, []);

  const calculateTotal = useCallback((): number => {
    return calculateOrderTotal(state.currentOrder.items);
  }, [state.currentOrder.items]);

  const value: OrderContextType = {
    currentOrder: state.currentOrder,
    orderHistory: state.orderHistory,
    loading: state.loading,
    error: state.error,
    addItem,
    removeItem,
    updateItemQuantity,
    updateCustomer,
    submitOrder,
    clearOrder,
    calculateTotal,
  };

  return <OrderContext value={value}>{children}</OrderContext>;
};

// Custom hook
export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
