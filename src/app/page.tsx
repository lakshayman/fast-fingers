"use client"

import {
  Container,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import Form from "@/components/custom/form"
import Game from "@/components/custom/game"
export default function Home() {
  const [playerName, setPlayerName] = useState("")
  const [difficulty, setDifficulty] = useState<string>("")

  const [isGameStarted, setIsGameStarted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPlayerName(window.sessionStorage.getItem("playerName") || "")
      setDifficulty(window.sessionStorage.getItem("difficulty") || "")
    }
  }, []);

  return (
    <Container maxW="container.sm" py={16}>
      {isGameStarted 
        ? <Game playerName={playerName} difficulty={difficulty} setScore={setScore} /> 
        : <Form playerName={playerName} difficulty={difficulty} setPlayerName={setPlayerName} setDifficulty={setDifficulty} setIsGameStarted={setIsGameStarted} />}
    </Container>
  )
}
