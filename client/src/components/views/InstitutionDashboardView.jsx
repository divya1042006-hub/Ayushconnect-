import React, { useState, useEffect } from 'react';
import { Building2, BarChart3, TrendingUp, AlertTriangle, ShieldCheck, CheckCircle2, Award, Users, BookOpen } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function InstitutionDashboardView() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetch('/api/institution/analytics')
      .then(res => res.json())
      .then(data => {
        if (data.success) setMetrics(data.analytics);
      });
  }, []);

  const skillGapData = [
    { skill: 'Ayurvedic Pharmacology', weakness: 42, severity: 'High' },
    { skill: 'FSSAI Ayush Standards', weakness: 35, severity: 'High' },
    { skill: 'Kati/Janu Basti Prep', weakness: 28, severity: 'Medium' },
    { skill: 'Patient Vitals Logging', weakness: 18, severity: 'Low' },
    { skill: 'OT Sterilization', weakness: 14, severity: 'Low' }
  ];

  const funnelData = [
    { stage: 'Enrolled', count: 120 },
    { stage: 'Assessed', count: 114 },
    { stage: 'Shortlisted', count: 88 },
    { stage: 'Interviewed', count: 64 },
    { stage: 'Placed', count: 52 }
  ];

  return (
    <div className="space-y-8 md:space-y-10 pb-16 font-manrope">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-yellow-950 text-white rounded-3xl p-8 md:p-12 shadow-wellness relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-amber-200/20 text-amber-200 border border-amber-300/30 text-xs font-bold">
                State Ayurvedic College & Hospital, Lucknow
              </span>
              <span className="text-xs text-white/80 font-medium">Code: AYU-INST-UP04</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Institution Skill Gap & Placement Analytics
            </h1>
            <p className="text-sm md:text-base text-white/90 font-medium">
              Aggregate batch-level reporting aligned to <strong className="text-amber-200 font-bold">NCISM Accreditation & HSSC Qualification Packs</strong>
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 flex items-center gap-6 min-w-[280px]">
            <div className="text-center">
              <div className="text-4xl font-black text-amber-300">92%</div>
              <div className="text-xs text-amber-100 font-bold uppercase mt-0.5">NCISM Alignment</div>
            </div>
            <div className="h-10 w-px bg-white/20"></div>
            <div className="text-center">
              <div className="text-4xl font-black text-white">84.2%</div>
              <div className="text-xs text-amber-100 font-bold uppercase mt-0.5">Placement Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Batch', val: '120 Students', sub: 'BAMS 2022-2027', color: 'text-amber-800 bg-amber-100' },
          { label: 'Assessed Ratio', val: '95% Completed', sub: '114 Diagnostic Tests', color: 'text-primary bg-leaf-green-light' },
          { label: 'Average Readiness', val: '81.4% Score', sub: 'Panchakarma Pack', color: 'text-tertiary bg-corporate-blue-pale' },
          { label: 'Top Batch Skill Gap', val: 'Pharmacology', sub: '42% Weakness Rate', color: 'text-red-700 bg-red-100' }
        ].map((m, i) => (
          <div key={i} className="bg-surface-white rounded-3xl p-6 border border-surface-container-high shadow-wellness space-y-1">
            <div className="text-xs font-bold text-outline uppercase">{m.label}</div>
            <div className="text-2xl font-black text-text-main font-manrope mt-1">{m.val}</div>
            <div className="text-xs font-medium text-outline mt-1">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Skill Gap Heatmap */}
        <div className="bg-surface-white rounded-3xl p-8 md:p-10 border border-surface-container-high shadow-wellness space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-amber-900 font-manrope">Batch Skill Gap Heatmap</h2>
              <p className="text-xs text-outline font-medium mt-0.5">Percentage of batch requiring competency reinforcement</p>
            </div>
            <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-3 py-1.5 rounded-full">
              HSSC NOS Analysis
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillGapData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" domain={[0, 50]} unit="%" />
                <YAxis dataKey="skill" type="category" width={140} tick={{ fontSize: 12, fontWeight: 600 }} />
                <Tooltip formatter={(value) => [`${value}% Weakness`, 'Rate']} />
                <Bar dataKey="weakness" radius={[0, 8, 8, 0]}>
                  {skillGapData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.severity === 'High' ? '#ba1a1a' : entry.severity === 'Medium' ? '#FFB703' : '#2D6A4F'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Placement Funnel Chart */}
        <div className="bg-surface-white rounded-3xl p-8 md:p-10 border border-surface-container-high shadow-wellness space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-primary font-manrope">Student Recruitment Funnel</h2>
              <p className="text-xs text-outline font-medium mt-0.5">Enrolled to Placed pipeline conversion</p>
            </div>
            <span className="text-xs font-extrabold text-primary bg-leaf-green-light px-3.5 py-1.5 rounded-full">
              52 Placed / Interning
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {funnelData.map((f, i) => {
              const pct = Math.round((f.count / 120) * 100);
              return (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-extrabold">
                    <span className="text-text-main text-sm">{f.stage}</span>
                    <span className="text-primary">{f.count} Students ({pct}%)</span>
                  </div>
                  <div className="w-full h-4 bg-surface-container-low rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 via-primary to-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* NCISM & Curriculum Recommendation Card */}
      <div className="bg-surface-white rounded-3xl p-8 md:p-10 border border-surface-container-high shadow-wellness space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-100 text-amber-800">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-amber-900 font-manrope">NCISM Curriculum Alignment Recommendations</h3>
            <p className="text-xs text-outline font-medium mt-0.5">Actionable steps to close batch skill gaps before final examinations</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 pt-2 text-xs">
          <div className="p-6 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-3">
            <div className="font-extrabold text-amber-900 text-sm flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              1. Add FSSAI Ayush Food Module
            </div>
            <p className="text-outline leading-relaxed font-medium">
              35% of students showed low familiarity with Ayush Ahara food safety regulations. Introduce 1-week certification.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-3">
            <div className="font-extrabold text-amber-900 text-sm flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              2. Conduct Remedial Labs
            </div>
            <p className="text-outline leading-relaxed font-medium">
              Organize intensive lab sessions for Dravya Identification with CSIR-CIMAP subject experts.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-3">
            <div className="font-extrabold text-amber-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              3. Expand Rotations
            </div>
            <p className="text-outline leading-relaxed font-medium">
              Partner with Patanjali & Dabur for 6-month clinical rotations for the remaining 36 unplaced students.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
