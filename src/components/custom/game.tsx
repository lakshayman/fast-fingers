import { Box, Text } from "@chakra-ui/react";

function Game({ playerName, difficulty, setScore }: { playerName: string, difficulty: string, setScore: (score: number) => void }) {
  
  return (
    <Box>
      <Text>{playerName}</Text>
      <Text>{difficulty}</Text>
    </Box>  
  )
}

export default Game;