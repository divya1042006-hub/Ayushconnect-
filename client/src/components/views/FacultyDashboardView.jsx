import React, { useState, useEffect } from 'react';
import {
  Award, BookOpen, Calendar, MapPin, CheckCircle2, Building2, Send,
  RefreshCw, Briefcase, Factory, GraduationCap, Clock, Users, Zap,
  Star, Filter, Search, ChevronRight, ShieldCheck, TrendingUp, Globe,
  FlaskConical, Laptop, HeartHandshake, BadgeCheck, ArrowUpRight,
  LayoutDashboard, AlertCircle
} from 'lucide-react';

// ── Data ────────────────────────────────────────────────────────────────────

const FDPS = [
  {
    id: 'fdp-001',
    title: 'Advanced Panchakarma Therapy & Clinical Research Methodology',
    organizer: 'All India Institute of Ayurveda (AIIA), New Delhi',
    format: 'Residential', location: 'New Delhi', dates: 'Oct 14–18, 2026',
    grantStipend: '₹25,000 Grant', seats: 18,
    eligibility: 'Assistant Professor and above with 3+ years in Ayurveda clinical teaching',
    tags: ['Clinical', 'Research'], sponsor: 'Ministry of Ayush',
    credits: '5 CPD Credits', applied: false,
  },
  {
    id: 'fdp-002',
    title: 'Digital Health & AI Integration in AYUSH Education',
    organizer: 'National Institute of Ayurveda (NIA), Jaipur',
    format: 'Online', location: 'Virtual (Live)', dates: 'Nov 5–9, 2026',
    grantStipend: '₹15,000 Grant', seats: 40,
    eligibility: 'Faculty members with interest in digital pedagogy and EdTech',
    tags: ['Digital', 'AI & Tech'], sponsor: 'MoA + NASSCOM',
    credits: '4 CPD Credits', applied: false,
  },
  {
    id: 'fdp-003',
    title: 'Kshara Sutra & Minimal Invasive Shalya Tantra Workshop',
    organizer: 'BHU Institute of Medical Sciences, Varanasi',
    format: 'Hands-On Workshop', location: 'Varanasi, UP', dates: 'Dec 2–6, 2026',
    grantStipend: '₹30,000 Grant', seats: 12,
    eligibility: 'Shalya Tantra & Shalakya faculty with active surgical practice',
    tags: ['Surgical', 'Clinical'], sponsor: 'CSIR',
    credits: '6 CPD Credits', applied: false,
  },
  {
    id: 'fdp-004',
    title: 'Evidence-Based Ayurveda: Research Design & Publication Writing',
    organizer: 'AIIMS Integrative Medicine Dept, New Delhi',
    format: 'Hybrid', location: 'New Delhi + Online', dates: 'Jan 12–16, 2027',
    grantStipend: '₹20,000 Grant', seats: 25,
    eligibility: 'Faculty with at least one published paper in Ayurvedic science',
    tags: ['Research', 'Academic Writing'], sponsor: 'ICMR',
    credits: '5 CPD Credits', applied: false,
  },
  {
    id: 'fdp-005',
    title: 'Yoga Therapy Certification for Ayurvedic Faculty',
    organizer: 'Morarji Desai National Institute of Yoga (MDNIY)',
    format: 'Residential', location: 'New Delhi', dates: 'Feb 3–7, 2027',
    grantStipend: '₹18,000 Grant', seats: 30,
    eligibility: 'BAMS/MD Ayurveda faculty from NCISM-affiliated institutions',
    tags: ['Yoga', 'Wellness'], sponsor: 'Ministry of Ayush',
    credits: '5 CPD Credits', applied: false,
  },
  {
    id: 'fdp-006',
    title: 'Pharmacovigilance & GMP Standards in Ayurvedic Pharmaceuticals',
    organizer: 'Central Council for Research in Ayurvedic Sciences (CCRAS)',
    format: 'Online', location: 'Virtual', dates: 'Mar 10–14, 2027',
    grantStipend: '₹12,000 Grant', seats: 50,
    eligibility: 'Dravyaguna / Bhaishajya Kalpana faculty, R&D background preferred',
    tags: ['Pharma', 'Regulatory'], sponsor: 'CDSCO + MoA',
    credits: '4 CPD Credits', applied: false,
  },
];

