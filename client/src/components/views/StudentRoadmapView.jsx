import React, { useState } from 'react';
import { Compass, CheckCircle2, AlertCircle, Award, Sparkles, ChevronRight, BookOpen, Layers, RefreshCw } from 'lucide-react';

// ── Embedded Qualification Packs (works offline — no API needed) ────────────
const QUAL_PACKS = [
  {
    id: 'qp-panchakarma', code: 'HSSC/Q8101', level: 'Level 4',
    title: 'Panchakarma Paricharaka', sector: 'Ayurveda Clinical',
    description: 'Authentic Panchakarma therapy procedures for BAMS practitioners',
    coreCompetencies: [
      'Panchakarma Procedure Execution',
      'Abhyanga & Swedana Technique',
      'Kati/Janu Basti Administration',
      'Shirodhara Protocol',
      'Sterilization & Aseptic Technique',
    ],
  },
  {
    id: 'qp-pharmacist', code: 'HSSC/Q8102', level: 'Level 3',
    title: 'Ayurvedic Pharmacist', sector: 'Ayurvedic Pharmacy',
    description: 'Herbal formulation, GMP compliance and QC testing',
    coreCompetencies: [
      'Ayurvedic Herbal Kashaya Preparation',
      'GMP & Quality Standards',
      'Herbal Identification & Classification',
      'Dispensing & Labelling',
      'Pharmacovigilance Documentation',
    ],
  },
  {
    id: 'qp-yoga', code: 'HSSC/Q8103', level: 'Level 3',
    title: 'Yoga Wellness Coach', sector: 'Yoga & Naturopathy',
    description: 'Therapeutic yoga coaching aligned to Ministry of Ayush NOS',
    coreCompetencies: [
      'Therapeutic Yoga Sequencing',
      'Pranayama Protocols',
      'Patient Assessment & Goal Setting',
      'Meditation Facilitation',
      'BNYS Clinical Documentation',
    ],
  },
  {
    id: 'qp-tele', code: 'HSSC/Q8104', level: 'Level 4',
    title: 'Tele-AYUSH Specialist', sector: 'Digital Health',
    description: 'Tele-medicine consultation and digital health tools for AYUSH practitioners',
    coreCompetencies: [
      'Tele-Consultation Protocols',
      'AI-Assisted Diagnostics',
      'Patient Communication (Digital)',
      'Clinical Documentation & Logging',
      'Data Privacy & DPDP Compliance',
    ],
  },
];

function computeLocalResult(pack, answers) {
  const totalScore = Object.values(answers).reduce((sum, v) => sum + Number(v), 0);
  const maxScore = pack.coreCompetencies.length * 5;
  const readinessScore = Math.round((totalScore / maxScore) * 100);
  const skills = pack.coreCompetencies.map((comp, idx) => {
    const score = Math.round(((answers[idx] || 3) / 5) * 100);
    const status = score >= 80 ? 'strong' : score >= 60 ? 'developing' : 'gap';
    return { name: comp, score, target: 90, status };
  });
  const xpGained = 150;
  return { success: true, readinessScore, targetPack: pack, skills, xpGained };
}

