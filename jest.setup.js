// Import Jest DOM extensions
require("@testing-library/jest-dom");

// Mock fetch if needed
global.fetch = jest.fn();

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});
