import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../db/database.ts';
import { UFAZ_PROGRAMS } from '../config/academicPrograms.ts';
import { calculateProgramGrades } from '../services/calculationEngine.ts';
import {
  analyzeStudentRank,
  calculateCohortRanking,
  simulateProjectedRank,
} from '../services/rankingEngine.ts';
import { ProgramId, SavedAcademicRecord } from '../../src/types.ts';

export const apiRouter = Router();

// Secure token session extractor
function getAuthenticatedUser(req: Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.replace('Bearer ', '').trim();
  const user = db.getSessionUser(token);
  if (!user) return null;
  const { passwordHash, salt, activationOtp, activationOtpExpiry, ...profile } = user;
  return profile;
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Giriş tələb olunur (Authentication required)' });
  }
  (req as any).user = user;
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'İnzibatçı hüquqları tələb olunur (Admin privileges required)' });
  }
  (req as any).user = user;
  next();
}

// --- AUTHENTICATION & ACCESS CONTROL ---

// 1. Secure Login with Student ID / UFAZ Email + Private Password
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { identifier, email, studentId, password } = req.body;
  const loginId = (identifier || email || studentId || '').toString().trim();
  const pass = (password || '').toString();

  if (!loginId || !pass) {
    return res.status(400).json({ error: 'Please enter both your Student ID / Email and password.' });
  }

  const result = db.authenticate(loginId, pass);
  if (!result.success || !result.user || !result.token) {
    return res.status(401).json({
      error: result.error || 'Invalid credentials. Please verify your Student ID and password.',
      isNotActivated: result.isNotActivated,
    });
  }

  const { passwordHash, salt, activationOtp, activationOtpExpiry, resetPasswordOtp, resetPasswordOtpExpiry, ...profile } = result.user;
  return res.json({ token: result.token, user: profile, firstTimeSetup: result.firstTimeSetup });
});

// 2. Request OTP for first-time account setup
apiRouter.post('/auth/request-otp', (req: Request, res: Response) => {
  const { identifier, studentId, email } = req.body;
  const targetId = (identifier || studentId || email || '').toString().trim();

  if (!targetId) {
    return res.status(400).json({ error: 'Please enter your Student ID or official UFAZ email address.' });
  }

  const result = db.requestOtp(targetId);
  if (!result.success) {
    return res.status(400).json({
      error: result.error,
      isAlreadyActivated: result.isAlreadyActivated,
    });
  }

  return res.json({
    success: true,
    studentId: result.studentId,
    email: result.email,
    fullName: result.fullName,
    simulatedOtp: result.simulatedOtp,
    message: `Verification code sent to official institutional email ${result.email}.`,
  });
});

// 2b. Direct Set / Reset Password without OTP or Email (Instant Setup & Recovery)
apiRouter.post('/auth/set-password', (req: Request, res: Response) => {
  const { identifier, email, studentId, password, newPassword } = req.body;
  const target = (identifier || email || studentId || '').toString().trim();
  const pass = (newPassword || password || '').toString();

  if (!target) {
    return res.status(400).json({ error: 'Please enter your UFAZ email address or Student ID.' });
  }
  if (!pass || pass.length < 4) {
    return res.status(400).json({ error: 'Password must be at least 4 characters long.' });
  }

  const result = db.setPasswordDirect(target, pass);
  if (!result.success || !result.user || !result.token) {
    return res.status(400).json({ error: result.error || 'Failed to save password.' });
  }

  const { passwordHash, salt, activationOtp, activationOtpExpiry, resetPasswordOtp, resetPasswordOtpExpiry, ...profile } = result.user;
  return res.json({
    success: true,
    token: result.token,
    user: profile,
    message: 'Password saved successfully. You are now logged in.',
  });
});

