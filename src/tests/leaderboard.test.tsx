import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import Leaderboard from '@/components/custom/leaderboard'
import type { LeaderboardEntry } from '@/types/game'

const mockLeaderboard: LeaderboardEntry[] = [
  {
    playerName: 'Player 1',
    score: 100,
    difficulty: 'easy',
    timestamp: 1710000000000
  },
  {
    playerName: 'Player 2',
    score: 85.5,
    difficulty: 'medium',
    timestamp: 1710086400000
  },
  {
    playerName: 'Player 3',
    score: 120.75,
    difficulty: 'hard',
    timestamp: 1710172800000
  }
]

describe('Leaderboard', () => {
  it('renders leaderboard title and highest score', () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <Leaderboard leaderboard={mockLeaderboard} highestScore={120.75} />
      </ChakraProvider>
    )

    expect(screen.getByText('Leaderboard')).toBeInTheDocument()
    expect(screen.getByText('Highest Score: 121')).toBeInTheDocument()
  })

  it('displays all player entries with correct information', () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <Leaderboard leaderboard={mockLeaderboard} highestScore={120.75} />
      </ChakraProvider>
    )

    expect(screen.getByText('Player 1')).toBeInTheDocument()
    expect(screen.getByText('Player 2')).toBeInTheDocument()
    expect(screen.getByText('Player 3')).toBeInTheDocument()

    expect(screen.getByText('easy')).toBeInTheDocument()
    expect(screen.getByText('medium')).toBeInTheDocument()
    expect(screen.getByText('hard')).toBeInTheDocument()

    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('86')).toBeInTheDocument()
    expect(screen.getByText('121')).toBeInTheDocument()
  })

  it('renders empty leaderboard correctly', () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <Leaderboard leaderboard={[]} highestScore={0} />
      </ChakraProvider>
    )

    expect(screen.getByText('Leaderboard')).toBeInTheDocument()
    expect(screen.getByText('Highest Score: 0')).toBeInTheDocument()
  })

  it('renders table headers correctly', () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <Leaderboard leaderboard={mockLeaderboard} highestScore={120.75} />
      </ChakraProvider>
    )

    expect(screen.getByText('Player')).toBeInTheDocument()
    expect(screen.getByText('Diff')).toBeInTheDocument()
    expect(screen.getByText('Score')).toBeInTheDocument()
    expect(screen.getByText('Date')).toBeInTheDocument()
  })
})