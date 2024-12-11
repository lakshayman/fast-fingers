import { GameState, LeaderboardEntry } from "@/types/game";

export const INITIAL_DIFFICULTY_FACTORS = {
  easy: 1,
  medium: 1.5,
  hard: 2
};

export const WORD_LENGTH_RANGES = {
  easy: { min: 2, max: 4 },
  medium: { min: 5, max: 8 },
  hard: { min: 9 }
};

export const MIN_TIME_SECONDS = 2;

export const DIFFICULTIES = [
  { label: "Easy", value: "easy", description: "2 - 4 letter words" },
  { label: "Medium", value: "medium", description: "5 - 8 letter words" },
  { label: "Hard", value: "hard", description: "8+ letter words" },
];

export const initialState = {
  screen: "FORM",
  score: 0,
  dictionary: {},
  isLoading: true,
  leaderboard: [] as LeaderboardEntry[],
  highestScore: 0,
  showResume: false,
  savedState: null,
};

export const gameInitialState = (savedState: GameState | null, initialDifficulty: string) => ({
  currentWord: savedState?.currentWord || "",
  input: "",
  timeLeft: savedState?.timeLeft || 2,
  localScore: savedState?.localScore || 0,
  difficulty: savedState?.difficulty || initialDifficulty,
  difficultyFactor: savedState?.difficultyFactor || 
    INITIAL_DIFFICULTY_FACTORS[initialDifficulty as keyof typeof INITIAL_DIFFICULTY_FACTORS],
  totalTimeElapsed: savedState?.totalTimeElapsed || 0,
  wordStartTime: savedState?.wordStartTime || 0,
});