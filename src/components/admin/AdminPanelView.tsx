import React, { useEffect, useState } from 'react';
import { api } from '../../services/api.ts';
import { ProgramId, StudentRecord } from '../../types.ts';
import { Shield, Plus, Megaphone, CheckCircle2, Search, Database } from 'lucide-react';

export const AdminPanelView: React.FC = () => {
  const [cohort, setCohort] = useState<StudentRecord[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<ProgramId>('cs');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Add student form
  const [newFullName, setNewFullName] = useState('');
  const [newStudentId, setNewStudentId] = useState('');
  const [newGpa, setNewGpa] = useState<number>(15.0);
  const [addStatus, setAddStatus] = useState<string | null>(null);

  // Announcement form
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState('Deliberation');
  const [annStatus, setAnnStatus] = useState<string | null>(null);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminOverview();
      setCohort(res.cohortStudents.filter((s: StudentRecord) => s.programId === selectedProgram));
    } catch (err) {
      console.error('Failed to load admin overview', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [selectedProgram]);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newStudentId) return;
    try {
      await api.addCohortStudent({
        fullName: newFullName,
        studentId: newStudentId,
        gpa: newGpa,
        programId: selectedProgram,
        academicLevel: 'L2',
      });
      setAddStatus('Student registered into cohort database.');
      setNewFullName('');
      setNewStudentId('');
      loadAdminData();
      setTimeout(() => setAddStatus(null), 4000);
    } catch (err: any) {
      setAddStatus(`Error: ${err.message}`);
    }
  };

  const handlePublishAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;
    try {
      await api.createAnnouncement({
        title: annTitle,
        content: annContent,
        category: annCategory,
        isPinned: false,
      });
      setAnnStatus('Announcement broadcasted to student portals.');
      setAnnTitle('');
      setAnnContent('');
      setTimeout(() => setAnnStatus(null), 4000);
    } catch (err: any) {
      setAnnStatus(`Error: ${err.message}`);
    }
  };

  const filtered = cohort.filter(
    (s) =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Registrar Administration
            </span>
            <span className="text-xs text-slate-500">• Authorized Access Only</span>
          </div>
          <h1 className="text-xl font-bold font-academic-title text-slate-900 mt-1">
            Cohort Database & Announcement Dispatcher
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Full administrative access to student GPA rosters, academic formulas, and campus notices.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <label className="font-semibold text-slate-700">Program Filter:</label>
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value as ProgramId)}
            className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-800"
          >
            <option value="cs">Computer Science (CS)</option>
            <option value="che">Chemical Engineering (ChE)</option>
            <option value="ge">Geophysical Engineering (GE)</option>
            <option value="pe">Petroleum Engineering (PE)</option>
            <option value="chem">Chemistry (Chem)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Cohort Student Roster */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Database className="w-4 h-4 text-amber-700" />
                <span>Cohort Roster: {selectedProgram.toUpperCase()} L2</span>
              </h3>
              <p className="text-xs text-slate-500">
                Total {cohort.length} students enrolled in this cohort
              </p>
            </div>

            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800"
              />
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto border border-slate-200 rounded">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="py-2 px-3">Student Name</th>
                  <th className="py-2 px-3">Matricule</th>
                  <th className="py-2 px-3">Level</th>
                  <th className="py-2 px-3 text-right">GPA /20</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-body">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-medium text-slate-900">{s.fullName}</td>
                    <td className="py-2 px-3 font-mono-grades text-slate-500">{s.studentId}</td>
                    <td className="py-2 px-3 text-slate-600">{s.academicLevel}</td>
                    <td className="py-2 px-3 text-right font-mono-grades font-bold text-blue-950">
                      {s.gpa.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Management Actions */}
        <div className="space-y-6">
          {/* Add Student Card */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
              <Plus className="w-4 h-4 text-emerald-700" />
              <span>Enroll Student to Cohort</span>
            </h4>

            <form onSubmit={handleAddStudent} className="space-y-2.5 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Full Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Leyla Karimova"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Student ID (Matricule):</label>
                <input
                  type="text"
                  placeholder="e.g. 22010499"
                  value={newStudentId}
                  onChange={(e) => setNewStudentId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-mono-grades"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Deliberation GPA /20:</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="20"
                  value={newGpa}
                  onChange={(e) => setNewGpa(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-mono-grades"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded text-xs transition-colors"
              >
                Enroll Student
              </button>
            </form>

            {addStatus && (
              <div className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[11px] font-medium flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{addStatus}</span>
              </div>
            )}
          </div>

          {/* Broadcast Announcement Card */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
              <Megaphone className="w-4 h-4 text-blue-700" />
              <span>Broadcast Announcement</span>
            </h4>

            <form onSubmit={handlePublishAnnouncement} className="space-y-2.5 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Deliberation Results Ready"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Category:</label>
                <select
                  value={annCategory}
                  onChange={(e) => setAnnCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-900"
                >
                  <option value="Deliberation">Deliberation</option>
                  <option value="Academic">Academic</option>
                  <option value="Exams">Exams</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Message Content:</label>
                <textarea
                  rows={2}
                  placeholder="Announcement body..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-900"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-1.5 bg-[#1e3a8a] hover:bg-[#183177] text-white font-semibold rounded text-xs transition-colors"
              >
                Publish Notice
              </button>
            </form>

            {annStatus && (
              <div className="p-2 bg-blue-50 text-blue-800 border border-blue-200 rounded text-[11px] font-medium flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{annStatus}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
