import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { CohortStats, ProgramId, RankingAnalysis, RankingEntry } from '../../types.ts';
import {
  Trophy,
  Shield,
  Search,
  Users,
  TrendingUp,
  Award,
  ArrowUpRight,
  Info,
} from 'lucide-react';

export const RankingView: React.FC = () => {
  const { user } = useAuth();
  const [selectedProgram, setSelectedProgram] = useState<ProgramId>(user?.programId || 'cs');
  const [selectedLevel, setSelectedLevel] = useState<string>('L2');
  const [entries, setEntries] = useState<RankingEntry[]>([]);
  const [stats, setStats] = useState<CohortStats | null>(null);
  const [analysis, setAnalysis] = useState<RankingAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  // Load cohort ranking
  const loadRanking = async () => {
    try {
      setLoading(true);
      const res = await api.getRanking(selectedProgram, selectedLevel);
      setEntries(res.entries);
      setStats(res.stats);
      setAnalysis(res.analysis);
    } catch (err) {
      console.error('Failed to load ranking', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRanking();
  }, [selectedProgram, selectedLevel]);

  const isSemesterPending = Boolean(stats && stats.averageGpa === 0);
  const hasUserCalculated = Boolean(analysis && (analysis.studentGpa > 0 || isSemesterPending));

  // Filter entries
  const filteredEntries = entries.filter((e) => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      e.studentDisplay.toLowerCase().includes(q) ||
      e.studentIdMasked.toLowerCase().includes(q) ||
      e.rank.toString() === q
    );
  });

  return (
    <div className="space-y-6 font-body">
      {/* Top Banner & Scope Selection */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Cohort Leaderboard
            </span>
            <span className="text-xs text-slate-500">• Official Roster</span>
          </div>
          <h1 className="text-xl font-bold font-academic-title text-slate-900 mt-1">
            Academic Standing & Cohort Ranking
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Official cohort roster. Semester GPAs are initialized to 0.00 pending scheduled exams.
          </p>
        </div>

        {/* Cohort Scopes */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-300">
            <span className="text-slate-500 font-medium">Program:</span>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value as ProgramId)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-hidden"
            >
              <option value="cs">Computer Science (62)</option>
              <option value="che">Chemical Eng (38)</option>
              <option value="ge">Geophysical Eng (28)</option>
              <option value="pe">Petroleum Eng (34)</option>
              <option value="chem">Chemistry (30)</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-300">
            <span className="text-slate-500 font-medium">Level:</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-hidden"
            >
              <option value="L2">L2 (License 2)</option>
              <option value="L1">L1 (Foundation)</option>
              <option value="L3">L3 (Senior)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-3 text-xs text-emerald-900 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            <strong>Academic Cohort Roster:</strong> Official student list for the semester. Current Semester GPA is set to 0.00 as exams have not yet commenced.
          </span>
        </div>
        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">
          Official Roster
        </span>
      </div>

      {/* Primary KPI Grid for Current Student */}
      {analysis && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border-2 border-blue-600/30 shadow-xs">
            <div className="text-xs text-slate-500 font-medium">Your Cohort Position</div>
            <div className="mt-1 flex items-baseline space-x-2">
              <span className="text-3xl font-bold font-mono-grades text-[#1e3a8a]">
                {analysis ? `#${analysis.currentRank}` : '—'}
              </span>
              <span className="text-xs text-slate-500">/ {analysis.totalStudents} students</span>
            </div>
            <div className="mt-2 text-xs font-semibold text-blue-800">
              {isSemesterPending
                ? 'Roster order (Pending exams)'
                : hasUserCalculated
                ? `Top ${analysis.percentile}% of class`
                : 'Calculate GPA to join ranking'}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 font-medium">Your Semester GPA</div>
            <div className="mt-1 flex items-baseline space-x-2">
              <span className="text-3xl font-bold font-mono-grades text-slate-900">
                {analysis ? analysis.studentGpa.toFixed(2) : '0.00'}
              </span>
              <span className="text-xs text-slate-500">/ 20.00</span>
            </div>
            <div className="mt-2 text-xs text-slate-500 font-medium">
              {isSemesterPending
                ? 'No exams held for now (0.00)'
                : hasUserCalculated
                ? `${(analysis.studentGpa - analysis.cohortAverage >= 0 ? '+' : '')}${(
                    analysis.studentGpa - analysis.cohortAverage
                  ).toFixed(2)} vs class mean`
                : 'Awaiting grade calculation'}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 font-medium">
              {hasUserCalculated && analysis.nextRankAbove && !isSemesterPending
                ? `Next Rank Above (#${analysis.nextRankAbove.rank})`
                : 'Target Threshold'}
            </div>
            <div className="mt-1 flex items-baseline space-x-2">
              <span className="text-3xl font-bold font-mono-grades text-amber-700">
                {isSemesterPending
                  ? '10.00'
                  : hasUserCalculated && analysis.nextRankAbove
                  ? analysis.nextRankAbove.gpa.toFixed(2)
                  : '—'}
              </span>
              <span className="text-xs text-slate-500">GPA</span>
            </div>
            <div className="mt-2 text-xs font-medium text-amber-800">
              {isSemesterPending ? (
                <span>Minimum passing mark threshold</span>
              ) : hasUserCalculated && analysis.nextRankAbove ? (
                <span>
                  Need +{analysis.nextRankAbove.gap.toFixed(2)} to reach #{analysis.nextRankAbove.rank}
                </span>
              ) : hasUserCalculated ? (
                <span>You hold the highest rank in cohort!</span>
              ) : (
                <span>Enter grades in GPA Calculator</span>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 font-medium">Cohort Benchmarks</div>
            <div className="mt-1 flex items-baseline space-x-2">
              <span className="text-2xl font-bold font-mono-grades text-slate-800">
                {stats?.averageGpa.toFixed(2)}
              </span>
              <span className="text-xs text-slate-500">Average</span>
            </div>
            <div className="mt-2 text-xs text-slate-500 flex justify-between">
              <span>
                Median: <strong className="text-slate-700">{stats?.medianGpa.toFixed(2)}</strong>
              </span>
              <span>
                Highest: <strong className="text-slate-700">{stats?.highestGpa.toFixed(2)}</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name or ID..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center space-x-3 text-xs text-slate-500">
          <span>
            Displaying <strong>{filteredEntries.length}</strong> of <strong>{entries.length}</strong> students
          </span>
        </div>
      </div>

      {/* The Cohort Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8fafc] text-slate-600 border-b border-slate-200 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 w-20">Rank</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Semester GPA</th>
                <th className="py-3 px-4">French Mention</th>
                <th className="py-3 px-4 text-right">Percentile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-body">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Loading certified cohort data...
                  </td>
                </tr>
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No student matching search filter.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((student) => (
                  <tr
                    key={`${student.rank}-${student.studentDisplay}`}
                    className={`transition-colors ${
                      student.isCurrentUser
                        ? 'bg-blue-50/90 font-semibold text-blue-950 border-l-4 border-l-[#1e3a8a]'
                        : 'hover:bg-slate-50/80 text-slate-700'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className={`font-mono-grades font-bold px-2 py-0.5 rounded text-xs ${
                            student.isCurrentUser
                              ? 'bg-[#1e3a8a] text-white'
                              : student.rank <= 3 && student.gpa > 0
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          #{student.rank}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {student.isCurrentUser ? (
                          <span className="flex items-center space-x-1.5 font-bold text-blue-900">
                            <span>{student.studentDisplay}</span>
                            <span className="text-[10px] bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded">
                              Your Account
                            </span>
                          </span>
                        ) : (
                          <span className="text-slate-800 font-medium">
                            {student.studentDisplay}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono-grades text-slate-500 text-[11px]">
                      {student.studentIdMasked}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono-grades font-bold text-sm text-slate-900">
                        {student.gpa.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-1">/ 20</span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] ${
                          student.gpa >= 16.0
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold'
                            : student.gpa >= 14.0
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : student.gpa >= 12.0
                            ? 'bg-purple-50 text-purple-800 border border-purple-200'
                            : student.gpa >= 10.0
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {student.honors}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-medium text-slate-600">
                      {student.percentileText}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
