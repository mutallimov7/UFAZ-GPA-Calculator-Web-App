import { CohortStats, ProjectedRankResult, RankingAnalysis, RankingEntry } from '../../src/types.ts';
import { roundToTwoDecimals, getHonors } from './calculationEngine.ts';

export interface StudentRecord {
  id: string;
  studentId: string;
  fullName: string;
  gpa: number;
  programId: string;
  academicLevel: string;
  cohortId: string;
}

/**
 * Standard Competition Ranking (1224)
 */
export function calculateCohortRanking(
  students: StudentRecord[],
  currentUserId?: string
): {
  entries: RankingEntry[];
  stats: CohortStats;
} {
  if (students.length === 0) {
    return {
      entries: [],
      stats: {
        cohortId: '',
        programId: 'cs',
        programName: 'Computer Science',
        academicLevel: 'L2',
        totalStudents: 0,
        averageGpa: 0,
        medianGpa: 0,
        highestGpa: 0,
        lowestGpa: 0,
        distribution: [],
      },
    };
  }

  // Sort descending by GPA; for ties, sort alphabetically by student full name
  const sorted = [...students].sort((a, b) => {
    if (b.gpa !== a.gpa) {
      return b.gpa - a.gpa;
    }
    return a.fullName.localeCompare(b.fullName);
  });
  const totalStudents = sorted.length;
  const allZeroGpa = sorted.every((s) => s.gpa === 0);

  // Build ranking entries with competition ranking and tie handling
  const entries: RankingEntry[] = [];
  let currentRank = 1;

  for (let i = 0; i < sorted.length; i++) {
    const student = sorted[i];

    // Standard competition ranking or sequential roster numbering if all 0
    if (allZeroGpa) {
      currentRank = i + 1;
    } else if (i > 0 && sorted[i].gpa === sorted[i - 1].gpa) {
      currentRank = entries[i - 1].rank;
    } else {
      currentRank = i + 1;
    }

    const isCurrentUser = Boolean(currentUserId && student.id === currentUserId);
    const percentileVal = Math.max(1, Math.round((currentRank / totalStudents) * 100));

    // Show student full name instead of anonymized "Student A01"
    const studentDisplay = isCurrentUser ? `${student.fullName} (You)` : student.fullName;
    // Protect other students' private Student IDs from being exposed/copied
    const studentIdMasked = isCurrentUser
      ? student.studentId
      : `${student.studentId.slice(0, 4)}••••`;

    entries.push({
      rank: currentRank,
      studentDisplay,
      studentIdMasked,
      gpa: roundToTwoDecimals(student.gpa),
      isCurrentUser,
      honors: getHonors(student.gpa),
      percentileText: allZeroGpa ? 'Pending' : `Top ${percentileVal}%`,
    });
  }

  // Calculate statistics
  const gpaList = sorted.map((s) => s.gpa);
  const sum = gpaList.reduce((acc, curr) => acc + curr, 0);
  const averageGpa = roundToTwoDecimals(sum / (totalStudents || 1));

  // Median
  const mid = Math.floor(totalStudents / 2);
  const medianGpa =
    totalStudents % 2 !== 0
      ? roundToTwoDecimals(gpaList[mid] || 0)
      : roundToTwoDecimals(((gpaList[mid - 1] || 0) + (gpaList[mid] || 0)) / 2);

  const highestGpa = roundToTwoDecimals(gpaList[0] || 0);
  const lowestGpa = roundToTwoDecimals(gpaList[totalStudents - 1] || 0);

  // Distribution bins
  const distributionBins = allZeroGpa
    ? [{ range: '0.00 (No Exam Yet)', min: 0.0, max: 0.0, count: totalStudents, percentage: 100 }]
    : [
        { range: '18.00 – 20.00 (Très Bien+)', min: 18.0, max: 20.0, count: 0, percentage: 0 },
        { range: '16.00 – 17.99 (Très Bien)', min: 16.0, max: 17.99, count: 0, percentage: 0 },
        { range: '14.00 – 15.99 (Bien)', min: 14.0, max: 15.99, count: 0, percentage: 0 },
        { range: '12.00 – 13.99 (Assez Bien)', min: 12.0, max: 13.99, count: 0, percentage: 0 },
        { range: '10.00 – 11.99 (Passable)', min: 10.0, max: 11.99, count: 0, percentage: 0 },
        { range: '0.00 – 9.99 (Ajourné)', min: 0.0, max: 9.99, count: 0, percentage: 0 },
      ];

  if (!allZeroGpa) {
    for (const gpa of gpaList) {
      for (const bin of distributionBins) {
        if (gpa >= bin.min && (gpa <= bin.max || (bin.max === 20 && gpa === 20))) {
          bin.count++;
          break;
        }
      }
    }
  }

  distributionBins.forEach((b) => {
    b.percentage = roundToTwoDecimals((b.count / totalStudents) * 100);
  });

  const firstStudent = sorted[0];
  const stats: CohortStats = {
    cohortId: firstStudent.cohortId,
    programId: firstStudent.programId as any,
    programName: firstStudent.programId.toUpperCase(),
    academicLevel: firstStudent.academicLevel as any,
    totalStudents,
    averageGpa,
    medianGpa,
    highestGpa,
    lowestGpa,
    distribution: distributionBins,
  };

  return { entries, stats };
}