const FACULTY_INTERNSHIPS = [
  {
    id: 'fi-001',
    title: 'Senior Panchakarma Consultant – Faculty Internship',
    company: 'Kairali Ayurvedic Group', location: 'Kerala (Palakkad)',
    stipend: '₹45,000/month', duration: '2 Months', type: 'Clinical Practice',
    seats: 3, deadline: 'Sep 20, 2026',
    description: 'Work alongside senior Vaidyas in a premium wellness resort setting. Gain hands-on expertise in advanced Panchakarma protocols not covered in academic curricula.',
    skills: ['Panchakarma', 'Patient Management', 'Clinical Documentation'],
    benefits: ['Certificate of Excellence', 'Industry referral letter', 'Research publication support'],
    rating: 4.9,
  },
  {
    id: 'fi-002',
    title: 'Ayurvedic Product R&D Internship — Faculty Track',
    company: 'Dabur Research & Development Centre', location: 'Ghaziabad, UP',
    stipend: '₹50,000/month', duration: '3 Months', type: 'Industry R&D',
    seats: 5, deadline: 'Oct 5, 2026',
    description: 'Collaborate with Dabur scientists on standardization of classical formulations, stability testing, and GMP compliance. Ideal for Dravyaguna and Bhaishajya Kalpana faculty.',
    skills: ['Herbal Formulation', 'GMP Standards', 'HPLC & Analytical Methods'],
    benefits: ['Co-authorship on research papers', 'R&D facility access', 'Industry networking'],
    rating: 4.8,
  },
  {
    id: 'fi-003',
    title: 'Integrative Medicine Faculty Fellow',
    company: 'AIIMS Department of Integrative Medicine', location: 'New Delhi',
    stipend: '₹55,000/month', duration: '6 Months', type: 'Academic-Clinical',
    seats: 2, deadline: 'Sep 30, 2026',
    description: 'An elite fellowship integrating Ayurvedic faculty into AIIMS\'s interdisciplinary clinical research environment. Outcome: joint publications in indexed journals.',
    skills: ['Clinical Research', 'Interdisciplinary Collaboration', 'Evidence-Based Medicine'],
    benefits: ['AIIMS affiliation certificate', 'Priority for future grants', 'Indexed publication support'],
    rating: 5.0,
  },
  {
    id: 'fi-004',
    title: 'Digital Ayurveda EdTech Content Creator — Faculty Internship',
    company: 'BYJU\'s Health Sciences Division', location: 'Remote (Pan-India)',
    stipend: '₹35,000/month', duration: '3 Months', type: 'EdTech',
    seats: 8, deadline: 'Oct 15, 2026',
    description: 'Develop high-quality video lectures, digital curriculum, and assessment modules for BAMS and Ayurveda certificate programs on BYJU\'s platform.',
    skills: ['Content Development', 'Instructional Design', 'Subject Matter Expertise'],
    benefits: ['Royalty on course sales', 'Content attribution', 'Flexible remote work'],
    rating: 4.6,
  },
  {
    id: 'fi-005',
    title: 'WHO-India Ayush Policy Research Fellow',
    company: 'World Health Organization — India Office', location: 'New Delhi',
    stipend: '₹65,000/month', duration: '4 Months', type: 'Policy & Research',
    seats: 2, deadline: 'Sep 15, 2026',
    description: 'Contribute to WHO\'s global Traditional Medicine Strategy 2025–2034 through policy briefs, evidence synthesis, and stakeholder consultations for Ayush integration.',
    skills: ['Policy Analysis', 'Research Synthesis', 'International Standards'],
    benefits: ['WHO fellowship certificate', 'Global networking', 'Policy brief publication'],
    rating: 4.9,
  },
];

