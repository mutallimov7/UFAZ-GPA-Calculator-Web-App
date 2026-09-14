import React from 'react';
import { Shield, Lock, FileCheck, Info } from 'lucide-react';

export const LegalView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Regulatory Framework
          </span>
          <span className="text-xs text-slate-500">• Academic Governance</span>
        </div>
        <h1 className="text-xl font-bold font-academic-title text-slate-900 mt-1">
          Academic Data Privacy, Anonymization Protocol & Terms of Service
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Governing rules on grading formulas, student data confidentiality, and French deliberation charters.
        </p>
      </div>

      {/* Card 1: Student Ranking Privacy Protocol */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
          <Shield className="w-4 h-4 text-emerald-700" />
          <h2>Cohort Ranking Privacy & Anonymization Charter</h2>
        </div>
        <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
          <p>
            In compliance with European Data Protection Directives (GDPR) and academic confidentiality standards, the UFAZ Academic Portal enforces a strict <strong>Privacy-Preserving Cohort Architecture</strong>:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
            <li>
              <strong>Student Identification Masking:</strong> Full student names and official matriculation numbers (Student IDs) of peers are never displayed on public or shared screens. Peers are represented by synthetic aliases (e.g. <em>Student A17</em>, <em>Student B04</em>).
            </li>
            <li>
              <strong>Personal Identification:</strong> The authenticated student has sole access to their own name and personal student dossier.
            </li>
            <li>
              <strong>Simulated Sandbox:</strong> All "What-If" and Grade Simulator calculations are processed locally within ephemeral sandboxes and do not alter official student transcripts without explicit authorization.
            </li>
          </ul>
        </div>
      </div>

      {/* Card 2: French University Deliberation Rules */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
          <FileCheck className="w-4 h-4 text-blue-800" />
          <h2>French ECTS Compensation & Deliberation Mechanism</h2>
        </div>
        <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
          <p>
            The curriculum follows the French university framework accredited in partnership with <strong>Université de Strasbourg (Unistra)</strong>:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
            <li>
              <strong>20-Point Grading Scale:</strong> All examinations and course assessments are rated on a continuous scale from 0.00 to 20.00.
            </li>
            <li>
              <strong>Semester Compensation (Compensation Semestrielle):</strong> If the overall weighted GPA across all teaching units (UEs) is ≥ 10.00 / 20, the student is declared <em>Admis</em> (Admitted) and automatically earns all 30 ECTS credits for that semester, even if an individual module is below 10.00.
            </li>
            <li>
              <strong>French Academic Honors (Mentions):</strong>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 font-mono-grades">
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-900">10.00 – 11.99</div>
                  <div className="text-[11px] text-slate-600 font-body">Passable (Pass)</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-blue-800">12.00 – 13.99</div>
                  <div className="text-[11px] text-slate-600 font-body">Assez Bien</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-blue-900">14.00 – 15.99</div>
                  <div className="text-[11px] text-slate-600 font-body">Bien (Honors)</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-emerald-800">16.00 – 20.00</div>
                  <div className="text-[11px] text-slate-600 font-body">Très Bien</div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
