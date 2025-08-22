# Digital Lemonade Stand Mobile App

A React Native mobile application for ordering beverages from a digital lemonade stand, built with TypeScript and Expo.

## Features

### Core Features

- **Beverage Display**: Browse available drinks with sizes and prices
- **Dynamic Pricing**: Real-time total calculation as items are added/modified
- **Customer Information**: Form for name and contact details
- **Order Processing**: Submit orders and receive confirmation numbers
- **Backend Integration**: Communicates with mock API endpoints

### Bonus Features Implemented

- **State Management**: Context API with TypeScript for clean state handling
- **Input Validation**: Robust client-side validation with error messages
- **User Interface**: Clean, intuitive design with smooth animations
- **Error Handling**: Graceful error handling with user-friendly messages

## Technology Stack

- **Frontend**: React Native with Expo
- **Language**: TypeScript
- **State Management**: React Context API
- **Styling**: StyleSheet with responsive design
- **HTTP Client**: Fetch API with custom error handling

## Project Structure

```
src/
├── App.tsx
├── components/          # Reusable UI components
│   ├── BeverageCard/
│   │   ├── index.tsx
│   │   └── styles.ts
│   ├── Header/
│   │   ├── index.tsx
│   │   └── styles.ts
│   ├── HeaderButton/
│   │   └── index.tsx
│   └── OrderItem/
│       ├── index.tsx
│       └── styles.ts
├── context/            # State management
│   ├── BeverageContext.tsx
│   └── OrderContext.tsx
├── services/           # API services
│   └── mockApi.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── validation.ts
└── screens/            # Screen components
    ├── BeverageList/
    │   ├── index.tsx
    │   └── styles.ts
    ├── Checkout/
    │   ├── index.tsx
    │   └── styles.ts
    ├── Confirmation/
    │   ├── index.tsx
    │   └── styles.ts
    ├── Order/
    │   ├── index.tsx
    │   └── styles.ts
    ├── OrderHistory/
    │   ├── index.tsx
    │   └── styles.ts
    ├── OrderTracking/
    │   ├── index.tsx
    │   └── styles.ts
    ├── index.tsx
    └── styles.ts
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device (for testing)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/gaurangk347/lemonade-stand
   cd digital-lemonade-stand
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - Scan QR code with Expo Go app (mobile)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## API Endpoints

The app communicates with the following mock API endpoints:

- `GET /api/beverages` - Fetch available beverages
- `POST /api/orders` - Submit new order
- `GET /api/orders` - Get list of orders
- `GET /api/orders/:id` - Get order details

### Mock Data Structure

```typescript
interface Beverage {
  id: string;
  name: string;
  description: string;
  sizes: BeverageSize[];
}

interface BeverageSize {
  id: string;
  name: string;
  price: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  customer: Customer;
  total: number;
  status: string;
}
```

## Design Choices & Assumptions

### State Management

- Used React Context API instead of Redux for simplicity and the app's moderate complexity
- Separate contexts for beverages and orders to maintain clear separation of concerns
- Custom hooks (`useBeverages`, `useOrder`) provide clean API for components

### Validation Strategy

- Client-side validation for immediate feedback
- Reusable validation utilities with TypeScript for type safety
- Form validation includes required fields, email format, and phone number format

### Error Handling

- User-friendly error messages displayed in UI
- Graceful degradation when API calls fail
- Loading states for better user experience

### UI/UX Decisions

- Card-based layout for easy browsing of beverages
- Sticky order summary for constant visibility of cart contents
- Progressive disclosure - show details only when needed
- Consistent color scheme and typography

### Mock Backend

- Realistic API simulation with async responses
- Error scenarios for testing error handling
- Persistent data during session (resets on app restart)

## Future Enhancements

If given more time, potential improvements would include:

1. **Comprehensive Testing**: Implement unit and integration tests using Jest and React Native Testing Library
2. **Persistent Storage**: AsyncStorage for order history
3. **Push Notifications**: Order status updates
4. **Payment Integration**: Stripe or similar payment processor
5. **User Authentication**: Login/signup functionality
6. **Accessibility**: Enhanced screen reader support

## Testing Strategy (For future enhancement)

### Unit Tests

- Component rendering and prop handling
- State management context providers and reducers
- Utility functions (validation, calculations)
- API service functions

### Integration Tests

- User interactions and state updates
- Form submission workflows
- API integration scenarios

### Test Coverage Areas

- Form validation logic
- Order calculation accuracy
- Error handling scenarios
- Component interaction flows

## Known Limitations

- Mock API data resets on app restart
- No persistent user sessions
- Limited offline functionality
- Basic error recovery mechanisms
- Missing testing

---

**Contact**: gaurangk347@gmail.com
**Repository**: https://github.com/gaurangk347/lemonade-stand
