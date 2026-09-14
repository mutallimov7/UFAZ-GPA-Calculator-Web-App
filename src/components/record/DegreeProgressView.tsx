import React, { useEffect, useState } from 'react';
import { api } from '../../services/api.ts';
import { DegreeProgressData } from '../../types.ts';
import { GraduationCap, CheckCircle2, Clock, BookOpen, Award } from 'lucide-react';

export const DegreeProgressView: React.FC = () => {
  const [data, setData] = useState<DegreeProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const res = await api.getDegreeProgress();
        if (isMounted) setData(res);
      } catch (err) {
        console.error('Failed to load degree progress', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProgress();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalRequired = data?.totalEctsRequired || data?.totalCreditsRequired || 180;
  const completed = data?.completedEcts ?? data?.creditsCompleted ?? 90;
  const percentage = Math.min(100, Math.round((completed / totalRequired) * 100));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              European Credit Transfer and Accumulation System (ECTS)
            </span>
            <span className="text-xs text-slate-500">• Bologna Process Compliant</span>
          </div>
          <h1 className="text-xl font-bold font-academic-title text-slate-900 mt-1">
            Degree Audit & Progression Tracker
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Licence en Informatique / Bachelor of Science (3 Years • 180 ECTS Credits).
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-[#f8fafc] px-4 py-2 rounded-lg border border-slate-200">
          <div className="text-right text-xs">
            <div className="text-slate-500 font-medium">Credits Earned:</div>
            <div className="font-mono-grades font-bold text-slate-900 text-sm">
              {completed} / {totalRequired} ECTS
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-bold font-mono-grades text-blue-900 text-sm">
            {percentage}%
          </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
          <span>Overall Degree Completion: {percentage}%</span>
          <span className="text-emerald-700 font-medium">On Track for 2027 Graduation</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-[#1e3a8a] h-3 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-[11px] text-slate-500">
          <span>License 1 (60 ECTS) — Validated</span>
          <span>License 2 (60 ECTS) — In Deliberation</span>
          <span>License 3 (60 ECTS) — Planned</span>
        </div>
      </div>

      {/* Level by Level Breakdown */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white p-8 text-center text-xs text-slate-500 rounded-lg border border-slate-200">
            Loading degree audit records...
          </div>
        ) : (
          data?.levels?.map((lvl) => {
            const earned = lvl.earnedEcts ?? lvl.credits ?? 0;
            const total = lvl.totalEcts ?? 60;
            const semesters = lvl.semesters || [];

            return (
              <div
                key={lvl.level}
                className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden"
              >
                <div className="bg-[#f8fafc] px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-slate-900">{lvl.level} Academic Year</span>
                    <span className="text-xs text-slate-500 ml-2 font-mono-grades">
                      ({earned} / {total} ECTS)
                    </span>
                    {lvl.gpa !== undefined && (
                      <span className="text-xs text-blue-900 font-mono-grades font-semibold ml-3">
                        Year GPA: {lvl.gpa.toFixed(2)} / 20
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded font-semibold ${
                      lvl.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : lvl.status === 'in_progress'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {lvl.status === 'completed'
                      ? 'Completed & Validated'
                      : lvl.status === 'in_progress'
                      ? 'Current Year (In Progress)'
                      : 'Upcoming'}
                  </span>
                </div>

                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {semesters.length > 0 ? (
                    semesters.map((sem) => (
                      <div
                        key={sem.semester}
                        className="border border-slate-200 rounded p-3 bg-slate-50/40 text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between font-semibold">
                          <span className="text-slate-900">{sem.semester}</span>
                          <span className="font-mono-grades text-blue-900">
                            {sem.earnedEcts} / {sem.totalEcts} ECTS
                          </span>
                        </div>

                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              sem.status === 'completed' ? 'bg-emerald-600' : 'bg-blue-600'
                            }`}
                            style={{ width: `${(sem.earnedEcts / (sem.totalEcts || 30)) * 100}%` }}
                          ></div>
                        </div>

                        <div className="text-[11px] text-slate-500">
                          {sem.modules?.length || 0} teaching units (UEs) registered
                        </div>
                        {sem.modules && sem.modules.length > 0 && (
                          <div className="text-[10px] text-slate-400 flex flex-wrap gap-1 pt-1">
                            {sem.modules.map((m) => (
                              <span key={m} className="bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                {m}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full border border-slate-200 rounded p-3 bg-slate-50/40 text-xs flex items-center justify-between">
                      <span className="text-slate-600">Credits Allocation</span>
                      <span className="font-mono-grades font-bold text-slate-800">
                        {earned} ECTS Completed
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
