"use client"

import { Container, VStack, Spinner } from "@chakra-ui/react"
import { useReducer, useMemo, useCallback, useEffect } from "react"
import Form from "@/components/custom/form"
import Game from "@/components/custom/game"
import type { LeaderboardEntry } from "@/types/game"
import Leaderboard from "@/components/custom/leaderboard"
import ResumeGame from "@/components/custom/resume-game"
import FinalScore from "@/components/custom/final-score"
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useSessionStorage } from '@/hooks/useSessionStorage'
import { GameStates } from '@/types/gameStates'
import { initialState } from '@/constants/game'
import { useDictionary } from '@/hooks/useDictionary'
import { reducer } from '@/reducers/gameReducer'

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState as GameStates);
  const [gameState, setGameState] = useLocalStorage('gameState', null);
  const [leaderboard, setLeaderboard] = useLocalStorage('leaderboard', []);
  const [playerName, setPlayerName] = useSessionStorage('playerName', '');
  const [difficulty, setDifficulty] = useSessionStorage('difficulty', 'easy');
  const { dictionary, isLoading } = useDictionary();

  const highestScore = useMemo(() =>
    leaderboard.reduce((max: number, entry: LeaderboardEntry) =>
      entry.score > max ? entry.score : max, 0
    ), [leaderboard]
  );

  const updateLeaderboard = useCallback((playerName: string, difficulty: string, score: number) => {
    const newEntry: LeaderboardEntry = {
      playerName,
      score,
      difficulty,
      timestamp: Date.now()
    };

    setLeaderboard([...leaderboard, newEntry].sort((a, b) => b.score - a.score)
      .slice(0, 10));
  }, []);

  useEffect(() => {
    console.log('gameState', gameState);
  }, [gameState]);

  const handleResume = useCallback(() => {
    console.log('handleResume', gameState);
    if (gameState) {
      dispatch({ type: 'SET_SCREEN', payload: "GAME" });
    }
  }, [gameState]);

  const handleRestart = useCallback(() => {
    if (gameState) {
      updateLeaderboard(playerName, difficulty, gameState.localScore);
    }
    setGameState(null);
    dispatch({ type: 'SET_SCREEN', payload: "FORM" });
  }, [gameState, playerName, difficulty, updateLeaderboard]);

  if (isLoading) {
    return <Container maxW="100%" h="100vh" py={16} justifyContent="center" alignItems="center" bg="url('/bg.jpg')" bgSize="cover">
      <Spinner
        size="lg"
        color="blue.500"
      />
    </Container>;
  }

  if (gameState) {
    return (
      <ResumeGame
        savedState={gameState}
        onResume={handleResume}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <Container w="100%" h="100vh" maxW="100%" py={16} bg="url('/bg.jpg')" bgSize="cover" overflow="auto">
      {state.screen === "FORM" ? (
        <VStack gap={8}>
          <Form
            playerName={playerName}
            difficulty={difficulty}
            setPlayerName={setPlayerName}
            setDifficulty={setDifficulty}
            setScreen={(screen) => dispatch({ type: 'SET_SCREEN', payload: screen })}
          />
          {leaderboard.length > 0 && <Leaderboard leaderboard={leaderboard} highestScore={highestScore} />}
        </VStack>
      ) : state.screen === "GAME" ? (
        <Game
          playerName={playerName}
          difficulty={difficulty}
          setScore={(score) => {
            dispatch({ type: 'SET_SCORE', payload: score });
            updateLeaderboard(playerName, difficulty, score);
            localStorage.removeItem('gameState');
          }}
          setScreen={(screen) => dispatch({ type: 'SET_SCREEN', payload: screen })}
          dictionary={dictionary}
          savedState={gameState}
          setGameState={setGameState}
        />
      ) : (
        <FinalScore
          score={state.score}
          highestScore={highestScore}
          leaderboard={leaderboard}
          onPlayAgain={() => dispatch({ type: 'SET_SCREEN', payload: "GAME" })}
          setScreen={(screen) => dispatch({ type: 'SET_SCREEN', payload: screen })}
        />
      )}
    </Container>
  );
}
