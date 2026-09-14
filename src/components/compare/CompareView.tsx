import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { CohortStats, RankingAnalysis } from '../../types.ts';
import { GitCompare, TrendingUp, Award, BookOpen, Sparkles } from 'lucide-react';

interface CompareViewProps {
  onNavigate?: (view: any) => void;
}

export const CompareView: React.FC<CompareViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<CohortStats | null>(null);
  const [analysis, setAnalysis] = useState<RankingAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCohortData = async () => {
      try {
        setLoading(true);
        const res = await api.getRanking(user?.programId || 'cs', user?.academicLevel || 'L2');
        if (isMounted) {
          setStats(res.stats);
          setAnalysis(res.analysis);
        }
      } catch (err) {
        console.error('Failed to load comparison data', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchCohortData();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const hasGpa = Boolean(user?.gpa && user.gpa > 0);
  const studentGpa = hasGpa ? user!.gpa : 0;
  const cohortMean = stats?.averageGpa || 14.57;
  const cohortMedian = stats?.medianGpa || 14.66;
  const highestGpa = stats?.highestGpa || 18.45;

  const diffMean = Math.round((studentGpa - cohortMean) * 100) / 100;
  const diffMedian = Math.round((studentGpa - cohortMedian) * 100) / 100;
  const gapTresBien = Math.round((16.0 - studentGpa) * 100) / 100;

  return (
    <div className="space-y-6 font-body">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Comparative Analytics
          </span>
          <span className="text-xs text-slate-500">• Relative Standing Analysis</span>
        </div>
        <h1 className="text-xl font-bold font-academic-title text-slate-900 mt-1">
          Peer & Benchmark Performance Comparison
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Evaluate your academic performance relative to cohort benchmarks, statistical percentiles, and university honors criteria.
        </p>
      </div>

      {!hasGpa ? (
        <div className="bg-white p-8 rounded-lg border border-slate-200 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 text-blue-800 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            Starting from Scratch: No GPA Recorded Yet
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Your account is fresh with no fictional records. Calculate your module component scores in the GPA Calculator and save them to unlock comparative metrics against your cohort.
          </p>
          {onNavigate && (
            <button
              onClick={() => onNavigate('calculator')}
              className="px-4 py-2 bg-[#1e3a8a] hover:bg-[#193275] text-white text-xs font-semibold rounded-md shadow-xs transition-colors inline-flex items-center space-x-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Go to GPA Calculator</span>
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Metric 1: vs Cohort Mean */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Vs. Class Mean
              </div>
              <div className="flex items-baseline space-x-2">
                <span
                  className={`text-3xl font-bold font-mono-grades ${
                    diffMean >= 0 ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {diffMean >= 0 ? `+${diffMean.toFixed(2)}` : diffMean.toFixed(2)}
                </span>
                <span className="text-xs text-slate-500">points</span>
              </div>
              <div className="text-xs text-slate-600">
                Your GPA is <strong className="text-slate-900">{studentGpa.toFixed(2)}</strong>, compared to the cohort average of{' '}
                <strong className="text-slate-900">{cohortMean.toFixed(2)}</strong>.
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-emerald-800 font-medium">
                {analysis?.percentile ? `Top ${analysis.percentile}% of cohort` : 'Calculated position'}
              </div>
            </div>

            {/* Metric 2: vs Cohort Median */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Vs. Cohort Median
              </div>
              <div className="flex items-baseline space-x-2">
                <span
                  className={`text-3xl font-bold font-mono-grades ${
                    diffMedian >= 0 ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {diffMedian >= 0 ? `+${diffMedian.toFixed(2)}` : diffMedian.toFixed(2)}
                </span>
                <span className="text-xs text-slate-500">points</span>
              </div>
              <div className="text-xs text-slate-600">
                Cohort median is <strong className="text-slate-900">{cohortMedian.toFixed(2)}</strong> (50th percentile cutoff).
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-blue-900 font-medium">
                {diffMedian >= 0 ? 'Above cohort median' : 'Below cohort median'}
              </div>
            </div>

            {/* Metric 3: Distance to High Honors (Très Bien) */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Gap to Très Bien (16.00)
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold font-mono-grades text-amber-700">
                  {gapTresBien > 0 ? `-${gapTresBien.toFixed(2)}` : 'Achieved!'}
                </span>
                <span className="text-xs text-slate-500">to threshold</span>
              </div>
              <div className="text-xs text-slate-600">
                {gapTresBien > 0
                  ? `${gapTresBien.toFixed(2)} GPA points needed to graduate with Highest Honors (Mention Très Bien).`
                  : 'You have satisfied the Mention Très Bien threshold.'}
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-amber-800 font-medium">
                Official UFAZ Honor Barrier
              </div>
            </div>
          </div>

          {/* Visual Benchmark Comparison Table */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">
              Academic Benchmark Spectrum (French 20-Point System)
            </h3>

            <div className="space-y-3 text-xs">
              {/* Valedictorian */}
              <div className="flex items-center justify-between p-3 rounded bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-semibold text-slate-900">Highest GPA (Rank #1):</span>
                  <span className="text-slate-500 ml-2">Cohort Valedictorian</span>
                </div>
                <span className="font-mono-grades font-bold text-slate-900">{highestGpa.toFixed(2)} / 20</span>
              </div>

              {/* Très Bien Threshold */}
              <div className="flex items-center justify-between p-3 rounded bg-emerald-50/50 border border-emerald-200">
                <div>
                  <span className="font-semibold text-emerald-950">Mention Très Bien (High Honors):</span>
                  <span className="text-emerald-700 ml-2">Standard Distinction</span>
                </div>
                <span className="font-mono-grades font-bold text-emerald-800">16.00 / 20</span>
              </div>

              {/* Current Student */}
              <div className="flex items-center justify-between p-3 rounded bg-blue-50 border-2 border-[#1e3a8a]">
                <div>
                  <span className="font-bold text-blue-950">
                    Your Standing {analysis?.currentRank ? `(Rank #${analysis.currentRank})` : ''}:
                  </span>
                  <span className="text-blue-800 ml-2 font-medium">
                    {studentGpa >= 16.0
                      ? 'Mention Très Bien'
                      : studentGpa >= 14.0
                      ? 'Mention Bien'
                      : studentGpa >= 12.0
                      ? 'Mention Assez Bien'
                      : studentGpa >= 10.0
                      ? 'Passable'
                      : 'Non-validé'}
                  </span>
                </div>
                <span className="font-mono-grades font-bold text-blue-950 text-sm">
                  {studentGpa.toFixed(2)} / 20
                </span>
              </div>

              {/* Cohort Median */}
              <div className="flex items-center justify-between p-3 rounded bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-semibold text-slate-900">Cohort Median (50th Percentile):</span>
                  <span className="text-slate-500 ml-2">Middle Student</span>
                </div>
                <span className="font-mono-grades font-bold text-slate-700">{cohortMedian.toFixed(2)} / 20</span>
              </div>

              {/* Cohort Mean */}
              <div className="flex items-center justify-between p-3 rounded bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-semibold text-slate-900">Cohort Mean:</span>
                  <span className="text-slate-500 ml-2">Class Average</span>
                </div>
                <span className="font-mono-grades font-bold text-slate-700">{cohortMean.toFixed(2)} / 20</span>
              </div>

              {/* Passing Threshold */}
              <div className="flex items-center justify-between p-3 rounded bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-semibold text-slate-900">Validation Threshold (Pass):</span>
                  <span className="text-slate-500 ml-2">Compensation Barrier</span>
                </div>
                <span className="font-mono-grades font-bold text-slate-700">10.00 / 20</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
