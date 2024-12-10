import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import FinalScore from '@/components/custom/final-score'

const mockLeaderboard = [
  { playerName: 'Player 1', score: 100, difficulty: 'easy', timestamp: Date.now() },
  { playerName: 'Player 2', score: 90, difficulty: 'medium', timestamp: Date.now() }
]

const defaultProps = {
  score: 95,
  highestScore: 100,
  leaderboard: mockLeaderboard,
  onPlayAgain: jest.fn()
}

describe('FinalScore', () => {
  it('renders score and leaderboard', () => {
    render(<ChakraProvider value={defaultSystem}>
      <FinalScore {...defaultProps} />
    </ChakraProvider>)
    
    expect(screen.getByText(/Final Score: 95/)).toBeInTheDocument()
    expect(screen.getByText('Player 1')).toBeInTheDocument()
    expect(screen.getByText('Player 2')).toBeInTheDocument()
  })

  it('shows new high score message when score equals highest score', () => {
    render(<ChakraProvider value={defaultSystem}>
      <FinalScore {...defaultProps} score={100} />
    </ChakraProvider>)
    
    expect(screen.getByText('New High Score!')).toBeInTheDocument()
  })

  it('handles play again button click', () => {
    render(<ChakraProvider value={defaultSystem}>
      <FinalScore {...defaultProps} />
    </ChakraProvider>)
    
    const playAgainButton = screen.getByText('Play Again')
    fireEvent.click(playAgainButton)
    
    expect(defaultProps.onPlayAgain).toHaveBeenCalled()
  })
})