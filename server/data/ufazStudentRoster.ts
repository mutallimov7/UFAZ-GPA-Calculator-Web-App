import { ProgramId } from '../../src/types.ts';

export interface EnrolledStudent {
  studentId: string;
  fullName: string;
  email: string;
  programId: ProgramId;
  group: string;
  academicLevel: 'L2';
  cohortId: string;
  gpa?: number;
}

export const UFAZ_OFFICIAL_ROSTER: EnrolledStudent[] = [
  // ==========================================
  // COMPUTER SCIENCE (CS-024) - 60 Students
  // ==========================================
  // Exercise CS1
  { studentId: '22423021', fullName: 'Abbasli Fidan', email: 'f.abbasli@ufaz.az', programId: 'cs', group: 'CS1', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423178', fullName: 'Abbasli Ismayil', email: 'i.abbasli@ufaz.az', programId: 'cs', group: 'CS1', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423324', fullName: 'Abbaszada Tunar', email: 't.abbaszada@ufaz.az', programId: 'cs', group: 'CS1', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423293', fullName: 'Aghamaliyev Said', email: 's.aghamaliyev@ufaz.az', programId: 'cs', group: 'CS1', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423258', fullName: 'Ahmadzada Raul', email: 'r.ahmadzada@ufaz.az', programId: 'cs', group: 'CS1', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423161', fullName: 'Akhundova Gunay', email: 'g.akhundova@ufaz.az', programId: 'cs', group: 'CS1', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423200', fullName: 'Akhundova Maryam', email: 'm.akhundova@ufaz.az', programId: 'cs', group: 'CS1', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423307', fullName: 'Alasgarov Teymur', email: 't.alasgarov@ufaz.az', programId: 'cs', group: 'CS1', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423174', fullName: 'Algayeva Ilaha', email: 'i.algayeva@ufaz.az', programId: 'cs', group: 'CS1', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423162', fullName: 'Aliyev Hakim', email: 'h.aliyev@ufaz.az', programId: 'cs', group: 'CS1', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423312', fullName: 'Alizada Tofig', email: 't.alizada@ufaz.az', programId: 'cs', group: 'CS1', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423242', fullName: 'Asadli Nasrin', email: 'n.asadli@ufaz.az', programId: 'cs', group: 'CS1', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423208', fullName: 'Atlukhanov Murad', email: 'm.atlukhanov@ufaz.az', programId: 'cs', group: 'CS1', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423213', fullName: 'Azizov Nadir', email: 'n.azizov@ufaz.az', programId: 'cs', group: 'CS1', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423163', fullName: 'Balayev Huseyn', email: 'h.balayev@ufaz.az', programId: 'cs', group: 'CS1', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423185', fullName: 'Bayramli Javid', email: 'j.bayramli@ufaz.az', programId: 'cs', group: 'CS1', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 }, // Rank 16 (GPA 15.91)
  { studentId: '22423005', fullName: 'Budagov Farhad', email: 'f.budagov@ufaz.az', programId: 'cs', group: 'CS1', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423010', fullName: 'Burjaliyev Farhad', email: 'f.burjaliyev@ufaz.az', programId: 'cs', group: 'CS1', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423280', fullName: 'Garibov Sabuhi', email: 's.garibov@ufaz.az', programId: 'cs', group: 'CS1', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423203', fullName: 'Guliyev Mikayil', email: 'm.guliyev1@ufaz.az', programId: 'cs', group: 'CS1', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423001', fullName: 'Gulmammadov Famil', email: 'f.gulmammadov@ufaz.az', programId: 'cs', group: 'CS1', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423333', fullName: 'Haji-Nabili Tural', email: 't.haji-nabili@ufaz.az', programId: 'cs', group: 'CS1', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22422990', fullName: 'Hajiyev Bahruz', email: 'b.hajiyev@ufaz.az', programId: 'cs', group: 'CS1', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423190', fullName: 'Hasanli Kamil', email: 'k.hasanli@ufaz.az', programId: 'cs', group: 'CS1', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423301', fullName: 'Hasanova Tamara', email: 't.hasanova@ufaz.az', programId: 'cs', group: 'CS1', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423282', fullName: 'Hasratli Said', email: 's.hasratli@ufaz.az', programId: 'cs', group: 'CS1', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22121920', fullName: 'Hajili Bashir', email: 'b.hajili@ufaz.az', programId: 'cs', group: 'CS1', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22221908', fullName: 'Aliyev Javid', email: 'j.aliyev1@ufaz.az', programId: 'cs', group: 'CS1', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22322567', fullName: 'Alizada Fuad', email: 'f.alizada@ufaz.az', programId: 'cs', group: 'CS1', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22221819', fullName: 'Eyvazzade Anar', email: 'a.eyvazzada@ufaz.az', programId: 'cs', group: 'CS1', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },

  // Exercise CS2
  { studentId: '22423192', fullName: 'Huseynli Kamran', email: 'k.huseynli@ufaz.az', programId: 'cs', group: 'CS2', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423251', fullName: 'Ilyasli Nilufar', email: 'n.ilyasli@ufaz.az', programId: 'cs', group: 'CS2', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22422989', fullName: 'Jafarova Aziza', email: 'a.jafarova1@ufaz.az', programId: 'cs', group: 'CS2', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423196', fullName: 'Javadzade Mahammad', email: 'm.javadzade@ufaz.az', programId: 'cs', group: 'CS2', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423334', fullName: 'Khalafli Yusif', email: 'y.khalafli@ufaz.az', programId: 'cs', group: 'CS2', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423318', fullName: 'Khankishizade Tunar', email: 't.khankishizade@ufaz.az', programId: 'cs', group: 'CS2', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22422993', fullName: 'Kuchinskiy Daniil', email: 'd.kuchinskiy@ufaz.az', programId: 'cs', group: 'CS2', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22422979', fullName: 'Majidzade Ali', email: 'a.majidzade@ufaz.az', programId: 'cs', group: 'CS2', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423023', fullName: 'Mammadli Fidan', email: 'f.mammadli@ufaz.az', programId: 'cs', group: 'CS2', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423157', fullName: 'Mammadli Gulzar', email: 'g.mammadli@ufaz.az', programId: 'cs', group: 'CS2', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423156', fullName: 'Mammadova Fatma', email: 'f.mammadova@ufaz.az', programId: 'cs', group: 'CS2', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22425334', fullName: 'Mohammad Bakir Isa', email: 'isa.mohammad-bakir@ufaz.az', programId: 'cs', group: 'CS2', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22422996', fullName: 'Mutallimov Eldar', email: 'e.mutallimov@ufaz.az', programId: 'cs', group: 'CS2', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423182', fullName: 'Najafzade Jansu', email: 'j.najafzade@ufaz.az', programId: 'cs', group: 'CS2', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423260', fullName: 'Rahimbayov Riad', email: 'r.rahimbayov@ufaz.az', programId: 'cs', group: 'CS2', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423169', fullName: 'Rahimli Igbal', email: 'i.rahimli@ufaz.az', programId: 'cs', group: 'CS2', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423257', fullName: 'Rahimov Rasul', email: 'r.rahimov@ufaz.az', programId: 'cs', group: 'CS2', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22322638', fullName: 'Rashidli Yusif', email: 'y.rashidli@ufaz.az', programId: 'cs', group: 'CS2', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423252', fullName: 'Rzali Nuray', email: 'n.rzali@ufaz.az', programId: 'cs', group: 'CS2', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423234', fullName: 'Rzayeva Narmina', email: 'n.rzayeva1@ufaz.az', programId: 'cs', group: 'CS2', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22422986', fullName: 'Safarov Ayhan', email: 'a.safarov@ufaz.az', programId: 'cs', group: 'CS2', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423254', fullName: 'Salahov Parvin', email: 'p.salahov@ufaz.az', programId: 'cs', group: 'CS2', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423295', fullName: 'Salahov Sami', email: 's.salahov@ufaz.az', programId: 'cs', group: 'CS2', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423233', fullName: 'Seyidli Narmin', email: 'n.seyidli@ufaz.az', programId: 'cs', group: 'CS2', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423238', fullName: 'Sharifova Narmina', email: 'n.sharifova@ufaz.az', programId: 'cs', group: 'CS2', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423199', fullName: 'Taghiyeva Mahsati', email: 'm.taghiyeva@ufaz.az', programId: 'cs', group: 'CS2', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423337', fullName: 'Valiyev Zaur', email: 'z.valiyev@ufaz.az', programId: 'cs', group: 'CS2', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423230', fullName: 'Yusibzada Narmin', email: 'n.yusibzada@ufaz.az', programId: 'cs', group: 'CS2', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423304', fullName: 'Yusubov Telman', email: 't.yusubov@ufaz.az', programId: 'cs', group: 'CS2', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },
  { studentId: '22423244', fullName: 'Zahidova Nazrin', email: 'n.zahidova@ufaz.az', programId: 'cs', group: 'CS2', academicLevel: 'L2', cohortId: 'cs_l2_2026', gpa: 0 },

  // ==========================================
  // CHEMICAL ENGINEERING (CE-024) - 40 Students
  // ==========================================
  // CE1
  { studentId: '22420097', fullName: 'Abdullayev Murad', email: 'm.abdullayev1@ufaz.az', programId: 'che', group: 'CE1', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22419923', fullName: 'Afandiyeva Amina', email: 'a.afandiyeva@ufaz.az', programId: 'che', group: 'CE1', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420029', fullName: 'Aghamali Aysel', email: 'a.aghamali@ufaz.az', programId: 'che', group: 'CE1', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420096', fullName: 'Aghayev Murad', email: 'm.aghayev@ufaz.az', programId: 'che', group: 'CE1', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420086', fullName: 'Ahmadova Khadija', email: 'k.ahmadova@ufaz.az', programId: 'che', group: 'CE1', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420085', fullName: 'Aliyeva Khadija', email: 'k.aliyeva1@ufaz.az', programId: 'che', group: 'CE1', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420100', fullName: 'Babanli Nazpari', email: 'n.babanli@ufaz.az', programId: 'che', group: 'CE1', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22419949', fullName: 'Baghirova Aydan', email: 'a.baghirova1@ufaz.az', programId: 'che', group: 'CE1', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420109', fullName: 'Bayramzade Nuray', email: 'n.bayramzade@ufaz.az', programId: 'che', group: 'CE1', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420072', fullName: 'Eyvazov Huseyn', email: 'h.eyvazov@ufaz.az', programId: 'che', group: 'CE1', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420091', fullName: 'Galayeva Leyla', email: 'l.galayeva@ufaz.az', programId: 'che', group: 'CE1', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420035', fullName: 'Gurbanov Eljan', email: 'e.gurbanov@ufaz.az', programId: 'che', group: 'CE1', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420093', fullName: 'Hajizada Malahat', email: 'm.hajizada@ufaz.az', programId: 'che', group: 'CE1', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420125', fullName: 'Humbatov Shamil', email: 's.humbatov@ufaz.az', programId: 'che', group: 'CE1', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420054', fullName: 'Huseynli Gasham', email: 'g.huseynli@ufaz.az', programId: 'che', group: 'CE1', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420121', fullName: 'Huseynov Rovshan', email: 'r.huseynov1@ufaz.az', programId: 'che', group: 'CE1', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22419953', fullName: 'Huseynzada Aykhan', email: 'a.huseynzade@ufaz.az', programId: 'che', group: 'CE1', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420111', fullName: 'Ibrahimkhalilli Omar', email: 'o.ibrahimkhalilli@ufaz.az', programId: 'che', group: 'CE1', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420051', fullName: 'Ismayilov Fikrat', email: 'f.ismayilov@ufaz.az', programId: 'che', group: 'CE1', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22222010', fullName: 'Aghazada Aykhan', email: 'a.aghazada@ufaz.az', programId: 'che', group: 'CE1', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },

  // CE2
  { studentId: '22419935', fullName: 'Ismayilzada Arif', email: 'a.ismayilzada@ufaz.az', programId: 'che', group: 'CE2', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420039', fullName: 'Ismayilzada Farhad', email: 'f.ismayilzada@ufaz.az', programId: 'che', group: 'CE2', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420114', fullName: 'Jabrayilova Rafiga', email: 'r.jabrayilova@ufaz.az', programId: 'che', group: 'CE2', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420082', fullName: 'Mammadli Karim', email: 'k.mammadli@ufaz.az', programId: 'che', group: 'CE2', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420076', fullName: 'Mammadov Israil', email: 'i.mammadov1@ufaz.az', programId: 'che', group: 'CE2', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420103', fullName: 'Niyazli Nigar', email: 'n.niyazli@ufaz.az', programId: 'che', group: 'CE2', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420030', fullName: 'Omarov Eldar', email: 'e.omarov@ufaz.az', programId: 'che', group: 'CE2', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420105', fullName: 'Rahimova Nigar', email: 'n.rahimova@ufaz.az', programId: 'che', group: 'CE2', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420057', fullName: 'Rahmanzade Govhar', email: 'g.rahmanzade@ufaz.az', programId: 'che', group: 'CE2', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420065', fullName: 'Rustamli Gumru', email: 'g.rustamli1@ufaz.az', programId: 'che', group: 'CE2', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420090', fullName: 'Sadigli Laman', email: 'l.sadigli@ufaz.az', programId: 'che', group: 'CE2', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420070', fullName: 'Salimova Gunel', email: 'g.salimova@ufaz.az', programId: 'che', group: 'CE2', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420098', fullName: 'Shukurlu Narida', email: 'n.shukurlu@ufaz.az', programId: 'che', group: 'CE2', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22419914', fullName: 'Sklyarova Alina', email: 'a.sklyarova@ufaz.az', programId: 'che', group: 'CE2', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420146', fullName: 'Suleymanova Zeyneb', email: 'z.suleymanova@ufaz.az', programId: 'che', group: 'CE2', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420129', fullName: 'Umarova Susan', email: 's.umarova@ufaz.az', programId: 'che', group: 'CE2', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420046', fullName: 'Zalova Fatima', email: 'f.zalova@ufaz.az', programId: 'che', group: 'CE2', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22420143', fullName: 'Zeynalli Zaur', email: 'z.zeynalli@ufaz.az', programId: 'che', group: 'CE2', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22222033', fullName: 'Khudiyeva Maryam', email: 'm.khudiyeva@ufaz.az', programId: 'che', group: 'CE2', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },
  { studentId: '22222031', fullName: 'Huseynova Lala', email: 'l.huseynova1@ufaz.az', programId: 'che', group: 'CE2', academicLevel: 'L2', cohortId: 'che_l2_2026', gpa: 0 },

  // ==========================================
  // GEOPHYSICAL & GEOLOGICAL ENGINEERING (GE-024) - 23 Students
  // ==========================================
  // GE1
  { studentId: '22419945', fullName: 'Aliyev Jafar', email: 'j.aliyev2@ufaz.az', programId: 'ge', group: 'GE1', academicLevel: 'L2', cohortId: 'ge_l2_2026', gpa: 0 },
  { studentId: '22419948', fullName: 'Asadov Huseyn', email: 'h.asadov@ufaz.az', programId: 'ge', group: 'GE1', academicLevel: 'L2', cohortId: 'ge_l2_2026', gpa: 0 },
  { studentId: '22222001', fullName: 'Babazade Rustam', email: 'r.babazada@ufaz.az', programId: 'ge', group: 'GE1', academicLevel: 'L2', cohortId: 'ge_l2_2026', gpa: 0 },
  { studentId: '22420058', fullName: 'Dadashova Nazrin', email: 'n.dadashova@ufaz.az', programId: 'ge', group: 'GE1', academicLevel: 'L2', cohortId: 'ge_l2_2026', gpa: 0 },
  { studentId: '22420044', fullName: 'Garifulin Marat', email: 'm.garifulin@ufaz.az', programId: 'ge', group: 'GE1', academicLevel: 'L2', cohortId: 'ge_l2_2026', gpa: 0 },
  { studentId: '22419932', fullName: 'Gaysayeva Alina', email: 'a.gaysayeva@ufaz.az', programId: 'ge', group: 'GE1', academicLevel: 'L2', cohortId: 'ge_l2_2026', gpa: 0 },
  { studentId: '22420061', fullName: 'Guliyeva Nigar', email: 'n.guliyeva@ufaz.az', programId: 'ge', group: 'GE1', academicLevel: 'L2', cohortId: 'ge_l2_2026', gpa: 0 },
  { studentId: '22222008', fullName: 'Gurbanli Zhala', email: 'z.gurbanli@ufaz.az', programId: 'ge', group: 'GE1', academicLevel: 'L2', cohortId: 'ge_l2_2026', gpa: 0 },
  { studentId: '22419939', fullName: 'Gurbanli Aytaj', email: 'a.gurbanli@ufaz.az', programId: 'ge', group: 'GE1', academicLevel: 'L2', cohortId: 'ge_l2_2026', gpa: 0 },
  { studentId: '22419936', fullName: 'Hajiyeva Aysu', email: 'a.hajiyeva@ufaz.az', programId: 'ge', group: 'GE1', academicLevel: 'L2', cohortId: 'ge_l2_2026', gpa: 0 },
  { studentId: '22420034', fullName: 'Huseynli Kheyransa', email: 'k.huseynli1@ufaz.az', programId: 'ge', group: 'GE1', academicLevel: 'L2', cohortId: 'ge_l2_2026', gpa: 0 },
  { studentId: '22322394', fullName: 'Isayev Javid', email: 'j.isayev@ufaz.az', programId: 'ge', group: 'GE1', academicLevel: 'L2', cohortId: 'ge_l2_2026', gpa: 0 },

  // GE2
  { studentId: '22420049', fullName: 'Ismayilov Murad', email: 'm.ismayilov@ufaz.az', programId: 'ge', group: 'GE2', academicLevel: 'L2', cohortId: 'ge_l2_2026', gpa: 0 },
  { studentId: '22419942', fullName: 'Jabbarli Fidan', email: 'f.jabbarli@ufaz.az', programId: 'ge', group: 'GE2', academicLevel: 'L2', cohortId: 'ge_l2_2026', gpa: 0 },
  { studentId: '22322407', fullName: 'Jafarli Shafiga', email: 's.jafarli@ufaz.az', programId: 'ge', group: 'GE2', academicLevel: 'L2', cohortId: 'ge_l2_2026', gpa: 0 },
  { studentId: '22420071', fullName: 'Jafarli Shams', email: 's.jafarli1@ufaz.az', programId: 'ge', group: 'GE2', academicLevel: 'L2', cohortId: 'ge_l2_2026', gpa: 0 },
  { studentId: '22419947', fullName: 'Khanlarov Hamid', email: 'h.khanlarov@ufaz.az', programId: 'ge', group: 'GE2', academicLevel: 'L2', cohortId: 'ge_l2_2026', gpa: 0 },
  { studentId: '22420037', fullName: 'Mahmudlu Lala', email: 'l.mahmudlu@ufaz.az', programId: 'ge', group: 'GE2', academicLevel: 'L2', cohortId: 'ge_l2_2026', gpa: 0 },
  { studentId: '22322420', fullName: 'Mammadov Ramal', email: 'r.mammadov2@ufaz.az', programId: 'ge', group: 'GE2', academicLevel: 'L2', cohortId: 'ge_l2_2026', gpa: 0 },
  { studentId: '22419951', fullName: 'Mammadzada Ilham', email: 'i.mammadzada@ufaz.az', programId: 'ge', group: 'GE2', academicLevel: 'L2', cohortId: 'ge_l2_2026', gpa: 0 },
  { studentId: '22420055', fullName: 'Nuriyeva Narmin', email: 'n.nuriyeva@ufaz.az', programId: 'ge', group: 'GE2', academicLevel: 'L2', cohortId: 'ge_l2_2026', gpa: 0 },
  { studentId: '22420052', fullName: 'Samadova Nargiz', email: 'n.samadova@ufaz.az', programId: 'ge', group: 'GE2', academicLevel: 'L2', cohortId: 'ge_l2_2026', gpa: 0 },
  { studentId: '22420040', fullName: 'Taghiyeva Laman', email: 'l.taghiyeva@ufaz.az', programId: 'ge', group: 'GE2', academicLevel: 'L2', cohortId: 'ge_l2_2026', gpa: 0 },

  // ==========================================
  // PETROLEUM ENGINEERING (PE-024) - 30 Students
  // ==========================================
  // PE1
  { studentId: '22420463', fullName: 'Aghabalayeva Arzu', email: 'a.aghabalayeva@ufaz.az', programId: 'pe', group: 'PE1', academicLevel: 'L2', cohortId: 'pe_l2_2026', gpa: 0 },
  { studentId: '22420501', fullName: 'Ahmadov Muradkhan', email: 'm.ahmadov@ufaz.az', programId: 'pe', group: 'PE1', academicLevel: 'L2', cohortId: 'pe_l2_2026', gpa: 0 },
  { studentId: '22420485', fullName: 'Akhundlu Hokuma', email: 'h.akhundlu@ufaz.az', programId: 'pe', group: 'PE1', academicLevel: 'L2', cohortId: 'pe_l2_2026', gpa: 0 },
  { studentId: '22420467', fullName: 'Aliyev Aykhan', email: 'a.aliyev1@ufaz.az', programId: 'pe', group: 'PE1', academicLevel: 'L2', cohortId: 'pe_l2_2026', gpa: 0 },
  { studentId: '22420491', fullName: 'Alizada Kamal', email: 'k.alizada@ufaz.az', programId: 'pe', group: 'PE1', academicLevel: 'L2', cohortId: 'pe_l2_2026', gpa: 0 },
  { studentId: '22420446', fullName: 'Aljanli Akif', email: 'a.aljanli@ufaz.az', programId: 'pe', group: 'PE1', academicLevel: 'L2', cohortId: 'pe_l2_2026', gpa: 0 },
  { studentId: '22420499', fullName: 'Allahverdiyev Khazar', email: 'k.allahverdiyev1@ufaz.az', programId: 'pe', group: 'PE1', academicLevel: 'L2', cohortId: 'pe_l2_2026', gpa: 0 },
  { studentId: '22322723', fullName: 'Azizli Hasan', email: 'h.azizli@ufaz.az', programId: 'pe', group: 'PE1', academicLevel: 'L2', cohortId: 'pe_l2_2026', gpa: 0 },
  { studentId: '22420477', fullName: 'Azizov Emil', email: 'e.azizov1@ufaz.az', programId: 'pe', group: 'PE1', academicLevel: 'L2', cohortId: 'pe_l2_2026', gpa: 0 },
  { studentId: '22322714', fullName: 'Baghirov Davud', email: 'd.baghirov@ufaz.az', programId: 'pe', group: 'PE1', academicLevel: 'L2', cohortId: 'pe_l2_2026', gpa: 0 },
  { studentId: '22420461', fullName: 'Dadashzada Amin', email: 'a.dadashzada1@ufaz.az', programId: 'pe', group: 'PE1', academicLevel: 'L2', cohortId: 'pe_l2_2026', gpa: 0 },
  { studentId: '22420457', fullName: 'Gadimov Amin', email: 'a.gadimov@ufaz.az', programId: 'pe', group: 'PE1', academicLevel: 'L2', cohortId: 'pe_l2_2026', gpa: 0 },
  { studentId: '22420481', fullName: 'Guliyev Farid', email: 'f.guliyev1@ufaz.az', programId: 'pe', group: 'PE1', academicLevel: 'L2', cohortId: 'pe_l2_2026', gpa: 0 },
  { studentId: '22322747', fullName: 'Guliyev Magsud', email: 'm.guliyev@ufaz.az', programId: 'pe', group: 'PE1', academicLevel: 'L2', cohortId: 'pe_l2_2026', gpa: 0 },
  { studentId: '22420487', fullName: 'Hasanli Ilkin', email: 'i.hasanli@ufaz.az', programId: 'pe', group: 'PE1', academicLevel: 'L2', cohortId: 'pe_l2_2026', gpa: 0 },

  // PE2
  { studentId: '22420505', fullName: 'Hasanov Omar', email: 'o.hasanov@ufaz.az', programId: 'pe', group: 'PE2', academicLevel: 'L2', cohortId: 'pe_l2_2026', gpa: 0 },
  { studentId: '22222242', fullName: 'Huseynov Vugar', email: 'v.huseynov@ufaz.az', programId: 'pe', group: 'PE2', academicLevel: 'L2', cohortId: 'pe_l2_2026', gpa: 0 },
  { studentId: '22322766', fullName: 'Ibrahimli Vasif', email: 'v.ibrahimli@ufaz.az', programId: 'pe', group: 'PE2', academicLevel: 'L2', cohortId: 'pe_l2_2026', gpa: 0 },
  { studentId: '22420521', fullName: 'Ibrahimov Said', email: 's.ibrahimov@ufaz.az', programId: 'pe', group: 'PE2', academicLevel: 'L2', cohortId: 'pe_l2_2026', gpa: 0 },
  { studentId: '22420524', fullName: 'Jafarov Shahlar', email: 's.jafarov@ufaz.az', programId: 'pe', group: 'PE2', academicLevel: 'L2', cohortId: 'pe_l2_2026', gpa: 0 },
  { studentId: '22420551', fullName: 'Kalbiyeva Zeynab', email: 'z.kalbiyeva@ufaz.az', programId: 'pe', group: 'PE2', academicLevel: 'L2', cohortId: 'pe_l2_2026', gpa: 0 },
  { studentId: '22420527', fullName: 'Khidirov Tural', email: 't.khidirov@ufaz.az', programId: 'pe', group: 'PE2', academicLevel: 'L2', cohortId: 'pe_l2_2026', gpa: 0 },
  { studentId: '22420489', fullName: 'Mammadli Ismayil', email: 'i.mammadli@ufaz.az', programId: 'pe', group: 'PE2', academicLevel: 'L2', cohortId: 'pe_l2_2026', gpa: 0 },
  { studentId: '22420503', fullName: 'Mammadova Nurana', email: 'n.mammadova@ufaz.az', programId: 'pe', group: 'PE2', academicLevel: 'L2', cohortId: 'pe_l2_2026', gpa: 0 },
  { studentId: '22420479', fullName: 'Rahimzade Farhad', email: 'f.rahimzade@ufaz.az', programId: 'pe', group: 'PE2', academicLevel: 'L2', cohortId: 'pe_l2_2026', gpa: 0 },
  { studentId: '22420454', fullName: 'Rustamli Ali', email: 'a.rustamli@ufaz.az', programId: 'pe', group: 'PE2', academicLevel: 'L2', cohortId: 'pe_l2_2026', gpa: 0 },
  { studentId: '22420435', fullName: 'Salahova Aisha', email: 'a.salahova1@ufaz.az', programId: 'pe', group: 'PE2', academicLevel: 'L2', cohortId: 'pe_l2_2026', gpa: 0 },
  { studentId: '22420494', fullName: 'Salimova Khadija', email: 'k.karimova@ufaz.az', programId: 'pe', group: 'PE2', academicLevel: 'L2', cohortId: 'pe_l2_2026', gpa: 0 },
  { studentId: '22420476', fullName: 'Sultanova Ayshan', email: 'a.sultanova@ufaz.az', programId: 'pe', group: 'PE2', academicLevel: 'L2', cohortId: 'pe_l2_2026', gpa: 0 },
  { studentId: '22420508', fullName: 'Umud Rasul', email: 'r.umud@ufaz.az', programId: 'pe', group: 'PE2', academicLevel: 'L2', cohortId: 'pe_l2_2026', gpa: 0 },

  // ==========================================
  // CHEMISTRY (CH-024) - 22 Students
  // ==========================================
  // CH1
  { studentId: '22420174', fullName: 'Abbasova Hagigat', email: 'h.abbasova@ufaz.az', programId: 'chem', group: 'CH1', academicLevel: 'L2', cohortId: 'chem_l2_2026', gpa: 0 },
  { studentId: '22420383', fullName: 'Abushov Nihad', email: 'n.abushov@ufaz.az', programId: 'chem', group: 'CH1', academicLevel: 'L2', cohortId: 'chem_l2_2026', gpa: 0 },
  { studentId: '22420381', fullName: 'Ahmadzada Nazrin', email: 'n.ahmadzada@ufaz.az', programId: 'chem', group: 'CH1', academicLevel: 'L2', cohortId: 'chem_l2_2026', gpa: 0 },
  { studentId: '22420178', fullName: 'Alakbarli Khadija', email: 'k.alakbarli@ufaz.az', programId: 'chem', group: 'CH1', academicLevel: 'L2', cohortId: 'chem_l2_2026', gpa: 0 },
  { studentId: '22420185', fullName: 'Atakishibayli Leyla', email: 'l.atakishibayli@ufaz.az', programId: 'chem', group: 'CH1', academicLevel: 'L2', cohortId: 'chem_l2_2026', gpa: 0 },
  { studentId: '22420194', fullName: 'Azimova Malak', email: 'm.azimova@ufaz.az', programId: 'chem', group: 'CH1', academicLevel: 'L2', cohortId: 'chem_l2_2026', gpa: 0 },
  { studentId: '22420166', fullName: 'Guliyev Farid', email: 'f.guliyev@ufaz.az', programId: 'chem', group: 'CH1', academicLevel: 'L2', cohortId: 'chem_l2_2026', gpa: 0 },
  { studentId: '22420397', fullName: 'Hajiyev Rufat', email: 'r.hajiyev@ufaz.az', programId: 'chem', group: 'CH1', academicLevel: 'L2', cohortId: 'chem_l2_2026', gpa: 0 },
  { studentId: '22420156', fullName: 'Huseynli Aylin', email: 'a.huseynli@ufaz.az', programId: 'chem', group: 'CH1', academicLevel: 'L2', cohortId: 'chem_l2_2026', gpa: 0 },
  { studentId: '22420191', fullName: 'Ibadova Mahin', email: 'm.ibadova@ufaz.az', programId: 'chem', group: 'CH1', academicLevel: 'L2', cohortId: 'chem_l2_2026', gpa: 0 },
  { studentId: '22420403', fullName: 'Kazimova Shahana', email: 's.kazimova@ufaz.az', programId: 'chem', group: 'CH1', academicLevel: 'L2', cohortId: 'chem_l2_2026', gpa: 0 },

  // CH2
  { studentId: '22420409', fullName: 'Mammadzada Ulvi', email: 'u.mammadzada@ufaz.az', programId: 'chem', group: 'CH2', academicLevel: 'L2', cohortId: 'chem_l2_2026', gpa: 0 },
  { studentId: '22420380', fullName: 'Mehraliyeva Narmina', email: 'n.mehraliyeva@ufaz.az', programId: 'chem', group: 'CH2', academicLevel: 'L2', cohortId: 'chem_l2_2026', gpa: 0 },
  { studentId: '22420412', fullName: 'Mustafazade Vasif', email: 'v.mustafazade@ufaz.az', programId: 'chem', group: 'CH2', academicLevel: 'L2', cohortId: 'chem_l2_2026', gpa: 0 },
  { studentId: '22420157', fullName: 'Nahmatova Ayshan', email: 'a.nahmatova@ufaz.az', programId: 'chem', group: 'CH2', academicLevel: 'L2', cohortId: 'chem_l2_2026', gpa: 0 },
  { studentId: '22420193', fullName: 'Nasibova Malak', email: 'm.nasibova1@ufaz.az', programId: 'chem', group: 'CH2', academicLevel: 'L2', cohortId: 'chem_l2_2026', gpa: 0 },
  { studentId: '22420155', fullName: 'Primak Anastasiya', email: 'a.primak@ufaz.az', programId: 'chem', group: 'CH2', academicLevel: 'L2', cohortId: 'chem_l2_2026', gpa: 0 },
  { studentId: '22420401', fullName: 'Rahimi Setayesh', email: 's.rahimi@ufaz.az', programId: 'chem', group: 'CH2', academicLevel: 'L2', cohortId: 'chem_l2_2026', gpa: 0 },
  { studentId: '22420153', fullName: 'Rasulov Amir', email: 'a.rasulov@ufaz.az', programId: 'chem', group: 'CH2', academicLevel: 'L2', cohortId: 'chem_l2_2026', gpa: 0 },
  { studentId: '22420170', fullName: 'Rustamzada Fatima', email: 'f.rustamzada@ufaz.az', programId: 'chem', group: 'CH2', academicLevel: 'L2', cohortId: 'chem_l2_2026', gpa: 0 },
  { studentId: '22420189', fullName: 'Rzayeva Madina', email: 'm.rzayeva@ufaz.az', programId: 'chem', group: 'CH2', academicLevel: 'L2', cohortId: 'chem_l2_2026', gpa: 0 },
  { studentId: '22420172', fullName: 'Safarli Fidan', email: 'f.safarli@ufaz.az', programId: 'chem', group: 'CH2', academicLevel: 'L2', cohortId: 'chem_l2_2026', gpa: 0 },
];
