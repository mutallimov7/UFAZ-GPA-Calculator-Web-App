import React, { useEffect, useState, useMemo } from 'react';
import { ProgramConfig, ProgramId, CalculationResult } from '../../types.ts';
import { api } from '../../services/api.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  Calculator,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Award,
  Info,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GpaCalculatorViewProps {
  onSavedSuccess?: () => void;
}

export const GpaCalculatorView: React.FC<GpaCalculatorViewProps> = ({ onSavedSuccess }) => {
  const { user, refreshUser } = useAuth();
  const [selectedProgram, setSelectedProgram] = useState<ProgramId>(user?.programId || 'cs');
  const [programConfig, setProgramConfig] = useState<ProgramConfig | null>(null);
  const [scores, setScores] = useState<Record<string, number | string>>({});
  const [calculation, setCalculation] = useState<CalculationResult | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Fetch program configuration on program change
  useEffect(() => {
    let isMounted = true;
    const fetchConfig = async () => {
      try {
        setLoadingConfig(true);
        const res = await api.getProgram(selectedProgram);
        if (isMounted) {
          setProgramConfig(res.program);
          // Initialize empty from scratch
          setScores({});
        }
      } catch (err) {
        console.error('Failed to load program configuration', err);
      } finally {
        if (isMounted) setLoadingConfig(false);
      }
    };

    fetchConfig();
    return () => {
      isMounted = false;
    };
  }, [selectedProgram]);

  // Recalculate whenever scores change
  useEffect(() => {
    let isMounted = true;
    const compute = async () => {
      try {
        const numScores: Record<string, number> = {};
        const errors: Record<string, string> = {};

        for (const [key, val] of Object.entries(scores)) {
          if (val === '' || val === undefined || val === null) {
            continue;
          }
          const num = Number(val);
          if (isNaN(num)) {
            errors[key] = 'Must be a number';
          } else if (num < 0 || num > 20) {
            errors[key] = 'Scale 0 - 20';
          } else {
            numScores[key] = num;
          }
        }

        setValidationErrors(errors);

        const result = await api.calculateGrades(selectedProgram, numScores);
        if (isMounted) {
          setCalculation(result);
        }
      } catch (err) {
        console.error('Calculation error', err);
      }
    };

    compute();
    return () => {
      isMounted = false;
    };
  }, [scores, selectedProgram]);

  const handleScoreChange = (id: string, value: string) => {
    setScores((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const loadSampleScores = () => {
    if (!programConfig) return;
    const sample: Record<string, number> = {};
    programConfig.modules.forEach((mod) => {
      mod.components.forEach((c) => {
        sample[c.id] = 13.5;
      });
      if (mod.subGroups) {
        mod.subGroups.forEach((g) => {
          g.components.forEach((c) => {
            sample[c.id] = 13.5;
          });
        });
      }
    });
    setScores(sample);
  };

  const loadPerfectScores = () => {
    if (!programConfig) return;
    const perfect: Record<string, number> = {};
    programConfig.modules.forEach((mod) => {
      mod.components.forEach((c) => {
        perfect[c.id] = 20;
      });
      if (mod.subGroups) {
        mod.subGroups.forEach((g) => {
          g.components.forEach((c) => {
            perfect[c.id] = 20;
          });
        });
      }
    });
    setScores(perfect);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
  };

  const clearScores = () => {
    setScores({});
  };

  const handleSaveToHistory = async () => {
    if (!calculation) return;
    try {
      setIsSaving(true);
      setSaveMessage(null);

      const numScores: Record<string, number> = {};
      for (const [key, val] of Object.entries(scores)) {
        if (val !== '' && !isNaN(Number(val))) {
          numScores[key] = Number(val);
        }
      }

      await api.saveCalculation({
        programId: selectedProgram,
        semester: programConfig ? `${programConfig.level} ${programConfig.semester}` : 'L2 S4',
        componentScores: numScores,
      });

      // Refresh current user state across entire application
      await refreshUser();

      setSaveMessage('Academic results certified and saved to official record.');
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
      if (onSavedSuccess) onSavedSuccess();
      setTimeout(() => setSaveMessage(null), 5000);
    } catch (err: any) {
      setSaveMessage(`Save failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Program Selector */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              GPA Calculation Engine
            </span>
            <span className="text-xs text-slate-500">• 20-Point French University Scale</span>
          </div>
          <h1 className="text-xl font-bold font-academic-title text-slate-900 mt-1">
            Component Assessment & Semester Deliberation
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Enter individual assessment grades. Intermediate modules and program GPA are computed automatically.
          </p>
        </div>

        {/* Program Selection Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
            Academic Program:
          </label>
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value as ProgramId)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-800 font-medium focus:ring-1 focus:ring-blue-600 focus:outline-hidden"
          >
            <option value="cs">Computer Science (L2)</option>
            <option value="che">Chemical Engineering (L2)</option>
            <option value="ge">Geophysical Engineering (L2)</option>
            <option value="pe">Petroleum Engineering (L2)</option>
            <option value="chem">Chemistry (L2)</option>
          </select>
        </div>
      </div>

      {/* Program Formula Certified Notice */}
      {programConfig && (
        <div className="bg-[#f0f5fb] border border-[#cfe0f2] rounded-lg p-4 text-xs text-slate-700 flex items-start space-x-3">
          <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-blue-950 flex items-center space-x-2">
              <span>{programConfig.name} ({programConfig.frenchName}) • {programConfig.partnerUniversity}</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-mono-grades">
                {programConfig.totalEcts} ECTS
              </span>
            </div>
            <div className="font-mono-grades text-[11px] text-blue-900 bg-white/70 px-2 py-1 rounded border border-blue-200">
              {programConfig.gpaFormulaText}
            </div>
          </div>
        </div>
      )}

      {/* Preset Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-4 py-2.5 rounded-lg border border-slate-200 text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-slate-500 font-medium">Presets:</span>
          <button
            type="button"
            onClick={loadSampleScores}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded transition-colors"
          >
            Sample Validation (13.5/20)
          </button>
          <button
            type="button"
            onClick={loadPerfectScores}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded transition-colors"
          >
            Max 20/20 Test
          </button>
          <button
            type="button"
            onClick={clearScores}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium rounded transition-colors flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleSaveToHistory}
            disabled={isSaving || !calculation}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#1e3a8a] hover:bg-[#183177] text-white font-semibold rounded shadow-xs transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save to Official History'}</span>
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800 font-medium flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Main Grid: Assessment Input Forms (Left 2 cols) & Live Results Panel (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Dynamic Modules and Components */}
        <div className="lg:col-span-2 space-y-6">
          {programConfig?.modules.map((module) => {
            const moduleResult = calculation?.moduleResults.find((m) => m.moduleId === module.id);
            const isPassed = moduleResult ? moduleResult.passed : false;

            return (
              <div
                key={module.id}
                className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden"
              >
                {/* Module Header */}
                <div className="bg-[#f8fafc] px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900">{module.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono-grades">
                        ({module.code})
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono-grades mt-0.5">
                      {module.formulaDescription}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">
                      Weight: {module.gpaWeight} • {module.ects} ECTS
                    </div>
                    <div className="flex items-center space-x-1 mt-0.5">
                      <span className="text-xs text-slate-500">Calculated:</span>
                      <span
                        className={`text-sm font-bold font-mono-grades px-2 py-0.5 rounded ${
                          moduleResult && moduleResult.grade >= 10.0
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {moduleResult ? moduleResult.grade.toFixed(2) : '0.00'} / 20
                      </span>
                    </div>
                  </div>
                </div>

                {/* Module Body: Individual Assessment Inputs */}
                <div className="p-4 space-y-4">
                  {/* Direct Components */}
                  {module.components.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {module.components.map((comp) => {
                        const error = validationErrors[comp.id];
                        return (
                          <div key={comp.id} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <label className="font-medium text-slate-700">{comp.label}</label>
                              {comp.weight && (
                                <span className="text-[10px] text-slate-400 font-mono-grades">
                                  × {comp.weight}
                                </span>
                              )}
                            </div>
                            <div className="relative">
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="20"
                                placeholder="0.00"
                                value={scores[comp.id] !== undefined ? scores[comp.id] : ''}
                                onChange={(e) => handleScoreChange(comp.id, e.target.value)}
                                className={`w-full text-xs font-mono-grades bg-white border rounded px-2.5 py-1.5 text-slate-800 focus:outline-hidden focus:ring-1 ${
                                  error
                                    ? 'border-red-400 focus:ring-red-400 bg-red-50/40'
                                    : 'border-slate-300 focus:ring-blue-600'
                                }`}
                              />
                              <span className="absolute right-2 top-1.5 text-[10px] text-slate-400">
                                /20
                              </span>
                            </div>
                            {error && <p className="text-[10px] text-red-600">{error}</p>}
                            {comp.description && (
                              <p className="text-[10px] text-slate-400">{comp.description}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Sub-Grouped Components (e.g. CS 5 sub-modules, Chemistry 3 sub-groups) */}
                  {module.subGroups && module.subGroups.length > 0 && (
                    <div className="space-y-4">
                      {module.subGroups.map((group) => {
                        const subResult = moduleResult?.subGroupResults?.[group.name];
                        return (
                          <div
                            key={group.id}
                            className="border border-slate-200 rounded-md p-3 bg-slate-50/40"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <span className="text-xs font-semibold text-slate-900">
                                  {group.name}
                                </span>
                                <span className="text-[11px] text-slate-500 font-mono-grades ml-2">
                                  {group.formulaText}
                                </span>
                              </div>
                              {subResult !== undefined && (
                                <span className="text-xs font-mono-grades font-bold text-blue-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                                  Sub-grade: {subResult.toFixed(2)} / 20
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {group.components.map((comp) => {
                                const error = validationErrors[comp.id];
                                return (
                                  <div key={comp.id} className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                      <label className="font-medium text-slate-700">
                                        {comp.name}
                                      </label>
                                      {comp.weight && (
                                        <span className="text-[10px] text-slate-400 font-mono-grades">
                                          × {comp.weight}
                                        </span>
                                      )}
                                    </div>
                                    <div className="relative">
                                      <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="20"
                                        placeholder="0.00"
                                        value={scores[comp.id] !== undefined ? scores[comp.id] : ''}
                                        onChange={(e) => handleScoreChange(comp.id, e.target.value)}
                                        className={`w-full text-xs font-mono-grades bg-white border rounded px-2.5 py-1.5 text-slate-800 focus:outline-hidden focus:ring-1 ${
                                          error
                                            ? 'border-red-400 focus:ring-red-400 bg-red-50/40'
                                            : 'border-slate-300 focus:ring-blue-600'
                                        }`}
                                      />
                                      <span className="absolute right-2 top-1.5 text-[10px] text-slate-400">
                                        /20
                                      </span>
                                    </div>
                                    {error && <p className="text-[10px] text-red-600">{error}</p>}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 1 Col: Live Academic Summary & Deliberation Outcome */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 sticky top-20">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Calculator className="w-4 h-4 text-blue-800" />
                <span>Deliberation Summary</span>
              </h3>
              <p className="text-xs text-slate-500">Official UFAZ / Unistra Formula Calculation</p>
            </div>

            {/* Big GPA Metric */}
            <div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-4 text-center">
              <div className="text-xs text-slate-500 font-medium">Calculated Semester GPA</div>
              <div className="mt-1 flex items-baseline justify-center space-x-1">
                <span className="text-4xl font-bold font-mono-grades text-[#1e3a8a]">
                  {calculation ? calculation.finalGpa.toFixed(2) : '0.00'}
                </span>
                <span className="text-sm font-semibold text-slate-500">/ 20.00</span>
              </div>
              <div className="mt-2 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-blue-50 text-blue-900 border border-blue-200">
                <Award className="w-3.5 h-3.5" />
                <span>{calculation?.honors}</span>
              </div>
            </div>

            {/* Validation & Compensation Status */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-600">ECTS Credits Earned:</span>
                <span className="font-mono-grades font-bold text-slate-900">
                  {calculation?.ectsEarned} / {calculation?.totalEcts} ECTS
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-600">Jury Decision:</span>
                <span
                  className={`font-semibold ${
                    calculation && calculation.finalGpa >= 10.0
                      ? 'text-emerald-700'
                      : 'text-rose-700'
                  }`}
                >
                  {calculation && calculation.finalGpa >= 10.0
                    ? 'Admis (Validated)'
                    : 'Ajourné (Not Validated)'}
                </span>
              </div>
            </div>

            {/* Breakdown Table */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                Module Breakdown
              </div>
              <div className="space-y-1.5 text-xs">
                {calculation?.moduleResults.map((m) => (
                  <div
                    key={m.moduleId}
                    className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0"
                  >
                    <span className="text-slate-600 truncate max-w-[140px]">{m.moduleName}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-slate-400">×{m.gpaWeight}</span>
                      <span
                        className={`font-mono-grades font-bold ${
                          m.grade >= 10.0 ? 'text-slate-900' : 'text-amber-700'
                        }`}
                      >
                        {m.grade.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveToHistory}
                disabled={isSaving || !calculation}
                className="w-full py-2.5 bg-[#1e3a8a] hover:bg-[#183177] text-white font-semibold rounded text-xs transition-colors shadow-xs flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Recording to Database...' : 'Save Calculation to History'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
