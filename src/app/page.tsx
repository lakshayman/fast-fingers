"use client"

import { Container, VStack, Spinner } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import Form from "@/components/custom/form"
import Game from "@/components/custom/game"
import { getDictionaryByDifficulty } from "@/utils/dictionary"
import type { LeaderboardEntry, GameState } from "@/types/game"
import Leaderboard from "@/components/custom/leaderboard"
import ResumeGame from "@/components/custom/resume-game"
import FinalScore from "@/components/custom/final-score"

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
      updateLeaderboard(savedState.playerName, savedState.difficulty, savedState.localScore);
    }
    setSavedState(null);
    localStorage.removeItem('gameState');
    setShowResume(false);
    setScreen("FORM");
  };

  const updateLeaderboard = (playerName: string, difficulty: string, score: number) => {
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

  if (isLoading) {
    return <Container maxW="100%" h="100vh" py={16} justifyContent="center" alignItems="center" bg="url('/bg.jpg')" bgSize="cover">
      <Spinner
        size="lg"
        color="blue.500"
      />
    </Container>;
  }

  if (showResume) {
    return (
      <ResumeGame 
        savedState={savedState}
        onResume={handleResume}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <Container w="100%" h="100vh" maxW="100%" py={16} bg="url('/bg.jpg')" bgSize="cover" overflow="auto">
      {screen === "FORM" ? (
        <VStack gap={8}>
          <Form
            playerName={playerName}
            difficulty={difficulty}
            setPlayerName={setPlayerName}
            setDifficulty={setDifficulty}
            setScreen={setScreen}
          />
          {leaderboard.length > 0 && <Leaderboard leaderboard={leaderboard} highestScore={highestScore} />}
        </VStack>
      ) : screen === "GAME" ? (
        <Game
          playerName={playerName}
          difficulty={difficulty}
          setScore={(score) => {
            setScore(score);
            updateLeaderboard(playerName, difficulty, score);
            localStorage.removeItem('gameState');
          }}
          setScreen={setScreen}
          dictionary={dictionary}
          savedState={savedState}
        />
      ) : (
        <FinalScore 
          score={score}
          highestScore={highestScore}
          leaderboard={leaderboard}
          onPlayAgain={() => setScreen("GAME")}
          setScreen={setScreen}
        />
      )}
    </Container>
  );
}
