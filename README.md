# TraderSphere: Modern Trading Dashboard

TraderSphere is a sophisticated trading dashboard built with React, TypeScript, and Vite that demonstrates advanced frontend techniques for handling real-time financial data. This project showcases my ability to work with REST and WebSocket APIs while creating a responsive, high-performance user interface.

![TraderSphere Dashboard]

<a href="https://ibb.co/N6hL09fG"><img src="https://i.ibb.co/vx5JN3fM/trader-Sphere-beta-screenshot.png" alt="trader-Sphere-beta-screenshot" border="0"></a>

## Features

### Real-time Market Data Integration

- **REST API Integration**: Fetches initial market data with optimized loading states and error handling
- **WebSocket Live Updates**: Implements real-time data streaming for instant price updates
- **Debounced Updates**: Optimizes rendering performance with intelligent update batching

### Advanced Data Visualization

- **Virtualized Data Tables**: Supports thousands of rows with minimal performance impact
- **Interactive Filtering**: Multi-level filtering capabilities (global and per-column)
- **Responsive Pagination**: Configurable page sizes with smooth navigation

### Futuristic Design

- **Dark Mode Interface**: Sleek, professional design optimized for trader focus
- **High Contrast Elements**: Color-coded indicators for positive/negative values
- **Clean Typography**: Optimized for readability during extended sessions

### Modular, Resizable Layout

- **Customizable Dashboard**: Drag-and-drop widget positioning
- **Resizable Components**: Adjust widget sizes to prioritize important information
- **Layout Persistence**: Saves user preferences for consistent experience

## Project Purpose

TraderSphere is a trader dashboard tool that allows users to display detailed information about various financial metrics and market data. It's designed to help traders:

1. Monitor real-time market movements across multiple assets
2. Analyze historical and current price data
3. Make informed decisions on buying and selling positions
4. Customize their workspace for optimal productivity

The modular, resizable layout allows traders to tailor their experience based on their specific needs and trading style. Whether focusing on a few key assets or monitoring broader market trends, the interface adapts to the user's requirements.

## Technical Implementation

### Frontend Architecture

- **React + TypeScript**: Type-safe component development
- **Vite**: Lightning-fast development server and optimized builds
- **Tanstack Query**: Sophisticated data fetching and caching
- **Tanstack Table**: High-performance table with virtualization
- **React Grid Layout**: Drag-and-drop resizable widgets

### Data Integration

- **WebSocket Connection**: Live data streaming with reconnection handling
- **REST API Fetching**: Optimized data loading with proper error states
- **Data Processing**: Intelligent merging of static and real-time data

### Testing

- **Vitest**: Modern, fast testing framework
- **React Testing Library**: Component testing with user-centric approach
- **Mock Service Worker**: API mocking for reliable tests

## Current Progress

- ✅ Core dashboard layout and styling
- ✅ Market summary table with virtualization
- ✅ Real-time data integration via WebSockets
- ✅ Data filtering and pagination
- ✅ Testing framework setup with Vitest
- ✅ Modular widget system
- 🔄 Customizable chart widgets (in progress)
- 🔄 User settings and preferences (in progress)
- ⬜ Advanced technical indicators
- ⬜ Portfolio tracking features

## Getting Started

```bash
# Clone the repository
git clone https://github.com/yourusername/traderSphere.git

# Install dependencies
cd traderSphere
yarn install

# Start development server
yarn dev

# Run tests
yarn test

# Build for production
yarn build
```

## License

[MIT](LICENSE)
