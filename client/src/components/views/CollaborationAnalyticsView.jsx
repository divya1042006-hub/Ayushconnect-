import React, { useState } from 'react';
import {
  BarChart3, TrendingUp, Users, Lightbulb, Handshake, Globe, Calendar,
  BookOpen, FlaskConical, Mic, Trophy, Brain, Building2, MapPin, Clock,
  CheckCircle2, Send, RefreshCw, ChevronRight, Zap, ArrowUpRight,
  Star, BadgeCheck, LayoutDashboard, AlertCircle, GraduationCap,
  PieChart, Activity, Target, Sparkles, Download, Filter
} from 'lucide-react';

// ── Collaboration Programs ──────────────────────────────────────────────────

const COLLABORATIONS = [
  {
    id: 'col-1', type: 'Joint Research', icon: 'FlaskConical',
    title: 'Kshara Sutra Standardization — Multi-Institutional Research',
    partners: ['NIA Jaipur', 'AIIMS Integrative Medicine', 'CCRAS'],
    lead: 'Dr. Rajeshwar Vaidya', status: 'Active', funding: '₹45 Lakh (ICMR)',
    duration: '18 Months', progress: 65,
    description: 'A multi-centre clinical trial to standardize Kshara Sutra thread preparation and document evidence-based outcomes across 200+ patient cases.',
    outcomes: ['3 indexed publications', 'National protocol document', 'PhD thesis co-guidance'],
    deadline: 'Dec 2026',
  },
  {
    id: 'col-2', type: 'Consultancy Project', icon: 'Handshake',
    title: 'Ayurvedic Quality Assurance Framework for Himalaya Drug Co.',
    partners: ['Himalaya Drug Company', 'SDM Udupi', 'BVDU Pune'],
    lead: 'Dr. Suresh Patil', status: 'Active', funding: '₹12 Lakh (Industry)',
    duration: '6 Months', progress: 40,
    description: 'Faculty consultancy to design an internal NABL-aligned QA system for Himalaya\'s herbal extraction unit, incorporating classical Ayurvedic assessment standards.',
    outcomes: ['QA manual delivery', 'Faculty consultancy fee', 'Industry MoU'],
    deadline: 'Mar 2027',
  },
  {
    id: 'col-3', type: 'Guest Lecture Series', icon: 'Mic',
    title: 'Industry Expert Seminar Series: Modern Ayurveda in Clinical Practice',
    partners: ['Dabur R&D', 'Patanjali Research Institute', 'Kairali Group'],
    lead: 'Dr. Kavita Sharma', status: 'Upcoming', funding: 'Sponsored',
    duration: 'Oct–Dec 2026', progress: 20,
    description: 'Monthly virtual lectures by industry practitioners covering Ayurvedic product formulation, tele-medicine integration, and wellness tourism industry demands.',
    outcomes: ['12 lectures', 'Student exposure to industry', 'CPD credits for faculty'],
    deadline: 'Dec 2026',
  },
  {
    id: 'col-4', type: 'Innovation Hackathon', icon: 'Trophy',
    title: 'AyushInnovate 2026: Healthcare AI Hackathon',
    partners: ['AyushConnect', 'IIT Bombay AI Lab', 'Ministry of Ayush'],
    lead: 'AyushConnect Platform', status: 'Open', funding: '₹5 Lakh Prize Pool',
    duration: '48 Hours (Oct 21–22)', progress: 0,
    description: 'A national hackathon challenging students and faculty teams to build AI-powered solutions for Ayurvedic diagnosis, herb identification, and patient triage.',
    outcomes: ['₹5L prize pool', 'Startup incubation access', 'National recognition'],
    deadline: 'Oct 21, 2026',
  },
  {
    id: 'col-5', type: 'Mentorship Program', icon: 'Users',
    title: 'Industry Mentor Connect: BAMS to Industry Transition Program',
    partners: ['Practo Ayush', 'BYJU\'s Health Sciences', 'WHO India'],
    lead: 'AyushConnect Team', status: 'Active', funding: 'Platform Funded',
    duration: 'Rolling', progress: 55,
    description: '1:1 mentorship pairing of final-year BAMS students with industry professionals from HealthTech, Pharma, and Clinical sectors for career guidance and skill alignment.',
    outcomes: ['1:1 mentor pairing', 'CV review & mock interviews', 'Industry referrals'],
    deadline: 'Ongoing',
  },
  {
    id: 'col-6', type: 'Curriculum Co-Design', icon: 'BookOpen',
    title: 'HSSC NOS-Aligned Curriculum Revision — Industry Input',
    partners: ['NCISM', 'HSSC Ayush Sub-SSC', 'Dabur', 'Kairali', 'Patanjali'],
    lead: 'NCISM Working Group', status: 'Upcoming', funding: 'Government Grant',
    duration: '3 Months', progress: 10,
    description: 'Industry leaders co-designing updated BAMS curriculum modules to ensure graduates are job-ready as per current HSSC Qualification Pack competencies.',
    outcomes: ['Updated NOS-aligned syllabus', 'Industry advisory board', 'Policy brief'],
    deadline: 'Nov 2026',
  },
];

