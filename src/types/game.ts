export interface LeaderboardEntry {
  playerName: string;
  score: number;
  difficulty: string;
  timestamp: number;
}

export interface GameState {
  currentWord: string;
  timeLeft: number;
  localScore: number;
  difficulty: string;
  difficultyFactor: number;
  totalTimeElapsed: number;
  wordStartTime: number;
  playerName: string;
}

export interface GameComponentProps {
  playerName: string;
  difficulty: string;
  setScore: (score: number) => void;
  setScreen: (screen: string) => void;
  dictionary: Record<string, string[]> | null;
  savedState: GameState | null;
  setGameState: (gameState: GameState | null) => void;
}

export type GameAction =
  | { type: 'SET_WORD'; payload: string }
  | { type: 'SET_INPUT'; payload: string }
  | { type: 'SET_TIME_LEFT'; payload: number }
  | { type: 'UPDATE_SCORE'; payload: number }
  | { type: 'SET_DIFFICULTY'; payload: string }
  | { type: 'UPDATE_DIFFICULTY_FACTOR'; payload: number }
  | { type: 'SET_TOTAL_TIME_ELAPSED'; payload: number }
  | { type: 'SET_WORD_START_TIME'; payload: number }
  | { type: 'RESET_INPUT' }
  | { type: 'DECREMENT_TIME_LEFT'; payload: number }
  | { type: 'WORD_COMPLETED'; payload: number }
  | { type: 'TICK_TIMER'; payload: number }
  | { type: 'NEW_WORD'; payload: { word: string, timeLeft: number, wordStartTime: number } };

export interface GameStatsProps {
  playerName: string;
  difficulty: string;
  difficultyFactor: number;
}