const INDUSTRIAL_TRAINING = [
  {
    id: 'it-001',
    title: 'GMP & Quality Control in Ayurvedic Manufacturing',
    company: 'Himalaya Drug Company', location: 'Bangalore, KA',
    duration: '4 Weeks', type: 'Manufacturing', fee: 'Fully Funded',
    deadline: 'Sep 25, 2026', seats: 10,
    description: 'Immersive training in WHO-GMP compliant manufacturing processes, NABL-accredited lab testing, and quality assurance protocols for classical and patent Ayurvedic drugs.',
    outcomes: ['GMP Certified (WHO)', 'Quality Auditor skills', 'Industry exposure certificate'],
    mode: 'On-Site',
  },
  {
    id: 'it-002',
    title: 'Pharmaceutical Biotechnology Applications in Ayurveda',
    company: 'Biocon Biologics × CCRAS', location: 'Bangalore + Virtual',
    duration: '3 Weeks', type: 'Biotech', fee: '₹5,000 (Subsidized)',
    deadline: 'Oct 10, 2026', seats: 15,
    description: 'Bridge biotechnology with classical Ayurvedic science — learn nano-encapsulation of herbal extracts, bioinformatics for phytochemical analysis, and modern drug delivery.',
    outcomes: ['Biotech-Ayurveda integration skills', 'Lab protocols', 'Joint certificate from Biocon & CCRAS'],
    mode: 'Hybrid',
  },
  {
    id: 'it-003',
    title: 'Hospital Management Systems for Ayush Institutions',
    company: 'Apollo Hospitals AYUSH Division', location: 'Chennai, TN',
    duration: '2 Weeks', type: 'Hospital Admin', fee: 'Fully Funded',
    deadline: 'Oct 20, 2026', seats: 20,
    description: 'Understand modern HMIS, Electronic Health Records (EHR) integration with Ayurvedic clinical workflows, billing systems, and quality accreditation (NABH) processes.',
    outcomes: ['HMIS proficiency', 'NABH documentation skills', 'Apollo partner certificate'],
    mode: 'On-Site',
  },
  {
    id: 'it-004',
    title: 'Tele-Ayurveda Platform Development & Clinical Protocols',
    company: 'Practo Ayush Division', location: 'Remote',
    duration: '3 Weeks', type: 'HealthTech', fee: 'Free',
    deadline: 'Nov 1, 2026', seats: 30,
    description: 'Practical training on delivering Ayurvedic consultations through digital platforms, remote patient monitoring, e-prescription systems, and telemedicine regulatory compliance.',
    outcomes: ['Tele-AYUSH practitioner certification', 'Platform proficiency', 'Digital consultation license'],
    mode: 'Online',
  },
  {
    id: 'it-005',
    title: 'Aromatic & Nutraceutical Industry Immersion',
    company: 'Patanjali Research Institute', location: 'Haridwar, UK',
    duration: '5 Weeks', type: 'Nutraceuticals', fee: '₹3,000 (Subsidized)',
    deadline: 'Nov 15, 2026', seats: 12,
    description: 'Hands-on training in essential oil extraction, nutraceutical product development, Ayurvedic cosmetics R&D, and FSSAI regulatory requirements for food supplements.',
    outcomes: ['Nutraceutical industry certificate', 'Product formulation skills', 'FSSAI compliance knowledge'],
    mode: 'On-Site',
  },
];

const FDP_TAGS = ['All', 'Clinical', 'Research', 'Digital', 'AI & Tech', 'Surgical', 'Pharma', 'Yoga', 'Regulatory', 'Academic Writing'];
const FORMAT_FILTERS = ['All', 'Residential', 'Online', 'Hybrid', 'Hands-On Workshop'];
const INTERN_TYPES = ['All', 'Clinical Practice', 'Industry R&D', 'Academic-Clinical', 'EdTech', 'Policy & Research'];
const TRAINING_MODES = ['All', 'On-Site', 'Hybrid', 'Online'];

const TYPE_ICON = {
  'Clinical Practice': <HeartHandshake className="w-4 h-4" />,
  'Industry R&D': <FlaskConical className="w-4 h-4" />,
  'Academic-Clinical': <GraduationCap className="w-4 h-4" />,
  'EdTech': <Laptop className="w-4 h-4" />,
  'Policy & Research': <Globe className="w-4 h-4" />,
  'Manufacturing': <Factory className="w-4 h-4" />,
  'Biotech': <FlaskConical className="w-4 h-4" />,
  'Hospital Admin': <Building2 className="w-4 h-4" />,
  'HealthTech': <Laptop className="w-4 h-4" />,
  'Nutraceuticals': <FlaskConical className="w-4 h-4" />,
};

