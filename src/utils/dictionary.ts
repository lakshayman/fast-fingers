import { useState, useEffect } from 'react';

type Difficulty = 'easy' | 'medium' | 'hard';

const WORD_LENGTH_RANGES = {
  easy: { min: 2, max: 4 },
  medium: { min: 5, max: 8 },
  hard: { min: 9, max: Infinity }
};

export const getDictionaryByDifficulty = async () => {
  try {
    const response = await fetch('/dictionary.json');
    const dictionary: string[] = await response.json();
    
    const separatedDictionary: Record<Difficulty, string[]> = {
      easy: [],
      medium: [],
      hard: []
    };

    dictionary.forEach(word => {
      if (word.length <= WORD_LENGTH_RANGES.easy.max) {
        separatedDictionary.easy.push(word);
      } else if (word.length <= WORD_LENGTH_RANGES.medium.max) {
        separatedDictionary.medium.push(word);
      } else {
        separatedDictionary.hard.push(word);
      }
    });

    return separatedDictionary;
  } catch (error) {
    console.error('Error loading dictionary:', error);
    return {
      easy: [],
      medium: [],
      hard: []
    };
  }
}; 