// ── Analytics Data ─────────────────────────────────────────────────────────

const COLLEGE_ANALYTICS = {
  placementRate: 82,
  avgMatchScore: 76,
  totalStudents: 248,
  placed: 204,
  topSkillGaps: [
    { skill: 'Panchakarma Procedure Execution', gap: 38, critical: true },
    { skill: 'Sterilization & Aseptic Technique', gap: 45, critical: true },
    { skill: 'Ayurvedic Herbal Kashaya Preparation', gap: 28, critical: false },
    { skill: 'Clinical Documentation & Logging', gap: 22, critical: false },
    { skill: 'Therapeutic Yoga', gap: 15, critical: false },
  ],
  readinessByDept: [
    { dept: 'Panchakarma', score: 78, students: 42 },
    { dept: 'Kayachikitsa', score: 85, students: 68 },
    { dept: 'Shalya Tantra', score: 72, students: 38 },
    { dept: 'Dravyaguna', score: 69, students: 55 },
    { dept: 'Prasuti Tantra', score: 81, students: 45 },
  ],
  monthlyPlacements: [
    { month: 'May', placed: 18 }, { month: 'Jun', placed: 24 }, { month: 'Jul', placed: 31 },
    { month: 'Aug', placed: 28 }, { month: 'Sep', placed: 35 }, { month: 'Oct', placed: 40 },
  ],
  topEmployers: [
    { name: 'Kairali Group', hired: 22 }, { name: 'Dabur R&D', hired: 18 },
    { name: 'Practo Ayush', hired: 35 }, { name: 'AIIMS Integrative', hired: 12 },
    { name: 'Himalaya', hired: 16 },
  ],
};

const COMPANY_ANALYTICS = {
  totalHired: 103,
  avgDaysToHire: 18,
  qualityScore: 82,
  retentionRate: 91,
  skillDemandTrend: [
    { skill: 'Clinical Documentation & Logging', demand: 92, supply: 68, trend: 'up' },
    { skill: 'Tele-AYUSH Protocols', demand: 88, supply: 42, trend: 'up' },
    { skill: 'AI-Assisted Diagnostics', demand: 85, supply: 30, trend: 'up' },
    { skill: 'Panchakarma Procedure Execution', demand: 78, supply: 62, trend: 'stable' },
    { skill: 'GMP Documentation', demand: 72, supply: 55, trend: 'stable' },
    { skill: 'Herbal Identification', demand: 60, supply: 70, trend: 'down' },
  ],
  hiringByRole: [
    { role: 'Clinical Therapist', count: 34, color: 'bg-emerald-500' },
    { role: 'Pharmacist', count: 22, color: 'bg-sky-500' },
    { role: 'HealthTech Exec', count: 28, color: 'bg-purple-500' },
    { role: 'Research Assoc.', count: 12, color: 'bg-amber-500' },
    { role: 'Yoga Instructor', count: 7, color: 'bg-rose-500' },
  ],
  topSkillGaps: [
    { skill: 'AI & Digital Health Tools', gap: 58, priority: 'High' },
    { skill: 'Tele-AYUSH Protocols', gap: 46, priority: 'High' },
    { skill: 'Research Methodology', gap: 35, priority: 'Medium' },
    { skill: 'GMP Compliance', gap: 28, priority: 'Medium' },
    { skill: 'Patient Communication', gap: 19, priority: 'Low' },
  ],
};

const COLLAB_TYPES = ['All', 'Joint Research', 'Consultancy Project', 'Guest Lecture Series', 'Innovation Hackathon', 'Mentorship Program', 'Curriculum Co-Design'];
const STATUS_COLORS = { Active: 'bg-emerald-100 text-emerald-800 border-emerald-200', Upcoming: 'bg-amber-100 text-amber-800 border-amber-200', Open: 'bg-sky-100 text-sky-800 border-sky-200' };
const TYPE_COLORS = {
  'Joint Research': 'bg-purple-100 text-purple-700',
  'Consultancy Project': 'bg-sky-100 text-sky-700',
  'Guest Lecture Series': 'bg-amber-100 text-amber-700',
  'Innovation Hackathon': 'bg-rose-100 text-rose-700',
  'Mentorship Program': 'bg-teal-100 text-teal-700',
  'Curriculum Co-Design': 'bg-indigo-100 text-indigo-700',
};

