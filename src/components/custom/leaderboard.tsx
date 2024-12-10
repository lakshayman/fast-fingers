import { VStack, Text, Box } from "@chakra-ui/react";
import { Table } from "@chakra-ui/react";
import type { LeaderboardEntry } from "@/types/game";

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
  highestScore: number;
}

export default function Leaderboard({ leaderboard, highestScore }: LeaderboardProps) {
  return (
    <VStack gap={4} align="stretch" bg="white" borderRadius="xl" p={4} overflow="auto">
      <Text fontSize="2xl" fontWeight="bold">Leaderboard</Text>
      <Text suppressHydrationWarning>Highest Score: {highestScore.toFixed(0)}</Text>
      <Box overflowX="auto" width="100%" maxH="30vh" >
        <Table.Root size={{base: "sm", md: "lg"}} variant="outline">
          <Table.Header borderWidth={1} borderColor="black">
            <Table.Row>
              <Table.ColumnHeader>Player</Table.ColumnHeader>
              <Table.ColumnHeader>Diff</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Score</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Date</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body borderWidth={1} borderColor="black">
            {leaderboard.map((item, index) => (
              <Table.Row key={index}>
                <Table.Cell>{item.playerName}</Table.Cell>
                <Table.Cell>{item.difficulty}</Table.Cell>
                <Table.Cell textAlign="end" suppressHydrationWarning>
                  {item.score.toFixed(0)}
                </Table.Cell>
                <Table.Cell textAlign="end" suppressHydrationWarning>
                  {new Date(item.timestamp).toLocaleString()}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </VStack>
  );
} 