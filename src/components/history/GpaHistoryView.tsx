import React, { useEffect, useState } from 'react';
import { api } from '../../services/api.ts';
import { SavedAcademicRecord } from '../../types.ts';
import { History, Award, CheckCircle2, ChevronDown, ChevronUp, Calendar, Trash2 } from 'lucide-react';

export const GpaHistoryView: React.FC = () => {
  const [records, setRecords] = useState<SavedAcademicRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.getGradeHistory();
      setRecords(res.records || []);
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6 font-body">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Academic History
            </span>
            <span className="text-xs text-slate-500">• Certified Records Archive</span>
          </div>
          <h1 className="text-xl font-bold font-academic-title text-slate-900 mt-1">
            Historical Grade Records & Deliberation Archives
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Official record of previous semesters, modular breakdowns, and jury mentions.
          </p>
        </div>
      </div>

      {/* Record List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white p-8 text-center text-xs text-slate-500 rounded-lg border border-slate-200">
            Loading academic history...
          </div>
        ) : records.length === 0 ? (
          <div className="bg-white p-8 text-center text-xs text-slate-500 rounded-lg border border-slate-200">
            No saved calculation records yet. Use the GPA Calculator to calculate and save your first semester record.
          </div>
        ) : (
          records.map((rec) => {
            const isExpanded = expandedId === rec.id;
            const gpa = (rec as any).finalGpa ?? rec.gpa ?? 0;
            const dateStr = (rec as any).calculatedAt ?? rec.savedAt ?? new Date().toISOString();
            const moduleGrades = rec.moduleGrades || {};
            const componentScores = rec.componentScores || {};

            return (
              <div
                key={rec.id}
                className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden"
              >
                <div
                  onClick={() => toggleExpand(rec.id)}
                  className="p-4 bg-white hover:bg-slate-50/70 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-md bg-blue-50 text-blue-800 border border-blue-200 flex items-center justify-center font-bold text-sm">
                      {rec.semester ? rec.semester.slice(0, 2) : 'S'}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">
                        {rec.semester} • {rec.academicYear}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
                        <span className="capitalize font-medium text-slate-700">
                          {rec.programId?.toUpperCase()} Program
                        </span>
                        <span>•</span>
                        <span>Saved: {new Date(dateStr).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-xs text-slate-500 font-medium">Semester GPA</div>
                      <div className="text-lg font-bold font-mono-grades text-[#1e3a8a]">
                        {gpa.toFixed(2)} / 20.00
                      </div>
                    </div>

                    <span
                      className={`text-xs px-2.5 py-1 rounded font-semibold ${
                        gpa >= 16.0
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : gpa >= 14.0
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : gpa >= 12.0
                          ? 'bg-purple-50 text-purple-800 border border-purple-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {rec.honors || 'Validated'}
                    </span>

                    <button className="text-slate-400 hover:text-slate-600 p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/50 text-xs space-y-3">
                    {Object.keys(moduleGrades).length > 0 && (
                      <div>
                        <div className="font-semibold text-slate-800 mb-1.5">
                          Module Grades:
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {Object.entries(moduleGrades).map(([mod, val]) => (
                            <div
                              key={mod}
                              className="bg-white p-2 rounded border border-slate-200 flex items-center justify-between"
                            >
                              <span className="text-slate-600 font-medium truncate text-[11px] mr-1">
                                {mod}:
                              </span>
                              <span className="font-mono-grades font-bold text-blue-900">
                                {Number(val).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {Object.keys(componentScores).length > 0 && (
                      <div>
                        <div className="font-semibold text-slate-800 mb-1.5">
                          Assessment Component Breakdown:
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {Object.entries(componentScores).map(([key, val]) => (
                            <div
                              key={key}
                              className="bg-white p-2 rounded border border-slate-200 flex items-center justify-between"
                            >
                              <span className="text-slate-500 truncate text-[11px] mr-1">
                                {key.replace(/^[a-z]+_/, '').replace(/_/g, ' ')}:
                              </span>
                              <span className="font-mono-grades font-bold text-slate-800">
                                {Number(val).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
