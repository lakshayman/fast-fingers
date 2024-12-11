import { useState, useEffect, useRef } from "react";
import { Box, Text, Input, VStack, HStack, Button } from "@chakra-ui/react";
import { ProgressRoot, ProgressBar } from "@/components/ui/progress";
import { GameState } from "@/types/game";

const INITIAL_DIFFICULTY_FACTORS = {
  easy: 1,
  medium: 1.5,
  hard: 2
};

const MIN_TIME_SECONDS = 2;

interface Props {
  playerName: string;
  difficulty: string;
  setScore: (score: number) => void;
  setScreen: (screen: string) => void;
  dictionary: Record<string, string[]> | null;
  savedState: GameState | null;
}

function Game({ playerName, difficulty: initialDifficulty, setScore, setScreen, dictionary, savedState }: Props) {
  const [currentWord, setCurrentWord] = useState(savedState?.currentWord || "");
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(savedState?.timeLeft || 0);
  const [localScore, setLocalScore] = useState(savedState?.localScore || 0);
  const [difficulty, setDifficulty] = useState(savedState?.difficulty || initialDifficulty);
  const [difficultyFactor, setDifficultyFactor] = useState(
    savedState?.difficultyFactor ||
    INITIAL_DIFFICULTY_FACTORS[initialDifficulty as keyof typeof INITIAL_DIFFICULTY_FACTORS]
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(savedState?.totalTimeElapsed || 0);
  const [wordStartTime, setWordStartTime] = useState(savedState?.wordStartTime || 0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saveState = () => {
      const state: GameState = {
        currentWord,
        timeLeft,
        localScore,
        difficulty,
        difficultyFactor,
        totalTimeElapsed,
        wordStartTime,
        playerName
      };
      localStorage.setItem('gameState', JSON.stringify(state));
    };

    const interval = setInterval(saveState, 1000);
    window.addEventListener('beforeunload', saveState);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', saveState);
    };
  }, [currentWord, timeLeft, localScore, difficulty, difficultyFactor, totalTimeElapsed, wordStartTime]);

  const getRandomWord = () => {
    const words = dictionary?.[difficulty] || [];
    if (!words || words.length === 0) return "error occurred";
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  };

  const calculateTimeForWord = (word: string) => {
    const calculatedTime = word.length / difficultyFactor;
    return Math.max(calculatedTime, MIN_TIME_SECONDS);
  };

  const updateDifficultyLevel = () => {
    const newDifficultyFactor = difficultyFactor + 0.01;
    setDifficultyFactor(newDifficultyFactor);

    if (newDifficultyFactor >= INITIAL_DIFFICULTY_FACTORS.hard && difficulty !== 'hard') {
      setDifficulty('hard');
    } else if (newDifficultyFactor >= INITIAL_DIFFICULTY_FACTORS.medium && difficulty === 'easy') {
      setDifficulty('medium');
    }
  };

  const startNewWord = () => {
    const newWord = getRandomWord();
    setCurrentWord(newWord);
    const wordTime = calculateTimeForWord(newWord);
    setTimeLeft(wordTime);
    setWordStartTime(wordTime);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          if (timerRef.current) clearInterval(timerRef.current);
          endGame();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);
  };

  useEffect(() => {
    startNewWord();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (e.target.value === currentWord) {
      const timeSpent = wordStartTime - timeLeft;
      setTotalTimeElapsed(prev => prev + timeSpent);
      setLocalScore((prev) => prev + timeSpent);
      updateDifficultyLevel();
      setInput("");
      startNewWord();
    } else {
      e.target.style.color = e.target.value === currentWord.slice(0, e.target.value.length) ? 'green' : 'red';
    }
  };

  const endGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const finalScore = Math.round(totalTimeElapsed);
    setScore(finalScore);
    setScreen("FINAL_SCORE");
  };

  const handleStopGame = () => {
    endGame();
  };

  return (
    <VStack gap={6} align="stretch">
      <HStack justify="space-between">
        <VStack align="start" bg="white" borderRadius="xl" p={4}>
          <Text>Player: {playerName}</Text>
          <Text>Difficulty: {difficulty}</Text>
          <Text suppressHydrationWarning>Difficulty Factor: {difficultyFactor.toFixed(2)}</Text>
        </VStack>
        <Button onClick={handleStopGame} bg="white" borderWidth={1} borderColor="gray.200" borderRadius="xl" p={4} _hover={{ bg: 'red.600', color: 'white' }}>
          Stop Game
        </Button>
      </HStack>

      <Box display="flex" justifyContent="center">
        <ProgressRoot
          value={(timeLeft / calculateTimeForWord(currentWord)) * 100}
          colorPalette="blue"
          variant="outline"
          width="400px"
          maxWidth="400px"
        >
          <ProgressBar />
        </ProgressRoot>
      </Box>
      <Text margin="auto" w="fit-content" textAlign="center" suppressHydrationWarning bg="white" borderRadius="xl" p={4}>Time Left: {timeLeft.toFixed(1)}s</Text>

      <VStack gap={4}>
        <Text fontSize="2xl" fontWeight="bold" bg="white" borderRadius="xl" p={4} w="fit-content" data-testid="game-word">{currentWord}</Text>
        <Input
          ref={inputRef}
          value={input}
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
        Score: {localScore.toFixed(2)}
      </Text>
    </VStack>
  );
}

export default Game;