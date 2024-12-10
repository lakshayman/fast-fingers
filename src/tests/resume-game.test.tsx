import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import ResumeGame from '@/components/custom/resume-game'

const mockSavedState = {
  currentWord: 'test',
  timeLeft: 5,
  localScore: 50,
  difficulty: 'medium',
  difficultyFactor: 1.5,
  totalTimeElapsed: 100,
  wordStartTime: 10,
  playerName: 'Test Player'
}

const defaultProps = {
  savedState: mockSavedState,
  onResume: jest.fn(),
  onRestart: jest.fn()
}

describe('ResumeGame', () => {
  it('renders saved game information', () => {
    render(<ChakraProvider value={defaultSystem}>
      <ResumeGame {...defaultProps} />
    </ChakraProvider>)
    
    expect(screen.getByText(/Test Player/)).toBeInTheDocument()
    expect(screen.getByText(/Score: 50/)).toBeInTheDocument()
    expect(screen.getByText(/Difficulty: medium/)).toBeInTheDocument()
  })

  it('handles resume button click', () => {
    render(<ChakraProvider value={defaultSystem}>
      <ResumeGame {...defaultProps} />
    </ChakraProvider>)
    
    const resumeButton = screen.getByText('Resume Game')
    fireEvent.click(resumeButton)
    
    expect(defaultProps.onResume).toHaveBeenCalled()
  })

  it('handles new game button click', () => {
    render(<ChakraProvider value={defaultSystem}>
      <ResumeGame {...defaultProps} />
    </ChakraProvider>)
    
    const newGameButton = screen.getByText('Start New Game')
    fireEvent.click(newGameButton)
    
    expect(defaultProps.onRestart).toHaveBeenCalled()
  })
})