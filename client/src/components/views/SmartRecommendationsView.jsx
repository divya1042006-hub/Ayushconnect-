import React, { useState, useMemo } from 'react';
import {
  Sparkles, Brain, Target, TrendingUp, CheckCircle2, Clock, AlertCircle,
  BookOpen, Briefcase, Award, Star, Users, Zap, ChevronRight, Play,
  MessageSquare, Send, BadgeCheck, ShieldCheck, RefreshCw, Building,
  MapPin, Gift, ArrowUpRight, Lightbulb, Bot, BarChart3, LayoutDashboard,
  QrCode, Share2, Bookmark, Copy, ExternalLink, X, Filter, Upload, FileText, Compass, Check
} from 'lucide-react';
import CourseLearningModal from '../common/CourseLearningModal';

// ── AI Matching Engine ──────────────────────────────────────────────────────
// Computes relevance score between student's skill gaps and course/internship
function computeMatch(studentGaps, requiredSkills) {
  if (!requiredSkills || requiredSkills.length === 0) return 60;
  const gapLower = studentGaps.map(g => g.toLowerCase());
  const matched = requiredSkills.filter(s =>
    gapLower.some(g => s.toLowerCase().includes(g.split(' ')[0]) || g.includes(s.toLowerCase().split(' ')[0]))
  );
  const base = Math.round((matched.length / requiredSkills.length) * 100);
  return Math.min(99, Math.max(55, base + Math.floor(Math.random() * 8)));
}

// ── Course Database ─────────────────────────────────────────────────────────
const COURSES_DB = [
  {
    id: 'c1', title: 'Panchakarma Therapy: Complete Clinical Protocol',
    provider: 'NIA Jaipur (NCISM Certified)', level: 'Intermediate',
    platform: 'SWAYAM / NPTEL',
    externalUrl: 'https://swayam.gov.in/nc_details/NPTEL',
    duration: '6 Weeks', rating: 4.9, lessons: 24,
    skills: ['Panchakarma Procedure Execution', 'Abhyanga & Swedana', 'Kati/Janu Basti'],
    color: 'from-emerald-600 to-teal-700', free: false, price: '₹1,200',
    certificate: 'HSSC NOS Certificate',
    fixesGaps: ['Panchakarma Procedure Execution', 'Abhyanga & Swedana'],
  },
  {
    id: 'c2', title: 'Ayurvedic Pharmacology & Dravyaguna',
    provider: 'AIIA New Delhi (MoA Approved)', level: 'Foundation',
    platform: 'Ministry of Ayush e-Learning',
    externalUrl: 'https://ayush.gov.in/',
    duration: '4 Weeks', rating: 4.8, lessons: 18,
    skills: ['Ayurvedic Herbal Kashaya Preparation', 'Herbal Identification'],
    color: 'from-amber-600 to-orange-700', free: true, price: 'Free',
    certificate: 'Ministry of Ayush Certificate',
    fixesGaps: ['Ayurvedic Herbal Kashaya Preparation'],
  },
  {
    id: 'c3', title: 'Clinical Yoga & Naturopathy for Practitioners',
    provider: 'Morarji Desai National Institute', level: 'Beginner',
    platform: 'MDNIY Digital Academy',
    externalUrl: 'http://www.yogamdniy.nic.in/',
    duration: '3 Weeks', rating: 4.7, lessons: 12,
    skills: ['Therapeutic Yoga', 'Pranayama Protocols', 'Patient Assessment'],
    color: 'from-purple-600 to-indigo-700', free: true, price: 'Free',
    certificate: 'Ministry of Yoga Certificate',
    fixesGaps: ['Therapeutic Yoga', 'Patient Assessment'],
  },
  {
    id: 'c4', title: 'Patient Vital Signs & Clinical Documentation',
    provider: 'AyushConnect Academy (HSSC Partner)', level: 'Foundation',
    platform: 'Coursera Ayush Division',
    externalUrl: 'https://www.coursera.org/browse/health',
    duration: '2 Weeks', rating: 4.8, lessons: 10,
    skills: ['Patient Vital Signs Monitoring', 'Clinical Documentation & Logging'],
    color: 'from-sky-600 to-cyan-700', free: true, price: 'Free',
    certificate: 'AyushConnect NOS Certificate',
    fixesGaps: ['Patient Vital Signs Monitoring', 'Clinical Documentation & Logging'],
  },
  {
    id: 'c5', title: 'AI & Digital Health Tools for Ayurveda',
    provider: 'AyushConnect Academy (HSSC Partner)', level: 'Intermediate',
    platform: 'edX HealthTech Portal',
    externalUrl: 'https://www.edx.org/school/mitx',
    duration: '5 Weeks', rating: 4.9, lessons: 20,
    skills: ['AI Diagnostics', 'Tele-Ayurveda', 'Digital Documentation'],
    color: 'from-rose-600 to-pink-700', free: false, price: '₹800',
    certificate: 'Industry Digital Health Certificate',
    fixesGaps: ['Digital Documentation', 'Tele-Ayurveda'],
  },
  {
    id: 'c6', title: 'Sterilization & Aseptic Technique in Ayurveda',
    provider: 'BHU Institute of Medical Sciences', level: 'Foundation',
    platform: 'BHU IMS Open Learning',
    externalUrl: 'https://www.bhu.ac.in/ims/',
    duration: '2 Weeks', rating: 4.6, lessons: 8,
    skills: ['Sterilization & Aseptic Technique', 'Infection Control'],
    color: 'from-teal-600 to-emerald-700', free: true, price: 'Free',
    certificate: 'BHU Clinical Safety Certificate',
    fixesGaps: ['Sterilization & Aseptic Technique'],
  },
];

