import { useState } from "react";

export function useLocalStorage(key: string, initialValue: any) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage key:', key, error);
      return initialValue;
    }
  });

  const setValue = (value: any) => {
    try {
      setStoredValue(value);
      typeof window !== "undefined" && window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting localStorage key:', key, error);
    }
  };

  return [storedValue, setValue];
} 