export default function StudentRoadmapView({ user, setUser }) {
  const [selectedPackId, setSelectedPackId] = useState('qp-panchakarma');
  const [selectedPack, setSelectedPack] = useState(QUAL_PACKS[0]);
  const [answers, setAnswers] = useState({ 0: 4, 1: 3, 2: 5, 3: 4, 4: 2 });
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePackChange = (id) => {
    setSelectedPackId(id);
    const found = QUAL_PACKS.find(p => p.id === id);
    setSelectedPack(found);
    setAssessmentResult(null);
    // Reset answers for the new pack
    const defaultAnswers = {};
    (found?.coreCompetencies || []).forEach((_, i) => { defaultAnswers[i] = 3; });
    setAnswers(defaultAnswers);
  };

  const handleSliderChange = (idx, val) => {
    setAnswers(prev => ({ ...prev, [idx]: Number(val) }));
  };

  const runDiagnostic = async () => {
    setLoading(true);
    // Compute result locally immediately (always works)
    const localResult = computeLocalResult(selectedPack, answers);

    const updateUserState = (data) => {
      if (setUser) {
        setUser(prev => {
          const updated = {
            ...prev,
            targetRole: data.targetPack?.id || data.targetPackId,
            targetRoleTitle: data.targetPack?.title || data.targetRoleTitle,
            readinessScore: data.readinessScore,
            skills: data.skills,
            xp: (prev?.xp || 1420) + (data.xpGained || 150)
          };
          try { localStorage.setItem('ayush_user', JSON.stringify(updated)); } catch(e) {}
          return updated;
        });
      }
    };

    // Also try the API in the background for persistence
    try {
      const res = await fetch('/api/students/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetPackId: selectedPackId, answers, studentId: user?.id, studentName: user?.name })
      });
      const data = await res.json();
      if (data.success) {
        setAssessmentResult(data);
        updateUserState(data);
        setLoading(false);
        return;
      }
    } catch (_) { /* Server not available — use local result below */ }

    // Use local result
    setAssessmentResult(localResult);
    updateUserState(localResult);
    setLoading(false);
  };

  return (
    <div className="space-y-8 md:space-y-10 pb-16 font-manrope">
      {/* Header */}
      <div className="bg-surface-white rounded-3xl p-8 md:p-10 border border-surface-container-high shadow-wellness flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-leaf-green-light text-primary text-xs font-extrabold border border-leaf-green-accent/30">
              Diagnostic & Skill Gap Engine
            </span>
            <span className="text-xs text-outline font-medium">HSSC Ayush Sub-SSC Standards</span>
          </div>
          <h1 className="text-3xl font-black text-primary">Ayush Skill Diagnostic & Roadmap Generator</h1>
          <p className="text-sm text-outline font-medium">
            Select a target HSSC Qualification Pack to assess your National Occupational Standards (NOS) readiness score.
          </p>
        </div>

        <button
          onClick={runDiagnostic}
          disabled={loading}
          className="px-8 py-4 rounded-2xl bg-primary text-white font-extrabold text-xs hover:bg-primary-container transition-all shadow-wellness flex items-center justify-center gap-3 shrink-0"
        >
          {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-leaf-green-accent" />}
          <span>{loading ? 'Calculating Fit...' : 'Run Skill Diagnostic'}</span>
        </button>
      </div>

      {/* Qualification Pack Selector Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {QUAL_PACKS.map((p) => {
          const isSelected = selectedPackId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => handlePackChange(p.id)}
              className={`p-6 rounded-2xl border-2 text-left transition-all ${
                isSelected
                  ? 'border-primary bg-leaf-green-light/40 shadow-md scale-[1.01]'
                  : 'border-surface-container-high bg-surface-white hover:border-outline-variant'
              }`}
            >
              <div className="text-xs font-bold text-outline uppercase">{p.code}</div>
              <div className={`text-sm font-black mt-1 ${isSelected ? 'text-primary' : 'text-text-main'}`}>
                {p.title}
              </div>
              <div className="text-xs text-outline mt-1 font-medium">{p.level}</div>
            </button>
          );
        })}
      </div>

      {/* Main Diagnostic Area */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Questionnaire / Self-Assessment */}
        <div className="bg-surface-white rounded-3xl p-8 md:p-10 border border-surface-container-high shadow-wellness space-y-8">
          <div className="flex items-center justify-between border-b border-surface-container-high pb-5">
            <div>
              <h2 className="text-xl font-extrabold text-text-main">
                {selectedPack?.title} Competency Diagnostic
              </h2>
              <p className="text-xs text-outline font-medium mt-0.5">{selectedPack?.sector} • {selectedPack?.description}</p>
            </div>
            <span className="text-xs font-extrabold text-primary bg-leaf-green-light px-3.5 py-1.5 rounded-full">
              Self-Rate 1-5
            </span>
          </div>

          <div className="space-y-6">
            {selectedPack?.coreCompetencies.map((comp, idx) => {
              const val = answers[idx] || 3;
              return (
                <div key={idx} className="p-5 rounded-2xl bg-surface-container-low border border-surface-container-high space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-text-main text-sm font-extrabold">{comp}</span>
                    <span className="px-3 py-1 rounded-lg bg-white text-primary border border-surface-container-high font-black">
                      Rating: {val} / 5 ({val * 20}%)
                    </span>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={val}
                    onChange={(e) => handleSliderChange(idx, e.target.value)}
                    className="w-full accent-primary cursor-pointer h-2"
                  />
                  <div className="flex justify-between text-xs text-outline font-semibold">
                    <span>1: Novice</span>
                    <span>3: Proficient</span>
                    <span>5: Expert Vaidya</span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={runDiagnostic}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-primary text-white font-extrabold text-xs hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Generate Visual Gap Report</span>
          </button>
        </div>

        {/* Right: Instant Gap Report & Personalized Roadmap */}
        <div className="space-y-8">
          {/* Readiness Result Card */}
          <div className="bg-gradient-to-br from-primary via-primary-container to-emerald-950 text-white rounded-3xl p-8 shadow-wellness space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-leaf-green-accent">
                Calculated HSSC Fit
              </span>
              <span className="text-xs text-white/80 font-bold">Reward: +150 XP</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-white/10 border-4 border-leaf-green-accent flex items-center justify-center text-4xl font-black shrink-0">
                {assessmentResult ? assessmentResult.readinessScore : (user?.readinessScore || 78)}%
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-black text-white font-manrope">
                  {assessmentResult ? assessmentResult.targetPack.title : (user?.targetRoleTitle || 'Panchakarma Paricharaka')}
                </div>
                <p className="text-xs text-white/80 font-medium">
                  {assessmentResult?.readinessScore >= 80 ? 'High Fit — Direct candidate for top hospital placements.' : 'Developing Fit — 1 skill gap identified to reach 90%+ readiness.'}
                </p>
              </div>
            </div>
          </div>

          {/* Skill Gap Breakdown Card */}
          <div className="bg-surface-white rounded-3xl p-8 border border-surface-container-high shadow-wellness space-y-6">
            <h3 className="text-lg font-extrabold text-primary font-manrope">Target Skill Gap Breakdown</h3>

            <div className="space-y-4">
              {(assessmentResult ? assessmentResult.skills : user?.skills)?.map((s, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-surface-container-high bg-surface-container-lowest flex items-center justify-between text-xs">
                  <span className="font-extrabold text-text-main text-sm flex items-center gap-3">
                    {s.status === 'strong' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-amber-500" />}
                    {s.name}
                  </span>
                  <span className={`px-3 py-1 rounded-lg font-black text-xs ${
                    s.status === 'strong' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {s.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Learning Roadmap */}
          <div className="bg-surface-white rounded-3xl p-8 border border-surface-container-high shadow-wellness space-y-6">
            <h3 className="text-lg font-extrabold text-text-main font-manrope flex items-center gap-3">
              <Compass className="w-6 h-6 text-primary" />
              <span>Recommended Action Plan</span>
            </h3>

            <div className="space-y-6 relative pl-6 border-l-2 border-primary/20">
              {[
                { step: 1, title: 'Bridge Skill Gap: Ayurvedic Pharmacology', type: 'HSSC Online Module', time: 'Est. 2 Weeks' },
                { step: 2, title: 'Complete Hands-on Basti Simulation', type: 'Clinical Practical at NIA', time: 'Est. 1 Week' },
                { step: 3, title: 'Submit One-Tap Internship Application', type: 'Patanjali Wellness Hub', time: 'Immediate' }
              ].map((r, i) => (
                <div key={i} className="relative space-y-1">
                  <div className="absolute -left-[31px] top-0.5 w-5 h-5 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center">
                    {r.step}
                  </div>
                  <div className="text-sm font-extrabold text-text-main">{r.title}</div>
                  <div className="text-xs text-outline flex items-center gap-2 font-medium">
                    <span className="text-primary font-bold">{r.type}</span>
                    <span>•</span>
                    <span>{r.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
