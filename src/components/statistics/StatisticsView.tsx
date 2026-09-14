import React, { useEffect, useState } from 'react';
import { api } from '../../services/api.ts';
import { CohortStats, ProgramId } from '../../types.ts';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import { BarChart3, TrendingUp, Users, Award, CheckCircle2 } from 'lucide-react';

export const StatisticsView: React.FC = () => {
  const [stats, setStats] = useState<CohortStats | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<ProgramId>('cs');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.getRanking(selectedProgram, 'L2');
        if (isMounted) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [selectedProgram]);

  const COLORS = ['#10b981', '#059669', '#2563eb', '#6366f1', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Departmental Analytics
            </span>
            <span className="text-xs text-slate-500">• Deliberation Statistical Summary</span>
          </div>
          <h1 className="text-xl font-bold font-academic-title text-slate-900 mt-1">
            Cohort GPA Distribution & Metrics
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Statistical breakdown of academic achievement across the 62-student cohort.
          </p>
        </div>

        {/* Program selector */}
        <div className="flex items-center space-x-2 text-xs">
          <label className="font-semibold text-slate-700">Cohort:</label>
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value as ProgramId)}
            className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-800"
          >
            <option value="cs">Computer Science L2 (62 Students)</option>
            <option value="che">Chemical Engineering L2 (38 Students)</option>
            <option value="ge">Geophysical Engineering L2 (28 Students)</option>
            <option value="pe">Petroleum Engineering L2 (34 Students)</option>
            <option value="chem">Chemistry L2 (30 Students)</option>
          </select>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500">Cohort Size</div>
          <div className="mt-1 text-2xl font-bold font-mono-grades text-slate-900">
            {stats?.totalStudents || 62}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">Enrolled Students</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500">Mean GPA</div>
          <div className="mt-1 text-2xl font-bold font-mono-grades text-blue-900">
            {stats?.averageGpa.toFixed(2) || '14.57'}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">Department Average</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500">Median GPA</div>
          <div className="mt-1 text-2xl font-bold font-mono-grades text-slate-800">
            {stats?.medianGpa.toFixed(2) || '14.66'}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">50th Percentile</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500">Highest Score</div>
          <div className="mt-1 text-2xl font-bold font-mono-grades text-emerald-700">
            {stats?.highestGpa.toFixed(2) || '18.45'}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">Cohort Valedictorian</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500">Pass Rate</div>
          <div className="mt-1 text-2xl font-bold font-mono-grades text-emerald-800">
            100%
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>All &gt; 10.00 / 20</span>
          </div>
        </div>
      </div>

      {/* Distribution Chart & Honors Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recharts Bar Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-blue-800" />
              <span>GPA Grade Distribution (French Academic Scale)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Distribution of student semester GPAs partitioned by French university honors classifications
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.distribution || []} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  angle={-15}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  formatter={(value: any, name: any, item: any) => [
                    `${value} students (${item.payload.percentage}%)`,
                    'Count',
                  ]}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stats?.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Honors Classification Breakdown Table */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-3 mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span>French Honors Brackets</span>
              </h3>
              <p className="text-xs text-slate-500">Unistra Deliberation Thresholds</p>
            </div>

            <div className="space-y-2 text-xs">
              {stats?.distribution.map((d, i) => (
                <div
                  key={d.range}
                  className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    ></span>
                    <span className="font-medium text-slate-700">{d.range}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono-grades font-bold text-slate-900">{d.count}</span>
                    <span className="text-[10px] text-slate-500 ml-1">({d.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <p>
              Under French university accreditation rules, students with a GPA ≥ 10.00 successfully validate all 30 ECTS credits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
