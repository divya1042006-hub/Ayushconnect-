import React, { useState, useEffect } from 'react';
import { Briefcase, Users, UserCheck, Award, ArrowRight, ShieldCheck, Sparkles, Filter, ChevronRight, CheckCircle2, AlertCircle, X, Eye } from 'lucide-react';

export default function RecruiterDashboardView({ setActiveTab }) {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [aiExplanation, setAiExplanation] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    fetch('/api/recruiter/pipeline')
      .then(res => res.json())
      .then(data => {
        if (data.success) setApplications(data.applications);
      });
  }, []);

  const moveStage = (appId, newStage) => {
    fetch('/api/recruiter/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appId, newStage })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setApplications(prev => prev.map(a => a.id === appId ? data.application : a));
          if (selectedApp?.id === appId) setSelectedApp(data.application);
        }
      });
  };

  const generateAiExplanation = (app) => {
    setLoadingAi(true);
    setAiExplanation(null);
    fetch('/api/ai/explain-match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidateName: app.candidateName,
        roleTitle: app.roleApplied,
        matchScore: app.matchScore,
        matchedSkills: app.matchedSkills,
        gapSkills: app.gapSkills
      })
    })
      .then(res => res.json())
      .then(data => {
        setLoadingAi(false);
        if (data.success) setAiExplanation(data.explanation);
      })
      .catch(() => setLoadingAi(false));
  };

  const stages = [
    { key: 'Applied', label: 'Applied', color: 'border-amber-300 bg-amber-50/50 text-amber-800' },
    { key: 'Screening', label: 'Screening', color: 'border-sky-300 bg-sky-50/50 text-sky-800' },
    { key: 'Interview', label: 'Interview', color: 'border-purple-300 bg-purple-50/50 text-purple-800' },
    { key: 'Offered', label: 'Offered', color: 'border-emerald-300 bg-emerald-50/50 text-emerald-800' }
  ];

  return (
    <div className="space-y-8 md:space-y-10 pb-16 font-manrope">
      {/* Top Banner */}
      <div className="bg-surface-white rounded-3xl p-8 md:p-10 border border-surface-container-high shadow-wellness flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-corporate-blue-pale text-tertiary text-xs font-bold border border-tertiary/20">
              Patanjali Wellness & Herbal Research Labs
            </span>
            <span className="text-xs text-outline font-medium">Head of Clinical Talent</span>
          </div>
          <h1 className="text-3xl font-black text-tertiary">Recruiter Candidate Pipeline</h1>
          <p className="text-sm text-outline font-medium">
            HSSC National Occupational Standards (NOS) matched applicant pipeline with drag-and-stage screening.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('screening')}
          className="px-6 py-3.5 rounded-2xl bg-tertiary text-white font-extrabold text-xs hover:bg-tertiary-container transition-all shadow-md flex items-center gap-3 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-corporate-blue-pale" />
          <span>Launch AI Resume Screening</span>
        </button>
      </div>

      {/* Hiring Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Open Roles', val: '8 Roles', sub: 'Panchakarma & Yoga', color: 'text-tertiary bg-corporate-blue-pale' },
          { label: 'Active Pipeline', val: '34 Applicants', sub: 'Weighted Fit Scored', color: 'text-primary bg-leaf-green-light' },
          { label: 'Interviews Today', val: '4 Scheduled', sub: 'NIA & AIIA Graduates', color: 'text-purple-800 bg-purple-100' },
          { label: 'Offers Released', val: '12 Offers', sub: '88% Acceptance Rate', color: 'text-emerald-800 bg-emerald-100' }
        ].map((m, i) => (
          <div key={i} className="bg-surface-white rounded-3xl p-6 border border-surface-container-high shadow-wellness space-y-1">
            <div className="text-xs font-bold text-outline uppercase">{m.label}</div>
            <div className="text-3xl font-black text-text-main font-manrope">{m.val}</div>
            <div className="text-xs font-medium text-outline mt-1">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Kanban Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stages.map((stg) => {
          const appsInStage = applications.filter(a => a.stage === stg.key);
          return (
            <div key={stg.key} className="bg-surface-container-low rounded-3xl p-5 border border-surface-container-high space-y-4 min-h-[550px]">
              <div className={`flex items-center justify-between p-3.5 rounded-2xl border font-black text-xs ${stg.color}`}>
                <span>{stg.label}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-white text-text-main text-xs font-bold shadow-xs">
                  {appsInStage.length}
                </span>
              </div>

              <div className="space-y-4">
                {appsInStage.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => { setSelectedApp(app); generateAiExplanation(app); }}
                    className="bg-surface-white rounded-2xl p-5 border border-surface-container-high shadow-wellness hover:shadow-wellness-hover transition-all cursor-pointer space-y-3 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-extrabold text-text-main group-hover:text-primary transition-colors">
                          {app.candidateName}
                        </div>
                        <div className="text-xs text-outline font-medium line-clamp-1 mt-0.5">{app.roleApplied}</div>
                      </div>
                      <span className="text-xs font-black px-2.5 py-1 rounded-full bg-leaf-green-light text-primary shrink-0">
                        {app.matchScore}%
                      </span>
                    </div>

                    {/* Matched Skills Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {app.matchedSkills?.map((sk, idx) => (
                        <span key={idx} className="text-[10px] font-medium bg-surface-container-low px-2 py-0.5 rounded text-outline">
                          {sk}
                        </span>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-surface-container-low text-xs">
                      <span className="text-outline font-medium">Applied {app.appliedDate}</span>
                      <button className="text-tertiary font-bold hover:underline flex items-center gap-1">
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Candidate Detail & AI Match Explanation Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-white rounded-3xl max-w-2xl w-full p-8 space-y-6 border border-surface-container-high shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-6 right-6 p-2.5 rounded-full hover:bg-surface-container-low text-outline"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-primary text-white text-xl font-black flex items-center justify-center shadow-md shrink-0">
                {selectedApp.candidateName.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-black text-text-main">{selectedApp.candidateName}</h3>
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-leaf-green-light text-primary">
                    {selectedApp.matchScore}% Fit Score
                  </span>
                </div>
                <div className="text-xs text-outline font-medium">
                  Applied for <strong className="text-text-main font-bold">{selectedApp.roleApplied}</strong> ({selectedApp.company})
                </div>
              </div>
            </div>

            {/* Stage Advancement Control */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold text-outline uppercase tracking-wider">Update Candidate Stage:</span>
              <div className="flex flex-wrap gap-2">
                {['Applied', 'Screening', 'Interview', 'Offered'].map((s) => (
                  <button
                    key={s}
                    onClick={() => moveStage(selectedApp.id, s)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedApp.stage === s
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-white text-text-main hover:bg-surface-container-high border border-surface-container-high'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Fit Explanation Box */}
            <div className="p-5 rounded-2xl bg-corporate-blue-pale/60 border border-tertiary/20 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-tertiary">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-tertiary" />
                  AI Explainable Match Justification
                </span>
                <span className="text-[11px] text-outline font-semibold">Rule-Based + LLM Explanation</span>
              </div>

              {loadingAi ? (
                <div className="text-xs text-outline py-2 font-medium">Generating explainable match breakdown...</div>
              ) : (
                <div className="text-xs text-text-main leading-relaxed font-medium whitespace-pre-line">
                  {aiExplanation || "Candidate matches 4 out of 4 required National Occupational Standards (NOS) for Panchakarma therapies."}
                </div>
              )}
            </div>

            {/* Skills & Notes */}
            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div className="p-5 rounded-2xl border border-surface-container-high bg-surface-container-lowest space-y-2">
                <div className="font-extrabold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Verified Core Competencies
                </div>
                <ul className="space-y-1.5 text-outline font-medium">
                  {selectedApp.matchedSkills?.map((m, i) => (
                    <li key={i}>• {m}</li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl border border-surface-container-high bg-surface-container-lowest space-y-2">
                <div className="font-extrabold text-amber-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  Competency Gaps to Train
                </div>
                <ul className="space-y-1.5 text-outline font-medium">
                  {selectedApp.gapSkills?.length > 0 ? selectedApp.gapSkills.map((g, i) => (
                    <li key={i}>• {g}</li>
                  )) : <li>• No critical gaps identified</li>}
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-6 py-2.5 rounded-2xl bg-surface-container-high text-text-main font-bold text-xs hover:bg-outline-variant transition-all"
              >
                Close Candidate Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
