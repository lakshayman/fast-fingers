import { useEffect, useRef, useReducer, useMemo, useCallback } from "react";
import { Box, Text, Input, VStack, HStack, Button } from "@chakra-ui/react";
import { ProgressRoot, ProgressBar } from "@/components/ui/progress";
import { GameComponentProps, GameState } from "@/types/game";
import { INITIAL_DIFFICULTY_FACTORS, MIN_TIME_SECONDS } from "@/constants/game";
import { gameInitialState } from "@/constants/game";
import { gameReducer } from "@/reducers/gameReducer";

function Game({ playerName, difficulty: initialDifficulty, setScore, setScreen, dictionary, savedState, setGameState }: GameComponentProps) {
  const [state, dispatch] = useReducer(gameReducer, gameInitialState(savedState, initialDifficulty));
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const gameMetrics = useMemo(() => ({
    timeLeft: state.timeLeft,
    localScore: state.localScore,
    totalTimeElapsed: state.totalTimeElapsed,
    wordStartTime: state.wordStartTime
  }), [
    state.timeLeft,
    state.localScore,
    state.totalTimeElapsed,
    state.wordStartTime
  ]);

  const getRandomWord = useCallback(() => {
    const words = dictionary?.[state.difficulty] || [];
    if (!words || words.length === 0) return "error occurred";
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  }, [dictionary, state.difficulty]);

  const calculateTimeForWord = useCallback((word: string) => {
    const calculatedTime = word.length / state.difficultyFactor;
    return Math.max(calculatedTime, MIN_TIME_SECONDS);
  }, [state.difficultyFactor]);

  const updateDifficultyLevel = useCallback(() => {
    const newDifficultyFactor = state.difficultyFactor + 0.01;
    dispatch({ type: 'UPDATE_DIFFICULTY_FACTOR', payload: newDifficultyFactor });

    if (newDifficultyFactor >= INITIAL_DIFFICULTY_FACTORS.hard && state.difficulty !== 'hard') {
      dispatch({ type: 'SET_DIFFICULTY', payload: 'hard' });
    } else if (newDifficultyFactor >= INITIAL_DIFFICULTY_FACTORS.medium && state.difficulty === 'easy') {
      dispatch({ type: 'SET_DIFFICULTY', payload: 'medium' });
    }
  }, [state.difficultyFactor, state.difficulty]);

  const endGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const finalScore = Math.round(state.totalTimeElapsed);
    setScore(finalScore);
    setScreen("FINAL_SCORE");
    setGameState(null);
  }, [state.totalTimeElapsed, setScore, setScreen, setGameState]);

  const startNewWord = useCallback((firstWord: boolean) => {
    const newWord = getRandomWord();
    const wordTime = calculateTimeForWord(newWord);
    
    dispatch({
      type: 'NEW_WORD',
      payload: {
        word: newWord,
        timeLeft: wordTime,
        wordStartTime: wordTime
      }
    });
    
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      dispatch({ type: 'TICK_TIMER', payload: 0.1 });
    }, 100);
    
    if(!firstWord) updateDifficultyLevel();
  }, [getRandomWord, calculateTimeForWord, updateDifficultyLevel]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_INPUT', payload: e.target.value });
    if (e.target.value === state.currentWord) {
      const timeSpent = state.wordStartTime - state.timeLeft;
      dispatch({ type: 'WORD_COMPLETED', payload: timeSpent });
      startNewWord(false);
    } else {
      e.target.style.color = e.target.value === state.currentWord.slice(0, e.target.value.length) ? 'green' : 'red';
    }
  }, [state.currentWord, state.wordStartTime, state.timeLeft, startNewWord]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const gameState: GameState = {
        currentWord: state.currentWord,
        difficulty: state.difficulty,
        difficultyFactor: state.difficultyFactor,
        playerName,
        ...gameMetrics
      };
      setGameState(gameState);
    };

    startNewWord(true);
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (state.timeLeft <= 0 && timerRef.current) {
      clearInterval(timerRef.current);
      endGame();
    }
  }, [state.timeLeft, endGame]);

  return (
    <VStack gap={6} align="stretch">
      <HStack justify="space-between">
        <VStack align="start" bg="white" borderRadius="xl" p={4}>
          <Text>Player: {playerName}</Text>
          <Text>Difficulty: {state.difficulty}</Text>
          <Text suppressHydrationWarning>Difficulty Factor: {state.difficultyFactor.toFixed(2)}</Text>
        </VStack>
        <Button onClick={endGame} bg="white" borderWidth={1} borderColor="gray.200" borderRadius="xl" p={4} _hover={{ bg: 'red.600', color: 'white' }}>
          Stop Game
        </Button>
      </HStack>

      <Box display="flex" justifyContent="center">
        <ProgressRoot
          value={(state.timeLeft / calculateTimeForWord(state.currentWord)) * 100}
          colorPalette="blue"
          variant="outline"
          width="400px"
          maxWidth="400px"
        >
          <ProgressBar />
        </ProgressRoot>
      </Box>
      <Text margin="auto" w="fit-content" textAlign="center" suppressHydrationWarning bg="white" borderRadius="xl" p={4}>Time Left: {state.timeLeft.toFixed(1)}s</Text>

      <VStack gap={4}>
        <Text fontSize="2xl" fontWeight="bold" bg="white" borderRadius="xl" p={4} w="fit-content" data-testid="game-word">{state.currentWord}</Text>
        <Input
          ref={inputRef}
          value={state.input}
          onChange={handleInputChange}
          placeholder="Type the word here..."
          size="lg"
          maxW="400px"
          transition="color 0.2s ease"
          padding={2}
          bg="white"
          borderRadius="xl"
          data-testid="game-input"
          autoFocus
        />
      </VStack>

      <Text margin="auto" w="fit-content" textAlign="center" fontSize="xl" suppressHydrationWarning bg="white" borderRadius="xl" p={4}>
        Score: {state.localScore.toFixed(2)}
      </Text>
    </VStack>
  );
}

export default Game;