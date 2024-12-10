import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import Form from '../components/custom/form'

const defaultProps = {
    playerName: '',
    difficulty: '',
    setPlayerName: jest.fn(),
    setDifficulty: jest.fn(),
    setScreen: jest.fn()
}

describe('Form', () => {
    it('renders form elements correctly', () => {
        render(<ChakraProvider value={defaultSystem}>
            <Form {...defaultProps} />
        </ChakraProvider>)
        expect(screen.getByText('Fast Fingers')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
        expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('handles name input correctly', async () => {
        render(<ChakraProvider value={defaultSystem}>
            <Form {...defaultProps} />
        </ChakraProvider>)
        const input = screen.getByPlaceholderText('Enter your name')
        await fireEvent.change(input, { target: { value: 'John' } })
        expect(defaultProps.setPlayerName).toHaveBeenCalledWith('John')
    })

    it('disables start button when form is incomplete', () => {
        render(<ChakraProvider value={defaultSystem}>
            <Form {...defaultProps} />
        </ChakraProvider>)
        const startButton = screen.getByTestId('start-button')
        expect(startButton).toBeDisabled()
    })

    it('enables start button when form is complete', () => {
        render(<ChakraProvider value={defaultSystem}>
            <Form {...defaultProps} {...{ playerName: 'John', difficulty: 'easy' }} />
        </ChakraProvider>)
        const startButton = screen.getByTestId('start-button')
        expect(startButton).not.toBeDisabled()
    })
})