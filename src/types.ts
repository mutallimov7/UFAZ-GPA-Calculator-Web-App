/**
 * UFAZ Academic GPA & Ranking Platform
 * Shared TypeScript Definitions
 */

export type ProgramId = 'cs' | 'che' | 'ge' | 'pe' | 'chem';
export type AcademicLevel = 'L1' | 'L2' | 'L3' | 'M1' | 'M2';
export type SemesterId = 'L1_S1' | 'L1_S2' | 'L2_S3' | 'L2_S4' | 'L3_S5' | 'L3_S6';
export type UserRole = 'student' | 'admin';

export interface AssessmentComponentDef {
  id: string;
  name: string;
  label: string;
  groupId?: string;
  groupName?: string;
  weight?: number;
  maxScore?: number; // usually 20 in the French system
  defaultValue?: number;
  description?: string;
}

export interface SubGroupDef {
  id: string;
  name: string;
  components: AssessmentComponentDef[];
  formulaText: string;
  weight?: number;
}

export interface ModuleDef {
  id: string;
  name: string;
  code: string;
  ects: number;
  gpaWeight: number;
  formulaDescription: string;
  subGroups?: SubGroupDef[];
  components: AssessmentComponentDef[];
}

export interface ProgramConfig {
  id: ProgramId;
  name: string;
  frenchName: string;
  partnerUniversity: string; // e.g., Université de Strasbourg (Unistra), Université de Rennes 1
  level: AcademicLevel;
  semester: string;
  totalEcts: number;
  totalGpaWeight: number;
  modules: ModuleDef[];
  gpaFormulaText: string;
}

export interface CalculationResult {
  programId: ProgramId;
  academicLevel: AcademicLevel;
  semester: string;
  moduleResults: {
    moduleId: string;
    moduleName: string;
    grade: number;
    ects: number;
    gpaWeight: number;
    passed: boolean; // >= 10.00
    subGroupResults?: Record<string, number>;
  }[];
  finalGpa: number;
  totalEcts: number;
  ectsEarned: number;
  honors: 'Très Bien (High Honors)' | 'Bien (Honors)' | 'Assez Bien (Satisfactory)' | 'Passable (Pass)' | 'Ajourné (Fail)' | 'En cours (No Exam Yet)';
  status: 'admitted' | 'admitted_with_compensation' | 'repeat';
  validationErrors?: { field: string; message: string }[];
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  studentId: string;
  role: UserRole;
  programId: ProgramId;
  academicLevel: AcademicLevel;
  currentSemester: string;
  gpa: number;
  cohortId: string;
  group?: string;
  isActivated?: boolean;
}

export interface SavedAcademicRecord {
  id: string;
  userId: string;
  studentId: string;
  programId: ProgramId;
  academicLevel: AcademicLevel;
  semester: string;
  academicYear: string;
  componentScores: Record<string, number>;
  moduleGrades: Record<string, number>;
  gpa: number;
  honors: string;
  savedAt: string;
  isOfficial?: boolean;
}

export interface RankingEntry {
  rank: number;
  studentDisplay: string; // "You" or "Student A17"
  studentIdMasked: string; // "2201****"
  gpa: number;
  isCurrentUser: boolean;
  honors: string;
  percentileText: string;
}

export interface CohortStats {
  cohortId: string;
  programId: ProgramId;
  programName: string;
  academicLevel: AcademicLevel;
  totalStudents: number;
  averageGpa: number;
  medianGpa: number;
  highestGpa: number;
  lowestGpa: number;
  distribution: {
    range: string;
    min: number;
    max: number;
    count: number;
    percentage: number;
  }[];
}

export interface RankingAnalysis {
  currentRank: number;
  totalStudents: number;
  studentGpa: number;
  percentile: number; // e.g. 27 for Top 27%
  cohortAverage: number;
  cohortMedian: number;
  highestGpa: number;
  nextRankAbove: {
    rank: number;
    gpa: number;
    gap: number;
    studentDisplay: string;
  } | null;
  rankBelow: {
    rank: number;
    gpa: number;
    gap: number;
  } | null;
}

export interface ProjectedRankResult {
  projectedGpa: number;
  currentRank: number;
  estimatedRank: number;
  totalStudents: number;
  rankDelta: number; // positive means moved up, e.g. +8
  estimatedPercentile: number;
  closestRankGpa: number;
}

export interface StudentRecord {
  id: string;
  studentId: string;
  fullName: string;
  gpa: number;
  programId: string;
  academicLevel: string;
  cohortId: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  category: string;
  publishDate?: string;
  date?: string;
  isPinned: boolean;
  author?: string;
}

export interface DegreeProgressData {
  programName?: string;
  partnerUniversity?: string;
  degreeName?: string;
  totalEctsRequired?: number;
  completedEcts?: number;
  totalCreditsRequired?: number;
  creditsCompleted?: number;
  creditsRemaining?: number;
  currentCumulativeGpa?: number;
  semestersCompleted?: number;
  totalSemesters?: number;
  levels: {
    level: string;
    status: 'completed' | 'in_progress' | 'upcoming';
    credits?: number;
    totalEcts?: number;
    earnedEcts?: number;
    gpa?: number;
    semesters?: {
      semester: string;
      totalEcts: number;
      earnedEcts: number;
      status: string;
      modules: string[];
    }[];
  }[];
}

