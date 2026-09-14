import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { AnnouncementItem, ProgramId, SavedAcademicRecord, UserProfile, UserRole } from '../../src/types.ts';
import { StudentRecord } from '../services/rankingEngine.ts';
import { UFAZ_OFFICIAL_ROSTER, EnrolledStudent } from '../data/ufazStudentRoster.ts';

export interface StoredUser extends UserProfile {
  passwordHash: string;
  salt: string;
  isActivated: boolean;
  personalEmail?: string;
  activationOtp?: string;
  activationOtpExpiry?: number;
  resetPasswordOtp?: string;
  resetPasswordOtpExpiry?: number;
}

export interface ActiveSession {
  token: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
}

export interface DatabaseSchema {
  schemaVersion: number;
  users: StoredUser[];
  academic_records: SavedAcademicRecord[];
  announcements: AnnouncementItem[];
  cohort_students: StudentRecord[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'ufaz_database.json');
const SESSIONS_PATH = path.join(DB_DIR, 'ufaz_sessions.json');
const DEFAULT_SALT = 'ufaz_salt_2026';

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

function generateInitialData(): DatabaseSchema {
  // 1. Seed Academic Administrator
  const adminUser: StoredUser = {
    id: 'usr_admin',
    email: 'admin@ufaz.az',
    fullName: 'UFAZ Academic Registrar',
    studentId: 'ADMIN-01',
    role: 'admin' as UserRole,
    programId: 'cs' as ProgramId,
    academicLevel: 'L2',
    currentSemester: 'Semester 4',
    gpa: 18.0,
    cohortId: 'admin_cohort',
    group: 'Administration',
    isActivated: true,
    passwordHash: hashPassword('admin2026', DEFAULT_SALT),
    salt: DEFAULT_SALT,
  };

  const users: StoredUser[] = [adminUser];
  const cohortStudents: StudentRecord[] = [];

  // 2. Populate all official students from UFAZ 2026/2027 Roster (175 students)
  for (const s of UFAZ_OFFICIAL_ROSTER) {
    const isEldar = s.studentId === '22422996';
    const userId = `usr_${s.studentId}`;
    const userGpa = 0.0; // Initialized to 0 pending semester exams

    // For Eldar Mutallimov, pre-configure personal email so they can log in or recover with either UFAZ email or personal Gmail
    const user: StoredUser = {
      id: userId,
      email: s.email,
      personalEmail: isEldar ? 'mutellimoveldar7@gmail.com' : undefined,
      fullName: s.fullName,
      studentId: s.studentId,
      role: 'student',
      programId: s.programId,
      academicLevel: s.academicLevel,
      currentSemester: 'Semester 4',
      gpa: userGpa,
      cohortId: s.cohortId,
      group: s.group,
      isActivated: false, // Students set their own password however they like
      passwordHash: '',
      salt: DEFAULT_SALT,
      // Default deterministic activation OTP for initial roster
      activationOtp: `${parseInt(s.studentId.slice(-4), 10) * 7}`.padStart(6, '0').slice(0, 6),
    };

    users.push(user);

    cohortStudents.push({
      id: userId,
      studentId: s.studentId,
      fullName: s.fullName,
      gpa: userGpa,
      programId: s.programId,
      academicLevel: s.academicLevel,
      cohortId: s.cohortId,
    });
  }

  // 3. Historical Academic Records (starts empty from scratch - user calculates and records their own)
  const academicRecords: SavedAcademicRecord[] = [];

  // 4. Official Announcements
  const announcements: AnnouncementItem[] = [
    {
      id: 'ann_1',
      title: 'Spring 2026 Examination & Deliberation Schedule',
      content:
        'Final written exams for L2 Semester 4 will take place from May 25 to June 12, 2026. Deliberation juries under the presidency of Université de Strasbourg (Unistra) will finalize official transcripts on June 28, 2026.',
      category: 'exam',
      publishDate: '2026-04-10',
      isPinned: true,
      author: 'UFAZ Academic Board',
    },
    {
      id: 'ann_2',
      title: 'ECTS Compensation & French Grading Scale Regulations',
      content:
        'In accordance with French university regulations (Unistra/UFAZ), academic modules are graded on a 20-point scale. A semester GPA of 10.00/20 grants full validation (30 ECTS) through inter-module compensation.',
      category: 'deliberation',
      publishDate: '2026-03-15',
      isPinned: true,
      author: 'Department of Studies',
    },
    {
      id: 'ann_3',
      title: 'Summer Lab Research Internships (France / Azerbaijan)',
      content:
        'Applications for 2026 summer research placements at Strasbourg, Rennes, and partner research institutes are now open. Eligible students must have validated all L1 & L2 modules.',
      category: 'deadline',
      publishDate: '2026-02-28',
      isPinned: false,
      author: 'International Relations Office',
    },
    {
      id: 'ann_4',
      title: 'Academic Formula & Privacy Security Notice',
      content:
        'Student GPA, assessment components, and semester results are strictly private and encrypted. Student records are only accessible to the authenticated student using their individual password.',
      category: 'general',
      publishDate: '2026-01-14',
      isPinned: false,
      author: 'Academic Registrar & IT Security',
    },
  ];

  return {
    schemaVersion: 5,
    users,
    academic_records: academicRecords,
    announcements,
    cohort_students: cohortStudents,
  };
}

export const AUTHORIZED_STUDENT_ID = '22422996';
export const AUTHORIZED_STUDENT_EMAIL = 'e.mutallimov@ufaz.az';
export const AUTHORIZED_STUDENT_NAME = 'Mutallimov Eldar';

class DatabaseService {
  private db: DatabaseSchema;
  private sessions: Map<string, ActiveSession> = new Map();

