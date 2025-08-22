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

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'ready' 
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderStatusUpdate {
  status: OrderStatus;
  timestamp: string;
  message?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  customer: Customer;
  total: number;
  status: OrderStatus;
  statusHistory: OrderStatusUpdate[];
  createdAt: string;
  updatedAt: string;
  confirmationNumber: string;
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
  // Current order being built
  currentOrder: Order;
  // List of past orders
  orders: Order[];
  // Currently tracked order (for order tracking screen)
  currentTrackedOrder: Order | null;
  loading: boolean;
  error: string | null;
  
  // Order building methods
  addItem: (item: Omit<OrderItem, 'id' | 'subtotal'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateCustomer: (customer: Customer) => void;
  submitOrder: () => Promise<Order | null>;
  clearOrder: () => void;
  
  // Order tracking methods
  trackOrder: (orderId: string) => Promise<Order | null>;
  getCustomerOrders: (email?: string) => Promise<Order[]>;
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