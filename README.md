# Vitrine App

A modern, hybrid e-commerce solution for small businesses, dropshippers, and affiliates.

## Features

### 🛍️ Modern Storefront
- **Premium Design**: Clean, responsive UI with glassmorphism effects and modern typography.
- **Dynamic Catalog**: Supports physical products, digital goods, and service bookings.
- **Hybrid Commerce**: Seamlessly mix direct sales (cart) with affiliate links.

### 💳 Integrated Payments
- **Multi-Method Support**: Native support for PIX (with QR Code generation) and Credit Cards.
- **Mock Payment Gateway**: Realistic checkout simulation for testing and demos.
- **Secure Processing**: Integrated `PaymentService` for handling transaction states.

### 🛠️ Powerful Admin Panel
- **Visual Theme Editor**: Customize colors, fonts, and layouts in real-time.
- **Product Management**: Easy add/edit/delete flow with AI-powered descriptions.
- **Demo Data Tools**: One-click seeding and clearing of demo products for quick setup.
- **Pro Features**: Unlock advanced modes like "Store Only" or "Affiliate Only".

### 🤖 AI-Powered
- **Product Descriptions**: Auto-generate compelling copy for your items.
- **Smart Recommendations**: (Coming Soon) AI-driven product suggestions.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## Project Structure

- `src/components`: UI components including `PaymentGateway`, `AdminPanel`, etc.
- `src/services`: Business logic for `PaymentService`, `ProductService`, etc.
- `src/contexts`: State management via `ConfigContext`.
- `src/types.ts`: TypeScript definitions for the application domain.

## License

Private
