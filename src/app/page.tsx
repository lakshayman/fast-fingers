"use client"

import { Container, VStack, Text, Table } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import Form from "@/components/custom/form"
import Game from "@/components/custom/game"
import { Box, Button } from "@chakra-ui/react"
import { getDictionaryByDifficulty } from "@/utils/dictionary"
import type { LeaderboardEntry } from "@/types/game"

export default function Home() {
  const [playerName, setPlayerName] = useState("")
  const [difficulty, setDifficulty] = useState<string>("")
  const [screen, setScreen] = useState("FORM")
  const [score, setScore] = useState(0)
  const [dictionary, setDictionary] = useState<Record<string, string[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [highestScore, setHighestScore] = useState<number>(0);

  useEffect(() => {
    const initializeDictionary = async () => {
      setIsLoading(true);
      const separatedDictionary = await getDictionaryByDifficulty();
      setDictionary(separatedDictionary);
      setIsLoading(false);
    };

    initializeDictionary();

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

  const updateLeaderboard = (score: number) => {
    const newEntry: LeaderboardEntry = {
      playerName,
      score,
      difficulty,
      timestamp: Date.now()
    };

    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => a.score - b.score)
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
      <Text>Highest Score: {highestScore}</Text>
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
              <Table.Cell textAlign="end">{item.score}</Table.Cell>
              <Table.Cell textAlign="end">{new Date(item.timestamp).toLocaleString()}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </VStack>
  );

  if (isLoading) {
    return <Container maxW="container.sm" py={16}>Loading...</Container>;
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
          }}
          setScreen={setScreen}
          dictionary={dictionary}
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
