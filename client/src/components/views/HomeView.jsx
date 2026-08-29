import React from 'react';
import { Leaf, Award, CheckCircle2, TrendingUp, Users, BookOpen, ChevronRight, ShieldCheck, Zap, Sparkles, Briefcase, Building2 } from 'lucide-react';

export default function HomeView({ setActiveTab, setActiveRole }) {
  const personas = [
    {
      role: 'student',
      tab: 'student',
      title: 'Student & Intern Portal',
      desc: 'Assess your skills against real HSSC qualification packs, view your readiness score, and get matched to top Ayush hospitals & companies.',
      badge: 'BAMS / BHMS / BNYS / BUMS',
      color: 'border-leaf-green-accent/40 bg-gradient-to-br from-leaf-green-light/40 via-white to-white',
      btnColor: 'bg-primary text-white hover:bg-primary-container',
      stats: '78% Avg Match Accuracy'
    },
    {
      role: 'recruiter',
      tab: 'recruiter',
      title: 'Industry & Recruiter Hub',
      desc: 'Access verified candidates matched by National Occupational Standards (NOS). Filter through drag-and-drop Kanban candidate screening.',
      badge: 'Patanjali, Himalaya, Dabur & Hospitals',
      color: 'border-tertiary/30 bg-gradient-to-br from-corporate-blue-pale/40 via-white to-white',
      btnColor: 'bg-tertiary text-white hover:bg-tertiary-container',
      stats: '100% NOS Skill Verified'
    },
    {
      role: 'faculty',
      tab: 'faculty',
      title: 'Faculty & Research Portal',
      desc: 'Discover Faculty Development Programs (FDPs), clinical trial collaborations, guest lectures, and institutional research grants.',
      badge: 'Academicians & Researchers',
      color: 'border-purple-300 bg-gradient-to-br from-purple-50/60 via-white to-white',
      btnColor: 'bg-purple-800 text-white hover:bg-purple-900',
      stats: 'Ministry & CSIR Funded'
    },
    {
      role: 'institution',
      tab: 'institution',
      title: 'Institution & NCISM Analytics',
      desc: 'Batch-level skill gap heatmaps, placement funnel analytics, curriculum alignment insights, and automated accreditation reporting.',
      badge: 'Ayush Colleges & Deans',
      color: 'border-amber-300 bg-gradient-to-br from-amber-50/60 via-white to-white',
      btnColor: 'bg-amber-800 text-white hover:bg-amber-900',
      stats: 'NCISM & HSSC Aligned'
    }
  ];

  return (
    <div className="space-y-10 md:space-y-12 pb-16 font-manrope">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary via-primary-container to-tertiary text-white p-10 md:p-14 shadow-wellness">
        <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none">
          <Leaf className="w-[450px] h-[450px] text-white" />
        </div>
        <div className="max-w-4xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-leaf-green-light/20 text-leaf-green-light border border-leaf-green-accent/30 text-xs font-bold backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            <span>National Platform for Ayush</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.15] font-manrope">
            Academia-Industry Collaboration Portal for the <span className="text-leaf-green-accent">Ayush Sector</span>
          </h1>
          <p className="text-white/90 text-base md:text-lg leading-relaxed font-medium max-w-3xl">
            AyushConnect bridges the clinical skill gap by anchoring student skill assessments, internships, and faculty development directly to <strong className="text-white underline decoration-leaf-green-accent decoration-2 underline-offset-4">HSSC Ayush Sub-SSC Qualification Packs</strong>.
          </p>
          <div className="pt-6 flex flex-wrap items-center gap-5">
            <button
              onClick={() => { setActiveTab('roadmap'); setActiveRole('student'); }}
              className="px-8 py-4 rounded-2xl bg-leaf-green-accent text-primary font-extrabold text-sm hover:bg-white transition-all shadow-xl flex items-center gap-3 group scale-100 hover:scale-[1.02]"
            >
              <span>Take Skill Gap Assessment</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => { setActiveTab('recruiter'); setActiveRole('recruiter'); }}
              className="px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-extrabold text-sm hover:bg-white/20 transition-all flex items-center gap-3"
            >
              <Briefcase className="w-5 h-5" />
              <span>Explore Industry Kanban</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sector Impact Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Ayush Industry Growth', value: '~17% CAGR', sub: '2024–2032 Projection', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'HSSC Qualification Packs', value: '4 Pilot Packs', sub: 'Panchakarma, Yoga, Kshara', icon: Award, color: 'text-primary bg-leaf-green-light' },
          { label: 'Candidate Match Fit', value: '94% Accuracy', sub: 'Weighted NOS Skill Overlap', icon: ShieldCheck, color: 'text-tertiary bg-corporate-blue-pale' },
          { label: 'Participating Colleges', value: '340+ Colleges', sub: 'NCISM & CCH Recognized', icon: Building2, color: 'text-amber-600 bg-amber-50' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-surface-white rounded-3xl p-7 border border-surface-container-high shadow-wellness hover:shadow-wellness-hover transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3.5 rounded-2xl ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-extrabold text-outline uppercase tracking-wider bg-surface-container-low px-2.5 py-1 rounded-full">
                  Verified
                </span>
              </div>
              <div className="text-3xl font-black text-text-main font-manrope">{stat.value}</div>
              <div className="text-sm font-bold text-text-main mt-1">{stat.label}</div>
              <div className="text-xs text-outline mt-1 font-medium">{stat.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Persona Gateways */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-3xl font-black text-primary font-manrope">Select Portal Persona</h2>
            <p className="text-sm text-outline font-medium mt-0.5">Explore tailored dashboards for every stakeholder in the Ayush ecosystem</p>
          </div>
          <span className="text-xs font-extrabold text-leaf-green-accent bg-leaf-green-light/40 px-4 py-1.5 rounded-full border border-leaf-green-accent/30 w-fit">
            Interactive Stitch Screens
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {personas.map((p, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 md:p-10 border-2 transition-all hover:scale-[1.01] shadow-wellness ${p.color}`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-white text-text-main shadow-xs border border-surface-container-high">
                  {p.badge}
                </span>
                <span className="text-xs font-extrabold text-primary bg-leaf-green-light px-3 py-1 rounded-full">{p.stats}</span>
              </div>
              <h3 className="text-2xl font-extrabold text-text-main mb-3 font-manrope">{p.title}</h3>
              <p className="text-sm text-outline leading-relaxed mb-8 font-medium">{p.desc}</p>

              <button
                onClick={() => { setActiveTab(p.tab); setActiveRole(p.role); }}
                className={`w-full py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-md ${p.btnColor}`}
              >
                <span>Launch {p.title}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Problem & Solution Context */}
      <div className="bg-surface-white rounded-3xl p-8 md:p-10 border border-surface-container-high shadow-wellness space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-leaf-green-light text-primary">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-primary font-manrope">Why AyushConnect?</h3>
            <p className="text-xs text-outline font-medium mt-0.5">Distinct from generic engineering portals like AICTE National Internship Portal</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 pt-2">
          <div className="p-6 rounded-2xl bg-surface-container-low border border-surface-container-high space-y-3">
            <div className="flex items-center gap-2 text-primary font-extrabold text-sm">
              <CheckCircle2 className="w-5 h-5 text-leaf-green-accent" />
              <span>Anchored to HSSC Qualification Packs</span>
            </div>
            <p className="text-xs text-outline leading-relaxed font-medium">
              Every skill assessment is mapped to real National Occupational Standards (NOS) for Panchakarma, Yoga, Kshara Karma, and Ayush Ahara.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-low border border-surface-container-high space-y-3">
            <div className="flex items-center gap-2 text-tertiary font-extrabold text-sm">
              <CheckCircle2 className="w-5 h-5 text-tertiary" />
              <span>Explainable AI Candidate Matching</span>
            </div>
            <p className="text-xs text-outline leading-relaxed font-medium">
              Recruiters see transparent, skill-by-skill fit explanations rather than black-box AI scores.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-low border border-surface-container-high space-y-3">
            <div className="flex items-center gap-2 text-purple-800 font-extrabold text-sm">
              <CheckCircle2 className="w-5 h-5 text-purple-600" />
              <span>Unified Academic & Industry Ecosystem</span>
            </div>
            <p className="text-xs text-outline leading-relaxed font-medium">
              Incorporates Faculty Development Programs (FDPs), clinical trial grants, and college batch heatmaps for NCISM alignment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
