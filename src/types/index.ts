export interface BeverageSize {
  id: string;
  name: string; // e.g., "Small (8oz)", "Medium (12oz)", "Large (16oz)"
  price: number;
}

export interface Beverage {
  id: string;
  name: string;
  description: string;
  image?: string;
  sizes: BeverageSize[];
  category?: string;
}

export interface OrderItem {
  id: string;
  beverageId: string;
  beverageName: string;
  sizeId: string;
  sizeName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

export interface Customer {
  name: string;
  email?: string;
  phone?: string;
  address?: Address;
}

export interface Order {
  id?: string;
  items: OrderItem[];
  customer: Customer;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  createdAt?: string;
  confirmationNumber?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface AppError {
  message: string;
  code?: string;
  details?: any;
}

// Context types
export interface BeverageContextType {
  beverages: Beverage[];
  loading: boolean;
  error: string | null;
  fetchBeverages: () => Promise<void>;
  refreshBeverages: () => Promise<void>;
}

export interface ErrorMetadata {
  originalError?: string;
  isRetryable?: boolean;
  code?: string;
}

export interface OrderContextType {
  currentOrder: Order;
  orderHistory: Order[];
  loading: boolean;
  error: string | null;
  errorMetadata?: ErrorMetadata;
  addItem: (item: Omit<OrderItem, 'id' | 'subtotal'>) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  updateCustomer: (customer: Customer) => void;
  submitOrder: () => Promise<{
    confirmationNumber: string | null;
    error: string | null;
    originalError?: string;
    isRetryable?: boolean;
  }>;
  clearOrder: () => void;
  calculateTotal: () => number;
}

// Form types
export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CustomerFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  general?: string;
}

// Navigation types (for future use)
export type RootStackParamList = {
  Home: undefined;
  Order: undefined;
  Confirmation: { confirmationNumber: string };
};