// ── Internship Database ─────────────────────────────────────────────────────
const INTERNSHIPS_DB = [
  {
    id: 'i1', title: 'Panchakarma Therapy Intern',
    company: 'Patanjali Wellness Hub', location: 'Haridwar, UK',
    stipend: '₹12,000/mo', duration: '3 Months', type: 'Clinical', program: 'BAMS',
    skills: ['Panchakarma Procedure Execution', 'Abhyanga & Swedana', 'Patient Vitals'],
    deadline: 'Sep 15, 2026', seats: 4,
  },
  {
    id: 'i2', title: 'Ayurvedic Pharmacist Trainee',
    company: 'Dabur Ayurvedic R&D', location: 'Noida, UP',
    stipend: '₹15,000/mo', duration: '6 Months', type: 'Industry R&D', program: 'BAMS',
    skills: ['Ayurvedic Herbal Kashaya Preparation', 'GMP Standards', 'QC Testing'],
    deadline: 'Sep 30, 2026', seats: 8,
  },
  {
    id: 'i3', title: 'Homeopathic Clinical Research Intern',
    company: 'SBL Homeopathy Research Centre', location: 'Kolkata, WB',
    stipend: '₹14,000/mo', duration: '4 Months', type: 'Clinical', program: 'BHMS',
    skills: ['Repertoirization', 'Materia Medica Analysis', 'Patient Case History'],
    deadline: 'Sep 28, 2026', seats: 6,
  },
  {
    id: 'i4', title: 'Naturopathy & Hydrotherapy Specialist Intern',
    company: 'Jindal Naturecure Institute', location: 'Bangalore, KA',
    stipend: '₹13,500/mo', duration: '3 Months', type: 'Yoga & Naturopathy', program: 'BNYS',
    skills: ['Therapeutic Yoga', 'Mud & Hydrotherapy Protocols', 'Dietary Counselling'],
    deadline: 'Oct 5, 2026', seats: 10,
  },
  {
    id: 'i5', title: 'Tele-Ayurveda Consultation Assistant',
    company: 'Practo Ayush Division', location: 'Remote',
    stipend: '₹10,000/mo', duration: '4 Months', type: 'Digital Health', program: 'BAMS',
    skills: ['Patient Assessment', 'Digital Documentation', 'Tele-Ayurveda'],
    deadline: 'Oct 5, 2026', seats: 20,
  },
  {
    id: 'i6', title: 'Unani Herbal Formulations Research Trainee',
    company: 'Hamdard Laboratories R&D', location: 'New Delhi',
    stipend: '₹16,000/mo', duration: '6 Months', type: 'Research', program: 'BUMS',
    skills: ['Kushta Preparation', 'Ilmul Advia Testing', 'Quality Standardization'],
    deadline: 'Oct 12, 2026', seats: 5,
  },
  {
    id: 'i7', title: 'Siddha Medicine & Varmam Therapy Fellow',
    company: 'National Institute of Siddha (NIS)', location: 'Chennai, TN',
    stipend: '₹17,000/mo', duration: '5 Months', type: 'Clinical', program: 'BSMS',
    skills: ['Varmam Key Point Therapy', 'Gunapadam Formulation', 'Pulse Diagnosis (Nadi)'],
    deadline: 'Oct 18, 2026', seats: 4,
  },
];

// ── Mentor Data ─────────────────────────────────────────────────────────────
const MENTORS = [
  {
    id: 'm1', name: 'Dr. Priya Nambiar', role: 'Panchakarma Specialist',
    org: 'NIA Jaipur', avatar: 'PN', rating: 4.9, sessions: 142,
    expertise: ['Panchakarma Procedure Execution', 'Abhyanga & Swedana'],
    nextSlot: 'Sep 2, 2026 at 10:00 AM',
  },
  {
    id: 'm2', name: 'Dr. Suresh Patil', role: 'Dravyaguna Expert',
    org: 'AIIA New Delhi', avatar: 'SP', rating: 4.8, sessions: 98,
    expertise: ['Ayurvedic Herbal Kashaya Preparation', 'Pharmacology'],
    nextSlot: 'Sep 3, 2026 at 2:00 PM',
  },
  {
    id: 'm3', name: 'Dr. Kavita Sharma', role: 'Clinical Yogacharya',
    org: 'MDNIY', avatar: 'KS', rating: 4.7, sessions: 217,
    expertise: ['Therapeutic Yoga', 'Patient Assessment'],
    nextSlot: 'Sep 4, 2026 at 11:00 AM',
  },
];

