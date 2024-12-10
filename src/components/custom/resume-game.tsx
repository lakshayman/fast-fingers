import { VStack, Text, HStack, Button, Container } from "@chakra-ui/react";
import type { GameState } from "@/types/game";

interface ResumeGameProps {
  savedState: GameState | null;
  onResume: () => void;
  onRestart: () => void;
}

export default function ResumeGame({ savedState, onResume, onRestart }: ResumeGameProps) {
  return (
    <Container maxW="100%" h="100vh" py={16} bg="yellow.300">
      <VStack gap={6}>
        <Text fontSize="xl">Game in progress found</Text>
        <Text>Would you like to resume your previous game?</Text>
        <Text>Player: {savedState?.playerName}</Text>
        <Text>Score: {savedState?.localScore.toFixed(2)}</Text>
        <Text>Difficulty: {savedState?.difficulty}</Text>
        <HStack>
          <Button 
            bg="white" 
            borderWidth={1} 
            borderColor="gray.200" 
            borderRadius="xl" 
            p={4} 
            className="hover:bg-blue-100 disabled:bg-gray-200 disabled:cursor-not-allowed" 
            onClick={onResume} 
            colorScheme="blue"
          >
            Resume Game
          </Button>
          <Button 
            bg="white" 
            borderWidth={1} 
            borderColor="gray.200" 
            borderRadius="xl" 
            p={4} 
            className="hover:bg-blue-100 disabled:bg-gray-200 disabled:cursor-not-allowed" 
            onClick={onRestart}
          >
            Start New Game
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
} 