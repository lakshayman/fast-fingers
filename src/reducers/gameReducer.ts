import { GameStates, GameAction } from '@/types/gameStates'

export function reducer(state: GameStates, action: GameAction) {
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