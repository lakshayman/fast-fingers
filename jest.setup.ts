// Suppress specific console errors during tests
const originalError = console.error;
console.error = (...args) => {
  if (
    /Warning: ReactDOM.render is no longer supported in React 18/.test(args[0]) ||
    /Warning: useLayoutEffect does nothing on the server/.test(args[0]) ||
    /Warning: React.createElement: type is invalid/.test(args[0]) ||
    /When testing, code that causes React state updates should be wrapped into act/.test(args[0]) ||
    /An update to.*inside a test was not wrapped in act/.test(args[0])
  ) {
    return;
  }
  originalError.call(console, ...args);
};

// Suppress specific console warnings
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    /Warning: React.createElement: type is invalid/.test(args[0])
  ) {
    return;
  }
  originalWarn.call(console, ...args);
}; 