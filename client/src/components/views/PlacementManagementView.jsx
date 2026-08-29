import React, { useState, useMemo } from 'react';
import {
  Briefcase, Search, Filter, Send, CheckCircle2, Clock, RefreshCw,
  Building2, MapPin, Zap, Users, Star, ShieldCheck, AlertCircle,
  ChevronRight, BadgeCheck, BarChart3, Brain, TrendingUp, Eye,
  UserCheck, XCircle, MessageSquare, LayoutDashboard, FileText,
  ListChecks, Kanban, SlidersHorizontal, ArrowUpRight, Info
} from 'lucide-react';

// ── Data ────────────────────────────────────────────────────────────────────

const JOB_POSTINGS = [
  {
    id: 'j1', title: 'Panchakarma Therapist (Entry Level)',
    company: 'Kairali Ayurvedic Group', location: 'Palakkad, Kerala',
    type: 'Full-Time', sector: 'Clinical', salary: '₹3.5–4.5 LPA',
    posted: '2 days ago', deadline: 'Sep 20, 2026', openings: 6,
    minScore: 75, verified: true,
    description: 'Deliver authentic Panchakarma therapies under senior Vaidyas. Fresh BAMS/diploma graduates welcome.',
    required: ['Panchakarma Procedure Execution', 'Abhyanga & Swedana', 'Patient Vital Signs Monitoring'],
    preferred: ['Sterilization & Aseptic Technique', 'Clinical Documentation'],
    qualifications: 'BAMS / Diploma in Ayurvedic Therapy + HSSC Certification preferred',
  },
  {
    id: 'j2', title: 'Junior Dravyaguna Researcher',
    company: 'Dabur Research & Development', location: 'Noida, UP',
    type: 'Full-Time', sector: 'Pharmaceutical R&D', salary: '₹4.0–5.5 LPA',
    posted: '5 days ago', deadline: 'Sep 30, 2026', openings: 4,
    minScore: 80, verified: true,
    description: 'Support R&D on classical herbal formulations and stability testing in a WHO-GMP certified lab.',
    required: ['Ayurvedic Herbal Kashaya Preparation', 'Herbal Identification', 'GMP Documentation'],
    preferred: ['HPLC & Analytical Methods', 'Research Methodology'],
    qualifications: 'B.Pharm (Ayurveda) or BAMS with Dravyaguna specialization',
  },
  {
    id: 'j3', title: 'Tele-Ayurveda Consultation Executive',
    company: 'Practo Ayush Division', location: 'Remote (Pan-India)',
    type: 'Full-Time / Remote', sector: 'HealthTech', salary: '₹3.0–4.0 LPA',
    posted: '1 day ago', deadline: 'Oct 5, 2026', openings: 15,
    minScore: 70, verified: true,
    description: 'Conduct online Ayurvedic consultations, manage patient follow-ups, and maintain digital health records.',
    required: ['Patient Assessment', 'Clinical Documentation & Logging', 'Digital Communication'],
    preferred: ['Tele-AYUSH Protocols', 'EHR Software'],
    qualifications: 'BAMS (Graduate) with basic digital literacy',
  },
  {
    id: 'j4', title: 'Yoga & Wellness Instructor',
    company: 'Isha Foundation – Wellness Division', location: 'Coimbatore, TN',
    type: 'Full-Time', sector: 'Yoga & Wellness', salary: '₹2.8–3.8 LPA',
    posted: '3 days ago', deadline: 'Oct 10, 2026', openings: 8,
    minScore: 68, verified: true,
    description: 'Lead daily therapeutic yoga and pranayama sessions for wellness retreat guests and outpatient groups.',
    required: ['Therapeutic Yoga', 'Pranayama Protocols', 'Group Facilitation'],
    preferred: ['Ayurvedic Dietetics', 'Patient Counselling'],
    qualifications: 'B.Nat / Yoga Graduate / BAMS with yoga specialization',
  },
  {
    id: 'j5', title: 'Clinical Ayurveda OPD Assistant',
    company: 'AIIMS Integrative Medicine Dept', location: 'New Delhi',
    type: 'Full-Time', sector: 'Hospital Clinical', salary: '₹4.5–6.0 LPA',
    posted: '7 days ago', deadline: 'Sep 25, 2026', openings: 3,
    minScore: 85, verified: true,
    description: 'Support senior physicians in Ayurveda OPD including case recording, patient management, and treatment protocol documentation.',
    required: ['Patient Vital Signs Monitoring', 'Kaya Chikitsa', 'Clinical Documentation & Logging'],
    preferred: ['Research Methodology', 'HMIS Software'],
    qualifications: 'BAMS with internship + NCISM registration mandatory',
  },
  {
    id: 'j6', title: 'Ayurveda Content & Curriculum Developer',
    company: "BYJU's Health Sciences Division", location: 'Remote',
    type: 'Contract (6 months)', sector: 'EdTech', salary: '₹25,000/month',
    posted: '4 days ago', deadline: 'Oct 15, 2026', openings: 5,
    minScore: 65, verified: false,
    description: 'Develop engaging BAMS curriculum modules, MCQ banks, clinical case studies, and video scripts for the BYJU\'s Ayurveda learning platform.',
    required: ['Subject Matter Expertise', 'Content Writing', 'Curriculum Design'],
    preferred: ['Video Scripting', 'Assessment Design'],
    qualifications: 'BAMS or BAMS post-graduate with teaching experience',
  },
];

