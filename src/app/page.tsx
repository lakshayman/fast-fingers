"use client"

import { Container, VStack, Text, Table, HStack, Button, Box, Spinner } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import Form from "@/components/custom/form"
import Game from "@/components/custom/game"
import { getDictionaryByDifficulty } from "@/utils/dictionary"
import type { LeaderboardEntry, GameState } from "@/types/game"

export default function Home() {
  const [playerName, setPlayerName] = useState("")
  const [difficulty, setDifficulty] = useState<string>("")
  const [screen, setScreen] = useState("FORM")
  const [score, setScore] = useState(0)
  const [dictionary, setDictionary] = useState<Record<string, string[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [highestScore, setHighestScore] = useState<number>(0)
  const [showResume, setShowResume] = useState(false)
  const [savedState, setSavedState] = useState<GameState | null>(null)

  useEffect(() => {
    const initializeDictionary = async () => {
      setIsLoading(true);
      const separatedDictionary = await getDictionaryByDifficulty();
      setDictionary(separatedDictionary);
      setIsLoading(false);
    };

    initializeDictionary();

    const saved = localStorage.getItem('gameState');
    if (saved) {
      const parsedState = JSON.parse(saved);
      setSavedState(parsedState);
      setShowResume(true);
    }

    if (typeof window !== "undefined") {
      setPlayerName(window.sessionStorage.getItem("playerName") || "")
      setDifficulty(window.sessionStorage.getItem("difficulty") || "easy")
    }

    const savedLeaderboard = localStorage.getItem('leaderboard');
    if (savedLeaderboard) {
      const parsedLeaderboard = JSON.parse(savedLeaderboard);
      setLeaderboard(parsedLeaderboard);
      
      const highest = parsedLeaderboard.reduce((max: number, entry: LeaderboardEntry) => 
        entry.score > max ? entry.score : max, 0);
      setHighestScore(highest);
    }
  }, []);

  const handleResume = () => {
    if (savedState) {
      setPlayerName(savedState.playerName);
      setDifficulty(savedState.difficulty);
      setScreen("GAME");
    }
    setShowResume(false);
  };

  const handleRestart = () => {
    if (savedState) {
      updateLeaderboard(savedState.localScore);
    }
    setSavedState(null);
    localStorage.removeItem('gameState');
    setShowResume(false);
    setScreen("FORM");
  };

  const updateLeaderboard = (score: number) => {
    const newEntry: LeaderboardEntry = {
      playerName,
      score,
      difficulty,
      timestamp: Date.now()
    };

    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    setLeaderboard(updatedLeaderboard);
    localStorage.setItem('leaderboard', JSON.stringify(updatedLeaderboard));

    if (score > highestScore) {
      setHighestScore(score);
    }
  };

  const renderLeaderboard = () => (
    <VStack gap={4} align="stretch">
      <Text fontSize="2xl" fontWeight="bold">Leaderboard</Text>
      <Text suppressHydrationWarning>Highest Score: {highestScore.toFixed(2)}</Text>
      <Table.Root size="md" variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Player Name</Table.ColumnHeader>
            <Table.ColumnHeader>Difficulty</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Score</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Date and Time</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {leaderboard.map((item, index) => (
            <Table.Row key={index}> 
              <Table.Cell>{item.playerName}</Table.Cell>
              <Table.Cell>{item.difficulty}</Table.Cell>
              <Table.Cell textAlign="end" suppressHydrationWarning>{item.score.toFixed(2)}</Table.Cell>
              <Table.Cell textAlign="end" suppressHydrationWarning>{new Date(item.timestamp).toLocaleString()}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </VStack>
  );

  if (isLoading) {
    return <Container maxW="container.sm" py={16} justifyContent="center" alignItems="center">
      <Spinner
        size="lg"
        color="blue.500"
      />
    </Container>;
  }

  if (showResume) {
    return (
      <Container maxW="container.sm" py={16}>
        <VStack gap={6}>
          <Text fontSize="xl">Game in progress found</Text>
          <Text>Would you like to resume your previous game?</Text>
          <Text>Player: {savedState?.playerName}</Text>
          <Text>Score: {savedState?.localScore.toFixed(2)}</Text>
          <Text>Difficulty: {savedState?.difficulty}</Text>
          <HStack>
            <Button onClick={handleResume} colorScheme="blue">Resume Game</Button>
            <Button onClick={handleRestart}>Start New Game</Button>
          </HStack>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.sm" py={16}>
      {screen === "FORM" ? (
        <VStack gap={8}>
          <Form 
            playerName={playerName} 
            difficulty={difficulty} 
            setPlayerName={setPlayerName} 
            setDifficulty={setDifficulty} 
            setScreen={setScreen} 
          />
          {leaderboard.length > 0 && renderLeaderboard()}
        </VStack>
      ) : screen === "GAME" ? (
        <Game 
          playerName={playerName} 
          difficulty={difficulty} 
          setScore={(score) => {
            setScore(score);
            updateLeaderboard(score);
            localStorage.removeItem('gameState');
          }}
          setScreen={setScreen}
          dictionary={dictionary}
          savedState={savedState}
        />
      ) : (
        <VStack gap={8}>
          <Box>
            <Text fontSize="2xl">Final Score: {score}</Text>
            {score === highestScore && <Text color="green.500">New High Score!</Text>}
            <Button onClick={() => setScreen("FORM")}>Play Again</Button>
          </Box>
          {renderLeaderboard()}
        </VStack>
      )}
    </Container>
  );
}