function BarChart({ data, maxVal, colorClass, labelKey, valueKey, suffix = '%' }) {
  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={i} className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-text-main">
            <span className="truncate max-w-[60%]">{item[labelKey]}</span>
            <span>{item[valueKey]}{suffix}</span>
          </div>
          <div className="w-full h-3 bg-surface-container-low rounded-full overflow-hidden">
            <div className={`h-full ${colorClass} rounded-full transition-all duration-700`} style={{ width: `${(item[valueKey] / maxVal) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Application Submissions Data (shared for CSV export) ──────────────────
const APP_SUBMISSIONS_DATA = {
  byProgram: [
    { program: 'Panchakarma Paricharaka (HSSC/Q8101)', count: 142, pct: 41.5, color: 'bg-emerald-500' },
    { program: 'Ayurvedic Pharmacist (HSSC/Q8102)', count: 88, pct: 25.7, color: 'bg-sky-500' },
    { program: 'Tele-Ayurveda Specialist (HSSC/Q8103)', count: 64, pct: 18.7, color: 'bg-purple-500' },
    { program: 'Yoga Wellness Coach (HSSC/Q8104)', count: 48, pct: 14.1, color: 'bg-amber-500' },
  ],
  byOrg: [
    { company: 'Patanjali Wellness Hub', apps: 112, hires: 34, pct: 85 },
    { company: 'Kairali Ayurvedic Group', apps: 86, hires: 22, pct: 70 },
    { company: 'Dabur R&D Labs', apps: 68, hires: 18, pct: 55 },
    { company: 'Practo Ayush Division', apps: 46, hires: 15, pct: 40 },
    { company: 'AIIMS Integrative OPD', apps: 30, hires: 12, pct: 28 },
  ],
  bySkillGap: [
    { gap: 'Panchakarma Procedure Execution', apps: 128, urgency: 'Critical Gap' },
    { gap: 'Sterilization & Aseptic Technique', apps: 94, urgency: 'Critical Gap' },
    { gap: 'Ayurvedic Herbal Kashaya Prep', apps: 72, urgency: 'Developing' },
    { gap: 'Clinical Documentation & Logging', apps: 48, urgency: 'Skill Booster' },
  ],
};

function exportToCSV(dateFrom, dateTo, showToast) {
  const rows = [
    ['=== AyushConnect Application Submissions Export ==='],
    [`Date Range: ${dateFrom} to ${dateTo}`, '', ''],
    ['', '', ''],
    ['--- By Qualification Program ---', '', ''],
    ['Program', 'Applications', 'Percentage'],
    ...APP_SUBMISSIONS_DATA.byProgram.map(p => [p.program, p.count, `${p.pct}%`]),
    ['', '', ''],
    ['--- By Hiring Organization ---', '', ''],
    ['Organization', 'Applications', 'Hires'],
    ...APP_SUBMISSIONS_DATA.byOrg.map(o => [o.company, o.apps, o.hires]),
    ['', '', ''],
    ['--- By Skill Gap Addressed ---', '', ''],
    ['Skill Gap', 'Applications', 'Urgency'],
    ...APP_SUBMISSIONS_DATA.bySkillGap.map(s => [s.gap, s.apps, s.urgency]),
  ];
  const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ayushconnect_applications_${dateFrom}_${dateTo}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📥 CSV exported successfully!');
}

export default function CollaborationAnalyticsView() {
  const [activeSection, setActiveSection] = useState('overview');
  const [typeFilter, setTypeFilter] = useState('All');
  const [appliedCollabs, setAppliedCollabs] = useState({});
  const [applyingId, setApplyingId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [analyticsView, setAnalyticsView] = useState('college');
  const [dateFrom, setDateFrom] = useState('2026-06-01');
  const [dateTo, setDateTo] = useState('2026-08-31');

  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3500); };

  const handleJoin = async (id, title) => {
    setApplyingId(id);
    await new Promise(r => setTimeout(r, 800));
    setAppliedCollabs(prev => ({ ...prev, [id]: true }));
    setApplyingId(null);
    showToast(`🤝 Joined "${title}" successfully!`);
  };

  const filteredCollabs = COLLABORATIONS.filter(c => typeFilter === 'All' || c.type === typeFilter);

  const sections = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'collaboration', label: 'Industry–College Ties', icon: <Handshake className="w-4 h-4" />, count: COLLABORATIONS.length },
    { id: 'analytics', label: 'Analytics Dashboards', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const totalActive = COLLABORATIONS.filter(c => c.status === 'Active').length;

  return (
    <div className="space-y-8 pb-16 font-manrope">
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl bg-indigo-700 text-white font-extrabold text-sm shadow-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5" />{toastMsg}
        </div>
      )}

      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-950 via-violet-900 to-purple-900 text-white rounded-3xl p-8 md:p-12 shadow-wellness relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #a78bfa 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="space-y-3">
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-violet-200 inline-block">
              🤝 Academia–Industry Collaboration & Analytics Platform
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Collaboration & Analytics Hub</h1>
            <p className="text-sm text-white/80 font-medium max-w-xl">
              Manage <strong className="text-violet-200">joint research</strong>, <strong className="text-violet-200">hackathons</strong>, <strong className="text-violet-200">guest lectures</strong>, and <strong className="text-violet-200">mentorship programs</strong>. Gain data-driven insights on placement readiness and market skill demand.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Active Collabs', value: totalActive, color: 'text-violet-300' },
              { label: 'Partner Orgs', value: 12, color: 'text-sky-300' },
              { label: 'Placement Rate', value: `${COLLEGE_ANALYTICS.placementRate}%`, color: 'text-emerald-300' },
              { label: 'Skill Gaps Tracked', value: COMPANY_ANALYTICS.skillDemandTrend.length, color: 'text-amber-300' },
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
              activeSection === s.id ? 'bg-indigo-700 text-white shadow-md' : 'text-outline hover:text-text-main hover:bg-surface-container-low'
            }`}>
            {s.icon}{s.label}
            {s.count !== undefined && <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${activeSection === s.id ? 'bg-white/20' : 'bg-surface-container-high'}`}>{s.count}</span>}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ─────────────────────────────────────────────────────── */}
      {activeSection === 'overview' && (
        <div className="space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Handshake className="w-7 h-7 text-violet-700" />, bg: 'bg-violet-100',
                label: 'Active Partnerships', value: totalActive,
                sub: 'Joint research, consultancy, mentorship & more',
                btn: 'View All', action: () => setActiveSection('collaboration')
              },
              {
                icon: <GraduationCap className="w-7 h-7 text-primary" />, bg: 'bg-leaf-green-light',
                label: 'College Placement Rate', value: `${COLLEGE_ANALYTICS.placementRate}%`,
                sub: `${COLLEGE_ANALYTICS.placed}/${COLLEGE_ANALYTICS.totalStudents} students placed`,
                btn: 'College Analytics', action: () => { setActiveSection('analytics'); setAnalyticsView('college'); }
              },
              {
                icon: <TrendingUp className="w-7 h-7 text-sky-700" />, bg: 'bg-sky-100',
                label: 'Top Demanded Skill', value: 'Tele-AYUSH',
                sub: `${COMPANY_ANALYTICS.skillDemandTrend[1].demand}% demand vs ${COMPANY_ANALYTICS.skillDemandTrend[1].supply}% supply`,
                btn: 'Market Trends', action: () => { setActiveSection('analytics'); setAnalyticsView('company'); }
              },
            ].map((card, i) => (
              <div key={i} className="bg-surface-white rounded-3xl p-8 border border-surface-container-high shadow-wellness space-y-5">
                <div className={`${card.bg} p-4 rounded-2xl w-fit`}>{card.icon}</div>
                <div>
                  <div className="text-sm font-extrabold text-outline uppercase tracking-wider">{card.label}</div>
                  <div className="text-3xl font-black text-text-main mt-1">{card.value}</div>
                  <div className="text-xs text-outline font-medium mt-1">{card.sub}</div>
                </div>
                <button onClick={card.action} className="w-full py-3 rounded-2xl bg-indigo-700 text-white text-xs font-extrabold hover:bg-indigo-800 flex items-center justify-center gap-2 shadow-sm">
                  {card.btn} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Recent collaborations preview */}
          <div className="bg-surface-white rounded-3xl p-8 border border-surface-container-high shadow-wellness space-y-5">
            <h2 className="text-xl font-extrabold text-text-main">Active Collaborations</h2>
            <div className="space-y-4">
              {COLLABORATIONS.filter(c => c.status === 'Active').map(c => (
                <div key={c.id} className="flex items-center gap-5 p-5 rounded-2xl border border-surface-container-high bg-surface-container-lowest hover:border-indigo-200 transition-all">
                  <div className={`p-3 rounded-2xl ${TYPE_COLORS[c.type]} shrink-0`}>
                    {c.type === 'Joint Research' ? <FlaskConical className="w-5 h-5" /> :
                     c.type === 'Consultancy Project' ? <Handshake className="w-5 h-5" /> :
                     c.type === 'Mentorship Program' ? <Users className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-extrabold text-text-main line-clamp-1">{c.title}</div>
                    <div className="text-xs text-outline font-medium">{c.partners.join(' • ')}</div>
                    <div className="mt-2 w-full h-1.5 bg-surface-container-low rounded-full">
                      <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full" style={{ width: `${c.progress}%` }} />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-text-main">{c.progress}%</div>
                    <div className="text-[11px] text-outline font-medium">{c.funding}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setActiveSection('collaboration')} className="w-full py-3 rounded-2xl border-2 border-dashed border-indigo-300 text-indigo-700 text-xs font-extrabold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
              View All {COLLABORATIONS.length} Programs <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── COLLABORATION SECTION ─────────────────────────────────────────── */}
      {activeSection === 'collaboration' && (
        <div className="space-y-6">
          <div className="bg-surface-white rounded-3xl p-7 border border-surface-container-high shadow-wellness space-y-4">
            <div>
              <h2 className="text-2xl font-black text-text-main flex items-center gap-3">
                <Handshake className="w-7 h-7 text-indigo-700" />Industry–College Collaboration Tools
              </h2>
              <p className="text-sm text-outline font-medium mt-1">
                Joint research, consultancy, guest lectures, hackathons, mentorship & curriculum co-design — all in one place
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {COLLAB_TYPES.map(t => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${typeFilter === t ? 'bg-indigo-700 text-white' : 'bg-surface-container-low border border-surface-container-high text-outline hover:text-text-main'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredCollabs.map(collab => {
              const isJoined = appliedCollabs[collab.id];
              const isJoining = applyingId === collab.id;
              return (
                <div key={collab.id} className="bg-surface-white rounded-3xl p-8 border border-surface-container-high shadow-wellness hover:shadow-wellness-hover transition-all flex flex-col space-y-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${TYPE_COLORS[collab.type]}`}>{collab.type}</span>
                        <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${STATUS_COLORS[collab.status]}`}>{collab.status}</span>
                      </div>
                      <h3 className="text-base font-extrabold text-text-main leading-snug">{collab.title}</h3>
                      <div className="text-xs text-primary font-bold mt-1">{collab.lead}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-black text-emerald-700">{collab.funding}</div>
                      <div className="text-[11px] text-outline font-medium">{collab.duration}</div>
                    </div>
                  </div>

                  <p className="text-xs text-outline font-medium leading-relaxed">{collab.description}</p>

                  {/* Partner logos / tags */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-extrabold text-outline uppercase tracking-wider">Partner Institutions</div>
                    <div className="flex flex-wrap gap-1.5">
                      {collab.partners.map((p, i) => (
                        <span key={i} className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-surface-container-low border border-surface-container-high text-outline flex items-center gap-1">
                          <Building2 className="w-3 h-3" />{p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Progress */}
                  {collab.progress > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-text-main">
                        <span>Progress</span><span>{collab.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full" style={{ width: `${collab.progress}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Outcomes */}
                  <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2">
                    <div className="text-[11px] font-extrabold text-indigo-800 uppercase tracking-wider">Expected Outcomes</div>
                    {collab.outcomes.map((o, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-indigo-900 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />{o}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-outline font-medium pt-1 border-t border-surface-container-low">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{collab.deadline}</span>
                  </div>

                  <button onClick={() => !isJoined && !isJoining && handleJoin(collab.id, collab.title)}
                    disabled={isJoined || isJoining}
                    className={`w-full py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      isJoined ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-default' :
                      isJoining ? 'bg-indigo-400 text-white cursor-not-allowed' :
                      'bg-indigo-700 text-white hover:bg-indigo-800 shadow-md'}`}>
                    {isJoined ? <><CheckCircle2 className="w-4 h-4" />Joined ✓</> :
                     isJoining ? <><RefreshCw className="w-4 h-4 animate-spin" />Joining...</> :
                     <><Send className="w-4 h-4" />Join this Collaboration</>}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── ANALYTICS SECTION ─────────────────────────────────────────────── */}
      {activeSection === 'analytics' && (
        <div className="space-y-6">
          {/* Toggle */}
          <div className="flex flex-wrap gap-3 bg-surface-white rounded-2xl p-2 border border-surface-container-high shadow-sm w-fit">
            <button onClick={() => setAnalyticsView('college')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${analyticsView === 'college' ? 'bg-primary text-white shadow-md' : 'text-outline hover:text-text-main hover:bg-surface-container-low'}`}>
              <GraduationCap className="w-4 h-4" />College Dashboard
            </button>
            <button onClick={() => setAnalyticsView('company')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${analyticsView === 'company' ? 'bg-sky-700 text-white shadow-md' : 'text-outline hover:text-text-main hover:bg-surface-container-low'}`}>
              <Building2 className="w-4 h-4" />Company Dashboard
            </button>
            <button onClick={() => setAnalyticsView('applications')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${analyticsView === 'applications' ? 'bg-purple-800 text-white shadow-md' : 'text-outline hover:text-text-main hover:bg-surface-container-low'}`}>
              <BarChart3 className="w-4 h-4" />Application Submissions Analytics
            </button>
          </div>

          {/* ── COLLEGE ANALYTICS ── */}
          {analyticsView === 'college' && (
            <div className="space-y-6">
              {/* KPI Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Placement Rate', value: `${COLLEGE_ANALYTICS.placementRate}%`, delta: '+4%', color: 'text-emerald-700', bg: 'bg-emerald-100' },
                  { label: 'Avg Match Score', value: `${COLLEGE_ANALYTICS.avgMatchScore}%`, delta: '+2.5%', color: 'text-primary', bg: 'bg-leaf-green-light' },
                  { label: 'Students Placed', value: COLLEGE_ANALYTICS.placed, delta: `of ${COLLEGE_ANALYTICS.totalStudents}`, color: 'text-sky-700', bg: 'bg-sky-100' },
                  { label: 'Active Skill Gaps', value: COLLEGE_ANALYTICS.topSkillGaps.filter(g => g.critical).length, delta: 'Critical', color: 'text-red-700', bg: 'bg-red-100' },
                ].map((kpi, i) => (
                  <div key={i} className={`rounded-3xl p-6 ${kpi.bg} border border-white/50 space-y-2`}>
                    <div className="text-xs font-extrabold text-text-main/70 uppercase tracking-wider">{kpi.label}</div>
                    <div className={`text-3xl font-black ${kpi.color}`}>{kpi.value}</div>
                    <div className="text-[11px] font-bold text-outline">{kpi.delta} vs last quarter</div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Department Readiness */}
                <div className="bg-surface-white rounded-3xl p-8 border border-surface-container-high shadow-wellness space-y-5">
                  <div>
                    <h3 className="text-lg font-extrabold text-text-main">Department Placement Readiness</h3>
                    <p className="text-xs text-outline font-medium mt-0.5">Average HSSC readiness score by dept</p>
                  </div>
                  <div className="space-y-4">
                    {COLLEGE_ANALYTICS.readinessByDept.map((dept, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-text-main">{dept.dept}</span>
                          <span className="flex items-center gap-2">
                            <span className="text-outline font-medium">{dept.students} students</span>
                            <span className={dept.score >= 80 ? 'text-emerald-700' : dept.score >= 74 ? 'text-amber-700' : 'text-red-700'}>{dept.score}%</span>
                          </span>
                        </div>
                        <div className="w-full h-3 bg-surface-container-low rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-700 ${dept.score >= 80 ? 'bg-gradient-to-r from-emerald-500 to-primary' : dept.score >= 74 ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-red-400 to-red-600'}`}
                            style={{ width: `${dept.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monthly Placements Bar Chart */}
                <div className="bg-surface-white rounded-3xl p-8 border border-surface-container-high shadow-wellness space-y-5">
                  <div>
                    <h3 className="text-lg font-extrabold text-text-main">Monthly Placement Trend</h3>
                    <p className="text-xs text-outline font-medium mt-0.5">Students placed per month (2026)</p>
                  </div>
                  <div className="flex items-end gap-3 h-40 pt-4">
                    {COLLEGE_ANALYTICS.monthlyPlacements.map((m, i) => {
                      const maxV = Math.max(...COLLEGE_ANALYTICS.monthlyPlacements.map(x => x.placed));
                      const height = `${(m.placed / maxV) * 100}%`;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                          <span className="text-[11px] font-black text-primary">{m.placed}</span>
                          <div className="w-full rounded-t-xl bg-gradient-to-t from-primary to-teal-400 transition-all duration-700" style={{ height }} />
                          <span className="text-[11px] text-outline font-medium">{m.month}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Skill Gaps + Top Employers */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-surface-white rounded-3xl p-8 border border-surface-container-high shadow-wellness space-y-5">
                  <div>
                    <h3 className="text-lg font-extrabold text-text-main flex items-center gap-2"><AlertCircle className="w-5 h-5 text-red-500" />Critical Skill Gaps in College</h3>
                    <p className="text-xs text-outline font-medium mt-0.5">% of students below industry benchmark</p>
                  </div>
                  <div className="space-y-4">
                    {COLLEGE_ANALYTICS.topSkillGaps.map((sg, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-text-main">{sg.skill}</span>
                          <span className={`${sg.critical ? 'text-red-700' : 'text-amber-700'} font-black`}>{sg.gap}% below target</span>
                        </div>
                        <div className="w-full h-3 bg-surface-container-low rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${sg.critical ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`}
                            style={{ width: `${sg.gap * 2}%` }} />
                        </div>
                        {sg.critical && <div className="text-[11px] text-red-600 font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3" />Critical — Immediate intervention needed</div>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-surface-white rounded-3xl p-8 border border-surface-container-high shadow-wellness space-y-5">
                  <div>
                    <h3 className="text-lg font-extrabold text-text-main flex items-center gap-2"><Building2 className="w-5 h-5 text-primary" />Top Hiring Partners</h3>
                    <p className="text-xs text-outline font-medium mt-0.5">Companies with most hires from this institution</p>
                  </div>
                  <div className="space-y-4">
                    {COLLEGE_ANALYTICS.topEmployers.map((emp, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high">
                        <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm shrink-0">{emp.name[0]}</div>
                        <div className="flex-1">
                          <div className="text-xs font-extrabold text-text-main">{emp.name}</div>
                          <div className="w-full h-2 bg-surface-container-low rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-primary to-teal-500 rounded-full"
                              style={{ width: `${(emp.hired / 35) * 100}%` }} />
                          </div>
                        </div>
                        <div className="text-sm font-black text-primary shrink-0">{emp.hired} hired</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── COMPANY ANALYTICS ── */}
          {analyticsView === 'company' && (
            <div className="space-y-6">
              {/* KPI Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Hired', value: COMPANY_ANALYTICS.totalHired, delta: '+18% YoY', color: 'text-sky-700', bg: 'bg-sky-100' },
                  { label: 'Avg Days to Hire', value: `${COMPANY_ANALYTICS.avgDaysToHire}d`, delta: '-3d vs Q1', color: 'text-emerald-700', bg: 'bg-emerald-100' },
                  { label: 'Hire Quality Score', value: `${COMPANY_ANALYTICS.qualityScore}%`, delta: '+5% vs target', color: 'text-primary', bg: 'bg-leaf-green-light' },
                  { label: 'Retention Rate', value: `${COMPANY_ANALYTICS.retentionRate}%`, delta: '12-month cohort', color: 'text-purple-700', bg: 'bg-purple-100' },
                ].map((kpi, i) => (
                  <div key={i} className={`rounded-3xl p-6 ${kpi.bg} border border-white/50 space-y-2`}>
                    <div className="text-xs font-extrabold text-text-main/70 uppercase tracking-wider">{kpi.label}</div>
                    <div className={`text-3xl font-black ${kpi.color}`}>{kpi.value}</div>
                    <div className="text-[11px] font-bold text-outline">{kpi.delta}</div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Skill Demand vs Supply */}
                <div className="bg-surface-white rounded-3xl p-8 border border-surface-container-high shadow-wellness space-y-5">
                  <div>
                    <h3 className="text-lg font-extrabold text-text-main flex items-center gap-2"><TrendingUp className="w-5 h-5 text-sky-700" />Skill Demand vs Market Supply</h3>
                    <p className="text-xs text-outline font-medium mt-0.5">Industry demand vs graduate supply — where are the gaps?</p>
                  </div>
                  <div className="space-y-5">
                    {COMPANY_ANALYTICS.skillDemandTrend.map((s, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-text-main line-clamp-1 max-w-[50%]">{s.skill}</span>
                          <div className="flex items-center gap-3">
                            <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${s.trend === 'up' ? 'text-red-700 bg-red-50' : s.trend === 'down' ? 'text-emerald-700 bg-emerald-50' : 'text-outline bg-surface-container-low'}`}>
                              {s.trend === 'up' ? '▲ Rising' : s.trend === 'down' ? '▼ Falling' : '→ Stable'}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-sky-700 font-bold w-14">Demand</span>
                            <div className="flex-1 h-2.5 bg-sky-100 rounded-full overflow-hidden">
                              <div className="h-full bg-sky-500 rounded-full" style={{ width: `${s.demand}%` }} />
                            </div>
                            <span className="text-[11px] font-black text-sky-700 w-8">{s.demand}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-emerald-700 font-bold w-14">Supply</span>
                            <div className="flex-1 h-2.5 bg-emerald-100 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s.supply}%` }} />
                            </div>
                            <span className="text-[11px] font-black text-emerald-700 w-8">{s.supply}%</span>
                          </div>
                        </div>
                        {s.demand - s.supply > 15 && (
                          <div className="text-[11px] text-red-600 font-bold flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />Gap: {s.demand - s.supply}% — Critical shortage in market
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hiring by Role Donut / Bar */}
                <div className="bg-surface-white rounded-3xl p-8 border border-surface-container-high shadow-wellness space-y-5">
                  <div>
                    <h3 className="text-lg font-extrabold text-text-main flex items-center gap-2"><PieChart className="w-5 h-5 text-purple-700" />Hiring Breakdown by Role</h3>
                    <p className="text-xs text-outline font-medium mt-0.5">Distribution of {COMPANY_ANALYTICS.totalHired} hires by role category</p>
                  </div>
                  <div className="space-y-4">
                    {COMPANY_ANALYTICS.hiringByRole.map((r, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full shrink-0 ${r.color}`} />
                        <div className="flex-1">
                          <div className="flex justify-between text-xs font-bold text-text-main mb-1">
                            <span>{r.role}</span><span>{r.count}</span>
                          </div>
                          <div className="w-full h-3 bg-surface-container-low rounded-full overflow-hidden">
                            <div className={`h-full ${r.color} rounded-full`} style={{ width: `${(r.count / COMPANY_ANALYTICS.totalHired) * 100}%` }} />
                          </div>
                        </div>
                        <span className="text-[11px] text-outline font-bold w-8 text-right">
                          {Math.round((r.count / COMPANY_ANALYTICS.totalHired) * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Market Skill Gap Priority */}
              <div className="bg-surface-white rounded-3xl p-8 border border-surface-container-high shadow-wellness space-y-5">
                <div>
                  <h3 className="text-lg font-extrabold text-text-main flex items-center gap-2"><Brain className="w-5 h-5 text-purple-700" />Market Skill Gap Priorities</h3>
                  <p className="text-xs text-outline font-medium mt-0.5">Skills most lacking in the candidate pool — industry urgency ranking</p>
                </div>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {COMPANY_ANALYTICS.topSkillGaps.map((sg, i) => (
                    <div key={i} className={`p-5 rounded-2xl border space-y-3 ${sg.priority === 'High' ? 'bg-red-50 border-red-200' : sg.priority === 'Medium' ? 'bg-amber-50 border-amber-200' : 'bg-sky-50 border-sky-200'}`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full ${sg.priority === 'High' ? 'bg-red-100 text-red-800' : sg.priority === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'}`}>
                          {sg.priority} Priority
                        </span>
                        <span className={`text-xl font-black ${sg.priority === 'High' ? 'text-red-700' : sg.priority === 'Medium' ? 'text-amber-700' : 'text-sky-700'}`}>{sg.gap}%</span>
                      </div>
                      <div className="text-sm font-extrabold text-text-main">{sg.skill}</div>
                      <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${sg.priority === 'High' ? 'bg-red-500' : sg.priority === 'Medium' ? 'bg-amber-500' : 'bg-sky-500'}`}
                          style={{ width: `${sg.gap}%` }} />
                      </div>
                      <div className="text-[11px] text-outline font-medium">{sg.gap}% of applicants lack this skill</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── APPLICATION SUBMISSIONS ANALYTICS ── */}
          {analyticsView === 'applications' && (
            <div className="space-y-6">
              {/* KPI Header with Date Range & CSV Export */}
              <div className="bg-surface-white rounded-3xl p-8 border border-surface-container-high shadow-wellness space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-purple-100 text-purple-700"><BarChart3 className="w-6 h-6" /></div>
                    <div>
                      <h2 className="text-xl font-extrabold text-text-main">Application Submission Analytics Engine</h2>
                      <p className="text-xs text-outline font-medium">Real-time breakdown by qualification program, hiring organization, and targeted skill gap</p>
                    </div>
                  </div>
                  <button
                    onClick={() => exportToCSV(dateFrom, dateTo, showToast)}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-700 text-white text-xs font-extrabold hover:bg-emerald-800 shadow-md transition-all shrink-0">
                    <Download className="w-4 h-4" /> Export CSV
                  </button>
                </div>

                {/* Date Range Selectors */}
                <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high">
                  <span className="text-xs font-extrabold text-outline flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-purple-700" /> Date Range Filter:
                  </span>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-outline">From:</label>
                    <input
                      type="date" value={dateFrom}
                      onChange={e => setDateFrom(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-surface-white border border-surface-container-high text-xs font-medium text-text-main focus:outline-none focus:border-purple-400 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-outline">To:</label>
                    <input
                      type="date" value={dateTo}
                      onChange={e => setDateTo(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-surface-white border border-surface-container-high text-xs font-medium text-text-main focus:outline-none focus:border-purple-400 cursor-pointer"
                    />
                  </div>
                  <span className="text-[11px] text-outline font-medium ml-auto">
                    Showing data: <strong className="text-purple-800">{dateFrom}</strong> → <strong className="text-purple-800">{dateTo}</strong>
                  </span>
                </div>

                <div className="text-3xl font-black text-purple-900">
                  342 <span className="text-sm font-bold text-outline">Total Applications Submitted Across Network</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Applications by Program */}
                <div className="bg-surface-white rounded-3xl p-8 border border-surface-container-high shadow-wellness space-y-5">
                  <div>
                    <h3 className="text-lg font-extrabold text-text-main flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-purple-700" /> Submissions by Qualification Program
                    </h3>
                    <p className="text-xs text-outline font-medium mt-0.5">Distribution across HSSC Qualification Packs</p>
                  </div>
                  <div className="space-y-4">
                    {APP_SUBMISSIONS_DATA.byProgram.map((item, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-text-main">
                          <span>{item.program}</span>
                          <span className="font-black text-purple-900">{item.count} apps ({item.pct}%)</span>
                        </div>
                        <div className="w-full h-3 bg-surface-container-low rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full transition-all duration-700`} style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Applications by Organization */}
                <div className="bg-surface-white rounded-3xl p-8 border border-surface-container-high shadow-wellness space-y-5">
                  <div>
                    <h3 className="text-lg font-extrabold text-text-main flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-sky-700" /> Submissions by Hiring Organization
                    </h3>
                    <p className="text-xs text-outline font-medium mt-0.5">Applications received & confirmed hires</p>
                  </div>
                  <div className="space-y-4">
                    {APP_SUBMISSIONS_DATA.byOrg.map((org, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high">
                        <div className="w-9 h-9 rounded-xl bg-sky-700 text-white flex items-center justify-center font-black text-sm shrink-0">{org.company[0]}</div>
                        <div className="flex-1">
                          <div className="text-xs font-extrabold text-text-main">{org.company}</div>
                          <div className="w-full h-2 bg-surface-container-low rounded-full mt-1.5 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full" style={{ width: `${org.pct}%` }} />
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs font-black text-sky-800">{org.apps} apps</div>
                          <div className="text-[10px] text-emerald-700 font-bold">{org.hires} hired ✓</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submissions by Skill Gap Addressed */}
              <div className="bg-surface-white rounded-3xl p-8 border border-surface-container-high shadow-wellness space-y-5">
                <div>
                  <h3 className="text-lg font-extrabold text-text-main flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-700" /> Application Volume by Skill Gap Addressed
                  </h3>
                  <p className="text-xs text-outline font-medium mt-0.5">Which skill gap bridge modules generated the most applicant conversions?</p>
                </div>
                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {[
                    { gap: 'Panchakarma Procedure Execution', apps: 128, urgency: 'Critical Gap', color: 'bg-red-100 text-red-800 border-red-200' },
                    { gap: 'Sterilization & Aseptic Technique', apps: 94, urgency: 'Critical Gap', color: 'bg-red-100 text-red-800 border-red-200' },
                    { gap: 'Ayurvedic Herbal Kashaya Prep', apps: 72, urgency: 'Developing', color: 'bg-amber-100 text-amber-800 border-amber-200' },
                    { gap: 'Clinical Documentation & Logging', apps: 48, urgency: 'Skill Booster', color: 'bg-sky-100 text-sky-800 border-sky-200' },
                  ].map((sg, i) => (
                    <div key={i} className={`p-5 rounded-2xl border space-y-3 ${sg.color}`}>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/70">{sg.urgency}</span>
                      <div className="text-2xl font-black">{sg.apps} <span className="text-xs font-medium">apps</span></div>
                      <div className="text-xs font-extrabold line-clamp-2">{sg.gap}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => exportToCSV(dateFrom, dateTo, showToast)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-surface-container-low border border-surface-container-high text-xs font-extrabold text-outline hover:bg-surface-container-high transition-all">
                    <Download className="w-4 h-4" /> Download Full Report as CSV
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