/**
 * Detailed Ranking Analysis for the logged-in student,
 * including exact percentile, gap to next rank above, and rank below.
 */
export function analyzeStudentRank(
  rankingEntries: RankingEntry[],
  currentUserId: string,
  stats: CohortStats
): RankingAnalysis | null {
  const userEntryIndex = rankingEntries.findIndex((e) => e.isCurrentUser);
  if (userEntryIndex === -1) {
    return null;
  }

  const userEntry = rankingEntries[userEntryIndex];
  const currentRank = userEntry.rank;
  const totalStudents = stats.totalStudents;
  const percentile = Math.max(1, Math.round((currentRank / totalStudents) * 100));

  // Find first student with a rank strictly above (smaller rank number)
  let nextRankAbove: RankingAnalysis['nextRankAbove'] = null;
  for (let i = userEntryIndex - 1; i >= 0; i--) {
    if (rankingEntries[i].rank < currentRank) {
      const above = rankingEntries[i];
      nextRankAbove = {
        rank: above.rank,
        gpa: above.gpa,
        gap: roundToTwoDecimals(above.gpa - userEntry.gpa),
        studentDisplay: above.studentDisplay,
      };
      break;
    }
  }

  // Find first student with a rank strictly below (higher rank number)
  let rankBelow: RankingAnalysis['rankBelow'] = null;
  for (let i = userEntryIndex + 1; i < rankingEntries.length; i++) {
    if (rankingEntries[i].rank > currentRank) {
      const below = rankingEntries[i];
      rankBelow = {
        rank: below.rank,
        gpa: below.gpa,
        gap: roundToTwoDecimals(userEntry.gpa - below.gpa),
      };
      break;
    }
  }

  return {
    currentRank,
    totalStudents,
    studentGpa: userEntry.gpa,
    percentile,
    cohortAverage: stats.averageGpa,
    cohortMedian: stats.medianGpa,
    highestGpa: stats.highestGpa,
    nextRankAbove,
    rankBelow,
  };
}

/**
 * Simulate projected rank outcome for a hypothetical GPA
 */
export function simulateProjectedRank(
  currentEntries: RankingEntry[],
  currentRank: number,
  projectedGpa: number
): ProjectedRankResult {
  const cleanGpa = roundToTwoDecimals(projectedGpa);
  const totalStudents = currentEntries.length;

  // Count how many students in the cohort currently have GPA > projectedGpa
  let estimatedRank = 1;
  for (const entry of currentEntries) {
    if (entry.isCurrentUser) continue; // Compare against peers
    if (entry.gpa > cleanGpa) {
      estimatedRank++;
    }
  }

  const rankDelta = currentRank - estimatedRank; // positive = promoted
  const estimatedPercentile = Math.max(1, Math.round((estimatedRank / totalStudents) * 100));

  // Find the GPA of the person right above the estimated position
  const closestPeer = currentEntries.find((e) => !e.isCurrentUser && e.rank === estimatedRank - 1);

  return {
    projectedGpa: cleanGpa,
    currentRank,
    estimatedRank,
    totalStudents,
    rankDelta,
    estimatedPercentile,
    closestRankGpa: closestPeer ? closestPeer.gpa : cleanGpa,
  };
}
