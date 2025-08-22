// src/services/mockApi.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Beverage, Order, ApiResponse } from '../types';

const ORDERS_STORAGE_KEY = '@LemonadeStand:orders';

// Mock database
let orderCounter = 1000; // Global order counter
let beverages: Beverage[] = [
  {
    id: '8f3e7a6d-4c1b-9e2f-0a5d-7b6c8d9e0f1a',
    name: 'Classic Lemonade',
    description: 'Fresh squeezed lemons with a touch of sweetness',
    category: 'Lemonade',
    sizes: [
      { id: '2e4d6f8a-1b3c-5d7e-9f0a-8b7c6d5e4f3a', name: 'Small (8oz)', price: 2.50 },
      { id: '9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d', name: 'Medium (12oz)', price: 3.50 },
      { id: '0f1e2d3c-4b5a-6978-8d9e-0f1a2b3c4d5e', name: 'Large (16oz)', price: 4.50 }
    ]
  },
  {
    id: '7c6d5e4f-3a2b-1c0d-9e8f-7a6b5c4d3e2f',
    name: 'Pink Lemonade',
    description: 'Classic lemonade with a splash of cranberry',
    category: 'Lemonade',
    sizes: [
      { id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', name: 'Small (8oz)', price: 2.75 },
      { id: '8e9f0a1b-2c3d-4e5f-6a7b-8c9d0e1f2a3b', name: 'Medium (12oz)', price: 3.75 },
      { id: '4d5c6b7a-8f9e-0d1c-2b3a-4d5e6f7a8b9c', name: 'Large (16oz)', price: 4.75 }
    ]
  },
  {
    id: '3e4d5c6b-7a89-0f1e-2d3c-4b5a6d7e8f9a',
    name: 'Strawberry Lemonade',
    description: 'Fresh strawberries blended with classic lemonade',
    category: 'Fruit Lemonade',
    sizes: [
      { id: '0a9b8c7d-6e5f-4a3b-2c1d-0e9f8a7b6c5d', name: 'Small (8oz)', price: 3.00 },
      { id: '7f6e5d4c-3b2a-1c0d-9e8f-7a6b5c4d3e2f', name: 'Medium (12oz)', price: 4.00 },
      { id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', name: 'Large (16oz)', price: 5.00 }
    ]
  },
  {
    id: '9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d',
    name: 'Arnold Palmer',
    description: 'Half iced tea, half lemonade - the perfect combination',
    category: 'Tea Blend',
    sizes: [
      { id: '5d4c3b2a-1e0f-9a8b-7c6d-5e4f3a2b1c0d', name: 'Small (8oz)', price: 2.75 },
      { id: 'e9f8a7b6-c5d4-3e2f-1a0b-9c8d7e6f5a4b', name: 'Medium (12oz)', price: 3.75 },
      { id: '3c2b1a0d-9e8f-7a6b-5c4d-3e2f1a0b9c8d', name: 'Large (16oz)', price: 4.75 }
    ]
  },
  {
    id: '0f1e2d3c-4b5a-6978-8d9e-0f1a2b3c4d5e',
    name: 'Sparkling Lemonade',
    description: 'Classic lemonade with a refreshing fizz',
    category: 'Sparkling',
    sizes: [
      { id: '8a7b6c5d-4e3f-2a1b-0c9d-8e7f6a5b4c3d', name: 'Small (8oz)', price: 3.25 },
      { id: '1b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e', name: 'Medium (12oz)', price: 4.25 },
      { id: '6e5d4c3b-2a19-8f7e-6d5c-4b3a2c1d0e9f', name: 'Large (16oz)', price: 5.25 }
    ]
  },
  {
    id: '4d3e2f1a-0b9c-8d7e-6f5a-4b3c2d1e0f9a',
    name: 'Mint Lemonade',
    description: 'Refreshing lemonade with fresh mint leaves',
    category: 'Herbal',
    sizes: [
      { id: '9e8d7c6b-5a4b-3c2d-1e0f-9a8b7c6d5e4f', name: 'Small (8oz)', price: 3.25 },
      { id: '2f3e4d5c-6b7a-8d9e-0f1a-2b3c4d5e6f7a', name: 'Medium (12oz)', price: 4.25 },
      { id: '7a6b5c4d-3e2f-1a0b-9c8d-7e6f5a4b3c2d', name: 'Large (16oz)', price: 5.25 }
    ]
  }
];


const storage = {
  // Save orders to storage
  async saveOrders(ordersToSave: Order[]) {
    try {
      await AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(ordersToSave));
    } catch (error) {
      console.error('Error saving orders:', error);
      throw new Error('Failed to save orders');
    }
  },
  
  // Get orders with optional filter
  async getOrders(filterFn?: (order: Order) => boolean) {
    try {
      const savedOrders = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
      const orders = savedOrders ? JSON.parse(savedOrders) : [];
      return filterFn ? orders.filter(filterFn) : [...orders];
    } catch (error) {
      console.error('Error getting orders:', error);
      return [];
    }
  }
};

// Simulate network delay
const delay = (ms: number = 800): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// Simulate random API failures (10% chance)
const shouldSimulateFailure = (): boolean => Math.random() < 0.1;

export const mockApi = {
  // Get all beverages
  async getBeverages(): Promise<ApiResponse<Beverage[]>> {
    await delay();
    
    if (shouldSimulateFailure()) {
      throw new Error('Failed to fetch beverages. Please try again.');
    }

    return {
      data: beverages,
      success: true,
      message: 'Beverages fetched successfully'
    };
  },

  // Submit order
  async submitOrder(order: Omit<Order, 'id' | 'confirmationNumber'>): Promise<ApiResponse<Order>> {
    // Add a delay to show loading state
    await delay(1000);
    
    // 20% chance of failure for testing (reduced from 50% for better UX)
    if (Math.random() < 0.2) {
      const errors = [
        'Network error: Could not connect to server',
        'Server timeout: Please try again',
        'Temporary service disruption',
        'Failed to process payment'
      ];
      const randomError = errors[Math.floor(Math.random() * errors.length)];
      throw new Error(randomError);
    }

    // Validate order
    if (!order.items?.length) {
      throw new Error('Order must contain at least one item');
    }

    if (!order.customer?.name?.trim()) {
      throw new Error('Customer name is required');
    }

    if (!order.customer.email && !order.customer.phone) {
      throw new Error('Either email or phone number is required');
    }

    try {
      // Always get fresh orders from storage
      const currentOrders = await storage.getOrders();
      
      // Create new order
      const newOrder: Order = {
        ...order,
        id: `order_${Date.now()}`,
        confirmationNumber: `LM${orderCounter++}`,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        items: [...order.items] // Ensure items are copied
      };

      // Save the updated orders list
      await storage.saveOrders([...currentOrders, newOrder]);

      return {
        data: newOrder,
        success: true,
        message: 'Order submitted successfully'
      };
    } catch (error) {
      console.error('Error in submitOrder:', error);
      throw new Error('Failed to process order. Please try again.');
    }
  },

  // Get order by ID
  async getOrder(orderId: string): Promise<ApiResponse<Order | null>> {
    try {
      if (shouldSimulateFailure()) {
        throw new Error('Random API failure');
      }
      
      await delay(300);
      const orders = await storage.getOrders();

      const order = orders.find((o: Order) => o.id === orderId) || null;
      
      return {
        success: true,
        message: order ? 'Order found' : 'Order not found',
        data: order
      };
    } catch (error) {
      console.error('Failed to get order:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get order',
        data: null
      };
    }
  },
  
  // Get all orders, optionally filtered by email or phone
  async getCustomerOrders(identifier?: { email?: string; phone?: string } | string): Promise<ApiResponse<Order[]>> {
    await delay(400);
    try {
      if (shouldSimulateFailure()) {
        throw new Error('Random API failure');
      }
      
      const allOrders = await storage.getOrders();
      
      // If no identifier, return all orders
      if (!identifier) {
        return {
          data: allOrders,
          success: true,
          message: allOrders.length ? 'Orders found' : 'No orders found'
        };
      }
      
      // Handle both string (email) and object parameters
      let email: string | undefined;
      let phone: string | undefined;

      if (typeof identifier === 'string') {
        email = identifier;
      } else if (identifier) {
        email = identifier.email;
        phone = identifier.phone;
      }
      
      // If no valid filters, return all orders
      if (!email && !phone) {
        return {
          data: allOrders,
          success: true,
          message: allOrders.length ? 'All orders' : 'No orders found'
        };
      }
      
      // Filter orders based on email and/or phone
      const filteredOrders = allOrders.filter((order: Order) => {
        const orderEmail = order.customer?.email?.toLowerCase();
        const orderPhone = order.customer?.phone;
        
        const matchesEmail = !email || (orderEmail && orderEmail === email.toLowerCase());
        const matchesPhone = !phone || (orderPhone && orderPhone === phone);
        
        return matchesEmail || matchesPhone;
      });
      
      return {
        data: filteredOrders,
        success: true,
        message: filteredOrders.length ? 'Matching orders found' : 'No matching orders found'
      };
    } catch (error) {
      console.error('Error getting customer orders:', error);
      return {
        data: [],
        success: false,
        message: 'Failed to load orders'
      };
    }
  },
};

// HTTP-like API wrapper (simulates actual HTTP requests)
export const api = {
  get: async (endpoint: string) => {
    console.log(`[Mock API] GET ${endpoint}`);
    
    // Handle query parameters
    const [path, query] = endpoint.split('?');
    const params = new URLSearchParams(query);
    
    switch (true) {
      case path === '/api/beverages':
        return mockApi.getBeverages();
        
      case path.startsWith('/api/orders/'):
        
        const orderId = path.split('/').pop();
        if (!orderId) throw new Error('Invalid order ID');
        return mockApi.getOrder(orderId);
        
      case path === '/api/orders':
        // Handle customer orders with email/phone
        const email = params.get('email');
        const phone = params.get('phone');
        return mockApi.getCustomerOrders({ 
          email: email || undefined, 
          phone: phone || undefined 
        });
        
      default:
        throw new Error(`Endpoint ${endpoint} not found`);
    }
  },

  post: async (endpoint: string, data: any) => {
    console.log(`[Mock API] POST ${endpoint}`, data ? { body: data } : '');
    
    switch (endpoint) {
      case '/api/orders':
        return mockApi.submitOrder(data);
        
      default:
        throw new Error(`Endpoint ${endpoint} not found`);
    }
  },

  // For more realistic HTTP simulation
  request: async (method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, data?: any) => {
    console.log(`[Mock API] ${method} ${endpoint}`, data ? { body: data } : '');
    
    try {
      let response;
      
      switch (method) {
        case 'GET':
          response = await api.get(endpoint);
          break;
          
        case 'POST':
          response = await api.post(endpoint, data);
          break;
        default:
          throw new Error(`Method ${method} not implemented`);
      }
      
      console.log(`[Mock API] Response:`, response);
      return response;
      
    } catch (error) {
      console.error(`[Mock API] Error:`, error);
      throw error;
    }
  }
};