import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { SavedAcademicRecord } from '../../types.ts';
import { Printer, Award, ShieldCheck, FileText, Sparkles } from 'lucide-react';

export const TranscriptView: React.FC = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<SavedAcademicRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const res = await api.getGradeHistory();
        if (isMounted) {
          setRecords(res.records || []);
        }
      } catch (err) {
        console.error('Failed to load academic transcript records', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchRecords();
    return () => {
      isMounted = false;
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const cumulativeGpa =
    records.length > 0
      ? Math.round((records.reduce((acc, r) => acc + r.gpa, 0) / records.length) * 100) / 100
      : user?.gpa || 0;

  const latestRecord = records.length > 0 ? records[records.length - 1] : null;

  return (
    <div className="space-y-6 font-body">
      {/* Top Banner with Action Buttons */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Academic Record
            </span>
            <span className="text-xs text-slate-500">• Certified Document</span>
          </div>
          <h1 className="text-xl font-bold font-academic-title text-slate-900 mt-1">
            Official Transcript of Records / Relevé de Notes
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Bilingual academic transcript co-delivered by UFAZ and Université de Strasbourg.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Transcript</span>
          </button>
        </div>
      </div>

      {/* Official Transcript Document Box */}
      <div className="bg-white p-8 sm:p-10 rounded-lg border-2 border-slate-300 shadow-md max-w-4xl mx-auto text-slate-900">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-academic-crest text-xl font-bold border-2 border-slate-900 shadow-sm">
              UF
            </div>
            <div>
              <div className="font-academic-crest font-bold text-base tracking-widest text-slate-950 uppercase">
                Université Franco-Azerbaïdjanaise
              </div>
              <div className="text-xs text-slate-600 font-medium">
                French-Azerbaijani University (UFAZ) • Baku, Azerbaijan
              </div>
              <div className="text-[11px] text-blue-900 font-semibold mt-0.5">
                In academic partnership with Université de Strasbourg (France)
              </div>
            </div>
          </div>

          <div className="text-right sm:text-right text-xs space-y-1">
            <div className="font-mono-grades text-slate-500 text-[10px]">
              DOC ID: TR-2026-{user?.studentId || 'STUDENT'}
            </div>
            <div className="font-bold text-slate-800">Academic Year: 2025–2026</div>
            <div className="text-slate-600">Session: Spring Deliberation</div>
          </div>
        </div>

        {/* Student Dossier Information */}
        <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded border border-slate-200 text-xs">
          <div>
            <div className="text-slate-500">Student Name / Nom de l'étudiant:</div>
            <div className="font-bold text-slate-950 text-sm">{user?.fullName || 'Student'}</div>
            <div className="text-slate-500 mt-2">Registration ID / Matricule:</div>
            <div className="font-mono-grades font-bold text-slate-800">{user?.studentId}</div>
          </div>

          <div>
            <div className="text-slate-500">Degree Program / Formation:</div>
            <div className="font-bold text-slate-950 text-sm">
              Licence Informatique (Bachelor of Computer Science)
            </div>
            <div className="text-slate-500 mt-2">Academic Level & Cycle:</div>
            <div className="font-semibold text-slate-800">
              {user?.academicLevel || 'L2'} • {user?.currentSemester || 'Semester 4'} • First Cycle
            </div>
          </div>
        </div>

        {/* Dynamic Transcript Content */}
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">Loading certified records...</div>
        ) : records.length === 0 ? (
          <div className="my-8 p-8 text-center border border-dashed border-slate-300 rounded-lg bg-slate-50/60 space-y-3">
            <FileText className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">
              No Certified Academic Records Recorded Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Your transcript is initialized from scratch. To populate this official document, compute your module grades in the <strong>GPA Calculator</strong> and click <strong>"Save to Academic Record"</strong>.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {records.map((rec) => (
              <div key={rec.id} className="border border-slate-300 rounded overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 text-xs font-bold text-slate-800 flex items-center justify-between border-b border-slate-300">
                  <span>Semester: {rec.semester} ({rec.academicYear})</span>
                  <span className="text-blue-900 font-mono-grades">
                    GPA: {rec.gpa.toFixed(2)} / 20.00 — {rec.honors}
                  </span>
                </div>
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Module / Course Name</th>
                      <th className="py-2.5 px-3 text-right">Grade /20</th>
                      <th className="py-2.5 px-3 text-right">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {Object.entries(rec.moduleGrades || {}).map(([modName, grade]) => (
                      <tr key={modName}>
                        <td className="py-2 px-3 font-semibold text-slate-800">{modName}</td>
                        <td className="py-2 px-3 text-right font-mono-grades font-bold text-slate-900">
                          {Number(grade).toFixed(2)}
                        </td>
                        <td
                          className={`py-2 px-3 text-right font-semibold ${
                            Number(grade) >= 10.0 ? 'text-emerald-700' : 'text-red-700'
                          }`}
                        >
                          {Number(grade) >= 10.0 ? 'Validé' : 'Non-validé'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 font-semibold text-slate-900 border-t border-slate-300">
                    <tr>
                      <td className="py-2.5 px-3">Semester Average</td>
                      <td className="py-2.5 px-3 text-right font-mono-grades font-bold text-blue-900">
                        {rec.gpa.toFixed(2)} / 20.00
                      </td>
                      <td
                        className={`py-2.5 px-3 text-right font-bold ${
                          rec.gpa >= 10.0 ? 'text-emerald-800' : 'text-red-800'
                        }`}
                      >
                        {rec.gpa >= 10.0 ? 'ADMIS' : 'AJOURNÉ'}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ))}

            {/* Overall Deliberation Summary */}
            <div className="mt-6 p-4 rounded bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div>
                <div className="font-semibold text-slate-900">
                  Cumulative Academic Average ({records.length} Semester{records.length > 1 ? 's' : ''}):
                </div>
                <div className="text-slate-800 font-mono-grades font-bold text-sm mt-0.5">
                  {cumulativeGpa.toFixed(2)} / 20.00
                </div>
                <div className="text-slate-500 text-[11px] mt-0.5">
                  Deliberation status: {latestRecord?.honors || 'Validated'}
                </div>
              </div>

              <div className="flex items-center space-x-2 text-emerald-800 bg-emerald-50 px-3 py-2 rounded border border-emerald-200">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="font-semibold">Officially Certified Record</span>
              </div>
            </div>
          </div>
        )}

        {/* Signatures & Seal */}
        <div className="mt-10 pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
          <div>
            <div className="font-semibold text-slate-900">Director of Academic Affairs</div>
            <div className="text-[11px] text-slate-500">French-Azerbaijani University</div>
            <div className="mt-12 font-academic-title italic text-slate-700">Prof. Jean-Marc Delorme</div>
            <div className="text-[10px] text-slate-400">Electronic Verification Valid</div>
          </div>

          <div>
            <div className="font-semibold text-slate-900">Dean of Faculty of Mathematics & CS</div>
            <div className="text-[11px] text-slate-500">Université de Strasbourg</div>
            <div className="mt-12 font-academic-title italic text-slate-700">Prof. Anne Lefebvre</div>
            <div className="text-[10px] text-slate-400">Co-Accreditation Board</div>
          </div>
        </div>
      </div>
    </div>
  );
};