// Candidate pool for AI shortlisting
const CANDIDATES = [
  { id: 'c1', name: 'Dr. Ananya Sharma', college: 'NIA Jaipur', score: 92, status: 'Shortlisted',
    skills: ['Panchakarma Procedure Execution', 'Abhyanga & Swedana', 'Patient Vital Signs Monitoring', 'Sterilization & Aseptic Technique'],
    appliedJob: 'j1', gpa: '8.7', certs: 3, avatar: 'AS' },
  { id: 'c2', name: 'Dr. Rohit Mehta', college: 'AIIA New Delhi', score: 87, status: 'Interviewing',
    skills: ['Ayurvedic Herbal Kashaya Preparation', 'GMP Documentation', 'Herbal Identification'],
    appliedJob: 'j2', gpa: '8.2', certs: 2, avatar: 'RM' },
  { id: 'c3', name: 'Dr. Priya Nair', college: 'SDM Udupi', score: 83, status: 'Shortlisted',
    skills: ['Patient Assessment', 'Clinical Documentation & Logging', 'Tele-AYUSH Protocols'],
    appliedJob: 'j3', gpa: '8.5', certs: 2, avatar: 'PN' },
  { id: 'c4', name: 'Dr. Kavita Joshi', college: 'BVDU Pune', score: 79, status: 'Applied',
    skills: ['Therapeutic Yoga', 'Pranayama Protocols', 'Group Facilitation'],
    appliedJob: 'j4', gpa: '7.9', certs: 1, avatar: 'KJ' },
  { id: 'c5', name: 'Dr. Arun Krishnan', college: 'Manipal College of Ayurveda', score: 76, status: 'Applied',
    skills: ['Patient Vital Signs Monitoring', 'Clinical Documentation & Logging'],
    appliedJob: 'j5', gpa: '7.6', certs: 1, avatar: 'AK' },
  { id: 'c6', name: 'Dr. Meera Pillai', college: 'Amrita Ayurveda', score: 74, status: 'Rejected',
    skills: ['Ayurvedic Herbal Kashaya Preparation'],
    appliedJob: 'j2', gpa: '7.2', certs: 1, avatar: 'MP' },
  { id: 'c7', name: 'Dr. Siddharth Rao', college: 'NIA Jaipur', score: 88, status: 'Selected',
    skills: ['Panchakarma Procedure Execution', 'Abhyanga & Swedana', 'Patient Vital Signs Monitoring', 'Sterilization & Aseptic Technique', 'Herbal Identification'],
    appliedJob: 'j1', gpa: '8.9', certs: 4, avatar: 'SR' },
  { id: 'c8', name: 'Dr. Divya Sharma', college: 'AIIA New Delhi', score: 91, status: 'Interviewing',
    skills: ['Patient Assessment', 'Clinical Documentation & Logging', 'Kaya Chikitsa', 'Patient Vital Signs Monitoring'],
    appliedJob: 'j5', gpa: '9.1', certs: 3, avatar: 'DS' },
];

