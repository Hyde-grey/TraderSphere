# TraderSphere: Modern Trading Dashboard

TraderSphere is a sophisticated trading dashboard built with React, TypeScript, and Vite that demonstrates advanced frontend techniques for handling real-time financial data. This project showcases my ability to work with REST and WebSocket APIs while creating a responsive, high-performance user interface.

![TraderSphere Dashboard]

<a href="https://ibb.co/GfGFGHF3"><img src="https://i.ibb.co/DPmLmrLg/Screenshot-2025-04-01-164411.png" alt="Screenshot-2025-04-01-164411" border="0"></a>
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
- **Interactive Candlestick Chart**: Visualize historical price data with customizable time intervals
- **Price Oscillator**: Monitor real-time price changes with dynamic bar visualization
- **Symbol-focused News Feed**: Get the latest news updates related to your selected trading symbols

### Futuristic Design

- **Dark Mode Interface**: Sleek, professional design optimized for trader focus
- **High Contrast Elements**: Color-coded indicators for positive/negative values
- **Clean Typography**: Optimized for readability during extended sessions
- **Visual Consistency**: Cyan/purple color theme across all charts and visualizations

### Modular, Resizable Layout

- **Customizable Dashboard**: Drag-and-drop widget positioning
- **Resizable Components**: Adjust widget sizes to prioritize important information
- **Layout Persistence**: Saves user preferences for consistent experience
- **Integrated Widget System**: All components respond to the same selected symbol for a cohesive experience

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
- **D3.js**: Advanced data visualization for candlestick charts

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
- ✅ Interactive candlestick chart with crosshair and tooltips
- ✅ Price oscillator visualization with real-time updates
- ✅ Symbol-specific news integration
- 🔄 User settings and preferences (in progress)
- ⬜ Advanced technical indicators
- ⬜ Portfolio tracking features
- ⬜ Custom widget development framework
- ⬜ Data export functionality

## Recent Updates

### Candlestick Chart Implementation

- Added interactive candlestick chart with historical price data visualization
- Implemented crosshair functionality with price and time tooltips
- Added customizable time intervals and zoom capabilities
- Created consistent visual styling with cyan/purple color scheme
- Optimized rendering performance for smooth interaction

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
- Modularized chart components for better code organization

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

### Symbol Selection and Dashboard Integration

**Important: To see live data across all widgets, you must first select a symbol from the Market Overview table.**

1. **Selecting a Trading Symbol**

   - Click on any row in the Market Overview table to select that symbol
   - Once selected, all dashboard widgets will update to display data for the chosen symbol
   - The selected symbol will be highlighted in the table
   - All connected widgets (Price Oscillator, Candlestick Chart, and News Feed) will automatically update to show relevant data

2. **Widget Synchronization**
   - All widgets are connected through a shared symbol context
   - Changing the symbol in one place updates all widgets
   - This provides a cohesive view of a single trading asset across different data visualizations

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

### Candlestick Chart

<a href="https://ibb.co/gFgTjhFM"><img src="https://i.ibb.co/dJK2WxJ0/Screenshot-2025-04-01-164726.png" alt="Screenshot-2025-04-01-164726" border="0"></a>

1. **Viewing Price History**

   - The chart automatically displays historical price data for the selected symbol
   - Candlesticks show open, high, low, and close prices for each time interval
   - Bullish candles (close > open) are displayed in cyan
   - Bearish candles (close < open) are displayed in purple

2. **Using the Crosshair and Tooltips**
   - Move your cursor over the chart to activate the crosshair
   - The crosshair shows precise price and time data at the cursor position
   - Tooltips display detailed information about the specific candlestick
   - The time axis (x-axis) displays hourly intervals
   - The price axis (y-axis) shows price levels with appropriate scaling

### Price Oscillator

<a href="https://ibb.co/S4vYjzzt"><img src="https://i.ibb.co/LXpjF33x/Screenshot-2025-04-01-164849.png" alt="Screenshot-2025-04-01-164849" border="0"></a>
<a href="https://ibb.co/mrLgrntF"><img src="https://i.ibb.co/qLtVLH9F/Screenshot-2025-04-01-164911.png" alt="Screenshot-2025-04-01-164911" border="0"></a>

1. **Monitoring Specific Symbols**

   - The chart automatically updates to show price changes for the selected symbol
   - The display shows:
     - Current price change percentage
     - Last price
     - Historical price changes (last 10 updates)

2. **Reading the Chart**
   - Cyan bars indicate positive price changes
   - Purple bars indicate negative price changes
   - Bar height represents the magnitude of change
   - Most recent changes are on the right
   - Older changes fade to show historical progression

### News Feed

<a href="https://ibb.co/FLv9Z0NV"><img src="https://i.ibb.co/Q3BZSCzd/Screenshot-2025-04-01-165033.png" alt="Screenshot-2025-04-01-165033" border="0"></a>

1. **Symbol-Specific News**
   - The News Feed widget automatically displays news related to the selected symbol
   - Articles are sorted by relevance and recency
   - Each news item shows a headline and brief summary
   - Click on any news item to read the full article

### General Tips

- The dashboard is fully responsive and works on both desktop and mobile
- Widget positions and sizes are saved automatically
- Use the Live Indicator to confirm real-time data connection
- Hover over elements for additional information and tooltips
- For the best experience, select popular trading symbols with high volumes of data
