import {
  AnnouncementItem,
  CalculationResult,
  CohortStats,
  DegreeProgressData,
  ProgramConfig,
  ProgramId,
  ProjectedRankResult,
  RankingAnalysis,
  RankingEntry,
  SavedAcademicRecord,
  UserProfile,
} from '../types.ts';

const TOKEN_KEY = 'ufaz_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    const err: any = new Error(errBody.error || `HTTP error ${response.status}`);
    if (errBody.isNotActivated) err.isNotActivated = true;
    if (errBody.isAlreadyActivated) err.isAlreadyActivated = true;

    // If an authenticated endpoint returns 401 unauthorized, clear the token & signal AuthContext
    if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/set-password')) {
      clearStoredToken();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('ufaz_unauthorized'));
      }
    }

    throw err;
  }

  return response.json();
}

export const api = {
  // Auth
  async login(identifier: string, password: string): Promise<{ token: string; user: UserProfile }> {
    const data = await request<{ token: string; user: UserProfile }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
    setStoredToken(data.token);
    return data;
  },

  // Direct Password Setting (No OTP / No email codes)
  async setPasswordDirect(identifier: string, password: string): Promise<{ token: string; user: UserProfile; message: string }> {
    const res = await request<{ token: string; user: UserProfile; message: string }>('/api/auth/set-password', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
    setStoredToken(res.token);
    return res;
  },

  async requestOtp(identifier: string): Promise<{
    success: boolean;
    studentId: string;
    email: string;
    fullName: string;
    simulatedOtp: string;
    message: string;
  }> {
    return request('/api/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ identifier }),
    });
  },

  async activateAccount(
    studentId: string,
    otp: string,
    password: string
  ): Promise<{ token: string; user: UserProfile; message: string }> {
    const res = await request<{ token: string; user: UserProfile; message: string }>('/api/auth/activate', {
      method: 'POST',
      body: JSON.stringify({ studentId, otp, password }),
    });
    setStoredToken(res.token);
    return res;
  },

  async requestPasswordReset(identifier: string): Promise<{
    success: boolean;
    studentId: string;
    email: string;
    fullName: string;
    simulatedOtp: string;
    message: string;
  }> {
    return request('/api/auth/forgot-password/request-otp', {
      method: 'POST',
      body: JSON.stringify({ identifier }),
    });
  },

  async resetPassword(
    identifier: string,
    otp: string,
    newPassword: string
  ): Promise<{ token: string; user: UserProfile; message: string }> {
    const res = await request<{ token: string; user: UserProfile; message: string }>('/api/auth/forgot-password/reset', {
      method: 'POST',
      body: JSON.stringify({ identifier, otp, newPassword }),
    });
    setStoredToken(res.token);
    return res;
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return request('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  },

  async logout(): Promise<void> {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      clearStoredToken();
    }
  },

  async switchUser(targetRole: 'student' | 'admin'): Promise<{ token: string; user: UserProfile }> {
    const data = await request<{ token: string; user: UserProfile }>('/api/auth/switch-user', {
      method: 'POST',
      body: JSON.stringify({ targetRole }),
    });
    setStoredToken(data.token);
    return data;
  },

  async getMe(): Promise<{ user: UserProfile }> {
    return request<{ user: UserProfile }>('/api/auth/me');
  },

  // Programs
  async getPrograms(): Promise<{ programs: any[] }> {
    return request<{ programs: any[] }>('/api/programs');
  },

  async getProgram(id: ProgramId): Promise<{ program: ProgramConfig }> {
    return request<{ program: ProgramConfig }>(`/api/programs/${id}`);
  },

  // Calculations
  async calculateGrades(
    programId: ProgramId,
    scores: Record<string, number | undefined | null>
  ): Promise<CalculationResult> {
    return request<CalculationResult>('/api/calculate', {
      method: 'POST',
      body: JSON.stringify({ programId, scores }),
    });
  },

  // Academic Records
  async getGradeHistory(): Promise<{ records: SavedAcademicRecord[] }> {
    return request<{ records: SavedAcademicRecord[] }>('/api/grades/history');
  },

  async saveCalculation(data: {
    programId: ProgramId;
    semester: string;
    academicYear?: string;
    componentScores: Record<string, number>;
  }): Promise<{ record: SavedAcademicRecord; calculation: CalculationResult }> {
    return request<{ record: SavedAcademicRecord; calculation: CalculationResult }>('/api/grades/save', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteGradeRecord(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/grades/${id}`, {
      method: 'DELETE',
    });
  },

  // Ranking
  async getRanking(
    programId?: string,
    level?: string
  ): Promise<{
    cohort: { programId: string; level: string; totalStudents: number };
    entries: RankingEntry[];
    stats: CohortStats;
    analysis: RankingAnalysis | null;
  }> {
    const params = new URLSearchParams();
    if (programId) params.append('programId', programId);
    if (level) params.append('level', level);
    return request(`/api/ranking?${params.toString()}`);
  },

  async simulateRank(
    projectedGpa: number,
    programId?: string,
    level?: string
  ): Promise<ProjectedRankResult> {
    return request<ProjectedRankResult>('/api/ranking/simulate', {
      method: 'POST',
      body: JSON.stringify({ projectedGpa, programId, level }),
    });
  },

  // Degree Progress
  async getDegreeProgress(): Promise<DegreeProgressData> {
    return request<DegreeProgressData>('/api/degree-progress');
  },

  // Announcements
  async getAnnouncements(): Promise<{ announcements: AnnouncementItem[] }> {
    return request<{ announcements: AnnouncementItem[] }>('/api/announcements');
  },

  async createAnnouncement(data: {
    title: string;
    content: string;
    category: string;
    isPinned?: boolean;
  }): Promise<{ announcement: AnnouncementItem }> {
    return request<{ announcement: AnnouncementItem }>('/api/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteAnnouncement(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/announcements/${id}`, {
      method: 'DELETE',
    });
  },

  // Admin
  async getAdminOverview(): Promise<any> {
    return request<any>('/api/admin/overview');
  },

  async addCohortStudent(data: {
    fullName: string;
    studentId: string;
    gpa: number;
    programId: string;
    academicLevel: string;
  }): Promise<any> {
    return request<any>('/api/admin/cohort/add', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