const PIPELINE_STAGES = ['Applied', 'Shortlisted', 'Interviewing', 'Selected', 'Rejected'];

const STATUS_STYLES = {
  Applied: 'bg-sky-100 text-sky-800 border-sky-200',
  Shortlisted: 'bg-amber-100 text-amber-800 border-amber-200',
  Interviewing: 'bg-purple-100 text-purple-800 border-purple-200',
  Selected: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Rejected: 'bg-red-100 text-red-800 border-red-200',
};

const STATUS_DOT = {
  Applied: 'bg-sky-500',
  Shortlisted: 'bg-amber-500',
  Interviewing: 'bg-purple-500',
  Selected: 'bg-emerald-500',
  Rejected: 'bg-red-500',
};

const SECTORS = ['All', 'Clinical', 'Pharmaceutical R&D', 'HealthTech', 'Yoga & Wellness', 'Hospital Clinical', 'EdTech'];

export default function PlacementManagementView() {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [appliedJobs, setAppliedJobs] = useState({});
  const [applyingId, setApplyingId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [candidateStatuses, setCandidateStatuses] = useState(
    Object.fromEntries(CANDIDATES.map(c => [c.id, c.status]))
  );
  const [selectedJob, setSelectedJob] = useState(null);
  const [stageFilter, setStageFilter] = useState('All');

  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3500); };

  const handleApply = async (jobId, jobTitle) => {
    setApplyingId(jobId);
    await new Promise(r => setTimeout(r, 900));
    setAppliedJobs(prev => ({ ...prev, [jobId]: true }));
    setApplyingId(null);
    showToast(`🚀 Applied to "${jobTitle}" successfully!`);
  };

  const handleStatusChange = (candidateId, newStatus) => {
    setCandidateStatuses(prev => ({ ...prev, [candidateId]: newStatus }));
    showToast(`✅ Status updated to ${newStatus}`);
  };

  const filteredJobs = JOB_POSTINGS.filter(j => {
    const matchSector = sectorFilter === 'All' || j.sector === sectorFilter;
    const matchSearch = !searchQuery || j.title.toLowerCase().includes(searchQuery.toLowerCase()) || j.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSector && matchSearch;
  });

  const candidatesForJob = selectedJob
    ? CANDIDATES.filter(c => c.appliedJob === selectedJob)
    : CANDIDATES;

  const filteredCandidates = candidatesForJob.filter(c => stageFilter === 'All' || candidateStatuses[c.id] === stageFilter);

  // Compute AI shortlist score from required skills overlap
  const shortlisted = useMemo(() => {
    return CANDIDATES.map(c => {
      const job = JOB_POSTINGS.find(j => j.id === c.appliedJob);
      if (!job) return { ...c, fitScore: c.score };
      const matched = job.required.filter(r => c.skills.includes(r)).length;
      const fitScore = Math.round((matched / job.required.length) * 60 + c.score * 0.4);
      return { ...c, fitScore: Math.min(99, fitScore), matchedRequired: matched, totalRequired: job.required.length };
    }).sort((a, b) => b.fitScore - a.fitScore);
  }, []);

  const pipelineCounts = PIPELINE_STAGES.reduce((acc, s) => {
    acc[s] = CANDIDATES.filter(c => candidateStatuses[c.id] === s).length;
    return acc;
  }, {});

  const sections = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'jobs', label: 'Job Board', icon: <Briefcase className="w-4 h-4" />, count: JOB_POSTINGS.length },
    { id: 'shortlisting', label: 'AI Shortlisting', icon: <Brain className="w-4 h-4" />, count: shortlisted.filter(c => c.fitScore >= 80).length },
    { id: 'tracking', label: 'Recruitment Tracking', icon: <Kanban className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-8 pb-16 font-manrope">
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl bg-primary text-white font-extrabold text-sm shadow-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5" />{toastMsg}
        </div>
      )}

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-primary to-teal-900 text-white rounded-3xl p-8 md:p-12 shadow-wellness relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, #6ee7b7 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="space-y-3">
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-teal-200 inline-block">
              🎯 HSSC-Verified Placement Management System
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Placement & Hiring Hub</h1>
            <p className="text-sm text-white/80 font-medium max-w-xl">
              End-to-end placement management — from <strong className="text-teal-200">job postings</strong> and <strong className="text-teal-200">AI-driven shortlisting</strong> to <strong className="text-teal-200">real-time recruitment tracking</strong> for students and HR teams.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Open Jobs', value: JOB_POSTINGS.length, color: 'text-teal-300' },
              { label: 'Total Applicants', value: CANDIDATES.length, color: 'text-sky-300' },
              { label: 'Shortlisted', value: pipelineCounts['Shortlisted'], color: 'text-amber-300' },
              { label: 'Selected', value: pipelineCounts['Selected'], color: 'text-emerald-300' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-2xl p-4 text-center border border-white/20">
                <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-[11px] text-white/70 font-medium mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-surface-white rounded-2xl p-2 border border-surface-container-high shadow-sm">
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              activeSection === s.id ? 'bg-primary text-white shadow-md' : 'text-outline hover:text-text-main hover:bg-surface-container-low'
            }`}>
            {s.icon}{s.label}
            {s.count !== undefined && <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${activeSection === s.id ? 'bg-white/20' : 'bg-surface-container-high'}`}>{s.count}</span>}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ─────────────────────────────────────────────────────── */}
      {activeSection === 'overview' && (
        <div className="space-y-8">
          {/* Pipeline Summary */}
          <div className="bg-surface-white rounded-3xl p-8 border border-surface-container-high shadow-wellness space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-text-main">Recruitment Pipeline</h2>
              <p className="text-xs text-outline font-medium mt-0.5">Real-time candidate flow across all open positions</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {PIPELINE_STAGES.map(stage => (
                <div key={stage} className={`rounded-2xl p-5 border text-center space-y-2 ${STATUS_STYLES[stage]}`}>
                  <div className="text-3xl font-black">{pipelineCounts[stage]}</div>
                  <div className="text-xs font-extrabold">{stage}</div>
                  <div className="w-full bg-white/40 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-current opacity-60" style={{ width: `${(pipelineCounts[stage] / CANDIDATES.length) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick action cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Briefcase className="w-7 h-7 text-primary" />, bg: 'bg-leaf-green-light', label: 'Job Board', count: `${JOB_POSTINGS.length} Active Jobs`, sub: 'Browse & apply to HSSC-verified openings', action: () => setActiveSection('jobs'), btn: 'Browse Jobs' },
              { icon: <Brain className="w-7 h-7 text-purple-700" />, bg: 'bg-purple-100', label: 'AI Shortlisting', count: `${shortlisted.filter(c => c.fitScore >= 80).length} Top Candidates`, sub: 'AI-ranked applicants by skill fit score', action: () => setActiveSection('shortlisting'), btn: 'View Shortlist' },
              { icon: <Kanban className="w-7 h-7 text-sky-700" />, bg: 'bg-sky-100', label: 'Recruitment Tracking', count: `${CANDIDATES.length} Applications`, sub: 'Real-time status board for HR & students', action: () => setActiveSection('tracking'), btn: 'Open Tracker' },
            ].map((card, i) => (
              <div key={i} className="bg-surface-white rounded-3xl p-8 border border-surface-container-high shadow-wellness space-y-5">
                <div className={`${card.bg} p-4 rounded-2xl w-fit`}>{card.icon}</div>
                <div>
                  <div className="text-lg font-extrabold text-text-main">{card.label}</div>
                  <div className="text-2xl font-black text-primary mt-1">{card.count}</div>
                  <div className="text-xs text-outline font-medium mt-1">{card.sub}</div>
                </div>
                <button onClick={card.action} className="w-full py-3 rounded-2xl bg-primary text-white text-xs font-extrabold hover:bg-primary-container flex items-center justify-center gap-2 shadow-sm">
                  {card.btn} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-surface-white rounded-3xl p-8 border border-surface-container-high shadow-wellness space-y-5">
            <h3 className="text-lg font-extrabold text-text-main">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { icon: '🚀', text: 'Dr. Ananya Sharma applied to Panchakarma Therapist at Kairali', time: '2 min ago', type: 'apply' },
                { icon: '✅', text: 'Dr. Siddharth Rao was Selected for Kairali opening', time: '45 min ago', type: 'selected' },
                { icon: '📋', text: 'New job posted: Tele-Ayurveda Executive at Practo (15 seats)', time: '1 hr ago', type: 'post' },
                { icon: '🤝', text: 'Dabur R&D moved Dr. Rohit Mehta to Interview stage', time: '3 hr ago', type: 'interview' },
                { icon: '🎯', text: 'AI shortlisted 5 new candidates for AIIMS OPD role', time: '5 hr ago', type: 'shortlist' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high">
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex-1 text-xs font-medium text-text-main">{item.text}</div>
                  <div className="text-[11px] text-outline font-medium shrink-0">{item.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── JOB BOARD ────────────────────────────────────────────────────── */}
      {activeSection === 'jobs' && (
        <div className="space-y-6">
          <div className="bg-surface-white rounded-3xl p-7 border border-surface-container-high shadow-wellness space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-text-main">Job Board</h2>
                <p className="text-sm text-outline font-medium">HSSC-verified entry-level Ayush positions from industry partners</p>
              </div>
              <div className="flex items-center gap-2 bg-surface-container-low rounded-2xl px-4 py-2.5 border border-surface-container-high min-w-[220px]">
                <Search className="w-4 h-4 text-outline shrink-0" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search jobs..."
                  className="bg-transparent text-xs font-medium text-text-main focus:outline-none w-full placeholder:text-outline" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {SECTORS.map(s => (
                <button key={s} onClick={() => setSectorFilter(s)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${sectorFilter === s ? 'bg-primary text-white' : 'bg-surface-container-low border border-surface-container-high text-outline hover:text-text-main'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredJobs.map(job => {
              const isApplied = appliedJobs[job.id];
              const isApplying = applyingId === job.id;
              return (
                <div key={job.id} className="bg-surface-white rounded-3xl p-7 border border-surface-container-high shadow-wellness hover:shadow-wellness-hover transition-all flex flex-col space-y-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-leaf-green-light text-primary border border-leaf-green-accent/30">{job.sector}</span>
                        <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-surface-container-low text-outline border border-surface-container-high">{job.type}</span>
                        {job.verified && <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" />HSSC</span>}
                      </div>
                      <h3 className="text-base font-extrabold text-text-main">{job.title}</h3>
                      <div className="text-xs font-bold text-primary flex items-center gap-1 mt-1"><Building2 className="w-3.5 h-3.5" />{job.company}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-black text-emerald-700">{job.salary}</div>
                      <div className="text-[11px] text-outline font-medium">{job.openings} openings</div>
                    </div>
                  </div>

                  <p className="text-xs text-outline font-medium leading-relaxed">{job.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-outline font-medium">
                    <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary" />{job.location}</div>
                    <div className="flex items-center gap-1.5 text-red-600 font-bold"><AlertCircle className="w-3.5 h-3.5" />{job.deadline}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[11px] font-extrabold text-red-700 uppercase tracking-wider">Required Skills</div>
                    <div className="flex flex-wrap gap-1.5">
                      {job.required.map((s, i) => <span key={i} className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200">{s}</span>)}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] font-extrabold text-outline uppercase tracking-wider">Qualifications</div>
                    <div className="text-xs text-outline font-medium">{job.qualifications}</div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-outline font-medium pt-2 border-t border-surface-container-low">
                    <span className="flex items-center gap-1.5"><Brain className="w-3.5 h-3.5 text-primary" />Min AI Score: {job.minScore}%</span>
                    <span className="text-[11px]">{job.posted}</span>
                  </div>

                  <button onClick={() => !isApplied && !isApplying && handleApply(job.id, job.title)}
                    disabled={isApplied || isApplying}
                    className={`w-full py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      isApplied ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-default' :
                      isApplying ? 'bg-primary/60 text-white cursor-not-allowed' :
                      'bg-primary text-white hover:bg-primary-container shadow-md'}`}>
                    {isApplied ? <><CheckCircle2 className="w-4 h-4" />Applied ✓</> :
                     isApplying ? <><RefreshCw className="w-4 h-4 animate-spin" />Submitting...</> :
                     <><Send className="w-4 h-4" />One-Tap Apply</>}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── AI SHORTLISTING ───────────────────────────────────────────────── */}
      {activeSection === 'shortlisting' && (
        <div className="space-y-6">
          <div className="bg-surface-white rounded-3xl p-7 border border-surface-container-high shadow-wellness space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-purple-100 text-purple-700"><Brain className="w-7 h-7" /></div>
              <div>
                <h2 className="text-2xl font-black text-text-main">Automated AI Shortlisting Engine</h2>
                <p className="text-sm text-outline font-medium">Candidates ranked by skill-match score against job requirements. Highlights exact/partial matches automatically.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-extrabold text-outline self-center">Filter by Job:</span>
              <button onClick={() => setSelectedJob(null)} className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${!selectedJob ? 'bg-purple-700 text-white' : 'bg-surface-container-low border border-surface-container-high text-outline'}`}>All Jobs</button>
              {JOB_POSTINGS.map(j => (
                <button key={j.id} onClick={() => setSelectedJob(j.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${selectedJob === j.id ? 'bg-purple-700 text-white' : 'bg-surface-container-low border border-surface-container-high text-outline hover:text-text-main'}`}>
                  {j.title.split(' ').slice(0, 3).join(' ')}...
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {shortlisted.filter(c => !selectedJob || c.appliedJob === selectedJob).map((candidate, idx) => {
              const job = JOB_POSTINGS.find(j => j.id === candidate.appliedJob);
              const status = candidateStatuses[candidate.id];
              return (
                <div key={candidate.id} className={`bg-surface-white rounded-3xl p-7 border shadow-wellness transition-all flex flex-col md:flex-row md:items-center gap-6 ${
                  candidate.fitScore >= 85 ? 'border-emerald-300 ring-2 ring-emerald-100' :
                  candidate.fitScore >= 75 ? 'border-amber-200' : 'border-surface-container-high'
                }`}>
                  {/* Rank + Avatar */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${idx === 0 ? 'bg-amber-400 text-white' : idx === 1 ? 'bg-slate-400 text-white' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-surface-container-low text-outline'}`}>
                      #{idx + 1}
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-lg shrink-0">{candidate.avatar}</div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="text-base font-extrabold text-text-main">{candidate.name}</div>
                        <div className="text-xs text-outline font-medium">{candidate.college} • GPA: {candidate.gpa} • {candidate.certs} Certs</div>
                        <div className="text-xs text-primary font-bold mt-0.5">Applying for: {job?.title}</div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className={`text-sm font-black px-4 py-2 rounded-2xl ${candidate.fitScore >= 85 ? 'bg-emerald-100 text-emerald-800' : candidate.fitScore >= 75 ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'}`}>
                          {candidate.fitScore}% AI Fit
                        </div>
                        <span className={`text-xs font-extrabold px-3 py-1.5 rounded-full border ${STATUS_STYLES[status]}`}>
                          <span className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${STATUS_DOT[status]}`} />
                            {status}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Skill match bars */}
                    <div className="flex flex-wrap gap-1.5">
                      {job?.required.map((req, i) => {
                        const has = candidate.skills.includes(req);
                        return (
                          <span key={i} className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                            has ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'
                          }`}>
                            {has ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {req}
                          </span>
                        );
                      })}
                    </div>

                    <div className="text-[11px] text-outline font-medium">
                      {candidate.matchedRequired}/{candidate.totalRequired} required skills matched
                    </div>
                  </div>

                  {/* Status Actions (HR View) */}
                  <div className="shrink-0 flex flex-col gap-2 min-w-[140px]">
                    <div className="text-[11px] font-extrabold text-outline uppercase tracking-wider text-center">Move to Stage</div>
                    {['Shortlisted', 'Interviewing', 'Selected', 'Rejected'].map(s => (
                      <button key={s} onClick={() => handleStatusChange(candidate.id, s)}
                        className={`py-2 px-4 rounded-xl text-[11px] font-extrabold transition-all ${
                          status === s ? `${STATUS_STYLES[s]} cursor-default border` : 'bg-surface-container-low text-outline hover:bg-surface-container-high border border-surface-container-high'
                        }`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── RECRUITMENT TRACKING ──────────────────────────────────────────── */}
      {activeSection === 'tracking' && (
        <div className="space-y-6">
          <div className="bg-surface-white rounded-3xl p-7 border border-surface-container-high shadow-wellness space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-text-main flex items-center gap-3"><Kanban className="w-6 h-6 text-primary" />Recruitment Kanban</h2>
                <p className="text-sm text-outline font-medium">Real-time application status board — drag candidates across stages</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {['All', ...PIPELINE_STAGES].map(s => (
                  <button key={s} onClick={() => setStageFilter(s)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${stageFilter === s ? 'bg-primary text-white' : 'bg-surface-container-low border border-surface-container-high text-outline hover:text-text-main'}`}>
                    {s} {s !== 'All' && `(${pipelineCounts[s] || 0})`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Kanban Board */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {PIPELINE_STAGES.map(stage => {
              const stageCandidates = CANDIDATES.filter(c => candidateStatuses[c.id] === stage && (stageFilter === 'All' || stageFilter === stage));
              return (
                <div key={stage} className="space-y-3">
                  <div className={`flex items-center justify-between px-4 py-3 rounded-2xl border font-extrabold text-xs ${STATUS_STYLES[stage]}`}>
                    <span className="flex items-center gap-2"><span className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT[stage]}`} />{stage}</span>
                    <span>{candidateStatuses && CANDIDATES.filter(c => candidateStatuses[c.id] === stage).length}</span>
                  </div>
                  <div className="space-y-3">
                    {(stageFilter === 'All' ? CANDIDATES.filter(c => candidateStatuses[c.id] === stage) : stageCandidates).map(c => {
                      const job = JOB_POSTINGS.find(j => j.id === c.appliedJob);
                      return (
                        <div key={c.id} className="bg-surface-white rounded-2xl p-4 border border-surface-container-high shadow-sm hover:shadow-wellness transition-all space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm shrink-0">{c.avatar}</div>
                            <div>
                              <div className="text-xs font-extrabold text-text-main">{c.name}</div>
                              <div className="text-[11px] text-outline font-medium">{c.college}</div>
                            </div>
                          </div>
                          <div className="text-[11px] text-primary font-bold line-clamp-1">{job?.title}</div>
                          <div className="flex items-center justify-between">
                            <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-lg ${c.fitScore >= 85 ? 'bg-emerald-100 text-emerald-800' : c.fitScore >= 75 ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'}`}>
                              {c.fitScore}% Fit
                            </span>
                          </div>
                          <div className="flex gap-1.5">
                            {stage !== 'Selected' && stage !== 'Rejected' && (
                              <button onClick={() => handleStatusChange(c.id, stage === 'Applied' ? 'Shortlisted' : stage === 'Shortlisted' ? 'Interviewing' : 'Selected')}
                                className="flex-1 py-1.5 rounded-xl bg-primary text-white text-[10px] font-extrabold hover:bg-primary-container transition-all">
                                Advance →
                              </button>
                            )}
                            {stage !== 'Rejected' && (
                              <button onClick={() => handleStatusChange(c.id, 'Rejected')}
                                className="py-1.5 px-2 rounded-xl bg-red-50 text-red-700 text-[10px] font-extrabold hover:bg-red-100 transition-all border border-red-200">
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {CANDIDATES.filter(c => candidateStatuses[c.id] === stage).length === 0 && (
                      <div className="p-4 rounded-2xl border border-dashed border-outline-variant text-center text-[11px] text-outline font-medium">
                        No candidates
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
