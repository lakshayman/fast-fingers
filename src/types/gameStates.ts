import { GameState, LeaderboardEntry } from './game'

export type GameStates = {
  screen: string;
  score: number;
  dictionary: Record<string, string[]> | null;
  isLoading: boolean;
  leaderboard: LeaderboardEntry[];
  highestScore: number;
  showResume: boolean;
  savedState: GameState | null;
}

export type GameAction = 
  | { type: 'SET_SCREEN'; payload: string }
  | { type: 'SET_SCORE'; payload: number }
  | { type: 'SET_DICTIONARY'; payload: Record<string, string[]> | null }
  | { type: 'SET_IS_LOADING'; payload: boolean }
  | { type: 'SET_LEADERBOARD'; payload: LeaderboardEntry[] }
  | { type: 'SET_HIGHEST_SCORE'; payload: number }
  | { type: 'SET_SHOW_RESUME'; payload: boolean }
  | { type: 'SET_SAVED_STATE'; payload: GameState | null } 