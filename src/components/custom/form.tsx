import {
    Input,
    Box,
    Heading,
    Icon,
    VStack,
    Text,
    Button,
    createListCollection,
} from "@chakra-ui/react";
import {
    SelectRoot,
    SelectTrigger,
    SelectValueText,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Field } from "@/components/ui/field";
import { LuKeyboard, LuZap } from "react-icons/lu";

export default function Form({ playerName, difficulty, setPlayerName, setDifficulty, setScreen }: { playerName: string, difficulty: string, setPlayerName: (playerName: string) => void, setDifficulty: (difficulty: string) => void, setScreen: (screen: string) => void }) {

    const difficulties = createListCollection({
        items: [
            { label: "Easy", value: "easy", description: "2 - 4 letter words" },
            { label: "Medium", value: "medium", description: "5 - 8 letter words" },
            { label: "Hard", value: "hard", description: "8+ letter words" },
        ],
    })

    const handleStartGame = () => {
        if (typeof window !== "undefined") {
            window.sessionStorage.setItem("playerName", playerName);
            window.sessionStorage.setItem("difficulty", difficulty);
        }
        setScreen("GAME");
    };

    return (
        <VStack align="stretch" w="100%" maxW="lg">
            <VStack>
                <Icon fontSize="40px">
                    <LuKeyboard />
                </Icon>
                <Heading size="2xl" textAlign="center">Fast Fingers</Heading>
            </VStack>

            <Box
                p={6}
                borderRadius="xl"
                w="100%"
                margin="auto"
                borderWidth={1}
                borderColor="gray.200"
                bg="white"
            >
                <VStack w="100%">
                    <Field label="Player Name *">
                        <Input
                            px={4}
                            placeholder="Enter your name"
                            size="xl"
                            border="1px solid"
                            borderColor="gray.200"
                            borderRadius="xl"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            _placeholder={{ color: 'gray.400' }}
                        />
                    </Field>

                    <Field label="Difficulty Level *">
                        <SelectRoot
                            collection={difficulties}
                            size="lg"
                            width="100%"
                            px={4}
                            border="1px solid"
                            borderColor="gray.200"
                            borderRadius="xl"
                            value={[difficulty]}
                            onValueChange={(e) => setDifficulty(e.value[0])}
                        >
                            <SelectTrigger>
                                <SelectValueText placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                {difficulties.items.map((difficulty) => (
                                    <SelectItem
                                        item={difficulty}
                                        key={difficulty.value}
                                        className="bg-white hover:bg-blue-100 cursor-pointer"
                                    >
                                        <VStack align="start">
                                            <Text fontWeight="medium">{difficulty.label}</Text>
                                            <Text fontSize="sm" color="gray.600">
                                                {difficulty.description}
                                            </Text>
                                        </VStack>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </SelectRoot>
                    </Field>

                    <Button borderWidth={1} borderColor="gray.200" borderRadius="xl" p={4} className="hover:bg-blue-100 disabled:bg-gray-200 disabled:cursor-not-allowed" disabled={!playerName || !difficulty} onClick={handleStartGame}>
                        <Icon fontSize="20px"><LuZap /></Icon>
                        <Text>Start Game</Text>
                    </Button>
                </VStack>
            </Box>
        </VStack>
    )
}