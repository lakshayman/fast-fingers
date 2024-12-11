import { GameState, LeaderboardEntry } from "@/types/game";
import { useState } from "react";

export function useLocalStorage(key: string, initialValue: LeaderboardEntry[] | GameState | null) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = typeof window !== "undefined" ?
        window.localStorage.getItem(key) :
        key === "leaderboard" ?
          JSON.stringify(initialValue) :
          null;
      return item && item !== "undefined" ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading localStorage key:', key, error);
      return initialValue;
    }
  });

  const setValue = (value: LeaderboardEntry[] | null) => {
    try {
      setStoredValue(value);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Error setting localStorage key:', key, error);
    }
  };

  return [storedValue, setValue];
} 