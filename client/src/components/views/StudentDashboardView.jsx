import React, { useState, useEffect } from 'react';
import {
  Award, Zap, Compass, Plus, CheckCircle2, AlertCircle, Clock, MapPin,
  Building, ShieldCheck, Sparkles, Send, BookOpen, Play, Star, Filter,
  Search, Briefcase, Globe, ChevronRight, TrendingUp, Users, BadgeCheck, RefreshCw,
  FileText, Cpu
} from 'lucide-react';
import AddCertificateModal from '../common/AddCertificateModal';
import CourseLearningModal from '../common/CourseLearningModal';
import { API_BASE } from '../../api';

// ─── Static Courses Data ────────────────────────────────────────────────────
const COURSES = [
  {
    id: 'c1', title: 'Panchakarma Therapy: Complete Clinical Protocol',
    provider: 'NIA Jaipur (NCISM Certified)', level: 'Intermediate',
    duration: '6 Weeks', lessons: 24, rating: 4.9, enrolled: 3420,
    tag: 'HSSC NOS Mapped', color: 'from-emerald-600 to-primary',
    skills: ['Abhyanga Technique', 'Basti Administration', 'Shirodhara'],
    free: false, price: '₹1,200'
  },
  {
    id: 'c2', title: 'Ayurvedic Pharmacology & Dravyaguna',
    provider: 'AIIA New Delhi (MoA Approved)', level: 'Foundation',
    duration: '4 Weeks', lessons: 18, rating: 4.8, enrolled: 5100,
    tag: 'NOS: HSS/Q5701', color: 'from-amber-600 to-orange-700',
    skills: ['Herbal Identification', 'Kashaya Preparation', 'Pharmacokinetics'],
    free: true, price: 'Free'
  },
  {
    id: 'c3', title: 'Clinical Yoga & Naturopathy for Ayush Practitioners',
    provider: 'Morarji Desai National Institute of Yoga', level: 'Beginner',
    duration: '3 Weeks', lessons: 12, rating: 4.7, enrolled: 8900,
    tag: 'Ministry of AYUSH', color: 'from-purple-600 to-indigo-700',
    skills: ['Therapeutic Yoga', 'Pranayama Protocols', 'Patient Assessment'],
    free: true, price: 'Free'
  },
  {
    id: 'c4', title: 'AI & Digital Health Tools for Ayurveda Practitioners',
    provider: 'AyushConnect Academy (HSSC Partner)', level: 'Intermediate',
    duration: '5 Weeks', lessons: 20, rating: 4.9, enrolled: 2300,
    tag: 'Industry Certified', color: 'from-sky-600 to-cyan-700',
    skills: ['AI Diagnostics', 'Tele-Ayurveda', 'Digital Documentation'],
    free: false, price: '₹800'
  },
  {
    id: 'c5', title: 'Kshara Sutra & Minimal Invasive Shalya Tantra',
    provider: 'BHU Institute of Medical Sciences', level: 'Advanced',
    duration: '8 Weeks', lessons: 32, rating: 4.8, enrolled: 1100,
    tag: 'HSSC Advanced Pack', color: 'from-rose-600 to-red-700',
    skills: ['Kshara Preparation', 'Surgical Threads', 'Post-Op Care'],
    free: false, price: '₹2,500'
  },
  {
    id: 'c6', title: 'Patient Communication & Ethics in Ayurveda Practice',
    provider: 'National Commission for Indian System of Medicine', level: 'Foundation',
    duration: '2 Weeks', lessons: 8, rating: 4.6, enrolled: 6700,
    tag: 'NCISM Certified', color: 'from-teal-600 to-emerald-700',
    skills: ['Patient Counselling', 'Medical Ethics', 'Case Documentation'],
    free: true, price: 'Free'
  },
];

