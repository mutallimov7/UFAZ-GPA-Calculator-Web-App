import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { ProjectedRankResult, RankingAnalysis, SavedAcademicRecord } from '../../types.ts';
import {
  Sliders,
  TrendingUp,
  Target,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle,
  AlertCircle,
  Trophy,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const GradeSimulatorView: React.FC = () => {
  const { user } = useAuth();
  const [projectedGpa, setProjectedGpa] = useState<number>(16.0);
  const [simulation, setSimulation] = useState<ProjectedRankResult | null>(null);
  const [records, setRecords] = useState<SavedAcademicRecord[]>([]);
  const [rankingAnalysis, setRankingAnalysis] = useState<RankingAnalysis | null>(null);
  const [loadingSim, setLoadingSim] = useState(false);

  // Target GPA Solver states
  const [targetGpa, setTargetGpa] = useState<number>(16.0);
  const [targetModule, setTargetModule] = useState<string>('cs_be_fin'); // Back-End Final exam

  // Semester Simulator states
  const [nextSemesterHypothesis, setNextSemesterHypothesis] = useState<number>(16.5);

  const hasGpa = Boolean(user?.gpa && user.gpa > 0);
  const currentGpa = hasGpa ? user!.gpa : 0;
  const currentRank = rankingAnalysis?.currentRank;

  useEffect(() => {
    let isMounted = true;
    const fetchContextData = async () => {
      try {
        const [histRes, rankRes] = await Promise.all([
          api.getGradeHistory(),
          api.getRanking(user?.programId || 'cs', user?.academicLevel || 'L2'),
        ]);
        if (isMounted) {
          setRecords(histRes.records || []);
          setRankingAnalysis(rankRes.analysis);
        }
      } catch (err) {
        console.error('Failed to load simulator context', err);
      }
    };
    fetchContextData();
    return () => {
      isMounted = false;
    };
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    const runSim = async () => {
      try {
        setLoadingSim(true);
        const res = await api.simulateRank(projectedGpa, user?.programId || 'cs', 'L2');
        if (isMounted) {
          setSimulation(res);
        }
      } catch (err) {
        console.error('Simulation error', err);
      } finally {
        if (isMounted) setLoadingSim(false);
      }
    };

    runSim();
    return () => {
      isMounted = false;
    };
  }, [projectedGpa, user]);

  const calculateNeededScore = () => {
    const deltaGpa = targetGpa - currentGpa;
    if (deltaGpa <= 0 && hasGpa) {
      return {
        status: 'already_achieved',
        needed: 0,
        text: 'Your current GPA already satisfies or exceeds this target!',
      };
    }
    // Effective coefficient of Back-End Final in CS L2: 5% of overall GPA
    const baseScore = hasGpa ? 12.0 : 10.0;
    const needed = Math.min(20, Math.max(0, baseScore + deltaGpa / 0.05));
    const formatted = Math.round(needed * 100) / 100;

    if (needed > 20) {
      return {
        status: 'impossible_single',
        needed: formatted,
        text: `Target requires gaining +${deltaGpa.toFixed(2)} GPA, which exceeds the scale of a single component. Multiple exam scores must be elevated concurrently.`,
      };
    }
    return {
      status: 'achievable',
      needed: formatted,
      text: `Aim for approximately ${formatted.toFixed(2)} / 20 in Back-End Final to achieve your target semester GPA of ${targetGpa.toFixed(2)}.`,
    };
  };

  const targetResult = calculateNeededScore();

  // Dynamic Cumulative GPA Projection
  const completedSemesters = records.length;
  const sumCurrent = records.reduce((acc, r) => acc + r.gpa, 0);
  const cumulativeCurrent =
    completedSemesters > 0 ? Math.round((sumCurrent / completedSemesters) * 100) / 100 : currentGpa;
  const totalSemestersProjected = Math.max(1, completedSemesters + 1);
  const cumulativeProjected =
    Math.round(((sumCurrent + nextSemesterHypothesis) / totalSemestersProjected) * 100) / 100;

  return (
    <div className="space-y-6 font-body">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              Simulation & Hypothetical Analysis
            </span>
            <span className="text-xs text-slate-500">• Interactive Sandbox</span>
          </div>
          <h1 className="text-xl font-bold font-academic-title text-slate-900 mt-1">
            Grade Simulator & What-If Engine
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Test future exam outcomes and target GPA requirements. Simulations do not alter official academic records.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded text-xs font-medium">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Non-destructive sandbox</span>
        </div>
      </div>

      {/* Simulator 1: Live Projected GPA & Cohort Ranking Outcome */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>Projected GPA to Estimated Cohort Rank</span>
            </h2>
            <p className="text-xs text-slate-500">
              Simulate your rank position across the official 62-student cohort
            </p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-800 rounded">
            Estimated Model
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Slider & Input Control */}
          <div className="lg:col-span-1 space-y-4 bg-slate-50/70 p-4 rounded-lg border border-slate-200">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Projected Semester GPA:
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  step="0.05"
                  min="10.0"
                  max="20.0"
                  value={projectedGpa}
                  onChange={(e) => setProjectedGpa(Number(e.target.value))}
                  className="w-28 text-sm font-mono-grades font-bold bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
                <span className="text-xs text-slate-500">/ 20.00</span>
              </div>
            </div>

            <div>
              <input
                type="range"
                min="10.0"
                max="19.5"
                step="0.05"
                value={projectedGpa}
                onChange={(e) => setProjectedGpa(Number(e.target.value))}
                className="w-full accent-[#1e3a8a] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono-grades mt-1">
                <span>10.00</span>
                <span>14.00 (Bien)</span>
                <span>16.00 (Très Bien)</span>
                <span>19.50</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
              <span>Your Official Saved GPA: </span>
              <span className="font-mono-grades font-bold text-slate-800">
                {hasGpa ? currentGpa.toFixed(2) : 'Not calculated yet'}
              </span>
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Current Saved Official */}
            <div className="border border-slate-200 rounded-lg p-4 bg-white">
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Current Official Result
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-3xl font-bold font-mono-grades text-slate-800">
                  {hasGpa && currentRank ? `#${currentRank}` : '—'}
                </span>
                <span className="text-xs text-slate-500">
                  / {rankingAnalysis?.totalStudents || 60} in CS L2
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-600 space-y-1">
                <div>
                  GPA:{' '}
                  <span className="font-mono-grades font-bold">
                    {hasGpa ? `${currentGpa.toFixed(2)} / 20` : 'None (Starting from scratch)'}
                  </span>
                </div>
                <div>
                  Status:{' '}
                  <span className="font-semibold text-slate-800">
                    {hasGpa ? `Top ${rankingAnalysis?.percentile}%` : 'Unranked'}
                  </span>
                </div>
              </div>
            </div>

            {/* Projected Estimated Result */}
            <div className="border-2 border-purple-300 rounded-lg p-4 bg-purple-50/40">
              <div className="flex items-center justify-between text-xs text-purple-900 font-bold uppercase tracking-wider">
                <span>Projected Simulation</span>
                <span className="text-[10px] bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded">
                  Estimated
                </span>
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-3xl font-bold font-mono-grades text-purple-900">
                  #{simulation ? simulation.estimatedRank : '...'}
                </span>
                <span className="text-xs text-purple-700">/ 60 in CS L2</span>
              </div>
              <div className="mt-2 text-xs text-slate-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Simulated GPA:</span>
                  <span className="font-mono-grades font-bold text-purple-900">
                    {projectedGpa.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Simulated Standing:</span>
                  <span className="font-semibold text-purple-800">
                    Top {simulation?.estimatedPercentile}% of cohort
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Auxiliary What-If Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tool A: Component Target Goal Solver */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Target className="w-4 h-4 text-emerald-700" />
              <span>Target GPA Goal Solver</span>
            </h3>
            <p className="text-xs text-slate-500">
              "What score do I need in an upcoming exam to reach my target GPA?"
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-medium text-slate-700 block mb-1">Target Semester GPA:</label>
              <select
                value={targetGpa}
                onChange={(e) => setTargetGpa(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 font-mono-grades font-semibold"
              >
                <option value="16.0">16.00 / 20 (Très Bien - High Honors)</option>
                <option value="16.5">16.50 / 20 (Top 10% Rank)</option>
                <option value="17.0">17.00 / 20 (Top 5% Rank)</option>
                <option value="14.0">14.00 / 20 (Bien - Honors)</option>
                <option value="12.0">12.00 / 20 (Assez Bien)</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Target Assessment Exam:</label>
              <select
                value={targetModule}
                onChange={(e) => setTargetModule(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 text-xs"
              >
                <option value="cs_be_fin">Back-End Final Examination</option>
                <option value="cs_va_fin">Vector Analysis Final Exam</option>
                <option value="cs_phy3_em_fin">Physics_3 EM Final Exam</option>
              </select>
            </div>
          </div>

          <div
            className={`p-3.5 rounded-lg border text-xs ${
              targetResult.status === 'achievable'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : targetResult.status === 'already_achieved'
                ? 'bg-blue-50 border-blue-200 text-blue-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex items-start space-x-2">
              {targetResult.status === 'achievable' && (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              )}
              {targetResult.status === 'impossible_single' && (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-semibold">{targetResult.text}</div>
                {targetResult.status === 'achievable' && (
                  <div className="mt-1 text-[11px] text-emerald-800">
                    Formula basis: Back-End Final holds a 5.00% direct weight across the total 30 ECTS semester GPA.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tool B: Multi-Semester Cumulative Projection */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-800" />
              <span>Next Semester Cumulative GPA Simulator</span>
            </h3>
            <p className="text-xs text-slate-500">
              Project your multi-semester cumulative standing based on future grades
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-medium text-slate-700 block mb-1">
                Hypothetical Next Semester GPA Outcome:
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  step="0.1"
                  min="10"
                  max="20"
                  value={nextSemesterHypothesis}
                  onChange={(e) => setNextSemesterHypothesis(Number(e.target.value))}
                  className="w-28 font-mono-grades font-bold bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-900"
                />
                <span className="text-slate-500">/ 20.00</span>
              </div>
            </div>

            <div className="bg-[#f8fafc] border border-slate-200 rounded p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">
                  Current Cumulative GPA ({completedSemesters} Semester{completedSemesters === 1 ? '' : 's'}):
                </span>
                <span className="font-mono-grades font-bold text-slate-900">
                  {cumulativeCurrent > 0 ? `${cumulativeCurrent.toFixed(2)} / 20` : '-- / 20'}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                <span className="text-blue-900 font-semibold">
                  Projected Cumulative with Next Semester:
                </span>
                <span className="font-mono-grades font-bold text-blue-900 text-sm">
                  {cumulativeProjected.toFixed(2)} / 20
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
