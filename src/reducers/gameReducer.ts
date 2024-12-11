import { GameAction } from '@/types/game';
import { GameStates, PageAction } from '@/types/gameStates'

export function reducer(state: GameStates, action: PageAction) {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, screen: action.payload };
    case 'SET_SCORE':
      return { ...state, score: action.payload };
    case 'SET_LEADERBOARD':
      return { ...state, leaderboard: action.payload };
    case 'SET_HIGHEST_SCORE':
      return { ...state, highestScore: action.payload };
    case 'SET_SAVED_STATE':
      return { ...state, savedState: action.payload };
    default:
      return state;
  }
}

export function gameReducer(state: {
  currentWord: string,
  difficulty: string,
  difficultyFactor: number,
  timeLeft: number,
  localScore: number,
  totalTimeElapsed: number,
  wordStartTime: number,
  input: string,
}, action: GameAction) {
  switch (action.type) {
    case 'SET_WORD':
      return { ...state, currentWord: action.payload };
    case 'SET_INPUT':
      return { ...state, input: action.payload };
    case 'SET_TIME_LEFT':
      return { ...state, timeLeft: action.payload };
    case 'UPDATE_SCORE':
      return { ...state, localScore: state.localScore + action.payload };
    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.payload };
    case 'UPDATE_DIFFICULTY_FACTOR':
      return { ...state, difficultyFactor: action.payload };
    case 'SET_TOTAL_TIME_ELAPSED':
      return { ...state, totalTimeElapsed: state.totalTimeElapsed + action.payload };
    case 'SET_WORD_START_TIME':
      return { ...state, wordStartTime: action.payload };
    case 'RESET_INPUT':
      return { ...state, input: '' };
    case 'DECREMENT_TIME_LEFT':
      return { ...state, timeLeft: state.timeLeft - action.payload };
    case 'WORD_COMPLETED':
      return {
        ...state,
        input: '',
        totalTimeElapsed: state.totalTimeElapsed + action.payload,
        localScore: state.localScore + action.payload
      };
    case 'TICK_TIMER':
      const newTimeLeft = state.timeLeft - action.payload;
      if (newTimeLeft <= 0) {
        return { ...state, timeLeft: 0 };
      }
      return { ...state, timeLeft: newTimeLeft };
    case 'NEW_WORD':
      return { ...state, currentWord: action.payload.word, timeLeft: action.payload.timeLeft, wordStartTime: action.payload.wordStartTime };
    default:
      return state;
  }
}