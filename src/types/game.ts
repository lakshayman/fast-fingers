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