// 3. Complete Activation (supports direct or with OTP)
apiRouter.post('/auth/activate', (req: Request, res: Response) => {
  const { studentId, identifier, otp, password, newPassword } = req.body;
  const sId = (studentId || identifier || '').toString().trim();
  const code = (otp || '').toString().trim();
  const pass = (password || newPassword || '').toString();

  if (!sId || !pass) {
    return res.status(400).json({ error: 'Student ID/Email and password are required.' });
  }

  // If no OTP provided, directly save password
  if (!code) {
    const result = db.setPasswordDirect(sId, pass);
    if (!result.success || !result.user || !result.token) {
      return res.status(400).json({ error: result.error || 'Account setup failed.' });
    }
    const { passwordHash, salt, activationOtp, activationOtpExpiry, resetPasswordOtp, resetPasswordOtpExpiry, ...profile } = result.user;
    return res.json({
      success: true,
      token: result.token,
      user: profile,
      message: 'Your personal password has been saved and your account is activated.',
    });
  }

  const result = db.completeActivation(sId, code, pass);
  if (!result.success || !result.user || !result.token) {
    return res.status(400).json({ error: result.error || 'Account setup failed.' });
  }

  const { passwordHash, salt, activationOtp, activationOtpExpiry, resetPasswordOtp, resetPasswordOtpExpiry, ...profile } = result.user;
  return res.json({
    success: true,
    token: result.token,
    user: profile,
    message: 'Your personal password has been saved and your account is activated.',
  });
});

// 3b. Request OTP for Password Recovery (Forgot Password)
apiRouter.post('/auth/forgot-password/request-otp', (req: Request, res: Response) => {
  const { identifier, email, studentId } = req.body;
  const targetId = (identifier || email || studentId || '').toString().trim();

  if (!targetId) {
    return res.status(400).json({ error: 'Please enter your UFAZ email address or Student ID.' });
  }

  const result = db.requestPasswordReset(targetId);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  return res.json({
    success: true,
    studentId: result.studentId,
    email: result.email,
    fullName: result.fullName,
    simulatedOtp: result.simulatedOtp,
    message: `A 6-digit recovery code has been sent to ${result.email}.`,
  });
});

// 3c. Complete Password Recovery & Set New Password (supports direct or with OTP)
apiRouter.post('/auth/forgot-password/reset', (req: Request, res: Response) => {
  const { identifier, email, studentId, otp, newPassword, password } = req.body;
  const target = (identifier || email || studentId || '').toString().trim();
  const code = (otp || '').toString().trim();
  const pass = (newPassword || password || '').toString();

  if (!target || !pass) {
    return res.status(400).json({ error: 'Student ID / Email and new password are required.' });
  }

  // If code is not provided, allow direct reset
  if (!code) {
    const result = db.setPasswordDirect(target, pass);
    if (!result.success || !result.user || !result.token) {
      return res.status(400).json({ error: result.error || 'Password reset failed.' });
    }
    const { passwordHash, salt, activationOtp, activationOtpExpiry, resetPasswordOtp, resetPasswordOtpExpiry, ...profile } = result.user;
    return res.json({
      success: true,
      token: result.token,
      user: profile,
      message: 'Password successfully updated. You are now logged in.',
    });
  }

  const result = db.resetPasswordWithOtp(target, code, pass);
  if (!result.success || !result.user || !result.token) {
    return res.status(400).json({ error: result.error || 'Password reset failed.' });
  }

  const { passwordHash, salt, activationOtp, activationOtpExpiry, resetPasswordOtp, resetPasswordOtpExpiry, ...profile } = result.user;
  return res.json({
    success: true,
    token: result.token,
    user: profile,
    message: 'Password successfully updated. You are now logged in.',
  });
});

// 4. Logout (invalidate session)
apiRouter.post('/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '').trim();
    db.revokeSession(token);
  }
  return res.json({ success: true });
});

// 5. Change Password
apiRouter.post('/auth/change-password', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Cari və yeni şifrə tələb olunur' });
  }

  const result = db.changePassword(user.id, oldPassword, newPassword);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  return res.json({ success: true, message: 'Şifrəniz uğurla dəyişdirildi.' });
});

// 6. Role Switcher for Admin testing
apiRouter.post('/auth/switch-user', (req: Request, res: Response) => {
  const { targetRole } = req.body; // 'student' | 'admin'
  const email = targetRole === 'admin' ? 'admin@ufaz.az' : 'e.mutallimov@ufaz.az';
  const user = db.findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const token = db.createSession(user.id);
  const { passwordHash, salt, activationOtp, activationOtpExpiry, ...profile } = user;
  return res.json({ token, user: profile });
});

// 7. Me
apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  return res.json({ user });
});

