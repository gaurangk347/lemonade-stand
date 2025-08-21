import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { Beverage, BeverageContextType, ApiResponse } from "../types";
import { api } from "../services/mockApi";

// Action types
type BeverageAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Beverage[] }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" };

// State type
interface BeverageState {
  beverages: Beverage[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: BeverageState = {
  beverages: [],
  loading: false,
  error: null,
};

// Reducer
const beverageReducer = (
  state: BeverageState,
  action: BeverageAction
): BeverageState => {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "FETCH_SUCCESS":
      return {
        ...state,
        beverages: action.payload,
        loading: false,
        error: null,
      };

    case "FETCH_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Context
const BeverageContext = createContext<BeverageContextType | undefined>(
  undefined
);

// Provider component
interface BeverageProviderProps {
  children: ReactNode;
}

export const BeverageProvider: React.FC<BeverageProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(beverageReducer, initialState);

  const fetchBeverages = useCallback(async () => {
    dispatch({ type: "FETCH_START" });

    try {
      const response: ApiResponse<Beverage[]> = await api.get("/api/beverages");

      if (response.success && response.data) {
        dispatch({ type: "FETCH_SUCCESS", payload: response.data });
      } else {
        throw new Error(response.message || "Failed to fetch beverages");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      dispatch({ type: "FETCH_ERROR", payload: errorMessage });
    }
  }, []);

  const refreshBeverages = useCallback(async () => {
    // Same as fetchBeverages but can be called explicitly for refresh
    await fetchBeverages();
  }, [fetchBeverages]);

  // Auto-fetch beverages on mount
  useEffect(() => {
    fetchBeverages();
  }, [fetchBeverages]);

  const value: BeverageContextType = {
    beverages: state.beverages,
    loading: state.loading,
    error: state.error,
    fetchBeverages,
    refreshBeverages,
  };

  return <BeverageContext value={value}>{children}</BeverageContext>;
};

// Custom hook
export const useBeverages = (): BeverageContextType => {
  const context = useContext(BeverageContext);
  if (context === undefined) {
    throw new Error("useBeverages must be used within a BeverageProvider");
  }
  return context;
};
