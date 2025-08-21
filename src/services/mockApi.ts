// src/services/mockApi.ts

import { Beverage, Order, ApiResponse } from '../types';

// Mock database
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

let orders: Order[] = [];
let orderCounter = 1000; // Start confirmation numbers at 1000

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

  // Get beverage by ID
  async getBeverage(id: string): Promise<ApiResponse<Beverage | null>> {
    await delay(400);
    
    const beverage = beverages.find(b => b.id === id);
    
    return {
      data: beverage || null,
      success: !!beverage,
      message: beverage ? 'Beverage found' : 'Beverage not found'
    };
  },

  // Submit order
  async submitOrder(order: Omit<Order, 'id' | 'confirmationNumber'>): Promise<ApiResponse<Order>> {
    // Add a delay to show loading state
    await delay(2000);
    
    // 50% chance of failure for testing
    if (Math.random() < 0.5) {
      // Different error messages for variety
      const errors = [
        'Network error: Could not connect to server',
        'Server timeout: Please try again',
        'Temporary service disruption',
        'Failed to process payment',
        'Order submission failed. Please check your connection and try again.'
      ];
      const randomError = errors[Math.floor(Math.random() * errors.length)];
      throw new Error(randomError);
    }

    // Validate order
    if (!order.items || order.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    if (!order.customer.name || !order.customer.name.trim()) {
      throw new Error('Customer name is required');
    }

    if (!order.customer.email && !order.customer.phone) {
      throw new Error('Either email or phone number is required');
    }

    // Create new order with ID and confirmation number
    const newOrder: Order = {
      ...order,
      id: `order_${Date.now()}`,
      confirmationNumber: `LM${orderCounter++}`,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    orders.push(newOrder);

    return {
      data: newOrder,
      success: true,
      message: 'Order submitted successfully'
    };
  },

  // Get order by ID
  async getOrder(id: string): Promise<ApiResponse<Order | null>> {
    await delay(400);
    
    const order = orders.find(o => o.id === id);
    
    return {
      data: order || null,
      success: !!order,
      message: order ? 'Order found' : 'Order not found'
    };
  },

  // Get orders by confirmation number
  async getOrderByConfirmation(confirmationNumber: string): Promise<ApiResponse<Order | null>> {
    await delay(400);
    
    const order = orders.find(o => o.confirmationNumber === confirmationNumber);
    
    return {
      data: order || null,
      success: !!order,
      message: order ? 'Order found' : 'Order not found'
    };
  },

  // Admin functions (for testing/demo purposes)
  async addBeverage(beverage: Omit<Beverage, 'id'>): Promise<ApiResponse<Beverage>> {
    await delay(600);
    
    const newBeverage: Beverage = {
      ...beverage,
      id: `beverage_${Date.now()}`
    };
    
    beverages.push(newBeverage);
    
    return {
      data: newBeverage,
      success: true,
      message: 'Beverage added successfully'
    };
  },

  // Update beverage prices (simulate dynamic pricing)
  async updateBeveragePrices(beverageId: string, priceMultiplier: number): Promise<ApiResponse<Beverage | null>> {
    await delay(600);
    
    const beverageIndex = beverages.findIndex(b => b.id === beverageId);
    
    if (beverageIndex === -1) {
      return {
        data: null,
        success: false,
        message: 'Beverage not found'
      };
    }
    
    // Update prices
    beverages[beverageIndex].sizes = beverages[beverageIndex].sizes.map(size => ({
      ...size,
      price: Math.round((size.price * priceMultiplier) * 100) / 100 // Round to 2 decimal places
    }));
    
    return {
      data: beverages[beverageIndex],
      success: true,
      message: 'Beverage prices updated successfully'
    };
  },

  // Reset data (for testing)
  async resetData(): Promise<void> {
    orders = [];
    orderCounter = 1000;
    // beverages remain the same as they're the core menu
  }
};

// HTTP-like API wrapper (simulates actual HTTP requests)
export const api = {
  get: async (endpoint: string) => {
    switch (endpoint) {
      case '/api/beverages':
        return mockApi.getBeverages();
      default:
        throw new Error(`Endpoint ${endpoint} not found`);
    }
  },

  post: async (endpoint: string, data: any) => {
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