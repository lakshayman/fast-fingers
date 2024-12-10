import '@testing-library/jest-dom'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import Game from '@/components/custom/game'

const mockDictionary = {
  easy: ['cat', 'dog'],
  medium: ['house', 'mouse'],
  hard: ['elephant', 'giraffe']
}

const defaultProps = {
  playerName: 'Test Player',
  difficulty: 'easy',
  setScore: jest.fn(),
  setScreen: jest.fn(),
  dictionary: mockDictionary,
  savedState: null
}

describe('Game', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers()
    })
    jest.useRealTimers()
    localStorage.clear()
  })

  it('updates difficulty factor when word is typed correctly', async () => {
    render(<ChakraProvider value={defaultSystem}>
      <Game {...defaultProps} />
    </ChakraProvider>)
    
    const input = screen.getByTestId("game-input")
    const currentWord = screen.getByTestId('game-word').textContent
    const initialDifficultyFactor = screen.getByText(/Difficulty Factor/).textContent

    await act(async () => {
      await fireEvent.change(input, { target: { value: currentWord! } })
    })

    act(() => {
      jest.advanceTimersByTime(500)
    })

    const newDifficultyFactor = screen.getByText(/Difficulty Factor/).textContent
    expect(newDifficultyFactor).not.toBe(initialDifficultyFactor)
  })

  it('saves game state to localStorage', () => {
    render(<ChakraProvider value={defaultSystem}>
      <Game {...defaultProps} />
    </ChakraProvider>)

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    const savedState = localStorage.getItem('gameState')
    expect(savedState).toBeTruthy()
    const parsedState = JSON.parse(savedState!)
    expect(parsedState.playerName).toBe('Test Player')
  })

  it('handles stop game button click', () => {
    render(<ChakraProvider value={defaultSystem}>
      <Game {...defaultProps} />
    </ChakraProvider>)

    const stopButton = screen.getByText('Stop Game')
    fireEvent.click(stopButton)

    expect(defaultProps.setScore).toHaveBeenCalled()
    expect(defaultProps.setScreen).toHaveBeenCalledWith('FINAL_SCORE')
  })
})