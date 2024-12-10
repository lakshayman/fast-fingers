import { useEffect, useState } from 'react';

export function useSessionStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    
    const item = window.sessionStorage.getItem(key);
    if (item === null) return initialValue;
    
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(key, JSON.stringify(storedValue));
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
} 