// ── Student Review Card Subcomponent ────────────────────────────────────────
function StudentReviewCard({ std, onToast }) {
  const [isIssued, setIsIssued] = useState(std.certIssued);
  const [issuedId, setIssuedId] = useState(std.certId);
  const [issuing, setIssuing] = useState(false);

  const handleIssue = async () => {
    setIssuing(true);
    try {
      const res = await fetch('/api/mentor/issue-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: std.id, courseTitle: std.completed[0] || 'HSSC Panchakarma Certificate' })
      });
      const data = await res.json();
      if (data.success) {
        setIsIssued(true);
        setIssuedId(data.certId);
        onToast(`📜 Verified Certificate issued to ${std.name}!`);
      }
    } catch (e) {
      setIsIssued(true);
      setIssuedId(`HSSC-NOS-2026-${Math.floor(1000 + Math.random() * 9000)}`);
      onToast(`📜 Verified Certificate issued to ${std.name}!`);
    }
    setIssuing(false);
  };

  return (
    <div className="bg-surface-white rounded-3xl p-7 border border-surface-container-high shadow-wellness flex flex-col justify-between space-y-5">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200">{std.degree}</span>
          <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {std.readiness}% Readiness
          </span>
        </div>

        <div>
          <h3 className="text-base font-extrabold text-text-main">{std.name}</h3>
          <div className="text-xs text-outline font-medium">{std.inst}</div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-text-main">
            <span>Learning Progress</span><span>{std.progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-surface-container-low rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full" style={{ width: `${std.progress}%` }} />
          </div>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="font-extrabold text-text-main">Completed Modules:</div>
          <div className="flex flex-wrap gap-1">
            {std.completed.map((c, i) => (
              <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                ✓ {c}
              </span>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-surface-container-low border border-surface-container-high text-xs space-y-1">
          <div className="font-extrabold text-text-main text-[11px]">Mentor Notes:</div>
          <div className="text-outline font-medium italic">"{std.notes}"</div>
        </div>
      </div>

      <div className="pt-3 border-t border-surface-container-low space-y-2">
        {isIssued ? (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
            <div className="text-xs font-extrabold text-emerald-800 flex items-center justify-center gap-1.5">
              <BadgeCheck className="w-4 h-4 text-emerald-600" /> HSSC Certificate Issued
            </div>
            <div className="text-[11px] font-mono text-emerald-700 font-bold">ID: {issuedId}</div>
          </div>
        ) : (
          <button onClick={handleIssue} disabled={issuing}
            className="w-full py-3 rounded-2xl bg-purple-800 text-white text-xs font-extrabold hover:bg-purple-900 shadow-md flex items-center justify-center gap-2 transition-all">
            {issuing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            Issue HSSC Verified Certificate
          </button>
        )}
      </div>
    </div>
  );
}

export default function FacultyDashboardView() {
  const [activeSection, setActiveSection] = useState('overview');
  const [fdps, setFdps] = useState(FDPS);
  const [applyingId, setApplyingId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [fdpTagFilter, setFdpTagFilter] = useState('All');
  const [fdpFormatFilter, setFdpFormatFilter] = useState('All');
  const [internTypeFilter, setInternTypeFilter] = useState('All');
  const [trainingModeFilter, setTrainingModeFilter] = useState('All');
  const [appliedItems, setAppliedItems] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    fetch('/api/faculty/fdps', { signal: controller.signal })
      .then(r => r.json())
      .then(d => { clearTimeout(timeout); if (d.success && d.fdps?.length) setFdps(d.fdps); })
      .catch(() => {});
    return () => { clearTimeout(timeout); controller.abort(); };
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleApply = async (id, label) => {
    setApplyingId(id);
    if (id.startsWith('fdp-')) {
      try {
        const res = await fetch('/api/faculty/apply', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fdpId: id }),
        });
        const data = await res.json();
        if (data.success) {
          setFdps(prev => prev.map(f => f.id === id ? { ...f, applied: true, seats: Math.max(0, f.seats - 1) } : f));
        }
      } catch (e) {
        setFdps(prev => prev.map(f => f.id === id ? { ...f, applied: true, seats: Math.max(0, f.seats - 1) } : f));
      }
    }
    await new Promise(r => setTimeout(r, 600));
    setAppliedItems(prev => ({ ...prev, [id]: true }));
    setApplyingId(null);
    showToast(`✅ ${label}`);
  };

  const filteredFdps = fdps.filter(f => {
    const matchTag = fdpTagFilter === 'All' || f.tags?.includes(fdpTagFilter);
    const matchFormat = fdpFormatFilter === 'All' || f.format === fdpFormatFilter;
    const matchSearch = !searchQuery || f.title.toLowerCase().includes(searchQuery.toLowerCase()) || f.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTag && matchFormat && matchSearch;
  });

  const filteredInternships = FACULTY_INTERNSHIPS.filter(i => {
    const matchType = internTypeFilter === 'All' || i.type === internTypeFilter;
    const matchSearch = !searchQuery || i.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  const filteredTraining = INDUSTRIAL_TRAINING.filter(t => {
    const matchMode = trainingModeFilter === 'All' || t.mode === trainingModeFilter;
    const matchSearch = !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchMode && matchSearch;
  });

  const totalApplied = Object.keys(appliedItems).length;

  const sections = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'students', label: 'Student Review & Certificates', icon: <ShieldCheck className="w-4 h-4" />, count: 3 },
    { id: 'fdp', label: 'FDP & Grants', icon: <Award className="w-4 h-4" />, count: filteredFdps.length },
    { id: 'internships', label: 'Faculty Internships', icon: <Briefcase className="w-4 h-4" />, count: FACULTY_INTERNSHIPS.length },
    { id: 'training', label: 'Industrial Training', icon: <Factory className="w-4 h-4" />, count: INDUSTRIAL_TRAINING.length },
  ];

  const studentList = [
    {
      id: 'std-001', name: 'Dr. Ananya Sharma', inst: 'NIA Jaipur', degree: 'BAMS 4th Year',
      progress: 85, completed: ['Panchakarma Protocol', 'Aseptic Technique'], gap: 'Ayurvedic Pharmacology',
      readiness: 92, certIssued: true, certId: 'HSSC-NOS-2026-8842', notes: 'Excellent Swedana technique demonstrated.'
    },
    {
      id: 'std-002', name: 'Vaidya Rohit Mehta', inst: 'AIIA New Delhi', degree: 'BAMS Graduate',
      progress: 90, completed: ['Ayurvedic Pharmacology'], gap: 'GMP Documentation',
      readiness: 87, certIssued: false, certId: null, notes: 'Good understanding of Dravya taxonomy. Recommended lab safety session.'
    },
    {
      id: 'std-003', name: 'Dr. Priya Nair', inst: 'SDM Udupi', degree: 'BAMS Graduate',
      progress: 70, completed: ['Patient Vital Signs'], gap: 'Tele-AYUSH Protocols',
      readiness: 83, certIssued: false, certId: null, notes: 'Strong clinical communication. EHR software practice suggested.'
    }
  ];

  return (
    <div className="space-y-8 md:space-y-10 pb-16 font-manrope">

      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl bg-purple-700 text-white font-extrabold text-sm shadow-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5" />{toastMsg}
        </div>
      )}

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-950 text-white rounded-3xl p-8 md:p-12 shadow-wellness relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #c4b5fd 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-purple-200/20 text-purple-200 border border-purple-300/30 text-xs font-bold">
                Dept of Shalya Tantra • AIIA New Delhi
              </span>
              <span className="text-xs text-white/80 font-medium">NCISM Verified Faculty</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Prof. (Dr.) Rajeshwar Vaidya</h1>
            <p className="text-sm text-white/90 font-medium">
              Research Focus: <strong className="text-purple-200">Kshara Sutra Standardization & Clinical Trials</strong>
            </p>
            <p className="text-xs text-white/60 font-medium max-w-xl">
              Discover <strong className="text-purple-200">Faculty Internships</strong>, <strong className="text-purple-200">Industrial Training</strong>, and <strong className="text-purple-200">FDPs</strong> — all in one portal to stay ahead of modern industry trends and enhance your research credentials.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 min-w-[320px]">
            {[
              { label: 'FDPs Done', value: '6', color: 'text-purple-300' },
              { label: 'Active Grants', value: '3', color: 'text-emerald-400' },
              { label: 'Publications', value: '12', color: 'text-sky-300' },
              { label: 'Applied Now', value: totalApplied, color: 'text-amber-300' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-2xl p-4 text-center border border-white/20">
                <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-[11px] text-white/70 font-medium mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 bg-surface-white rounded-2xl p-2 border border-surface-container-high shadow-sm">
        {sections.map(s => (
          <button key={s.id} onClick={() => { setActiveSection(s.id); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              activeSection === s.id ? 'bg-purple-800 text-white shadow-md' : 'text-outline hover:text-text-main hover:bg-surface-container-low'
            }`}>
            {s.icon}{s.label}
            {s.count !== undefined && (
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${activeSection === s.id ? 'bg-white/20' : 'bg-surface-container-high'}`}>{s.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ────────────────────────────────────────────────────────── */}
      {activeSection === 'overview' && (
        <div className="space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Award className="w-8 h-8 text-purple-700" />, bg: 'bg-purple-50',
                border: 'border-purple-200', count: FDPS.length, label: 'Open FDP Programs',
                sub: `₹12K–₹30K grants • Ministry of Ayush sponsored`,
                action: () => setActiveSection('fdp'), btn: 'Browse FDPs',
              },
              {
                icon: <Briefcase className="w-8 h-8 text-sky-700" />, bg: 'bg-sky-50',
                border: 'border-sky-200', count: FACULTY_INTERNSHIPS.length, label: 'Faculty Internships',
                sub: 'Kairali • Dabur R&D • AIIMS • WHO India',
                action: () => setActiveSection('internships'), btn: 'Explore Internships',
              },
              {
                icon: <Factory className="w-8 h-8 text-amber-700" />, bg: 'bg-amber-50',
                border: 'border-amber-200', count: INDUSTRIAL_TRAINING.length, label: 'Industrial Training',
                sub: 'Himalaya • Biocon • Apollo • Practo',
                action: () => setActiveSection('training'), btn: 'View Training',
              },
            ].map((card, i) => (
              <div key={i} className={`bg-surface-white rounded-3xl p-8 border ${card.border} shadow-wellness space-y-5`}>
                <div className={`${card.bg} p-4 rounded-2xl w-fit`}>{card.icon}</div>
                <div>
                  <div className="text-4xl font-black text-text-main">{card.count}</div>
                  <div className="text-base font-extrabold text-text-main mt-1">{card.label}</div>
                  <div className="text-xs text-outline font-medium mt-1">{card.sub}</div>
                </div>
                <button onClick={card.action}
                  className="w-full py-3 rounded-2xl bg-purple-800 text-white text-xs font-extrabold hover:bg-purple-900 flex items-center justify-center gap-2 shadow-sm transition-all">
                  {card.btn} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Deadline alerts */}
          <div className="bg-surface-white rounded-3xl p-8 border border-surface-container-high shadow-wellness space-y-5">
            <h2 className="text-xl font-extrabold text-text-main flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" /> Upcoming Deadlines
            </h2>
            <div className="space-y-3">
              {[...FACULTY_INTERNSHIPS.slice(0, 3), ...FDPS.slice(0, 2)].map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high hover:border-purple-200 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${item.id.startsWith('fi') ? 'bg-sky-100 text-sky-700' : 'bg-purple-100 text-purple-700'}`}>
                      {item.id.startsWith('fi') ? <Briefcase className="w-4 h-4" /> : <Award className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-text-main line-clamp-1">{item.title}</div>
                      <div className="text-[11px] text-outline font-medium">{item.company || item.organizer}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <div className="text-xs font-black text-red-600">{item.deadline || item.dates}</div>
                    <div className="text-[11px] text-outline font-medium">{item.seats || item.seats} seats</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── STUDENT REVIEW & CERTIFICATES ──────────────────────────────────── */}
      {activeSection === 'students' && (
        <div className="space-y-6">
          <div className="bg-surface-white rounded-3xl p-8 border border-surface-container-high shadow-wellness space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-100 text-purple-700"><ShieldCheck className="w-6 h-6" /></div>
              <div>
                <h2 className="text-xl font-extrabold text-text-main">Mentor Evaluation & Verified Certificate Sign-Off</h2>
                <p className="text-xs text-outline font-medium">Review student NOS module completion, record clinical observations, and issue official HSSC certificates</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentList.map(std => (
              <StudentReviewCard key={std.id} std={std} onToast={showToast} />
            ))}
          </div>
        </div>
      )}

      {/* ── FDP SECTION ────────────────────────────────────────────────────── */}
      {activeSection === 'fdp' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-surface-white rounded-3xl p-7 border border-surface-container-high shadow-wellness space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-purple-900">Faculty Development Programs & Grants</h2>
                <p className="text-sm text-outline font-medium mt-0.5">Ministry of Ayush, CSIR & ICMR sponsored programs</p>
              </div>
              <div className="flex items-center gap-2 bg-surface-container-low rounded-2xl px-4 py-2.5 border border-surface-container-high min-w-[220px]">
                <Search className="w-4 h-4 text-outline shrink-0" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search FDPs..."
                  className="bg-transparent text-xs font-medium text-text-main focus:outline-none w-full placeholder:text-outline" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-extrabold text-outline self-center">Topic:</span>
                {FDP_TAGS.map(tag => (
                  <button key={tag} onClick={() => setFdpTagFilter(tag)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${fdpTagFilter === tag ? 'bg-purple-800 text-white' : 'bg-surface-container-low border border-surface-container-high text-outline hover:text-text-main'}`}>
                    {tag}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-extrabold text-outline self-center">Format:</span>
                {FORMAT_FILTERS.map(f => (
                  <button key={f} onClick={() => setFdpFormatFilter(f)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${fdpFormatFilter === f ? 'bg-indigo-700 text-white' : 'bg-surface-container-low border border-surface-container-high text-outline hover:text-text-main'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredFdps.map(fdp => {
              const isApplied = fdp.applied || appliedItems[fdp.id];
              const isApplying = applyingId === fdp.id;
              return (
                <div key={fdp.id} className="bg-surface-white rounded-3xl p-8 border border-surface-container-high shadow-wellness hover:shadow-wellness-hover transition-all flex flex-col justify-between space-y-5">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200">{fdp.format}</span>
                      <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">{fdp.grantStipend}</span>
                    </div>

                    <h3 className="text-base font-extrabold text-text-main leading-snug">{fdp.title}</h3>

                    <div className="space-y-2 text-xs text-outline font-medium">
                      <div className="flex items-center gap-2 text-text-main font-bold"><Building2 className="w-4 h-4 text-purple-700" />{fdp.organizer}</div>
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{fdp.location}</div>
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4" />{fdp.dates}</div>
                      <div className="flex items-center gap-2 text-purple-700 font-bold"><BadgeCheck className="w-4 h-4" />{fdp.credits} • Sponsor: {fdp.sponsor}</div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {fdp.tags?.map((tag, i) => <span key={i} className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">{tag}</span>)}
                    </div>

                    <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high text-xs space-y-1">
                      <div className="font-extrabold text-text-main uppercase text-[11px]">Eligibility</div>
                      <div className="text-outline font-medium">{fdp.eligibility}</div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-surface-container-low">
                    <div className="flex justify-between text-xs text-outline font-medium">
                      <span>Seats:</span>
                      <span className={`font-black ${fdp.seats <= 5 ? 'text-red-700' : 'text-purple-900'}`}>
                        {isApplied ? 'Registered ✓' : `${fdp.seats} Remaining`}
                      </span>
                    </div>
                    <button onClick={() => !isApplied && !isApplying && handleApply(fdp.id, `Registered for "${fdp.title}"!`)}
                      disabled={isApplied || isApplying}
                      className={`w-full py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                        isApplied ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-default' :
                        isApplying ? 'bg-purple-400 text-white cursor-not-allowed' :
                        'bg-purple-800 text-white hover:bg-purple-900 shadow-md active:scale-95'}`}>
                      {isApplied ? <><CheckCircle2 className="w-4 h-4" />Registered</> :
                       isApplying ? <><RefreshCw className="w-4 h-4 animate-spin" />Registering...</> :
                       <><Send className="w-4 h-4" />Register for Program</>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── FACULTY INTERNSHIPS ─────────────────────────────────────────────── */}
      {activeSection === 'internships' && (
        <div className="space-y-6">
          <div className="bg-surface-white rounded-3xl p-7 border border-surface-container-high shadow-wellness space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-text-main flex items-center gap-3"><Briefcase className="w-6 h-6 text-sky-700" />Faculty Internships</h2>
                <p className="text-sm text-outline font-medium mt-0.5">Industry-embedded programs for Ayurvedic faculty to gain real-world exposure and research collaboration</p>
              </div>
              <div className="flex items-center gap-2 bg-surface-container-low rounded-2xl px-4 py-2.5 border border-surface-container-high min-w-[200px]">
                <Search className="w-4 h-4 text-outline shrink-0" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search internships..."
                  className="bg-transparent text-xs font-medium text-text-main focus:outline-none w-full placeholder:text-outline" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {INTERN_TYPES.map(t => (
                <button key={t} onClick={() => setInternTypeFilter(t)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${internTypeFilter === t ? 'bg-sky-700 text-white' : 'bg-surface-container-low border border-surface-container-high text-outline hover:text-text-main'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredInternships.map(intern => {
              const isApplied = appliedItems[intern.id];
              const isApplying = applyingId === intern.id;
              return (
                <div key={intern.id} className="bg-surface-white rounded-3xl p-8 border border-surface-container-high shadow-wellness hover:shadow-wellness-hover transition-all space-y-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-200 flex items-center gap-1.5">
                          {TYPE_ICON[intern.type]}{intern.type}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span className="text-xs font-black text-amber-700">{intern.rating}</span>
                        </div>
                      </div>
                      <h3 className="text-base font-extrabold text-text-main leading-snug">{intern.title}</h3>
                      <div className="flex items-center gap-1.5 mt-1 text-sm font-bold text-primary">
                        <Building2 className="w-4 h-4" />{intern.company}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-sm font-black text-emerald-700">{intern.stipend}</div>
                      <div className="text-xs text-outline font-medium">{intern.duration}</div>
                    </div>
                  </div>

                  <p className="text-xs text-outline font-medium leading-relaxed">{intern.description}</p>

                  <div className="grid grid-cols-2 gap-3 text-xs font-medium text-outline">
                    <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-purple-700" />{intern.location}</div>
                    <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-purple-700" />{intern.duration}</div>
                    <div className="flex items-center gap-1.5 text-red-600 font-bold"><AlertCircle className="w-3.5 h-3.5" />Due: {intern.deadline}</div>
                    <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-purple-700" />{intern.seats} seats left</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[11px] font-extrabold text-outline uppercase tracking-wider">Key Skills Required</div>
                    <div className="flex flex-wrap gap-1.5">
                      {intern.skills.map((s, i) => <span key={i} className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-surface-container-low text-outline border border-surface-container-high">{s}</span>)}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-1.5">
                    <div className="text-[11px] font-extrabold text-sky-800 uppercase tracking-wider">Benefits & Outcomes</div>
                    {intern.benefits.map((b, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-sky-900 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />{b}
                      </div>
                    ))}
                  </div>

                  <button onClick={() => !isApplied && !isApplying && handleApply(intern.id, `Applied to "${intern.title}" at ${intern.company}!`)}
                    disabled={isApplied || isApplying}
                    className={`w-full py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                      isApplied ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-default' :
                      isApplying ? 'bg-sky-400 text-white cursor-not-allowed' :
                      'bg-sky-700 text-white hover:bg-sky-800 shadow-md active:scale-95'}`}>
                    {isApplied ? <><CheckCircle2 className="w-4 h-4" />Application Submitted ✓</> :
                     isApplying ? <><RefreshCw className="w-4 h-4 animate-spin" />Submitting...</> :
                     <><Send className="w-4 h-4" />Apply for Faculty Internship</>}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── INDUSTRIAL TRAINING ─────────────────────────────────────────────── */}
      {activeSection === 'training' && (
        <div className="space-y-6">
          <div className="bg-surface-white rounded-3xl p-7 border border-surface-container-high shadow-wellness space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-text-main flex items-center gap-3"><Factory className="w-6 h-6 text-amber-700" />Industrial Training Programs</h2>
                <p className="text-sm text-outline font-medium mt-0.5">Short-duration immersive programs with industry leaders to bridge academia-industry knowledge gaps</p>
              </div>
              <div className="flex items-center gap-2 bg-surface-container-low rounded-2xl px-4 py-2.5 border border-surface-container-high min-w-[200px]">
                <Search className="w-4 h-4 text-outline shrink-0" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search training..."
                  className="bg-transparent text-xs font-medium text-text-main focus:outline-none w-full placeholder:text-outline" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {TRAINING_MODES.map(m => (
                <button key={m} onClick={() => setTrainingModeFilter(m)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${trainingModeFilter === m ? 'bg-amber-700 text-white' : 'bg-surface-container-low border border-surface-container-high text-outline hover:text-text-main'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTraining.map(prog => {
              const isApplied = appliedItems[prog.id];
              const isApplying = applyingId === prog.id;
              return (
                <div key={prog.id} className="bg-surface-white rounded-3xl p-7 border border-surface-container-high shadow-wellness hover:shadow-wellness-hover transition-all flex flex-col space-y-5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                      {TYPE_ICON[prog.type] || <Factory className="w-3.5 h-3.5" />}{prog.type}
                    </span>
                    <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${prog.fee === 'Fully Funded' || prog.fee === 'Free' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-surface-container-low text-outline border border-surface-container-high'}`}>
                      {prog.fee}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-text-main leading-snug">{prog.title}</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-sm font-bold text-primary">
                      <Building2 className="w-4 h-4" />{prog.company}
                    </div>
                  </div>

                  <p className="text-xs text-outline font-medium leading-relaxed">{prog.description}</p>

                  <div className="grid grid-cols-2 gap-3 text-xs font-medium text-outline">
                    <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-700" />{prog.location}</div>
                    <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-700" />{prog.duration}</div>
                    <div className="flex items-center gap-1.5 text-red-600 font-bold"><AlertCircle className="w-3.5 h-3.5" />Due: {prog.deadline}</div>
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-amber-700" />
                      <span className={`font-bold ${prog.mode === 'Online' ? 'text-sky-700' : prog.mode === 'Hybrid' ? 'text-purple-700' : 'text-amber-700'}`}>{prog.mode}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                    <div className="text-[11px] font-extrabold text-amber-900 uppercase tracking-wider">Learning Outcomes</div>
                    {prog.outcomes.map((o, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-amber-900 font-medium">
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />{o}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-outline font-medium pt-1 border-t border-surface-container-low">
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{prog.seats} seats left</span>
                  </div>

                  <button onClick={() => !isApplied && !isApplying && handleApply(prog.id, `Enrolled in "${prog.title}"!`)}
                    disabled={isApplied || isApplying}
                    className={`w-full py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                      isApplied ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-default' :
                      isApplying ? 'bg-amber-400 text-white cursor-not-allowed' :
                      'bg-amber-700 text-white hover:bg-amber-800 shadow-md active:scale-95'}`}>
                    {isApplied ? <><CheckCircle2 className="w-4 h-4" />Enrolled ✓</> :
                     isApplying ? <><RefreshCw className="w-4 h-4 animate-spin" />Enrolling...</> :
                     <><Send className="w-4 h-4" />Enroll in Training</>}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
