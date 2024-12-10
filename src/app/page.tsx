"use client"

import { Container } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import Form from "@/components/custom/form"
import Game from "@/components/custom/game"
import { Box, Text, Button } from "@chakra-ui/react"
import { getDictionaryByDifficulty } from "@/utils/dictionary"

export default function Home() {
  const [playerName, setPlayerName] = useState("")
  const [difficulty, setDifficulty] = useState<string>("")
  const [screen, setScreen] = useState("FORM")
  const [score, setScore] = useState(0)
  const [dictionary, setDictionary] = useState<Record<string, string[]>>({})
  const [isLoading, setIsLoading] = useState(true)

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
  }, []);

  if (isLoading) {
    return <Container maxW="container.sm" py={16}>Loading...</Container>;
  }

  return (
    <Container maxW="container.sm" py={16}>
      {screen === "FORM" ? (
        <Form 
          playerName={playerName} 
          difficulty={difficulty} 
          setPlayerName={setPlayerName} 
          setDifficulty={setDifficulty} 
          setScreen={setScreen} 
        />
      ) : screen === "GAME" ? (
        <Game 
          playerName={playerName} 
          difficulty={difficulty} 
          setScore={setScore} 
          setScreen={setScreen}
          dictionary={dictionary}
        />
      ) : (
        <Box>
          <Text>Final Score: {score}</Text>
          <Button onClick={() => setScreen("FORM")}>Play Again</Button>
        </Box>
      )}
    </Container>
  );
}
