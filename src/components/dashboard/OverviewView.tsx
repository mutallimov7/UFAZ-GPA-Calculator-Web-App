import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { RankingAnalysis, SavedAcademicRecord } from '../../types.ts';
import {
  Trophy,
  Award,
  BookOpen,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
  GraduationCap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface OverviewViewProps {
  onNavigate: (view: any) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [rankingAnalysis, setRankingAnalysis] = useState<RankingAnalysis | null>(null);
  const [records, setRecords] = useState<SavedAcademicRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [rankRes, histRes] = await Promise.all([
          api.getRanking(user?.programId || 'cs', user?.academicLevel || 'L2'),
          api.getGradeHistory(),
        ]);
        if (isMounted) {
          setRankingAnalysis(rankRes.analysis);
          setRecords(histRes.records || []);
        }
      } catch (err) {
        console.error('Failed to load overview data', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const hasGpa = Boolean(user?.gpa && user.gpa > 0);
  const currentGpa = hasGpa ? user!.gpa : null;

  // Derive latest record if available
  const latestRecord = records.length > 0 ? records[records.length - 1] : null;

  // Cumulative GPA from actual records
  const cumulativeGpa =
    records.length > 0
      ? Math.round((records.reduce((acc, r) => acc + r.gpa, 0) / records.length) * 100) / 100
      : hasGpa
      ? user!.gpa
      : 0;

  // Completed ECTS from validated records (French Bologna: 30 ECTS per validated semester >= 10/20)
  const completedEcts = records.reduce((acc, r) => (r.gpa >= 10.0 ? acc + 30 : acc), 0);
  const ectsPercentage = Math.min(100, Math.round((completedEcts / 180) * 100));

  const rank = rankingAnalysis?.currentRank;
  const totalInCohort = rankingAnalysis?.totalStudents || 60;
  const nextAbove = rankingAnalysis?.nextRankAbove;

  // Chart data from real records
  const chartData = records.map((r) => ({
    semester: r.semester,
    gpa: r.gpa,
    benchmark: 14.0,
  }));

  const getMention = (gpa: number) => {
    if (gpa <= 0) return 'En cours (No Exam Yet)';
    if (gpa >= 16.0) return 'Très Bien (High Honors)';
    if (gpa >= 14.0) return 'Bien (Honors)';
    if (gpa >= 12.0) return 'Assez Bien (Satisfactory)';
    if (gpa >= 10.0) return 'Passable (Pass)';
    return 'Ajourné (Fail)';
  };

  return (
    <div className="space-y-6 font-body">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Official Student Dashboard
            </span>
            <span className="text-xs text-slate-500">• Semester 4 (Spring 2026)</span>
          </div>
          <h1 className="text-2xl font-bold font-academic-title text-slate-900 mt-1">
            Welcome, {user?.fullName || 'Student'}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            French-Azerbaijani University • Licence Informatique / Bachelor of Science (Unistra)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('calculator')}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#1e3a8a] hover:bg-[#193275] text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Open GPA Calculator</span>
          </button>
          <button
            onClick={() => onNavigate('simulator')}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold rounded-md shadow-xs transition-colors"
          >
            <span>What-If Simulator</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Current Semester GPA */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Current Semester GPA</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                hasGpa && currentGpa! > 0
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              {hasGpa && currentGpa! > 0 ? 'Calculated' : 'No Exam Yet'}
            </span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-mono-grades text-slate-900">
              {hasGpa ? currentGpa!.toFixed(2) : '0.00'}
            </span>
            <span className="text-xs text-slate-500">/ 20.00</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-600 flex items-center space-x-1">
            <Award className="w-3.5 h-3.5 text-blue-700" />
            <span className="font-semibold text-blue-900">
              {hasGpa && currentGpa! > 0 ? `Mention: ${getMention(currentGpa!)}` : 'Mention: En cours (No Exam Yet)'}
            </span>
          </div>
        </div>

        {/* Metric 2: Official Cohort Ranking */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Official Cohort Rank</span>
            <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
              {rank ? `#${rank} (${hasGpa && currentGpa! > 0 ? `Top ${rankingAnalysis?.percentile}%` : 'Roster Order'})` : 'Enrolled'}
            </span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-mono-grades text-[#1e3a8a]">
              {rank ? `#${rank}` : '—'}
            </span>
            <span className="text-xs text-slate-500">/ {totalInCohort} students</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-600 truncate">
            {hasGpa && currentGpa! > 0 && nextAbove ? (
              <span className="text-amber-700 font-medium">
                +{nextAbove.gap.toFixed(2)} GPA to reach Rank #{nextAbove.rank}
              </span>
            ) : hasGpa && currentGpa! > 0 && rank === 1 ? (
              <span className="text-emerald-700 font-medium">Rank #1 in Cohort</span>
            ) : (
              <span className="text-slate-500">Official Roster • Semester Exams Pending</span>
            )}
          </div>
        </div>

        {/* Metric 3: Cumulative Academic GPA */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Cumulative GPA</span>
            <span className="text-[10px] text-slate-400">
              {records.length} Semester{records.length === 1 ? '' : 's'}
            </span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-mono-grades text-slate-800">
              {cumulativeGpa > 0 ? cumulativeGpa.toFixed(2) : '--'}
            </span>
            <span className="text-xs text-slate-500">/ 20.00</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-600 flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {records.length > 0
                ? `Validated across ${records.length} semester${records.length > 1 ? 's' : ''}`
                : 'Starting fresh from scratch'}
            </span>
          </div>
        </div>

        {/* Metric 4: ECTS Credits Completed */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Degree Progression</span>
            <span className="text-[10px] text-slate-500">Licence 3-Year</span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-mono-grades text-slate-900">
              {completedEcts}
            </span>
            <span className="text-xs text-slate-500">/ 180 ECTS</span>
          </div>
          <div className="mt-2 flex items-center space-x-2">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-800 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${ectsPercentage}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-slate-500 font-mono-grades font-semibold">
              {ectsPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Two-Column Section: Historical Trend & Immediate Next Rank Strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: GPA Trend Line Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-blue-800" />
                <span>Semester GPA Trajectory & Academic Stability</span>
              </h2>
              <p className="text-xs text-slate-500">
                Official certified records across academic cycles
              </p>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs text-blue-800 hover:text-blue-950 font-semibold flex items-center space-x-1"
            >
              <span>View History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {records.length === 0 ? (
            <div className="h-64 w-full flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-lg p-6 text-center bg-slate-50/50">
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 text-blue-800 flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Fresh Academic Slate</h3>
              <p className="text-xs text-slate-500 max-w-md mt-1 mb-4">
                No semester grades have been recorded yet. Use the GPA Calculator to enter your course component scores, compute your semester average, and save your certified results.
              </p>
              <button
                onClick={() => onNavigate('calculator')}
                className="px-4 py-2 bg-[#1e3a8a] hover:bg-[#193275] text-white text-xs font-semibold rounded-md transition-colors flex items-center space-x-1.5 shadow-xs"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Calculate Your First GPA</span>
              </button>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="semester" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 20]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`${Number(val).toFixed(2)} / 20`, 'GPA']}
                  />
                  <Area type="monotone" dataKey="gpa" stroke="#1e3a8a" strokeWidth={2.5} fill="url(#gpaGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
            <span>Minimum pass threshold: 10.00 / 20</span>
            <span className="text-blue-900 font-semibold">Honors (Bien): 14.00 / 20</span>
            <span className="text-emerald-800 font-semibold">High Honors (Très Bien): 16.00 / 20</span>
          </div>
        </div>

        {/* Right Col: Next Rank Strategy & Cohort Position */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>Next Rank Analysis</span>
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                {user?.programId?.toUpperCase() || 'CS'} L2 Cohort
              </span>
            </div>

            {hasGpa && rank ? (
              <>
                <div className="bg-[#f8fafc] border border-slate-200 rounded-md p-3 text-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Your Current Position:</span>
                    <span className="font-bold text-blue-900">
                      Rank #{rank} ({currentGpa!.toFixed(2)})
                    </span>
                  </div>
                  {nextAbove ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Immediate Predecessor:</span>
                        <span className="font-medium text-slate-700">
                          Rank #{nextAbove.rank} ({nextAbove.gpa.toFixed(2)})
                        </span>
                      </div>
                      <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
                        <span className="text-slate-600 font-medium">GPA Difference:</span>
                        <span className="font-mono-grades font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          +{nextAbove.gap.toFixed(2)} GPA
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="border-t border-slate-200 pt-2 text-emerald-700 font-semibold">
                      You currently hold the top rank in your cohort!
                    </div>
                  )}
                </div>

                <div className="mt-4 text-xs text-slate-600 space-y-2">
                  <p className="font-medium text-slate-800">Target Strategy:</p>
                  <p className="text-[11px] text-slate-500">
                    Use the What-If Simulator to experiment with final exam targets and observe real-time simulated ranking shifts.
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 text-xs text-slate-600 space-y-3">
                <p className="font-semibold text-slate-800">No Grades Recorded Yet</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Your academic record is clear. As soon as you compute and save your semester grades, the ranking engine will position you within your cohort and display your gap to the next rank.
                </p>
                <button
                  onClick={() => onNavigate('calculator')}
                  className="text-xs text-blue-800 hover:text-blue-950 font-semibold underline"
                >
                  Enter grades in Calculator &rarr;
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigate('ranking')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold transition-colors flex items-center justify-center space-x-1"
            >
              <span>Explore Official Cohort Leaderboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Module Quick Status for Current Semester */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Current Semester 4 Course Modules & Evaluation Weights
            </h3>
            <p className="text-xs text-slate-500">
              Official UFAZ Curriculum Formulas • Spring Examination Period
            </p>
          </div>
          <button
            onClick={() => onNavigate('calculator')}
            className="text-xs text-blue-800 hover:underline font-semibold flex items-center space-x-1"
          >
            <span>Open GPA Calculator</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50">
            <div className="text-[11px] font-semibold text-slate-500">MATH-201 • 5 ECTS</div>
            <div className="font-bold text-slate-900 text-sm mt-0.5">Vector Analysis</div>
            <div className="mt-2 text-xs font-mono-grades font-bold text-blue-900">
              {latestRecord?.moduleGrades?.['Vector Analysis']
                ? `${latestRecord.moduleGrades['Vector Analysis'].toFixed(2)} / 20`
                : '-- / 20'}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Notebook (2) + Mid (3) + Final (5)
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50">
            <div className="text-[11px] font-semibold text-slate-500">PHYS-203 • 7 ECTS</div>
            <div className="font-bold text-slate-900 text-sm mt-0.5">Physics_3</div>
            <div className="mt-2 text-xs font-mono-grades font-bold text-blue-900">
              {latestRecord?.moduleGrades?.['Physics_3']
                ? `${latestRecord.moduleGrades['Physics_3'].toFixed(2)} / 20`
                : '-- / 20'}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Electricity (2) + EM (3) / 5
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50">
            <div className="text-[11px] font-semibold text-slate-500">LANG-201 • 3 ECTS</div>
            <div className="font-bold text-slate-900 text-sm mt-0.5">French</div>
            <div className="mt-2 text-xs font-mono-grades font-bold text-blue-900">
              {latestRecord?.moduleGrades?.['French']
                ? `${latestRecord.moduleGrades['French'].toFixed(2)} / 20`
                : '-- / 20'}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Midterm (2) + Speaking (3) + Final (3)
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50">
            <div className="text-[11px] font-semibold text-slate-500">INFO-200 • 15 ECTS</div>
            <div className="font-bold text-slate-900 text-sm mt-0.5">Computer Science</div>
            <div className="mt-2 text-xs font-mono-grades font-bold text-blue-900">
              {latestRecord?.moduleGrades?.['Computer Science']
                ? `${latestRecord.moduleGrades['Computer Science'].toFixed(2)} / 20`
                : '-- / 20'}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              SE, SP, Systems, Networks, Back-End
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