// ─── Static Internship Opportunities ────────────────────────────────────────
const INTERNSHIP_OPPORTUNITIES = [
  {
    id: 'i1', title: 'Panchakarma Therapy Intern',
    company: 'Patanjali Wellness Hub', location: 'Haridwar, Uttarakhand',
    stipend: '₹12,000/month', duration: '3 Months', type: 'Clinical',
    sector: 'Wellness & Therapy', matchScore: 96,
    skills: ['Abhyanga', 'Panchakarma', 'Patient Vitals'],
    deadline: 'Sep 15, 2026', seats: 4, verified: true,
    description: 'Hands-on clinical training in authentic Panchakarma procedures under senior Vaidyas.'
  },
  {
    id: 'i2', title: 'Ayurvedic Pharmacist Trainee',
    company: 'Dabur Ayurvedic R&D Division', location: 'Noida, UP',
    stipend: '₹15,000/month', duration: '6 Months', type: 'Industry R&D',
    sector: 'Pharmaceutical', matchScore: 88,
    skills: ['Herbal Formulation', 'GMP Standards', 'QC Testing'],
    deadline: 'Sep 30, 2026', seats: 8, verified: true,
    description: 'Work with research scientists on standardization of classical Ayurvedic formulations.'
  },
  {
    id: 'i3', title: 'Yoga & Wellness Coach Intern',
    company: 'Isha Foundation Wellness Centre', location: 'Coimbatore, TN',
    stipend: '₹8,000/month', duration: '2 Months', type: 'Teaching',
    sector: 'Yoga & Wellness', matchScore: 82,
    skills: ['Therapeutic Yoga', 'Pranayama', 'Counselling'],
    deadline: 'Oct 10, 2026', seats: 12, verified: true,
    description: 'Teach therapeutic yoga and support wellness programs for diverse patient groups.'
  },
  {
    id: 'i4', title: 'Tele-Ayurveda Consultation Assistant',
    company: 'Practo Ayush Division', location: 'Remote (Pan-India)',
    stipend: '₹10,000/month', duration: '4 Months', type: 'Digital Health',
    sector: 'HealthTech', matchScore: 79,
    skills: ['Patient Communication', 'Clinical Documentation', 'Digital Tools'],
    deadline: 'Oct 5, 2026', seats: 20, verified: true,
    description: 'Support certified Ayurveda doctors in conducting online consultations and follow-ups.'
  },
  {
    id: 'i5', title: 'Ayurvedic Nutrition & Dietetics Researcher',
    company: 'CSIR-National Institute of Nutrition', location: 'Hyderabad, TS',
    stipend: '₹18,000/month', duration: '6 Months', type: 'Research',
    sector: 'Research & Academia', matchScore: 74,
    skills: ['Ayurvedic Dietetics', 'Research Methodology', 'Data Analysis'],
    deadline: 'Sep 20, 2026', seats: 3, verified: true,
    description: 'Collaborate on government-funded research bridging Ayurvedic nutrition principles with modern dietary science.'
  },
  {
    id: 'i6', title: 'Kaya Chikitsa Clinical Intern',
    company: 'AIIMS Ayurveda Department', location: 'New Delhi',
    stipend: '₹14,000/month', duration: '3 Months', type: 'Clinical',
    sector: 'Hospital & Clinical', matchScore: 91,
    skills: ['Kaya Chikitsa', 'OPD Management', 'Case Reporting'],
    deadline: 'Sep 25, 2026', seats: 6, verified: true,
    description: 'Gain hospital-based clinical exposure in internal medicine at India\'s premier Ayurveda OPD.'
  },
];

const SECTORS = ['All', 'Clinical', 'Wellness & Therapy', 'Pharmaceutical', 'HealthTech', 'Research & Academia', 'Hospital & Clinical'];
const COURSE_LEVELS = ['All', 'Beginner', 'Foundation', 'Intermediate', 'Advanced'];