// --- PROGRAMS & CURRICULUM ---
apiRouter.get('/programs', (_req: Request, res: Response) => {
  const programsList = Object.values(UFAZ_PROGRAMS).map((p) => ({
    id: p.id,
    name: p.name,
    frenchName: p.frenchName,
    partnerUniversity: p.partnerUniversity,
    level: p.level,
    semester: p.semester,
    totalEcts: p.totalEcts,
    modulesCount: p.modules.length,
    gpaFormulaText: p.gpaFormulaText,
  }));
  return res.json({ programs: programsList });
});

apiRouter.get('/programs/:id', (req: Request, res: Response) => {
  const programId = req.params.id as ProgramId;
  const program = UFAZ_PROGRAMS[programId];
  if (!program) {
    return res.status(404).json({ error: 'Program not found' });
  }
  return res.json({ program });
});

// --- GPA CALCULATION ENGINE ---
apiRouter.post('/calculate', (req: Request, res: Response) => {
  const { programId, scores } = req.body;
  if (!programId) {
    return res.status(400).json({ error: 'programId is required' });
  }

  const result = calculateProgramGrades({ programId, scores: scores || {} });
  return res.json(result);
});

// --- ACADEMIC RECORDS & GPA HISTORY ---
apiRouter.get('/grades/history', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const records = db.getAcademicRecords(user.id);
  return res.json({ records });
});

apiRouter.post('/grades/save', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { programId, semester, academicYear, componentScores } = req.body;

  if (!programId || !semester) {
    return res.status(400).json({ error: 'Program and semester are required' });
  }

  // Calculate authoritative official grade server-side
  const calculation = calculateProgramGrades({ programId, scores: componentScores });

  const moduleGrades: Record<string, number> = {};
  for (const m of calculation.moduleResults) {
    moduleGrades[m.moduleName] = m.grade;
  }

  const record: SavedAcademicRecord = {
    id: 'rec_' + Date.now(),
    userId: user.id,
    studentId: user.studentId,
    programId,
    academicLevel: calculation.academicLevel,
    semester: semester || calculation.semester,
    academicYear: academicYear || '2025-2026',
    componentScores,
    moduleGrades,
    gpa: calculation.finalGpa,
    honors: calculation.honors,
    savedAt: new Date().toISOString(),
    isOfficial: true,
  };

  const saved = db.saveAcademicRecord(record);
  return res.json({ record: saved, calculation });
});

apiRouter.delete('/grades/:id', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const success = db.deleteAcademicRecord(req.params.id, user.id);
  if (!success) {
    return res.status(404).json({ error: 'Record not found or unauthorized' });
  }
  return res.json({ success: true });
});

// --- COHORT RANKING & PRIVACY-CONSCIOUS LEADERBOARD ---
apiRouter.get('/ranking', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  const programId = (req.query.programId as string) || (user ? user.programId : 'cs');
  const level = (req.query.level as string) || 'L2';

  const cohortStudents = db.getCohortStudents(programId, level);
  const currentUserId = user ? user.id : undefined;

  const { entries, stats } = calculateCohortRanking(cohortStudents, currentUserId);
  const analysis = currentUserId ? analyzeStudentRank(entries, currentUserId, stats) : null;

  return res.json({
    cohort: {
      programId,
      level,
      totalStudents: stats.totalStudents,
    },
    entries,
    stats,
    analysis,
  });
});

apiRouter.post('/ranking/simulate', (req: Request, res: Response) => {
  const { projectedGpa, programId, level } = req.body;
  const user = getAuthenticatedUser(req);

  if (projectedGpa === undefined || isNaN(Number(projectedGpa))) {
    return res.status(400).json({ error: 'Valid projected GPA is required' });
  }

  const pId = programId || (user ? user.programId : 'cs');
  const lvl = level || 'L2';
  const cohortStudents = db.getCohortStudents(pId, lvl);
  const currentUserId = user ? user.id : undefined;

  const { entries } = calculateCohortRanking(cohortStudents, currentUserId);
  const currentUserEntry = entries.find((e) => e.isCurrentUser);
  const currentRank = currentUserEntry ? currentUserEntry.rank : Math.floor(entries.length / 2);

  const simulation = simulateProjectedRank(entries, currentRank, Number(projectedGpa));
  return res.json(simulation);
});

