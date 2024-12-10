import { VStack, Text, Box, Button, HStack } from "@chakra-ui/react";
import Leaderboard from "./leaderboard";
import type { LeaderboardEntry } from "@/types/game";

interface FinalScoreProps {
  score: number;
  highestScore: number;
  leaderboard: LeaderboardEntry[];
  onPlayAgain: () => void;
  setScreen: (screen: string) => void;
}

export default function FinalScore({ score, highestScore, leaderboard, onPlayAgain, setScreen }: FinalScoreProps) {
  return (
    <VStack gap={8}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Text fontSize="2xl" color="white">Final Score: {score}</Text>
        {score === highestScore && <Text color="green.500">New High Score!</Text>}
        <HStack>
          <Button 
            bg="white" 
          borderWidth={1} 
          borderColor="gray.200" 
          borderRadius="xl" 
          p={4} 
          className="hover:bg-blue-100 disabled:bg-gray-200 disabled:cursor-not-allowed" 
          onClick={onPlayAgain}
        >
          Play Again
        </Button>
        <Button 
            bg="white" 
          borderWidth={1} 
          borderColor="gray.200" 
          borderRadius="xl" 
          p={4} 
          className="hover:bg-blue-100 disabled:bg-gray-200 disabled:cursor-not-allowed" 
          onClick={() => setScreen("FORM")}
        >
          Go to Home
        </Button>
        </HStack>
      </Box>
      <Leaderboard leaderboard={leaderboard} highestScore={highestScore} />
    </VStack>
  );
} 