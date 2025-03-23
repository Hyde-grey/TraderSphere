# TraderSphere: Modern Trading Dashboard

TraderSphere is a sophisticated trading dashboard built with React, TypeScript, and Vite that demonstrates advanced frontend techniques for handling real-time financial data. This project showcases my ability to work with REST and WebSocket APIs while creating a responsive, high-performance user interface.

![TraderSphere Dashboard]

<a href="https://ibb.co/GfgMzmP2"><img src="https://i.ibb.co/7x7pshyW/trader-Sphere-beta-screenshot.png" alt="trader-Sphere-beta-screenshot" border="0"></a>
<a href="https://tradersphere.netlify.app/">Live Demo</a>

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
- ✅ Live connection status indicator with animations
- ✅ Optimized table performance with virtualization
- ✅ Responsive search functionality
- 🔄 Customizable chart widgets (in progress)
- 🔄 User settings and preferences (in progress)
- ⬜ Advanced technical indicators
- ⬜ Portfolio tracking features
- ⬜ Custom widget development framework
- ⬜ Data export functionality

## Recent Updates

### Market Summary Table Enhancements

- Added live connection status indicator with animated feedback
- Implemented optimized table virtualization for better performance
- Enhanced search functionality with global and column-specific filtering
- Improved pagination controls with configurable page sizes
- Added responsive design for better mobile experience

### Technical Improvements

- Refactored components for better maintainability
- Implemented proper TypeScript interfaces
- Added Framer Motion animations for better UX
- Optimized CSS with modular styling

## Getting Started

```bash
# Clone the repository
git clone https://github.com/Hyde-grey/TraderSphere.git

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

## Usage Guide

### Dashboard Layout

1. **Dragging Widgets**

   - Click and hold the header (title bar) of any widget to drag it
   - Widgets can be repositioned anywhere on the dashboard
   - The layout automatically adjusts to prevent overlapping

2. **Resizing Widgets**
   - Hover over the edges or corners of any widget to see resize handles
   - Click and drag these handles to adjust the widget size
   - Widgets maintain their aspect ratio while resizing

### Market Overview Table

1. **Searching for Symbols**

   - Use the search bar in the Market Overview table
   - Type any symbol (e.g., "BTC", "ETH", "AAPL")
   - Results filter in real-time as you type

2. **Sorting and Filtering**
   - Click column headers to sort by that column
   - Use the filter icons in column headers for advanced filtering
   - Multiple filters can be applied simultaneously

### Price Oscillator

1. **Monitoring Specific Symbols**

   - Enter a symbol in the search input at the top of the Price Oscillator
   - The chart will update in real-time with price changes
   - The display shows:
     - Current price change percentage
     - Last price
     - Historical price changes (last 10 updates)

2. **Reading the Chart**
   - Green bars indicate positive price changes
   - Purple bars indicate negative price changes
   - Bar height represents the magnitude of change
   - Most recent changes are on the right
   - Older changes fade to show historical progression

### General Tips

- The dashboard is fully responsive and works on both desktop and mobile
- Widget positions and sizes are saved automatically
- Use the Live Indicator to confirm real-time data connection
- Hover over elements for additional information and tooltips

## License

[MIT](LICENSE)