// --- DEGREE PROGRESS ---
apiRouter.get('/degree-progress', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const records = db.getAcademicRecords(user.id);

  const completedSemesters = records.length;
  const creditsEarned = records.reduce((acc, r) => (r.gpa >= 10.0 ? acc + 30 : acc), 0);
  const currentCumulativeGpa =
    records.length > 0
      ? Math.round((records.reduce((acc, r) => acc + r.gpa, 0) / records.length) * 100) / 100
      : (user.gpa || 0);

  const findRecord = (semKey: string) =>
    records.find((r) => r.semester.toLowerCase().includes(semKey.toLowerCase()));

  const s1Rec = findRecord('s1');
  const s2Rec = findRecord('s2');
  const s3Rec = findRecord('s3');
  const s4Rec = findRecord('s4');
  const s5Rec = findRecord('s5');
  const s6Rec = findRecord('s6');

  const l1Ects = (s1Rec && s1Rec.gpa >= 10 ? 30 : 0) + (s2Rec && s2Rec.gpa >= 10 ? 30 : 0);
  const l1Gpa =
    s1Rec && s2Rec
      ? Math.round(((s1Rec.gpa + s2Rec.gpa) / 2) * 100) / 100
      : s1Rec
      ? s1Rec.gpa
      : s2Rec
      ? s2Rec.gpa
      : 0;

  const l2Ects = (s3Rec && s3Rec.gpa >= 10 ? 30 : 0) + (s4Rec && s4Rec.gpa >= 10 ? 30 : 0);
  const l2Gpa =
    s3Rec && s4Rec
      ? Math.round(((s3Rec.gpa + s4Rec.gpa) / 2) * 100) / 100
      : s3Rec
      ? s3Rec.gpa
      : s4Rec
      ? s4Rec.gpa
      : 0;

  const l3Ects = (s5Rec && s5Rec.gpa >= 10 ? 30 : 0) + (s6Rec && s6Rec.gpa >= 10 ? 30 : 0);
  const l3Gpa =
    s5Rec && s6Rec
      ? Math.round(((s5Rec.gpa + s6Rec.gpa) / 2) * 100) / 100
      : s5Rec
      ? s5Rec.gpa
      : s6Rec
      ? s6Rec.gpa
      : 0;

  return res.json({
    programName: user.programId === 'cs' ? 'Computer Science' : user.programId.toUpperCase(),
    partnerUniversity: 'Université de Strasbourg (Unistra)',
    degreeName: 'Licence Informatique & Bachelor of Science',
    totalEctsRequired: 180,
    completedEcts: Math.min(180, creditsEarned),
    totalCreditsRequired: 180,
    creditsCompleted: Math.min(180, creditsEarned),
    creditsRemaining: Math.max(0, 180 - creditsEarned),
    currentCumulativeGpa,
    semestersCompleted: completedSemesters,
    totalSemesters: 6,
    levels: [
      {
        level: 'L1 (Year 1)',
        status: l1Ects >= 60 ? 'completed' : l1Ects > 0 ? 'in_progress' : 'pending',
        totalEcts: 60,
        earnedEcts: l1Ects,
        credits: l1Ects,
        gpa: l1Gpa,
        semesters: [
          {
            semester: 'Semester 1 (S1)',
            totalEcts: 30,
            earnedEcts: s1Rec && s1Rec.gpa >= 10 ? 30 : 0,
            status: s1Rec ? 'completed' : 'pending',
            gpa: s1Rec?.gpa,
            modules: ['Algorithmics I', 'Calculus & Algebra I', 'Physics I', 'French FLE'],
          },
          {
            semester: 'Semester 2 (S2)',
            totalEcts: 30,
            earnedEcts: s2Rec && s2Rec.gpa >= 10 ? 30 : 0,
            status: s2Rec ? 'completed' : 'pending',
            gpa: s2Rec?.gpa,
            modules: ['Data Structures & C', 'Linear Algebra', 'Digital Electronics', 'Technical English'],
          },
        ],
      },
      {
        level: 'L2 (Year 2)',
        status: l2Ects >= 60 ? 'completed' : l2Ects > 0 ? 'in_progress' : 'pending',
        totalEcts: 60,
        earnedEcts: l2Ects,
        credits: l2Ects,
        gpa: l2Gpa,
        semesters: [
          {
            semester: 'Semester 3 (S3)',
            totalEcts: 30,
            earnedEcts: s3Rec && s3Rec.gpa >= 10 ? 30 : 0,
            status: s3Rec ? 'completed' : 'pending',
            gpa: s3Rec?.gpa,
            modules: ['OOP & Java', 'Database Systems', 'Probability & Stats', 'Web Technologies'],
          },
          {
            semester: 'Semester 4 (S4)',
            totalEcts: 30,
            earnedEcts: s4Rec && s4Rec.gpa >= 10 ? 30 : 0,
            status: s4Rec ? 'completed' : 'in_progress',
            gpa: s4Rec?.gpa,
            modules: ['Back-End Development', 'Vector Analysis', 'Physics 3 (Electromagnetism)', 'French Language'],
          },
        ],
      },
      {
        level: 'L3 (Year 3)',
        status: l3Ects >= 60 ? 'completed' : l3Ects > 0 ? 'in_progress' : 'upcoming',
        totalEcts: 60,
        earnedEcts: l3Ects,
        credits: l3Ects,
        gpa: l3Gpa,
        semesters: [
          {
            semester: 'Semester 5 (S5)',
            totalEcts: 30,
            earnedEcts: s5Rec && s5Rec.gpa >= 10 ? 30 : 0,
            status: s5Rec ? 'completed' : 'upcoming',
            gpa: s5Rec?.gpa,
            modules: ['Software Engineering & Architecture', 'Computer Networks & Security', 'Machine Learning', 'Scientific Computing'],
          },
          {
            semester: 'Semester 6 (S6)',
            totalEcts: 30,
            earnedEcts: s6Rec && s6Rec.gpa >= 10 ? 30 : 0,
            status: s6Rec ? 'completed' : 'upcoming',
            gpa: s6Rec?.gpa,
            modules: ['PFE Capstone Project', 'Distributed Systems', 'Engineering Internship'],
          },
        ],
      },
    ],
  });
});