export default function SmartRecommendationsView({ user }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [enrolledCourses, setEnrolledCourses] = useState({});
  const [appliedInternships, setAppliedInternships] = useState({});
  const [applyingId, setApplyingId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [mentorMsg, setMentorMsg] = useState({});
  const [msgInput, setMsgInput] = useState('');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [bookedSessions, setBookedSessions] = useState({});
  const [activeCertModal, setActiveCertModal] = useState(null);
  const [filterPresets, setFilterPresets] = useState([
    { name: 'Critical Gap Fixes', filter: 'gap' },
    { name: 'Free Certifications', filter: 'free' },
    { name: 'Panchakarma Modules', filter: 'panchakarma' },
  ]);
  const [activePreset, setActivePreset] = useState(null);
  const [newPresetName, setNewPresetName] = useState('');
  const [progress, setProgress] = useState({});

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleShareLinkedIn = (certTitle, certId) => {
    const shareUrl = `http://localhost:3000/verify-certificate?id=${certId || 'HSSC-NOS-2026-8842'}`;
    const text = `I am proud to share that I earned my official HSSC National Occupational Standards Certificate: "${certTitle}" via AyushConnect! Verify credential: ${shareUrl}`;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedInUrl, '_blank');
    showToast('🚀 Share to LinkedIn launched!');
  };

  const handleSavePreset = () => {
    if (!newPresetName.trim()) return;
    setFilterPresets(prev => [...prev, { name: newPresetName.trim(), filter: newPresetName.toLowerCase() }]);
    setNewPresetName('');
    showToast('🔖 Saved filter preset successfully!');
  };

  // ── Resume Personalization Engine ──────────────────────────────────────
  const [resumeParsedSkills, setResumeParsedSkills] = useState(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeFileName, setResumeFileName] = useState('');

  const hasResume = Boolean(resumeParsedSkills);

  const defaultUnassessedSkills = [
    { name: 'Panchakarma Procedure Execution', score: 0, target: 90, status: 'unassessed' },
    { name: 'Abhyanga & Swedana Technique', score: 0, target: 90, status: 'unassessed' },
    { name: 'Patient Vital Signs & Logging', score: 0, target: 90, status: 'unassessed' },
    { name: 'Ayurvedic Herbal Kashaya Prep', score: 0, target: 90, status: 'unassessed' },
    { name: 'Sterilization & Aseptic Technique', score: 0, target: 90, status: 'unassessed' },
  ];

  const studentSkills = hasResume ? resumeParsedSkills : defaultUnassessedSkills;

  const gapSkills = hasResume ? studentSkills.filter(s => s && s.status === 'gap').map(s => s.name) : [];
  const developingSkills = hasResume ? studentSkills.filter(s => s && s.status === 'developing').map(s => s.name) : [];
  const strongSkills = hasResume ? studentSkills.filter(s => s && s.status === 'strong').map(s => s.name) : [];
  const allWeakSkills = [...gapSkills, ...developingSkills];

  // AI-ranked courses: courses that fix gaps rank highest
  const rankedCourses = useMemo(() => {
    return COURSES_DB.map(c => {
      const gapFix = hasResume ? (c.fixesGaps?.filter(g => allWeakSkills.includes(g)).length || 0) : 0;
      const aiScore = hasResume ? Math.min(99, 65 + gapFix * 16) : 0;
      const urgency = !hasResume ? 'Awaiting Resume' :
                      c.fixesGaps?.some(g => gapSkills.includes(g)) ? 'Critical Gap Fix' :
                      c.fixesGaps?.some(g => developingSkills.includes(g)) ? 'Skill Booster' : 'Enrichment';
      return { ...c, aiScore, urgency };
    }).sort((a, b) => b.aiScore - a.aiScore);
  }, [hasResume, resumeParsedSkills]);

  const [programFilter, setProgramFilter] = useState('All');
  const [showAppTrackerModal, setShowAppTrackerModal] = useState(false);

  const completedCourseCount = Object.values(progress).filter(p => p === 100).length;
  const liveReadinessScore = hasResume
    ? Math.min(98, Math.max(70, 70 + completedCourseCount * 8 + Object.keys(enrolledCourses).length * 3))
    : 0;

  const handleQuickResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reject image files explicitly
    const isImage = /\.(png|jpe?g|gif|webp|svg|bmp|heic|ico)$/i.test(file.name) || (file.type && file.type.startsWith('image/'));
    if (isImage) {
      showToast('❌ Image files cannot be parsed as resumes. Please upload a PDF, DOCX, DOC, or TXT CV.');
      e.target.value = '';
      return;
    }

    // Strict document check
    const allowed = /\.(pdf|txt|doc|docx)$/i;
    if (!allowed.test(file.name)) {
      showToast('❌ Unsupported format. Please upload a valid Resume/CV (.PDF, .DOCX, .DOC, .TXT).');
      e.target.value = '';
      return;
    }

    setIsUploadingResume(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        let text = '';
        if (file.type === 'text/plain') {
          text = event.target.result || '';
        } else {
          try {
            const bytes = new Uint8Array(event.target.result);
            const textDecoder = new TextDecoder('latin1');
            const fullStr = textDecoder.decode(bytes);

            // If PDF is just an image stream
            const hasTextOperators = /\b(BT|ET|Tj|TJ|ToUnicode|Font)\b/.test(fullStr);
            const hasImageOnly = /\b(\/Image|\/DCTDecode|\/JPXDecode)\b/.test(fullStr) && !hasTextOperators;

            if (hasImageOnly) {
              text = '';
            } else {
              for (let i = 0; i < bytes.length; i++) {
                const b = bytes[i];
                if (b > 31 && b < 127) text += String.fromCharCode(b);
                else if (b === 10 || b === 13) text += '\n';
              }
              const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 3 && /[a-zA-Z]/.test(l));
              text = lines.join('\n');
            }
          } catch {
            text = '';
          }
        }

        const cleanText = (text || '').trim();
        const resumeKeywordCheck = /\b(resume|cv|curriculum\s+vitae|education|qualification|experience|internship|skills|bams|bhms|bnys|bums|bsms|ayurveda|doctor|clinical|hospital|university)\b/i;
        
        if (!cleanText || cleanText.length < 35 || !resumeKeywordCheck.test(cleanText)) {
          showToast(`❌ Invalid Document: "${file.name}" is not a recognized CV/Resume. Image PDFs and non-resume files are not supported.`);
          setIsUploadingResume(false);
          e.target.value = '';
          return;
        }

        setResumeFileName(file.name);

        try {
          const res = await fetch(`${API_BASE}/api/ai/parse-resume`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resumeText: cleanText })
          });
          if (res.ok) {
            const data = await res.json();
            if (data?.success && data.extractedData) {
              const extracted = data.extractedData.extractedSkills || [];
              if (extracted.length > 0) {
                const formatted = extracted.map(s => ({
                  name: s, score: 85, target: 90, status: 'strong'
                }));
                (data.extractedData.skillGaps || []).filter(g => g.isGap).forEach(g => {
                  formatted.push({ name: g.skill, score: g.proficiencyScore, target: 90, status: 'gap' });
                });
                setResumeParsedSkills(formatted);
                showToast(`📄 Parsed "${file.name}"! Recommendations re-ranked to your exact skill gaps.`);
                setIsUploadingResume(false);
                return;
              }
            }
          }
        } catch (_) {}

        // Local keyword-based skill extraction fallback
        const lower = cleanText.toLowerCase();
        const detected = [];
        const AYUSH_SKILL_KEYWORDS = {
          'panchakarma': 'Panchakarma Procedure Execution',
          'abhyanga': 'Abhyanga & Swedana',
          'swedana': 'Abhyanga & Swedana',
          'vital signs': 'Patient Vital Signs Monitoring',
          'pulse diagnosis': 'Nadi Pariksha (Pulse Diagnostics)',
          'nadi': 'Nadi Pariksha (Pulse Diagnostics)',
          'kashaya': 'Ayurvedic Herbal Kashaya Preparation',
          'dravya': 'Ayurvedic Herbal Kashaya Preparation',
          'tele-ayurveda': 'Tele-Ayurveda Protocols',
          'telemedicine': 'Tele-Ayurveda Protocols',
          'yoga': 'Therapeutic Yoga & Pranayama',
          'pranayama': 'Therapeutic Yoga & Pranayama',
          'basti': 'Kati/Janu Basti Setup',
          'documentation': 'Clinical Documentation & Logging',
          'shilajit': 'Rasa Shastra & Bhasma Standardization',
          'bhasma': 'Rasa Shastra & Bhasma Standardization',
          'prakriti': 'Prakriti-Based Diet Planning',
          'marma': 'Marma Therapy Execution',
          'leech': 'Jalaukavacharana (Leech Therapy)'
        };

        Object.entries(AYUSH_SKILL_KEYWORDS).forEach(([kw, skill]) => {
          if (lower.includes(kw) && !detected.some(d => d.name === skill)) {
            detected.push({ name: skill, score: 85, target: 90, status: 'strong' });
          }
        });

        if (detected.length === 0) {
          showToast(`⚠️ No recognized Ayush clinical skills found in "${file.name}". Showing default recommendations.`);
          setResumeParsedSkills([]);
          setIsUploadingResume(false);
          return;
        }

        setResumeParsedSkills(detected);
        showToast(`📄 Resume personalized! Detected ${detected.length} skills in ${file.name}`);
        setIsUploadingResume(false);
      };

      if (file.type === 'text/plain') reader.readAsText(file);
      else reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error(err);
      setIsUploadingResume(false);
      showToast('⚠️ Error processing resume file.');
    }
  };

  // AI-ranked internships based on skill match and program degree filter
  const rankedInternships = useMemo(() => {
    return INTERNSHIPS_DB.filter(i => programFilter === 'All' || i.program === programFilter)
      .map(i => {
        const matchScore = hasResume ? computeMatch(allWeakSkills, i.skills) : 0;
        const overlap = hasResume ? i.skills.filter(s => studentSkills.some(ss => ss.name === s && ss.status === 'strong')).length : 0;
        return { ...i, matchScore, overlap };
      }).sort((a, b) => b.matchScore - a.matchScore);
  }, [hasResume, programFilter, resumeParsedSkills]);

  const [learningCourse, setLearningCourse] = useState(null);

  const handleEnroll = (courseId) => {
    const targetCourse = COURSES_DB.find(c => c.id === courseId) || { id: courseId, title: 'AYUSH Clinical Certification Module' };
    setEnrolledCourses(prev => ({ ...prev, [courseId]: true }));
    setProgress(prev => ({ ...prev, [courseId]: prev[courseId] || 25 }));
    setLearningCourse(targetCourse);
    showToast('🎓 Enrolled! Video lecture demo & Skill Assessment quiz opened.');
  };

  const handleCompleteCourse = (courseId, score) => {
    setProgress(prev => ({ ...prev, [courseId]: 100 }));
    setEnrolledCourses(prev => ({ ...prev, [courseId]: true }));
    showToast(`🏆 Assessment passed with ${score}%! Verified to student profile.`);
  };

  const handleApplyInternship = async (intern) => {
    setApplyingId(intern.id);
    await new Promise(r => setTimeout(r, 900));
    setAppliedInternships(prev => ({ ...prev, [intern.id]: true }));
    setApplyingId(null);
    showToast(`🚀 Applied to "${intern.title}" at ${intern.company}!`);
  };

  const handleBookMentor = (mentorId) => {
    setBookedSessions(prev => ({ ...prev, [mentorId]: true }));
    showToast('📅 Mentor session booked! You\'ll receive a confirmation email.');
  };

  const handleSendMsg = (mentorId) => {
    if (!msgInput.trim()) return;
    setMentorMsg(prev => ({
      ...prev,
      [mentorId]: [...(prev[mentorId] || []), { from: 'me', text: msgInput, time: new Date().toLocaleTimeString() }]
    }));
    setMsgInput('');
    // Simulate mentor reply after 1.5s
    setTimeout(() => {
      setMentorMsg(prev => ({
        ...prev,
        [mentorId]: [...(prev[mentorId] || []), {
          from: 'mentor',
          text: 'Thank you for your message! I\'ll review your skill profile and get back to you before our next session.',
          time: new Date().toLocaleTimeString()
        }]
      }));
    }, 1500);
  };

  const sections = [
    { id: 'overview', label: 'AI Overview', icon: <Bot className="w-4 h-4" /> },
    { id: 'courses', label: 'Smart Courses', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'internships', label: 'AI Internship Matches', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'mentors', label: 'Mentor Tracking', icon: <Users className="w-4 h-4" /> },
    { id: 'progress', label: 'My Progress', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-8 pb-16 font-manrope">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl bg-primary text-white font-extrabold text-sm shadow-2xl flex items-center gap-3 animate-pulse">
          <Sparkles className="w-5 h-5" />{toastMsg}
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-primary text-white rounded-3xl p-8 md:p-12 shadow-wellness relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-white/10 text-purple-200 border border-purple-300/30 text-xs font-bold flex items-center gap-2">
                <Bot className="w-4 h-4" /> AI-Powered Recommendation Engine
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Smart Learning & Opportunity Hub
            </h1>
            <p className="text-sm text-white/80 font-medium max-w-xl">
              Our AI analyzes your HSSC skill profile and <strong className="text-purple-200">auto-recommends courses, internships, and mentors</strong> to close your skill gaps fastest.
            </p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/20">
              <div className="flex justify-center mb-1 text-emerald-400"><ShieldCheck className="w-5 h-5" /></div>
              <div className="text-2xl font-black text-emerald-300">{liveReadinessScore}%</div>
              <div className="text-[11px] text-white/70 font-medium">Live Readiness Score</div>
            </div>
            {[
              { label: 'Gap Skills', value: gapSkills.length, color: 'text-red-400', icon: <AlertCircle className="w-5 h-5" /> },
              { label: 'Developing', value: developingSkills.length, color: 'text-amber-400', icon: <TrendingUp className="w-5 h-5" /> },
              { label: 'Strong', value: studentSkills.filter(s => s.status === 'strong').length, color: 'text-emerald-400', icon: <CheckCircle2 className="w-5 h-5" /> },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-2xl p-4 text-center border border-white/20">
                <div className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</div>
                <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-[11px] text-white/70 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resume Skill Gap Personalizer Banner */}
      <div className="bg-surface-white rounded-3xl p-5 sm:p-6 border border-surface-container-high shadow-wellness flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="p-3 rounded-2xl bg-leaf-green-light text-primary shrink-0 border border-leaf-green-accent/30">
            <FileText className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-primary">
                {resumeFileName ? `Personalized via "${resumeFileName}"` : 'Personalize Recommendations with Your Resume'}
              </h3>
              {resumeParsedSkills && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-200">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-outline font-medium truncate">
              {resumeParsedSkills
                ? `${studentSkills.length} competencies extracted. Courses and internships re-ranked.`
                : 'Upload PDF / DOCX to automatically align all course and job recommendations to your exact resume skill gaps.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {resumeParsedSkills && (
            <button
              onClick={() => {
                setResumeParsedSkills(null);
                setResumeFileName('');
                showToast('Reset to standard profile.');
              }}
              className="px-3 py-2 rounded-xl text-outline hover:text-red-600 hover:bg-red-50 text-xs font-bold transition-all"
            >
              Reset
            </button>
          )}
          <label className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-black transition-all cursor-pointer flex items-center gap-2 shadow-sm">
            {isUploadingResume ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            <span>{isUploadingResume ? 'Parsing...' : resumeFileName ? 'Change Resume' : 'Upload Resume'}</span>
            <input
              type="file"
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleQuickResumeUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 bg-surface-white rounded-2xl p-2 border border-surface-container-high shadow-sm">
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              activeSection === s.id ? 'bg-primary text-white shadow-md' : 'text-outline hover:text-text-main hover:bg-surface-container-low'
            }`}>
            {s.icon}{s.label}
          </button>
        ))}
      </div>

      {/* ── AI OVERVIEW ────────────────────────────────────────────────────── */}
      {activeSection === 'overview' && (
        <div className="space-y-8">
          {/* Gap Analysis */}
          <div className="bg-surface-white rounded-3xl p-8 border border-surface-container-high shadow-wellness space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-red-100 text-red-700"><Brain className="w-6 h-6" /></div>
              <div>
                <h2 className="text-xl font-extrabold text-text-main">AI Skill Gap Analysis</h2>
                <p className="text-xs text-outline font-medium">Based on your HSSC NOS assessment vs industry benchmarks</p>
              </div>
            </div>
            <div className="space-y-4">
              {!hasResume ? (
                <div className="p-8 rounded-2xl bg-surface-container-low border border-dashed border-surface-container-high text-center space-y-3">
                  <Brain className="w-10 h-10 text-outline mx-auto" />
                  <div className="text-sm font-black text-text-main">No Resume Uploaded Yet (0% Initialized)</div>
                  <p className="text-xs text-outline font-medium max-w-md mx-auto">
                    Upload your resume in the panel above to calculate your live HSSC skill proficiencies and diagnostic gap percentages.
                  </p>
                </div>
              ) : (
                studentSkills.map((skill, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-2 text-sm text-text-main">
                        {skill.status === 'strong' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                        {skill.status === 'developing' && <Clock className="w-5 h-5 text-amber-500" />}
                        {skill.status === 'gap' && <AlertCircle className="w-5 h-5 text-red-500" />}
                        {skill.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-outline">Target: {skill.target}%</span>
                        <span className={`px-3 py-1 rounded-lg font-black text-xs ${
                          skill.status === 'strong' ? 'bg-emerald-100 text-emerald-800' :
                          skill.status === 'developing' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>{skill.score}%</span>
                      </div>
                    </div>
                    <div className="relative w-full h-3 bg-surface-container-low rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ${
                        skill.status === 'strong' ? 'bg-gradient-to-r from-emerald-500 to-primary' :
                        skill.status === 'developing' ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
                        'bg-gradient-to-r from-red-400 to-red-600'
                      }`} style={{ width: `${skill.score}%` }} />
                      <div className="absolute top-0 h-full w-px bg-gray-400/60" style={{ left: `${skill.target}%` }} />
                    </div>
                    {skill.status !== 'strong' && (
                      <div className="text-[11px] text-outline font-medium flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                        <span>AI suggests: <button onClick={() => setActiveSection('courses')} className="text-primary font-bold underline">
                          {rankedCourses.find(c => c.fixesGaps?.includes(skill.name))?.title || 'Enroll in a targeted module'}
                        </button></span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI Quick Recommendations Panel */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <BookOpen className="w-6 h-6" />, color: 'bg-emerald-100 text-emerald-700',
                title: 'Top Course Pick', badge: hasResume ? 'AI Recommended' : 'Awaiting Resume',
                content: rankedCourses[0]?.title,
                sub: rankedCourses[0]?.provider,
                action: () => setActiveSection('courses'), btnLabel: 'View Courses'
              },
              {
                icon: <Briefcase className="w-6 h-6" />, color: 'bg-sky-100 text-sky-700',
                title: 'Best Internship Match', badge: hasResume ? `${rankedInternships[0]?.matchScore}% Match` : 'Awaiting Resume',
                content: rankedInternships[0]?.title,
                sub: rankedInternships[0]?.company + ' • ' + rankedInternships[0]?.location,
                action: () => setActiveSection('internships'), btnLabel: 'View Matches'
              },
              {
                icon: <Users className="w-6 h-6" />, color: 'bg-purple-100 text-purple-700',
                title: 'Recommended Mentor', badge: `⭐ ${MENTORS[0]?.rating}`,
                content: MENTORS[0]?.name,
                sub: MENTORS[0]?.role + ' • ' + MENTORS[0]?.org,
                action: () => setActiveSection('mentors'), btnLabel: 'Connect'
              },
            ].map((card, i) => (
              <div key={i} className="bg-surface-white rounded-3xl p-7 border border-surface-container-high shadow-wellness space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl w-fit ${card.color}`}>{card.icon}</div>
                  <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-leaf-green-light text-primary">{card.badge}</span>
                </div>
                <div>
                  <div className="text-xs text-outline font-bold uppercase tracking-wider">{card.title}</div>
                  <div className="text-base font-extrabold text-text-main mt-1 leading-snug">{card.content}</div>
                  <div className="text-xs text-outline font-medium mt-1">{card.sub}</div>
                </div>
                <button onClick={card.action} className="w-full py-3 rounded-2xl bg-primary text-white text-xs font-extrabold hover:bg-primary-container flex items-center justify-center gap-2">
                  {card.btnLabel} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SMART COURSES ──────────────────────────────────────────────────── */}
      {activeSection === 'courses' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-black text-text-main flex items-center gap-3">
              <BookOpen className="w-7 h-7 text-primary" /> AI-Recommended Courses
            </h2>
            <p className="text-sm text-outline font-medium mt-1">
              {hasResume
                ? <>Ranked by how well they fix <strong className="text-red-600">{gapSkills.length} skill gaps</strong> in your profile</>
                : 'Upload resume above to calculate course alignment with your skill gaps (0% Initialized)'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {rankedCourses.map((course) => {
              const isEnrolled = enrolledCourses[course.id];
              const prog = progress[course.id] || 0;
              return (
                <div key={course.id} className="bg-surface-white rounded-3xl overflow-hidden border border-surface-container-high shadow-wellness hover:shadow-wellness-hover transition-all flex flex-col">
                  <div className={`bg-gradient-to-br ${course.color} p-6 text-white space-y-2`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${
                        course.urgency === 'Critical Gap Fix' ? 'bg-red-400/30 border-red-300/50 text-white' :
                        course.urgency === 'Skill Booster' ? 'bg-amber-400/30 border-amber-300/50' :
                        'bg-white/20 border-white/30'
                      }`}>{course.urgency}</span>
                      <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-white/20 border border-white/30">
                        {hasResume ? `AI ${course.aiScore}%` : 'Awaiting Resume'}
                      </span>
                    </div>
                    <h3 className="text-base font-black leading-snug">{course.title}</h3>
                    <p className="text-xs text-white/80">{course.provider}</p>
                    <div className="flex items-center gap-3 text-xs text-white/80 font-medium">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{course.duration}</span>
                      <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />{course.rating}</span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1 space-y-4">
                    {isEnrolled && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-text-main">
                          <span>Your Progress</span><span>{prog}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-surface-container-low rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-primary rounded-full transition-all" style={{ width: `${prog}%` }} />
                        </div>
                        {prog === 100 && (
                          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-extrabold">
                            <BadgeCheck className="w-4 h-4" /> Certificate Earned: {course.certificate}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="text-[11px] font-extrabold text-outline uppercase tracking-wider">Skills You'll Gain:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {course.skills.map((sk, i) => (
                          <span key={i} className={`text-[11px] font-medium px-2.5 py-1 rounded-lg ${
                            allWeakSkills.includes(sk) ? 'bg-red-50 text-red-700 border border-red-200 font-bold' : 'bg-surface-container-low text-outline'
                          }`}>{sk}</span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-surface-container-low gap-2 flex-wrap">
                      <div>
                        <div className="text-xs font-extrabold text-text-main">{course.free ? 'Free' : course.price}</div>
                        <a href={course.externalUrl} target="_blank" rel="noopener noreferrer"
                          className="text-[11px] font-extrabold text-primary hover:underline flex items-center gap-1 mt-0.5">
                          {course.platform} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <a href={course.externalUrl} target="_blank" rel="noopener noreferrer"
                          className="px-3 py-2 rounded-2xl bg-surface-container-low text-primary border border-surface-container-high text-[11px] font-extrabold hover:bg-leaf-green-light transition-all flex items-center gap-1">
                          Platform ↗
                        </a>
                        <button onClick={() => !isEnrolled && handleEnroll(course.id)}
                          disabled={isEnrolled}
                          className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                            isEnrolled ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-default' :
                            'bg-primary text-white hover:bg-primary-container shadow-md'
                          }`}>
                          {isEnrolled ? <><CheckCircle2 className="w-4 h-4" />Enrolled</> : <><Play className="w-4 h-4 text-leaf-green-accent" />{course.free ? 'Enroll Free' : 'Enroll'}</>}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── AI INTERNSHIP MATCHES ──────────────────────────────────────────── */}
      {activeSection === 'internships' && (
        <div className="space-y-6">
          <div className="bg-surface-white rounded-3xl p-7 border border-surface-container-high shadow-wellness space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-sky-100 text-sky-700"><Bot className="w-6 h-6" /></div>
                <div>
                  <h2 className="text-xl font-extrabold text-text-main">AI Internship Matching Engine</h2>
                  <p className="text-xs text-outline font-medium">Ranked by compatibility with your current HSSC skill profile — higher means less gap to bridge</p>
                </div>
              </div>
              <button onClick={() => setShowAppTrackerModal(true)}
                className="px-4 py-2.5 rounded-2xl bg-purple-800 text-white text-xs font-extrabold hover:bg-purple-900 shadow-md flex items-center gap-2 shrink-0">
                <Clock className="w-4 h-4" /> My Submitted Applications ({Object.keys(appliedInternships).length + 2})
              </button>
            </div>

            {/* Program-Specific AYUSH Filters */}
            <div className="space-y-2 pt-2 border-t border-surface-container-low">
              <div className="text-xs font-extrabold text-outline uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-primary" /> Filter by Qualification Program Degree:
              </div>
              <div className="flex flex-wrap gap-2">
                {['All', 'BAMS', 'BHMS', 'BNYS', 'BUMS', 'BSMS'].map(p => (
                  <button key={p} onClick={() => setProgramFilter(p)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                      programFilter === p ? 'bg-primary text-white border-primary shadow-xs' : 'bg-surface-container-low text-outline border-surface-container-high hover:bg-surface-container-high'
                    }`}>
                    {p === 'All' ? '🎓 All AYUSH Degrees' : `${p} Degree`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {allWeakSkills.map((s, i) => (
                <span key={i} className="text-[11px] font-bold px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {rankedInternships.map((intern) => {
              const isApplied = appliedInternships[intern.id];
              const isApplying = applyingId === intern.id;
              return (
                <div key={intern.id} className={`bg-surface-white rounded-3xl p-7 border shadow-wellness hover:shadow-wellness-hover transition-all flex flex-col space-y-5 ${
                  intern.matchScore >= 85 ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-surface-container-high'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${
                      !hasResume ? 'bg-surface-container-high text-outline' :
                      intern.matchScore >= 85 ? 'bg-emerald-100 text-emerald-800' :
                      intern.matchScore >= 70 ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
                    }`}>
                      {hasResume ? `${intern.matchScore}% AI Match` : 'Awaiting Resume'}
                    </span>
                    {hasResume && intern.matchScore >= 85 && (
                      <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                        <Sparkles className="w-3.5 h-3.5" /> Top Pick
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-text-main">{intern.title}</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-sm font-bold text-primary">
                      <Building className="w-4 h-4" />{intern.company}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs text-outline font-medium">
                    <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary" />{intern.location}</div>
                    <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" />{intern.duration}</div>
                    <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold"><Zap className="w-3.5 h-3.5" />{intern.stipend}</div>
                    <div className="flex items-center gap-1.5 text-red-600 font-bold"><AlertCircle className="w-3.5 h-3.5" />Due: {intern.deadline}</div>
                  </div>

                  <div>
                    <div className="text-[11px] font-extrabold text-outline uppercase tracking-wider mb-2">Skills Required:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {intern.skills.map((sk, i) => {
                        const hasSkill = studentSkills.find(s => s.name === sk && s.status === 'strong');
                        const isGap = gapSkills.includes(sk);
                        return (
                          <span key={i} className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                            hasSkill ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            isGap ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>{sk}</span>
                        );
                      })}
                    </div>
                    <div className="text-[11px] text-outline font-medium mt-2">
                      {hasResume ? `${intern.overlap}/${intern.skills.length} skills matched ✓` : `0/${intern.skills.length} skills (Upload Resume to match)`}
                    </div>
                  </div>

                  <button onClick={() => !isApplied && !isApplying && handleApplyInternship(intern)}
                    disabled={isApplied || isApplying}
                    className={`w-full py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                      isApplied ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-default' :
                      isApplying ? 'bg-primary/60 text-white cursor-not-allowed' :
                      'bg-primary text-white hover:bg-primary-container shadow-md active:scale-95'
                    }`}>
                    {isApplied ? <><CheckCircle2 className="w-4 h-4" />Applied ✓</> :
                     isApplying ? <><RefreshCw className="w-4 h-4 animate-spin" />Submitting...</> :
                     <><Send className="w-4 h-4" />Apply for Internship</>}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── MENTOR TRACKING ────────────────────────────────────────────────── */}
      {activeSection === 'mentors' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-black text-text-main flex items-center gap-3">
              <Users className="w-7 h-7 text-primary" /> Mentor Feedback & Tracking
            </h2>
            <p className="text-sm text-outline font-medium mt-1">AI-matched mentors based on your skill gaps — book a session or send a message</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Mentor List */}
            <div className="lg:col-span-1 space-y-4">
              {MENTORS.map(mentor => (
                <div key={mentor.id}
                  onClick={() => setSelectedMentor(mentor)}
                  className={`bg-surface-white rounded-3xl p-6 border shadow-wellness hover:shadow-wellness-hover cursor-pointer transition-all space-y-4 ${
                    selectedMentor?.id === mentor.id ? 'border-primary ring-2 ring-leaf-green-light' : 'border-surface-container-high'
                  }`}>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-lg shrink-0">
                      {mentor.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-text-main">{mentor.name}</div>
                      <div className="text-xs text-outline font-medium">{mentor.role}</div>
                      <div className="text-[11px] text-primary font-bold">{mentor.org}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-amber-600 font-extrabold">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />{mentor.rating}
                    </span>
                    <span className="text-outline font-medium">{mentor.sessions} sessions</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.expertise.map((e, i) => (
                      <span key={i} className="text-[11px] font-bold px-2 py-0.5 rounded bg-leaf-green-light text-primary">{e}</span>
                    ))}
                  </div>
                  <button
                    onClick={(ev) => { ev.stopPropagation(); handleBookMentor(mentor.id); }}
                    disabled={!!bookedSessions[mentor.id]}
                    className={`w-full py-2.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                      bookedSessions[mentor.id] ? 'bg-emerald-100 text-emerald-800 cursor-default' : 'bg-purple-800 text-white hover:bg-purple-900 shadow-sm'
                    }`}>
                    {bookedSessions[mentor.id] ? <><CheckCircle2 className="w-4 h-4" />Session Booked</> : <>📅 Book Session — {mentor.nextSlot}</>}
                  </button>
                </div>
              ))}
            </div>

            {/* Mentor Chat / Feedback */}
            <div className="lg:col-span-2">
              {selectedMentor ? (
                <div className="bg-surface-white rounded-3xl border border-surface-container-high shadow-wellness flex flex-col" style={{ minHeight: '480px' }}>
                  <div className="p-6 border-b border-surface-container-high flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-base shrink-0">
                      {selectedMentor.avatar}
                    </div>
                    <div>
                      <div className="font-extrabold text-text-main">{selectedMentor.name}</div>
                      <div className="text-xs text-outline font-medium">{selectedMentor.role} • {selectedMentor.org}</div>
                    </div>
                    <div className="ml-auto flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full font-bold">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />Online
                    </div>
                  </div>

                  <div className="flex-1 p-6 space-y-4 overflow-y-auto" style={{ maxHeight: '300px' }}>
                    {/* Intro message */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center text-xs font-black shrink-0">{selectedMentor.avatar}</div>
                      <div className="bg-surface-container-low rounded-2xl rounded-tl-none p-4 max-w-xs">
                        <div className="text-xs text-text-main font-medium">Hello! I'm here to support your journey. I see you're working on <strong>{gapSkills[0] || 'your Ayurveda skills'}</strong>. Let me know how I can help! 🌿</div>
                        <div className="text-[11px] text-outline font-medium mt-1">Just now</div>
                      </div>
                    </div>

                    {(mentorMsg[selectedMentor.id] || []).map((msg, i) => (
                      <div key={i} className={`flex gap-3 ${msg.from === 'me' ? 'justify-end' : ''}`}>
                        {msg.from !== 'me' && (
                          <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center text-xs font-black shrink-0">{selectedMentor.avatar}</div>
                        )}
                        <div className={`rounded-2xl p-4 max-w-xs text-xs font-medium ${
                          msg.from === 'me' ? 'bg-primary text-white rounded-tr-none' : 'bg-surface-container-low text-text-main rounded-tl-none'
                        }`}>
                          {msg.text}
                          <div className={`text-[11px] mt-1 ${msg.from === 'me' ? 'text-white/60' : 'text-outline'}`}>{msg.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 border-t border-surface-container-high flex gap-3">
                    <input
                      value={msgInput}
                      onChange={e => setMsgInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendMsg(selectedMentor.id)}
                      placeholder="Ask your mentor anything about your skill gaps..."
                      className="flex-1 px-4 py-3 rounded-2xl bg-surface-container-low border border-surface-container-high text-xs font-medium text-text-main focus:outline-none focus:border-primary"
                    />
                    <button onClick={() => handleSendMsg(selectedMentor.id)}
                      className="p-3 rounded-2xl bg-primary text-white hover:bg-primary-container transition-all shadow-md">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-surface-white rounded-3xl border border-dashed border-outline-variant h-full min-h-[300px] flex items-center justify-center flex-col gap-4 p-12 text-center">
                  <MessageSquare className="w-12 h-12 text-outline/40" />
                  <div className="text-sm font-bold text-outline">Select a mentor on the left to start a conversation or book a session</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── PROGRESS TRACKER ──────────────────────────────────────────────── */}
      {activeSection === 'progress' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-black text-text-main flex items-center gap-3">
              <BarChart3 className="w-7 h-7 text-primary" /> My Progress Dashboard
            </h2>
            <p className="text-sm text-outline font-medium mt-1">Track completion, earn certificates, and monitor your HSSC readiness improvement</p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Courses Enrolled', value: Object.keys(enrolledCourses).length, total: COURSES_DB.length, icon: <BookOpen className="w-5 h-5" />, color: 'text-primary bg-leaf-green-light' },
              { label: 'Certificates Earned', value: Object.entries(progress).filter(([k, v]) => v === 100).length, total: COURSES_DB.length, icon: <Award className="w-5 h-5" />, color: 'text-purple-700 bg-purple-100' },
              { label: 'Internships Applied', value: Object.keys(appliedInternships).length, total: INTERNSHIPS_DB.length, icon: <Briefcase className="w-5 h-5" />, color: 'text-sky-700 bg-sky-100' },
              { label: 'Mentor Sessions', value: Object.keys(bookedSessions).length, total: MENTORS.length, icon: <Users className="w-5 h-5" />, color: 'text-amber-700 bg-amber-100' },
            ].map((stat, i) => (
              <div key={i} className="bg-surface-white rounded-3xl p-6 border border-surface-container-high shadow-wellness text-center space-y-3">
                <div className={`p-3 rounded-2xl w-fit mx-auto ${stat.color}`}>{stat.icon}</div>
                <div className="text-3xl font-black text-text-main">{stat.value}<span className="text-sm text-outline font-medium">/{stat.total}</span></div>
                <div className="text-xs text-outline font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Course Progress Cards */}
          <div className="bg-surface-white rounded-3xl p-8 border border-surface-container-high shadow-wellness space-y-6">
            <h3 className="text-lg font-extrabold text-text-main">Course Completion Tracker</h3>
            <div className="space-y-5">
              {COURSES_DB.map(course => {
                const isEnrolled = enrolledCourses[course.id];
                const prog = progress[course.id] || 0;
                return (
                  <div key={course.id} className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center gap-4 ${isEnrolled ? 'border-emerald-200 bg-emerald-50/30' : 'border-surface-container-high bg-surface-container-lowest'}`}>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-extrabold text-text-main">{course.title}</div>
                        {prog === 100 && <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold flex items-center gap-1"><BadgeCheck className="w-3.5 h-3.5" />Completed</span>}
                      </div>
                      <div className="text-xs text-outline font-medium">{course.provider} • {course.duration}</div>
                      {isEnrolled && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold text-text-main">
                            <span>Progress</span><span>{prog}%</span>
                          </div>
                          <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-500 to-primary rounded-full" style={{ width: `${prog}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="shrink-0">
                      {!isEnrolled ? (
                        <button onClick={() => handleEnroll(course.id)} className="px-5 py-2.5 rounded-2xl bg-primary text-white text-xs font-extrabold hover:bg-primary-container transition-all">
                          Enroll Now
                        </button>
                      ) : prog < 100 ? (
                        <button onClick={() => setProgress(prev => ({ ...prev, [course.id]: Math.min(100, prev[course.id] + 20) }))}
                          className="px-5 py-2.5 rounded-2xl bg-leaf-green-light text-primary text-xs font-extrabold hover:bg-emerald-200 transition-all flex items-center gap-2">
                          <Play className="w-3.5 h-3.5" />Continue
                        </button>
                      ) : (
                        <button onClick={() => setActiveCertModal({ ...course, certId: `HSSC-NOS-2026-${Math.floor(1000 + Math.random() * 9000)}` })}
                          className="px-5 py-2.5 rounded-2xl bg-emerald-100 text-emerald-800 text-xs font-extrabold flex items-center gap-2 border border-emerald-200 hover:bg-emerald-200 transition-all shadow-xs">
                          <BadgeCheck className="w-4 h-4" />View Certificate
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── SAVED FILTER PRESETS BAR ────────────────────────────────────────── */}
      <div className="bg-surface-white rounded-2xl p-4 border border-surface-container-high shadow-wellness flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-extrabold text-outline flex items-center gap-1">
            <Bookmark className="w-4 h-4 text-primary" /> Saved Filter Presets:
          </span>
          {filterPresets.map((preset, idx) => (
            <button key={idx} onClick={() => { setActivePreset(preset.filter); showToast(`Applied "${preset.name}" preset!`); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${activePreset === preset.filter ? 'bg-primary text-white border-primary shadow-xs' : 'bg-surface-container-low text-outline border-surface-container-high hover:bg-surface-container-high'}`}>
              {preset.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input value={newPresetName} onChange={e => setNewPresetName(e.target.value)} placeholder="New preset name..."
            className="px-3 py-1.5 rounded-xl bg-surface-container-low border border-surface-container-high text-xs font-medium text-text-main focus:outline-none w-36" />
          <button onClick={handleSavePreset} className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-extrabold hover:bg-primary-container transition-all">
            + Save Preset
          </button>
        </div>
      </div>

      {/* ── CERTIFICATE VIEW MODAL WITH QR CODE & LINKEDIN SHARE ─────────── */}
      {activeCertModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-white rounded-3xl max-w-xl w-full p-8 border border-surface-container-high shadow-2xl space-y-6 relative animate-in fade-in zoom-in-95">
            <button onClick={() => setActiveCertModal(null)} className="absolute top-6 right-6 p-2 rounded-xl hover:bg-surface-container-low text-outline">
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Header */}
            <div className="text-center space-y-2 border-b border-surface-container-high pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                <ShieldCheck className="w-4 h-4" /> HSSC NOS Verified Credential
              </div>
              <h2 className="text-2xl font-black text-text-main font-serif">Certificate of Completion</h2>
              <p className="text-xs text-outline font-medium">Healthcare Sector Skill Council (Ayush Sub-SSC)</p>
            </div>

            {/* Certificate Body */}
            <div className="bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-surface-container-lowest p-6 rounded-2xl border border-emerald-100 text-center space-y-4">
              <p className="text-xs text-outline font-medium">This is to certify that</p>
              <h3 className="text-2xl font-black text-primary font-manrope">{user?.name || 'Ayush Practitioner'}</h3>
              <p className="text-xs text-text-main font-medium leading-relaxed">
                has successfully completed the accredited National Occupational Standards (NOS) training module:
              </p>
              <div className="text-base font-extrabold text-purple-900 bg-white/80 p-3 rounded-xl border border-purple-100 shadow-xs">
                {activeCertModal.title}
              </div>
              <div className="text-xs text-outline font-medium">
                Issued by <strong className="text-text-main">{activeCertModal.provider}</strong> • Date: August 29, 2026
              </div>
            </div>

            {/* QR Code & Verification Block */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low border border-surface-container-high gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`http://localhost:3000/verify-certificate?id=${activeCertModal.certId}`)}`}
                  alt="Certificate Verification QR Code"
                  className="w-20 h-20 rounded-xl border border-white shadow-sm shrink-0 bg-white p-1"
                />
                <div className="space-y-1 text-left">
                  <div className="text-xs font-black text-text-main flex items-center gap-1">
                    <QrCode className="w-4 h-4 text-primary" /> Verified Credential ID
                  </div>
                  <div className="text-xs font-mono font-bold text-primary">{activeCertModal.certId}</div>
                  <div className="text-[11px] text-outline font-medium">Scan QR to verify authentic HSSC record online</div>
                </div>
              </div>
            </div>

            {/* Actions: Share to LinkedIn & Download */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleShareLinkedIn(activeCertModal.title, activeCertModal.certId)}
                className="py-3 rounded-2xl bg-[#0A66C2] text-white text-xs font-extrabold hover:bg-[#004182] transition-all flex items-center justify-center gap-2 shadow-md">
                <Share2 className="w-4 h-4" /> Share to LinkedIn
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`http://localhost:3000/verify-certificate?id=${activeCertModal.certId}`);
                  showToast('📋 Verification link copied to clipboard!');
                }}
                className="py-3 rounded-2xl bg-surface-container-low text-text-main border border-surface-container-high text-xs font-extrabold hover:bg-surface-container-high transition-all flex items-center justify-center gap-2">
                <Copy className="w-4 h-4" /> Copy Direct Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── APPLICATION STATUS TRACKER DASHBOARD MODAL ─────────────────────── */}
      {showAppTrackerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-white rounded-3xl max-w-3xl w-full p-8 border border-surface-container-high shadow-2xl space-y-6 relative">
            <button onClick={() => setShowAppTrackerModal(false)} className="absolute top-6 right-6 p-2 rounded-xl hover:bg-surface-container-low text-outline">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-surface-container-high pb-4">
              <div className="p-3 rounded-2xl bg-purple-100 text-purple-700"><Clock className="w-6 h-6" /></div>
              <div>
                <h2 className="text-xl font-extrabold text-text-main">My Application Status Dashboard</h2>
                <p className="text-xs text-outline font-medium">Visual timeline tracking for your submitted internship & career applications</p>
              </div>
            </div>

            {/* Pipeline Stage Legend */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Decision'].map((stage, idx, arr) => (
                <React.Fragment key={stage}>
                  <span className={`text-[10px] font-extrabold px-2.5 py-1.5 rounded-full whitespace-nowrap ${
                    stage === 'Applied' ? 'bg-amber-100 text-amber-800' :
                    stage === 'Under Review' ? 'bg-sky-100 text-sky-800' :
                    stage === 'Shortlisted' ? 'bg-emerald-100 text-emerald-800' :
                    stage === 'Interview Scheduled' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-600'}`}>{stage}</span>
                  {idx < arr.length - 1 && <div className="h-px w-6 bg-surface-container-high shrink-0" />}
                </React.Fragment>
              ))}
            </div>

            <div className="space-y-6 max-h-[420px] overflow-y-auto pr-1">
              {[
                { id: 'APP-2026-9812', title: 'Panchakarma Therapy Intern', company: 'Patanjali Wellness Hub', date: 'Aug 28, 2026', currentStage: 2, notes: 'HR shortlisted based on 92% readiness score.' },
                { id: 'APP-2026-9844', title: 'Ayurvedic Pharmacist Trainee', company: 'Dabur Ayurvedic R&D', date: 'Aug 25, 2026', currentStage: 1, notes: 'Application under review by R&D hiring panel.' },
                { id: 'APP-2026-9901', title: 'Kaya Chikitsa Clinical Fellow', company: 'AIIMS Ayurveda OPD', date: 'Aug 20, 2026', currentStage: 3, notes: 'Interview scheduled for Sep 3, 11:00 AM.' },
                ...Object.keys(appliedInternships).map((id, index) => {
                  const intern = INTERNSHIPS_DB.find(i => i.id === id) || { title: 'Ayush Fellowship', company: 'Partner Org' };
                  return { id: `APP-2026-${1000 + index * 12}`, title: intern.title, company: intern.company, date: 'Today', currentStage: 0, notes: 'Application received by organization.' };
                })
              ].map((app, idx) => {
                const STAGES = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Decision'];
                const STAGE_COLORS = ['bg-amber-500', 'bg-sky-500', 'bg-emerald-500', 'bg-purple-500', 'bg-gray-400'];
                return (
                  <div key={idx} className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-outline">{app.id}</span>
                        </div>
                        <div className="text-sm font-extrabold text-text-main">{app.title}</div>
                        <div className="text-xs text-primary font-bold">{app.company} • Applied: {app.date}</div>
                      </div>
                      <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full text-white shrink-0 ${STAGE_COLORS[app.currentStage]}`}>
                        {STAGES[app.currentStage]}
                      </span>
                    </div>

                    {/* Visual Timeline */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-0">
                        {STAGES.map((stage, i) => {
                          const done = i <= app.currentStage;
                          const active = i === app.currentStage;
                          return (
                            <React.Fragment key={stage}>
                              <div className="flex flex-col items-center">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                                  done ? `${STAGE_COLORS[i]} border-transparent text-white` : 'bg-surface-container-low border-surface-container-high text-outline'
                                } ${active ? 'ring-2 ring-offset-1 ring-current' : ''}`}>
                                  {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span className="text-[10px] font-black">{i + 1}</span>}
                                </div>
                                <span className={`text-[9px] font-bold mt-1 text-center leading-tight max-w-[52px] ${done ? 'text-text-main' : 'text-outline/50'}`}>
                                  {stage}
                                </span>
                              </div>
                              {i < STAGES.length - 1 && (
                                <div className={`flex-1 h-1 rounded-full mx-1 mb-5 transition-all ${i < app.currentStage ? STAGE_COLORS[i] : 'bg-surface-container-high'}`} />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>

                    <div className="text-[11px] text-outline font-medium italic bg-surface-container-low rounded-xl px-3 py-2">
                      📝 &quot;{app.notes}&quot;
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

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

