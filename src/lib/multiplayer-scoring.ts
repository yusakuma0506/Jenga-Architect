export const CORRECT_POINTS_BY_LEVEL = {
  ENTRY: 200,
  JUNIOR: 300,
  SENIOR: 400,
} as const;

export const WRONG_ANSWER_PENALTY = 50;
export const MAX_QUIZ_ATTEMPTS = 3;

export type PlayerStanding = {
  userId: string;
  name: string;
  image: string | null;
  totalScore: number;
  isEliminated: boolean;
  rank: number | null;
  rankLabel: string;
};

export function getCorrectPoints(level: keyof typeof CORRECT_POINTS_BY_LEVEL): number {
  return CORRECT_POINTS_BY_LEVEL[level];
}

export function computeStandings(
  participants: {
    userId: string;
    name: string;
    image: string | null;
    totalScore: number;
    isEliminated: boolean;
  }[]
): PlayerStanding[] {
  const active = participants
    .filter((p) => !p.isEliminated)
    .sort((a, b) => b.totalScore - a.totalScore);

  const eliminated = participants.filter((p) => p.isEliminated);

  const standings: PlayerStanding[] = [];
  let rank = 1;

  for (let i = 0; i < active.length; i++) {
    if (i > 0 && active[i].totalScore < active[i - 1].totalScore) {
      rank = i + 1;
    }

    standings.push({
      ...active[i],
      rank,
      rankLabel: formatRank(rank),
    });
  }

  const loserRank = active.length + 1;
  const loserLabel =
    eliminated.length > 1 ? `${formatRank(loserRank)} (Out)` : 'LOSER';

  for (const player of eliminated) {
    standings.push({
      ...player,
      rank: loserRank,
      rankLabel: loserLabel,
    });
  }

  return standings;
}

function formatRank(rank: number): string {
  if (rank === 1) return '1st';
  if (rank === 2) return '2nd';
  if (rank === 3) return '3rd';
  return `${rank}th`;
}
