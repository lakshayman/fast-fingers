import { useState, useEffect, useRef } from "react";
import { Box, Text, Input, VStack, HStack, Button } from "@chakra-ui/react";
import { ProgressRoot, ProgressBar } from "@/components/ui/progress";

const INITIAL_DIFFICULTY_FACTORS = {
  easy: 1,
  medium: 1.5,
  hard: 2
};

const MIN_TIME_SECONDS = 2;

function Game({ 
  playerName, 
  difficulty: initialDifficulty, 
  setScore, 
  setScreen,
  dictionary
}: { 
  playerName: string, 
  difficulty: string, 
  setScore: (score: number) => void,
  setScreen: (screen: string) => void,
  dictionary: Record<string, string[]>
}) {
  const [currentWord, setCurrentWord] = useState("");
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [localScore, setLocalScore] = useState(0);
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [difficultyFactor, setDifficultyFactor] = useState(INITIAL_DIFFICULTY_FACTORS[initialDifficulty as keyof typeof INITIAL_DIFFICULTY_FACTORS]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);
  const [wordStartTime, setWordStartTime] = useState(0);

  const getRandomWord = () => {
    const words = dictionary[difficulty];
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
        <VStack align="start">
          <Text>Player: {playerName}</Text>
          <Text>Difficulty: {difficulty}</Text>
          <Text>Difficulty Factor: {difficultyFactor.toFixed(2)}</Text>
        </VStack>
        <Button onClick={handleStopGame} colorScheme="red">
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
      <Text textAlign="center">Time Left: {timeLeft.toFixed(1)}s</Text>

      <VStack gap={4}>
        <Text fontSize="2xl" fontWeight="bold">{currentWord}</Text>
        <Input 
          value={input}
          onChange={handleInputChange}
          placeholder="Type the word here..."
          size="lg"
          maxW="400px"
        />
      </VStack>

      <Text textAlign="center" fontSize="xl">
        Score: {localScore.toFixed(2)}
      </Text>
    </VStack>
  );
}

export default Game;