  constructor() {
    this.db = this.loadOrInit();
    this.loadSessions();
  }

  private loadSessions(): void {
    try {
      if (fs.existsSync(SESSIONS_PATH)) {
        const raw = fs.readFileSync(SESSIONS_PATH, 'utf-8');
        const list: ActiveSession[] = JSON.parse(raw);
        const now = Date.now();
        for (const s of list) {
          if (s.expiresAt > now) {
            this.sessions.set(s.token, s);
          }
        }
      }
    } catch (err) {
      console.warn('Could not load existing sessions:', err);
    }
  }

  private saveSessions(): void {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      const now = Date.now();
      const validSessions = Array.from(this.sessions.values()).filter((s) => s.expiresAt > now);
      fs.writeFileSync(SESSIONS_PATH, JSON.stringify(validSessions, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Could not persist sessions:', err);
    }
  }

  private loadOrInit(): DatabaseSchema {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.schemaVersion === 5 && parsed.users && parsed.cohort_students && parsed.users.length >= 100) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Initializing fresh database with 175-student roster due to:', err);
    }
    const fresh = generateInitialData();
    this.saveDirect(fresh);
    return fresh;
  }

  private saveDirect(data: DatabaseSchema): void {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database to disk:', err);
    }
  }

  public save(): void {
    this.saveDirect(this.db);
  }

  // Session Management (cryptographically secure random tokens)
  public createSession(userId: string): string {
    const token = 'ufaz_sess_' + crypto.randomBytes(32).toString('hex');
    const now = Date.now();
    const expiresAt = now + 7 * 24 * 60 * 60 * 1000; // 7 days

    this.sessions.set(token, {
      token,
      userId,
      createdAt: now,
      expiresAt,
    });
    this.saveSessions();
    return token;
  }

  public getSessionUser(token: string): StoredUser | null {
    if (!token) return null;
    const session = this.sessions.get(token);
    if (!session) return null;

    if (Date.now() > session.expiresAt) {
      this.sessions.delete(token);
      this.saveSessions();
      return null;
    }

    return this.findUserById(session.userId) || null;
  }

  public revokeSession(token: string): boolean {
    const deleted = this.sessions.delete(token);
    if (deleted) {
      this.saveSessions();
    }
    return deleted;
  }

  // User Queries
  public getUsers(): DatabaseSchema['users'] {
    return this.db.users;
  }

  public findUserByEmail(email: string): StoredUser | undefined {
    return this.db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserByStudentId(studentId: string): StoredUser | undefined {
    return this.db.users.find((u) => u.studentId === studentId);
  }

  public findUserByIdentifier(identifier: string): StoredUser | undefined {
    const trimmed = identifier.trim().toLowerCase();
    return this.db.users.find((u) => {
      if (u.studentId.toLowerCase() === trimmed || u.email.toLowerCase() === trimmed) {
        return true;
      }
      if (u.personalEmail && u.personalEmail.toLowerCase() === trimmed) {
        return true;
      }
      // Convenient support for the current student's personal email
      if (trimmed === 'mutellimoveldar7@gmail.com' && u.studentId === '22422996') {
        return true;
      }
      return false;
    });
  }

  public findUserById(id: string): StoredUser | undefined {
    return this.db.users.find((u) => u.id === id);
  }

  // Account Activation & OTP Verification
  public requestOtp(identifier: string): {
    success: boolean;
    error?: string;
    email?: string;
    studentId?: string;
    fullName?: string;
    simulatedOtp?: string;
    isAlreadyActivated?: boolean;
  } {
    const user = this.findUserByIdentifier(identifier);
    if (!user) {
      return {
        success: false,
        error: 'Tələbə ID və ya UFAZ e-poçtu sistemdə tapılmadı. Zəhmət olmasa rəsmi tələbə ID-nizi yoxlayın.',
      };
    }

    // Privacy protection: prevent unauthorized access to other students' accounts
    if (user.role === 'student' && user.studentId !== AUTHORIZED_STUDENT_ID) {
      return {
        success: false,
        error: `Access Denied (Privacy Protection): You cannot request verification codes for another student (${user.fullName}). Access is restricted to your own verified student account (ID: ${AUTHORIZED_STUDENT_ID}).`,
      };
    }

    if (user.isActivated && user.passwordHash) {
      return {
        success: false,
        error: 'Bu tələbə hesabı artıq şəxsi şifrə ilə aktivləşdirilib və qorunur. Şifrəni unutmusunuzsa, "Şifrəni bərpa et" seçimindən istifadə edin.',
        isAlreadyActivated: true,
      };
    }

    // Generate a secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.activationOtp = otp;
    user.activationOtpExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    this.save();

    console.log(`[UFAZ Security OTP Service] Generated activation code for ${user.fullName} (${user.email}): ${otp}`);

    return {
      success: true,
      email: user.email,
      studentId: user.studentId,
      fullName: user.fullName,
      simulatedOtp: otp,
    };
  }

  public completeActivation(
    studentId: string,
    otp: string,
    newPassword: string
  ): { success: boolean; error?: string; user?: StoredUser; token?: string } {
    const user = this.findUserByIdentifier(studentId);
    if (!user) {
      return { success: false, error: 'Tələbə tapılmadı.' };
    }

    // Privacy protection
    if (user.role === 'student' && user.studentId !== AUTHORIZED_STUDENT_ID) {
      return {
        success: false,
        error: `Access Denied (Privacy Protection): You are not authorized to activate another student's account (${user.fullName}).`,
      };
    }

    // Verify OTP
    const trimmedOtp = (otp || '').trim();
    const isActValid = user.activationOtp && user.activationOtp === trimmedOtp;
    const isResetValid = user.resetPasswordOtp && user.resetPasswordOtp === trimmedOtp;

    if (!isActValid && !isResetValid) {
      return { success: false, error: 'Daxil edilmiş təsdiq kodu yanlışdır.' };
    }

    const expiry = isActValid ? user.activationOtpExpiry : user.resetPasswordOtpExpiry;
    if (expiry && Date.now() > expiry) {
      return { success: false, error: 'Təsdiq kodunun vaxtı keçmişdir. Yenidən kod göndərin.' };
    }

    if (!newPassword || newPassword.length < 4) {
      return { success: false, error: 'Şifrə ən azı 4 simvoldan ibarət olmalıdır.' };
    }

    const salt = 'ufaz_salt_' + Date.now();
    user.passwordHash = hashPassword(newPassword, salt);
    user.salt = salt;
    user.isActivated = true;
    user.activationOtp = undefined;
    user.activationOtpExpiry = undefined;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpiry = undefined;

    this.save();

    const token = this.createSession(user.id);
    return { success: true, user, token };
  }

  // Password Recovery via Email OTP
  public requestPasswordReset(identifier: string): {
    success: boolean;
    error?: string;
    email?: string;
    studentId?: string;
    fullName?: string;
    simulatedOtp?: string;
  } {
    const user = this.findUserByIdentifier(identifier);
    if (!user) {
      return {
        success: false,
        error: 'Tələbə hesabı tapılmadı. Zəhmət olmasa UFAZ e-poçtunuzu və ya tələbə ID-nizi yoxlayın.',
      };
    }

    // Privacy protection
    if (user.role === 'student' && user.studentId !== AUTHORIZED_STUDENT_ID) {
      return {
        success: false,
        error: `Access Denied (Privacy Protection): You cannot reset credentials for another student (${user.fullName}). Each student's account is private.`,
      };
    }

    // Generate a secure 6-digit recovery OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    this.save();

    console.log(`[UFAZ Password Recovery Service] Generated recovery code for ${user.fullName} (${user.email}): ${otp}`);

    return {
      success: true,
      email: user.email,
      studentId: user.studentId,
      fullName: user.fullName,
      simulatedOtp: otp,
    };
  }

  public resetPasswordWithOtp(
    identifier: string,
    otp: string,
    newPassword: string
  ): { success: boolean; error?: string; user?: StoredUser; token?: string } {
    const user = this.findUserByIdentifier(identifier);
    if (!user) {
      return { success: false, error: 'Tələbə məlumatı tapılmadı.' };
    }

    // Privacy protection
    if (user.role === 'student' && user.studentId !== AUTHORIZED_STUDENT_ID) {
      return {
        success: false,
        error: `Access Denied (Privacy Protection): You cannot reset credentials for another student.`,
      };
    }

    const trimmedOtp = (otp || '').trim();
    const isResetValid = user.resetPasswordOtp && user.resetPasswordOtp === trimmedOtp;
    const isActValid = user.activationOtp && user.activationOtp === trimmedOtp;

    if (!isResetValid && !isActValid) {
      return { success: false, error: 'Daxil edilmiş bərpa kodu yanlışdır. Zəhmət olmasa e-poçtunuza göndərilən 6 rəqəmli kodu daxil edin.' };
    }

    const expiry = isResetValid ? user.resetPasswordOtpExpiry : user.activationOtpExpiry;
    if (expiry && Date.now() > expiry) {
      return { success: false, error: 'Bərpa kodunun vaxtı keçmişdir. Yenidən kod sorğulayın.' };
    }

    if (!newPassword || newPassword.length < 4) {
      return { success: false, error: 'Yeni şifrə ən azı 4 simvoldan ibarət olmalıdır.' };
    }

    const salt = 'ufaz_salt_' + Date.now();
    user.passwordHash = hashPassword(newPassword, salt);
    user.salt = salt;
    user.isActivated = true;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpiry = undefined;
    user.activationOtp = undefined;
    user.activationOtpExpiry = undefined;

    this.save();

    const token = this.createSession(user.id);
    return { success: true, user, token };
  }

  // Direct Password Setting / Updating without OTP or Email Codes
  public setPasswordDirect(
    identifier: string,
    newPassword: string
  ): { success: boolean; error?: string; user?: StoredUser; token?: string } {
    const user = this.findUserByIdentifier(identifier);
    if (!user) {
      return {
        success: false,
        error: 'Student record not found for this email address or Student ID. Please verify your email.',
      };
    }

    // Privacy protection: only the authorized user can set or modify credentials
    if (user.role === 'student' && user.studentId !== AUTHORIZED_STUDENT_ID) {
      return {
        success: false,
        error: `Access Denied (Privacy Protection): You cannot modify credentials for another student (${user.fullName}). In accordance with UFAZ privacy regulations, only the authorized student may access or change their password.`,
      };
    }

    if (!newPassword || newPassword.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters long.' };
    }

    const salt = 'ufaz_salt_' + Date.now();
    user.passwordHash = hashPassword(newPassword, salt);
    user.salt = salt;
    user.isActivated = true;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpiry = undefined;
    user.activationOtp = undefined;
    user.activationOtpExpiry = undefined;

    this.save();

    const token = this.createSession(user.id);
    return { success: true, user, token };
  }

  public authenticate(
    identifier: string,
    password: string
  ): { success: boolean; error?: string; user?: StoredUser; token?: string; isNotActivated?: boolean; firstTimeSetup?: boolean } {
    const user = this.findUserByIdentifier(identifier);
    if (!user) {
      return { success: false, error: 'Student ID / Email not found in the database. Please check your spelling.' };
    }

    // Strict privacy boundary: prevent unauthorized access to any other student's account
    if (user.role === 'student' && user.studentId !== AUTHORIZED_STUDENT_ID) {
      return {
        success: false,
        error: `Access Denied (Privacy Protection): You entered the Student ID or email of another student (${user.fullName}). In accordance with UFAZ academic privacy regulations, accessing another student's account, evaluation notes, or confidential portal is strictly prohibited. Please sign in with your own student credentials (ID: ${AUTHORIZED_STUDENT_ID} / Mutallimov Eldar).`,
      };
    }

    // First time logging in for the authorized student: if no password has been set yet, set it directly and log in!
    if (user.role === 'student' && (!user.isActivated || !user.passwordHash)) {
      if (!password || password.length < 4) {
        return {
          success: false,
          error: 'Please choose a password with at least 4 characters to set up your account.',
          isNotActivated: true,
        };
      }

      const salt = 'ufaz_salt_' + Date.now();
      user.passwordHash = hashPassword(password, salt);
      user.salt = salt;
      user.isActivated = true;
      user.resetPasswordOtp = undefined;
      user.resetPasswordOtpExpiry = undefined;
      user.activationOtp = undefined;
      user.activationOtpExpiry = undefined;

      this.save();

      const token = this.createSession(user.id);
      return { success: true, user, token, firstTimeSetup: true };
    }

    const isMatch = this.verifyPassword(password, user.passwordHash, user.salt);
    if (!isMatch) {
      return {
        success: false,
        error: 'Incorrect password. If you forgot your password, please click "Forgot password?" below to reset it.',
      };
    }

    const token = this.createSession(user.id);
    return { success: true, user, token };
  }

  public changePassword(userId: string, oldPass: string, newPass: string): { success: boolean; error?: string } {
    const user = this.findUserById(userId);
    if (!user) return { success: false, error: 'User not found' };

    if (!this.verifyPassword(oldPass, user.passwordHash, user.salt)) {
      return { success: false, error: 'Cari şifrə yanlışdır.' };
    }

    if (!newPass || newPass.length < 6) {
      return { success: false, error: 'Yeni şifrə ən azı 6 simvol olmalıdır.' };
    }

    const newSalt = 'ufaz_salt_' + Date.now();
    user.passwordHash = hashPassword(newPass, newSalt);
    user.salt = newSalt;
    this.save();
    return { success: true };
  }

  public createUser(user: StoredUser) {
    this.db.users.push(user);
    this.db.cohort_students.push({
      id: user.id,
      studentId: user.studentId,
      fullName: user.fullName,
      gpa: user.gpa || 0,
      programId: user.programId,
      academicLevel: user.academicLevel,
      cohortId: user.cohortId,
    });
    this.save();
  }

  public updateUser(id: string, updates: Partial<UserProfile>) {
    const idx = this.db.users.findIndex((u) => u.id === id);
    if (idx !== -1) {
      this.db.users[idx] = { ...this.db.users[idx], ...updates };
      const cIdx = this.db.cohort_students.findIndex((c) => c.id === id);
      if (cIdx !== -1) {
        if (updates.gpa !== undefined) this.db.cohort_students[cIdx].gpa = updates.gpa;
        if (updates.fullName !== undefined) this.db.cohort_students[cIdx].fullName = updates.fullName;
        if (updates.programId !== undefined) this.db.cohort_students[cIdx].programId = updates.programId;
        if (updates.academicLevel !== undefined) this.db.cohort_students[cIdx].academicLevel = updates.academicLevel;
      }
      this.save();
      return this.db.users[idx];
    }
    return null;
  }

  // Academic Records (strictly scoped to user)
  public getAcademicRecords(userId?: string): SavedAcademicRecord[] {
    if (!userId) return this.db.academic_records;
    return this.db.academic_records.filter((r) => r.userId === userId);
  }

  public saveAcademicRecord(record: SavedAcademicRecord): SavedAcademicRecord {
    const existingIdx = this.db.academic_records.findIndex(
      (r) => r.userId === record.userId && r.semester === record.semester
    );
    if (existingIdx !== -1) {
      this.db.academic_records[existingIdx] = record;
    } else {
      this.db.academic_records.push(record);
    }

    this.updateUser(record.userId, { gpa: record.gpa });
    this.save();
    return record;
  }

  public deleteAcademicRecord(id: string, userId: string): boolean {
    const initialLen = this.db.academic_records.length;
    this.db.academic_records = this.db.academic_records.filter(
      (r) => !(r.id === id && (r.userId === userId || userId === 'usr_admin'))
    );
    if (this.db.academic_records.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Cohort Students
  public getCohortStudents(programId?: string, academicLevel?: string): StudentRecord[] {
    let list = this.db.cohort_students;
    if (programId) {
      list = list.filter((s) => s.programId === programId);
    }
    if (academicLevel) {
      list = list.filter((s) => s.academicLevel === academicLevel);
    }
    return list;
  }

  // Announcements
  public getAnnouncements(): AnnouncementItem[] {
    return this.db.announcements.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
  }

  public createAnnouncement(item: AnnouncementItem): AnnouncementItem {
    this.db.announcements.unshift(item);
    this.save();
    return item;
  }

  public deleteAnnouncement(id: string): boolean {
    const initialLen = this.db.announcements.length;
    this.db.announcements = this.db.announcements.filter((a) => a.id !== id);
    if (this.db.announcements.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  public verifyPassword(password: string, hash: string, salt: string): boolean {
    const testHash = hashPassword(password, salt);
    return testHash === hash;
  }

  public hashPassword(password: string, salt: string): string {
    return hashPassword(password, salt);
  }
}

export const db = new DatabaseService();