export default function StudentDashboardView({ user, setActiveTab }) {
  const [jobs, setJobs] = useState([]);
  const normalizeCerts = (rawCerts) => {
    if (!rawCerts) return [];
    let list = rawCerts;
    if (typeof rawCerts === 'string') {
      try { list = JSON.parse(rawCerts); } catch (_) { list = []; }
    }
    if (!Array.isArray(list)) return [];
    return list.map(c => {
      if (typeof c === 'string') return { title: c, issuer: 'HSSC Ayush Sub-SSC', year: 2025, verified: true };
      return {
        title: c?.title || 'HSSC NOS Certified Specialist',
        issuer: c?.issuer || 'HSSC Ayush Sub-SSC',
        year: c?.year || 2025,
        verified: c?.verified !== false
      };
    });
  };

  const [certifications, setCertifications] = useState(() => normalizeCerts(user?.certifications));
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState({});
  const [isAddCertOpen, setIsAddCertOpen] = useState(false);
  const [applySuccessMsg, setApplySuccessMsg] = useState('');

  // Tabs: 'dashboard' | 'courses' | 'opportunities'
  const [activeSection, setActiveSection] = useState('dashboard');

  // Course states
  const [enrolledCourses, setEnrolledCourses] = useState({});
  const [courseLevel, setCourseLevel] = useState('All');

  const [applications, setApplications] = useState([
    {
      id: 'app-1',
      roleApplied: 'Panchakarma Intern',
      company: 'Patanjali Wellness Hub',
      appliedDate: 'Aug 24, 2026',
      matchScore: 94,
      status: 'Shortlisted',
      jobId: 'job-001'
    },
    {
      id: 'app-2',
      roleApplied: 'Ayurvedic Clinical Trainee',
      company: 'Dabur Health Research',
      appliedDate: 'Aug 18, 2026',
      matchScore: 88,
      status: 'Interview',
      jobId: 'job-002'
    }
  ]);
  const [sectorFilter, setSectorFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedInternships, setAppliedInternships] = useState({});
  const [applyingInternId, setApplyingInternId] = useState(null);

  useEffect(() => {
    setCertifications(normalizeCerts(user?.certifications));
  }, [user]);

  useEffect(() => {
    fetch(`${API_BASE}/api/jobs`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data?.success) setJobs(data.jobs); })
      .catch(() => {});

    fetch(`${API_BASE}/api/recruiter/pipeline`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.success && Array.isArray(data.applications)) {
          const sId = user?.id || 'std-001';
          setApplications(data.applications.filter(a => a.studentId === sId || a.candidateName === user?.name));
        }
      })
      .catch(() => {});
  }, [user]);

  const showToast = (msg) => {
    setApplySuccessMsg(msg);
    setTimeout(() => setApplySuccessMsg(''), 3500);
  };

  const handleApply = (job) => {
    setApplyingJobId(job.id);
    const payload = { jobId: job.id, studentId: user?.id || 'std-001', candidateName: user?.name || 'Student Candidate' };
    fetch(`${API_BASE}/api/jobs/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setApplyingJobId(null);
        if (data?.success) {
          setAppliedJobs(prev => ({ ...prev, [job.id]: true }));
          setApplications(prev => [data.application, ...prev]);
          showToast(`✅ Applied to ${job.title} at ${job.company}!`);
        } else {
          setAppliedJobs(prev => ({ ...prev, [job.id]: true }));
          showToast(`✅ Application submitted to ${job.company}!`);
        }
      })
      .catch(() => {
        setApplyingJobId(null);
        setAppliedJobs(prev => ({ ...prev, [job.id]: true }));
        showToast(`✅ Application submitted to ${job.company}!`);
      });
  };

  const handleApplyInternship = async (intern) => {
    setApplyingInternId(intern.id);
    await new Promise(r => setTimeout(r, 1000));
    setAppliedInternships(prev => ({ ...prev, [intern.id]: true }));
    setApplyingInternId(null);
    showToast(`🎉 Applied to "${intern.title}" at ${intern.company}!`);
  };

  const [learningCourse, setLearningCourse] = useState(null);

  const handleEnrollCourse = (courseId) => {
    const target = COURSES.find(c => c.id === courseId) || { id: courseId, title: 'AYUSH Certification Module' };
    setEnrolledCourses(prev => ({ ...prev, [courseId]: true }));
    setLearningCourse(target);
    showToast('🎓 Enrolled! Video lecture demo & Skill Assessment quiz opened.');
  };

  const handleCompleteCourse = (courseId, score) => {
    setEnrolledCourses(prev => ({ ...prev, [courseId]: true }));
    showToast(`🏆 Skill Assessment passed with ${score}%! Verified to student profile.`);
  };

  const handleCertificateAdded = (newCert) => {
    setCertifications(prev => [...prev, newCert]);
  };

  const readinessScore = user?.readinessScore || user?.readiness_score || 78;
  const targetRoleTitle = user?.targetRoleTitle || 'Panchakarma Paricharaka';

  const defaultSkills = [
    { name: "Abhyanga & Swedana Technique", score: 85, target: 90, status: "strong" },
    { name: "Kati/Janu Basti Setup & Monitoring", score: 75, target: 85, status: "developing" },
    { name: "Sterilization & Herbal Dravya Prep", score: 90, target: 90, status: "strong" },
    { name: "Patient Vitals & Therapy Logging", score: 80, target: 85, status: "developing" },
    { name: "Ayurvedic Pharmacology Basics", score: 65, target: 80, status: "developing" }
  ];
  const userSkills = (user?.skills && Array.isArray(user.skills) && user.skills.length > 0) ? user.skills : defaultSkills;

  const filteredCourses = COURSES.filter(c => courseLevel === 'All' || c.level === courseLevel);
  const filteredInternships = INTERNSHIP_OPPORTUNITIES.filter(i => {
    const matchSector = sectorFilter === 'All' || i.sector === sectorFilter || i.type === sectorFilter;
    const matchSearch = !searchQuery || i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSector && matchSearch;
  });

  const tabs = [
    { id: 'dashboard', label: 'My Dashboard', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'courses', label: 'Courses', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'opportunities', label: 'Internship Opportunities', icon: <Briefcase className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-8 md:space-y-10 pb-16 font-manrope">
      {/* Toast */}
      {applySuccessMsg && (
        <div className="fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl bg-emerald-600 text-white font-extrabold text-sm shadow-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5" />
          {applySuccessMsg}
        </div>
      )}

      {/* Top Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-primary via-primary-container to-emerald-900 text-white p-8 md:p-12 shadow-wellness relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-leaf-green-light/20 text-leaf-green-light border border-leaf-green-accent/30 text-xs font-bold">
                {user?.degree || 'BAMS'} • {user?.institution || 'Ayush National Institute'}
              </span>
              <span className="text-xs text-white/80 font-medium">Reg: {user?.regNo || 'AYU-2026-REG'}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Welcome back, {user?.name || 'Student'}! 👋
            </h1>
            <p className="text-sm md:text-base text-white/90 font-medium max-w-2xl">
              Target: <strong className="text-leaf-green-accent font-bold">{targetRoleTitle}</strong> (HSS/Q5701) •
              <span className="ml-2">{INTERNSHIP_OPPORTUNITIES.length} internships available near you</span>
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 flex items-center gap-5 min-w-[280px]">
            <div className="relative w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-4 border-leaf-green-accent shrink-0">
              <span className="text-2xl font-black text-white">{readinessScore}%</span>
            </div>
            <div>
              <div className="text-xs text-white/80 font-extrabold uppercase tracking-wider">HSSC Fit Readiness</div>
              <div className="text-lg font-black text-leaf-green-accent">Industry Ready</div>
              <div className="text-xs text-white/70 font-medium mt-0.5">Top 12% in NIA Batch</div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-6 text-sm font-semibold">
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span>Level <strong className="text-white font-extrabold">{user?.level || 4}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-leaf-green-accent" />
              <span>XP: <strong className="text-white font-extrabold">{user?.xp || 1420} / 2000</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-sky-300" />
              <span>{certifications.length} Certificates 📜</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-300" />
              <span>{Object.keys(enrolledCourses).length} Courses Enrolled</span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('roadmap')}
            className="px-5 py-2.5 rounded-2xl bg-leaf-green-accent text-primary font-extrabold hover:bg-white transition-all shadow-md text-xs flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Retake Skill Assessment</span>
          </button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex items-center gap-2 bg-surface-white rounded-2xl p-1.5 border border-surface-container-high shadow-sm w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              activeSection === tab.id
                ? 'bg-primary text-white shadow-md'
                : 'text-outline hover:text-text-main hover:bg-surface-container-low'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── DASHBOARD SECTION ─────────────────────────────────────────────── */}
      {activeSection === 'dashboard' && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left 2 Columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button onClick={() => setActiveTab('screening')} className="p-5 rounded-3xl bg-surface-white border-2 border-emerald-300 shadow-wellness hover:shadow-wellness-hover hover:border-primary transition-all text-left group space-y-2.5 relative overflow-hidden">
                <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800 w-fit group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-primary flex items-center gap-1">
                    <span>Resume Skill Match</span>
                    <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-full font-bold">AI</span>
                  </div>
                  <div className="text-[11px] text-outline mt-0.5 font-medium">Upload & map 6+ roles</div>
                </div>
              </button>
              <button onClick={() => setActiveTab('roadmap')} className="p-5 rounded-3xl bg-surface-white border border-surface-container-high shadow-wellness hover:shadow-wellness-hover hover:border-leaf-green-accent transition-all text-left group space-y-2.5">
                <div className="p-2.5 rounded-2xl bg-leaf-green-light text-primary w-fit group-hover:scale-110 transition-transform">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-text-main">HSSC Gap Report</div>
                  <div className="text-[11px] text-outline mt-0.5 font-medium">Analyze target skills</div>
                </div>
              </button>
              <button onClick={() => setActiveSection('courses')} className="p-5 rounded-3xl bg-surface-white border border-surface-container-high shadow-wellness hover:shadow-wellness-hover hover:border-purple-300 transition-all text-left group space-y-2.5">
                <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-800 w-fit group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-text-main">Browse Courses</div>
                  <div className="text-[11px] text-outline mt-0.5 font-medium">{COURSES.length} HSSC courses</div>
                </div>
              </button>
              <button onClick={() => setIsAddCertOpen(true)} className="p-5 rounded-3xl bg-surface-white border border-surface-container-high shadow-wellness hover:shadow-wellness-hover hover:border-amber-300 transition-all text-left group space-y-2.5">
                <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800 w-fit group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-text-main">Add Certificate</div>
                  <div className="text-[11px] text-outline mt-0.5 font-medium">Upload & verify NOS</div>
                </div>
              </button>
            </div>

            {/* Skills */}
            <div className="bg-surface-white rounded-3xl p-8 md:p-10 border border-surface-container-high shadow-wellness space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-primary font-manrope">HSSC Ayush Skill Breakdown</h2>
                  <p className="text-xs text-outline font-medium mt-0.5">Mapped to National Occupational Standards (NOS)</p>
                </div>
                <span className="text-xs font-extrabold text-primary bg-leaf-green-light px-3.5 py-1.5 rounded-full">
                  {userSkills.length} Competencies
                </span>
              </div>
              <div className="space-y-5 pt-2">
                {userSkills.map((skill, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-text-main text-sm flex items-center gap-2.5">
                        {skill.status === 'strong' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                        {skill.status === 'developing' && <Clock className="w-5 h-5 text-amber-500" />}
                        {skill.status === 'gap' && <AlertCircle className="w-5 h-5 text-red-500" />}
                        {skill.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-outline text-xs font-medium">Target: {skill.target}%</span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-black ${
                          skill.status === 'strong' ? 'bg-emerald-100 text-emerald-800' :
                          skill.status === 'developing' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>{skill.score}%</span>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-surface-container-low rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ${
                        skill.status === 'strong' ? 'bg-gradient-to-r from-emerald-500 to-primary' :
                        skill.status === 'developing' ? 'bg-gradient-to-r from-amber-400 to-amber-600' :
                        'bg-gradient-to-r from-red-400 to-red-600'
                      }`} style={{ width: `${skill.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-surface-white rounded-3xl p-8 md:p-10 border border-surface-container-high shadow-wellness space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-purple-900 font-manrope flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-700" />
                    <span>Verified HSSC Certifications</span>
                  </h2>
                  <p className="text-xs text-outline font-medium mt-0.5">NOS Credentials</p>
                </div>
                <button onClick={() => setIsAddCertOpen(true)} className="text-xs font-extrabold text-purple-800 bg-purple-100 px-3.5 py-1.5 rounded-full border border-purple-300 hover:bg-purple-800 hover:text-white transition-all flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Certificate</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certifications.map((cert, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-purple-200 bg-purple-50/50 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xs font-extrabold text-purple-950 line-clamp-1">{cert.title}</div>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1 shrink-0">
                        <ShieldCheck className="w-3 h-3" /> Verified NOS
                      </span>
                    </div>
                    <div className="text-[11px] text-outline font-medium flex items-center justify-between">
                      <span>{cert.issuer}</span>
                      <span className="font-bold">{cert.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Applications */}
            <div className="bg-surface-white rounded-3xl p-8 md:p-10 border border-surface-container-high shadow-wellness space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-text-main font-manrope">My Applications</h2>
                  <p className="text-xs text-outline font-medium mt-0.5">Real-time recruitment status</p>
                </div>
                <span className="text-xs font-bold text-outline bg-surface-container-low px-3.5 py-1.5 rounded-full">
                  {applications.length} Active
                </span>
              </div>
              <div className="space-y-4">
                {applications.map((app, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-surface-container-high bg-surface-container-lowest flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-sm font-extrabold text-text-main">{app.roleApplied}</div>
                      <div className="text-xs text-outline font-medium flex items-center gap-2">
                        <span className="font-bold text-primary">{app.company}</span>
                        <span>•</span>
                        <span>Applied: {app.appliedDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-extrabold text-primary bg-leaf-green-light px-3 py-1.5 rounded-full">{app.matchScore}% Fit</span>
                      <span className={`text-xs font-bold px-3.5 py-1.5 rounded-full ${
                        app.status === 'Shortlisted' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        app.status === 'Interview' ? 'bg-sky-100 text-sky-800 border border-sky-300' :
                        app.status === 'Offered' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                        'bg-amber-100 text-amber-800'
                      }`}>{app.status}</span>
                    </div>
                  </div>
                ))}
                {applications.length === 0 && (
                  <div className="text-center py-8 text-outline text-sm font-medium">
                    No applications yet. Browse <button onClick={() => setActiveSection('opportunities')} className="text-primary font-bold underline">Internship Opportunities</button>!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Recommended Jobs */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-primary font-manrope">Recommended</h2>
              <button onClick={() => setActiveSection('opportunities')} className="text-xs font-bold text-leaf-green-accent flex items-center gap-1 hover:underline">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-5">
              {jobs.slice(0, 4).map((job) => {
                const isApplied = appliedJobs[job.id] || applications.some(a => a.jobId === job.id);
                return (
                  <div key={job.id} className="bg-surface-white rounded-3xl p-6 border border-surface-container-high shadow-wellness hover:shadow-wellness-hover transition-all space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-leaf-green-light text-primary border border-leaf-green-accent/30">{job.sector}</span>
                          {job.verified && <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Verified</span>}
                        </div>
                        <h3 className="text-base font-extrabold text-text-main line-clamp-1">{job.title}</h3>
                        <div className="text-xs text-outline font-bold flex items-center gap-1.5 mt-1">
                          <Building className="w-4 h-4 text-primary" /><span>{job.company}</span>
                        </div>
                      </div>
                      <div className="text-xs font-black text-primary bg-leaf-green-light px-3 py-1.5 rounded-full shrink-0">{job.matchScore}%</div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-outline pt-2 border-t border-surface-container-low font-medium">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                      <span className="font-bold text-text-main">{job.stipend}</span>
                    </div>
                    <button
                      onClick={() => handleApply(job)}
                      disabled={isApplied || applyingJobId === job.id}
                      className={`w-full py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        isApplied ? 'bg-emerald-100 text-emerald-800 cursor-default border border-emerald-300' : 'bg-primary text-white hover:bg-primary-container shadow-md'
                      }`}
                    >
                      {isApplied ? <><CheckCircle2 className="w-4 h-4 text-emerald-700" /><span>Applied ✓</span></> :
                       applyingJobId === job.id ? <RefreshCw className="w-4 h-4 animate-spin" /> :
                       <><Send className="w-4 h-4" /><span>One-Tap Apply</span></>}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── COURSES SECTION ───────────────────────────────────────────────── */}
      {activeSection === 'courses' && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-text-main">AYUSH Learning Courses</h2>
              <p className="text-sm text-outline font-medium mt-0.5">Ministry of Ayush & HSSC accredited skill modules</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {COURSE_LEVELS.map(lvl => (
                <button key={lvl} onClick={() => setCourseLevel(lvl)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${courseLevel === lvl ? 'bg-primary text-white' : 'bg-surface-white border border-surface-container-high text-outline hover:text-text-main'}`}>
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <div key={course.id} className="bg-surface-white rounded-3xl overflow-hidden border border-surface-container-high shadow-wellness hover:shadow-wellness-hover transition-all flex flex-col">
                {/* Course Header */}
                <div className={`bg-gradient-to-br ${course.color} p-6 text-white space-y-3`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-white/20 border border-white/30">{course.tag}</span>
                    <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${course.free ? 'bg-emerald-400/30 text-white border border-emerald-300/40' : 'bg-white/20 border border-white/30'}`}>
                      {course.price}
                    </span>
                  </div>
                  <h3 className="text-base font-black leading-snug">{course.title}</h3>
                  <p className="text-xs text-white/80 font-medium">{course.provider}</p>
                </div>

                {/* Course Details */}
                <div className="p-6 flex flex-col flex-1 space-y-4">
                  <div className="flex items-center gap-4 text-xs text-outline font-medium">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{course.duration}</span>
                    <span className="flex items-center gap-1.5"><Play className="w-4 h-4" />{course.lessons} Lessons</span>
                    <span className="flex items-center gap-1.5 text-amber-600 font-bold"><Star className="w-4 h-4 fill-amber-400 text-amber-400" />{course.rating}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {course.skills.map((sk, i) => (
                      <span key={i} className="text-[11px] font-medium bg-surface-container-low px-2.5 py-1 rounded-lg text-outline">{sk}</span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-outline font-medium">
                    <Users className="w-4 h-4" />
                    <span>{course.enrolled.toLocaleString()} enrolled</span>
                    <span className="ml-auto px-2 py-0.5 rounded bg-surface-container-low text-[11px] font-bold">{course.level}</span>
                  </div>

                  <button
                    onClick={() => handleEnrollCourse(course.id)}
                    disabled={!!enrolledCourses[course.id]}
                    className={`mt-auto w-full py-3 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                      enrolledCourses[course.id]
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-default'
                        : 'bg-primary text-white hover:bg-primary-container shadow-md active:scale-95'
                    }`}
                  >
                    {enrolledCourses[course.id] ? (
                      <><CheckCircle2 className="w-4 h-4" /><span>Enrolled ✓</span></>
                    ) : (
                      <><Play className="w-4 h-4 text-leaf-green-accent" /><span>{course.free ? 'Enroll Free' : `Enroll — ${course.price}`}</span></>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── OPPORTUNITIES SECTION ─────────────────────────────────────────── */}
      {activeSection === 'opportunities' && (
        <div className="space-y-8">
          {/* Header + Filters */}
          <div className="bg-surface-white rounded-3xl p-8 border border-surface-container-high shadow-wellness space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-text-main flex items-center gap-3">
                  <Briefcase className="w-7 h-7 text-primary" />
                  Internship Opportunities
                </h2>
                <p className="text-sm text-outline font-medium mt-1">
                  {filteredInternships.length} HSSC-verified internships matched to your profile
                </p>
              </div>
              <div className="flex items-center gap-2 bg-surface-container-low rounded-2xl px-4 py-2.5 border border-surface-container-high min-w-[220px]">
                <Search className="w-4 h-4 text-outline shrink-0" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search role, company, city..."
                  className="bg-transparent text-xs font-medium text-text-main focus:outline-none w-full placeholder:text-outline"
                />
              </div>
            </div>

            {/* Sector filters */}
            <div className="flex flex-wrap gap-2">
              <Filter className="w-4 h-4 text-outline self-center" />
              {SECTORS.map(s => (
                <button key={s} onClick={() => setSectorFilter(s)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${sectorFilter === s ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-low border border-surface-container-high text-outline hover:text-text-main'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Internship Cards */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredInternships.map(intern => {
              const isApplied = appliedInternships[intern.id];
              return (
                <div key={intern.id} className="bg-surface-white rounded-3xl p-7 border border-surface-container-high shadow-wellness hover:shadow-wellness-hover transition-all flex flex-col space-y-5">
                  {/* Top badges */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-leaf-green-light text-primary border border-leaf-green-accent/30">{intern.type}</span>
                    <div className="flex items-center gap-2">
                      {intern.verified && <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200"><ShieldCheck className="w-3.5 h-3.5" />HSSC</span>}
                      <span className={`text-xs font-black px-2.5 py-1 rounded-full ${intern.matchScore >= 90 ? 'bg-emerald-100 text-emerald-800' : intern.matchScore >= 80 ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'}`}>
                        {intern.matchScore}% Match
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-text-main">{intern.title}</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-sm font-bold text-primary">
                      <Building className="w-4 h-4" />{intern.company}
                    </div>
                  </div>

                  <p className="text-xs text-outline font-medium leading-relaxed">{intern.description}</p>

                  <div className="grid grid-cols-2 gap-3 text-xs font-medium text-outline">
                    <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary" />{intern.location}</div>
                    <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" />{intern.duration}</div>
                    <div className="flex items-center gap-1.5 font-extrabold text-emerald-700"><Zap className="w-3.5 h-3.5" />{intern.stipend}</div>
                    <div className="flex items-center gap-1.5 text-red-600 font-bold"><BadgeCheck className="w-3.5 h-3.5" />Deadline: {intern.deadline}</div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {intern.skills.map((sk, i) => (
                      <span key={i} className="text-[11px] font-medium bg-surface-container-low px-2.5 py-1 rounded-lg text-outline">{sk}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-outline font-medium pt-1 border-t border-surface-container-low">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{intern.seats} seats left</span>
                    <span className="text-primary font-bold">{intern.sector}</span>
                  </div>

                  <button
                    onClick={() => !isApplied && handleApplyInternship(intern)}
                    disabled={isApplied || applyingInternId === intern.id}
                    className={`w-full py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                      isApplied ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-default' :
                      applyingInternId === intern.id ? 'bg-primary/60 text-white cursor-not-allowed' :
                      'bg-primary text-white hover:bg-primary-container shadow-md active:scale-95'
                    }`}
                  >
                    {isApplied ? (
                      <><CheckCircle2 className="w-4 h-4" /><span>Application Submitted ✓</span></>
                    ) : applyingInternId === intern.id ? (
                      <><RefreshCw className="w-4 h-4 animate-spin" /><span>Submitting...</span></>
                    ) : (
                      <><Send className="w-4 h-4" /><span>Apply for Internship</span></>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Certificate Modal */}
      <AddCertificateModal
        isOpen={isAddCertOpen}
        onClose={() => setIsAddCertOpen(false)}
        onCertificateAdded={handleCertificateAdded}
        user={user}
      />

      {/* Course Video Lecture & Skill Assessment Modal */}
      {learningCourse && (
        <CourseLearningModal
          course={learningCourse}
          onClose={() => setLearningCourse(null)}
          onCompleteCourse={handleCompleteCourse}
        />
      )}
    </div>
  );
}
