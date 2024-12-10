import { useEffect, useReducer } from 'react';
import { getDictionaryByDifficulty } from '@/utils/dictionary';

export function useDictionary() {
  const [state, dispatch] = useReducer(
    (state: any, action: { type: string; payload: any }) => {
      switch (action.type) {
        case 'SET_DICTIONARY':
          return { ...state, dictionary: action.payload };
        case 'SET_IS_LOADING':
          return { ...state, isLoading: action.payload };
        default:
          return state;
      }
    },
    { dictionary: null, isLoading: true }
  );

  useEffect(() => {
    let mounted = true;

    const initializeDictionary = async () => {
      try {
        const separatedDictionary = await getDictionaryByDifficulty();
        if (mounted) {
          dispatch({ type: 'SET_DICTIONARY', payload: separatedDictionary });
          dispatch({ type: 'SET_IS_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Failed to load dictionary:', error);
        if (mounted) {
          dispatch({ type: 'SET_IS_LOADING', payload: false });
        }
      }
    };

    initializeDictionary();

    return () => {
      mounted = false;
    };
  }, []);

  return { dictionary: state.dictionary, isLoading: state.isLoading };
} 