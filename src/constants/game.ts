export const INITIAL_DIFFICULTY_FACTORS = {
  easy: 1,
  medium: 1.5,
  hard: 2
};

export const WORD_LENGTH_RANGES = {
  easy: { min: 2, max: 4 },
  medium: { min: 5, max: 8 },
  hard: { min: 9, max: Infinity }
};

export const MIN_TIME_SECONDS = 2;

export const DIFFICULTIES = [
  { label: "Easy", value: "easy", description: "2 - 4 letter words" },
  { label: "Medium", value: "medium", description: "5 - 8 letter words" },
  { label: "Hard", value: "hard", description: "8+ letter words" },
]; 