// --- ANNOUNCEMENTS ---
apiRouter.get('/announcements', (_req: Request, res: Response) => {
  const items = db.getAnnouncements();
  return res.json({ announcements: items });
});

apiRouter.post('/announcements', requireAdmin, (req: Request, res: Response) => {
  const { title, content, category, isPinned } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  const item = db.createAnnouncement({
    id: 'ann_' + Date.now(),
    title,
    content,
    category: category || 'general',
    publishDate: new Date().toISOString().split('T')[0],
    isPinned: Boolean(isPinned),
    author: (req as any).user.fullName || 'Academic Office',
  });
  return res.json({ announcement: item });
});

apiRouter.delete('/announcements/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteAnnouncement(req.params.id);
  return res.json({ success });
});

// --- ADMIN MANAGEMENT ---
apiRouter.get('/admin/overview', requireAdmin, (_req: Request, res: Response) => {
  const users = db.getUsers().map(({ passwordHash, salt, ...p }) => p);
  const records = db.getAcademicRecords();
  const csCohort = db.getCohortStudents('cs', 'L2');
  const { stats } = calculateCohortRanking(csCohort);

  return res.json({
    totalUsers: users.length,
    studentsCount: users.filter((u) => u.role === 'student').length,
    csCohortSize: csCohort.length,
    csStats: stats,
    recordsCount: records.length,
    announcementsCount: db.getAnnouncements().length,
    users,
  });
});

apiRouter.post('/admin/cohort/add', requireAdmin, (req: Request, res: Response) => {
  const { fullName, studentId, gpa, programId, academicLevel } = req.body;
  if (!fullName || !studentId || gpa === undefined) {
    return res.status(400).json({ error: 'Name, ID, and GPA are required' });
  }

  const salt = 'ufaz_peer_' + Date.now();
  const user = {
    id: 'usr_' + Date.now(),
    email: `${studentId.toLowerCase()}@ufaz.az`,
    fullName,
    studentId,
    role: 'student' as const,
    programId: (programId || 'cs') as ProgramId,
    academicLevel: (academicLevel || 'L2') as any,
    currentSemester: 'Semester 4',
    gpa: Number(gpa),
    cohortId: `${programId || 'cs'}_${academicLevel || 'l2'}_2026`,
    isActivated: true,
    passwordHash: db.hashPassword('ufaz2026', salt),
    salt,
  };
  db.createUser(user);
  return res.json({ success: true, user });
});
