import React, { useState } from 'react';
import {
  HelpCircle, Search, ChevronDown, ChevronUp, BookOpen, Briefcase,
  Award, Building2, Users, FileCheck, BarChart3, Handshake, MessageSquare,
  ExternalLink, Mail, Phone, Clock, CheckCircle2, Leaf, Zap, ShieldCheck,
  GraduationCap, BrainCircuit
} from 'lucide-react';

const FAQ_DATA = [
  {
    category: 'Getting Started',
    icon: <Leaf className="w-5 h-5 text-primary" />,
    color: 'bg-leaf-green-light border-primary/20',
    questions: [
      {
        q: 'What is AyushConnect?',
        a: 'AyushConnect is India\'s premier AYUSH Academia-Industry Collaboration Portal, anchored to HSSC (Healthcare Sector Skill Council) National Occupational Standards (NOS). It connects BAMS, BHMS, BNYS, BUMS, and BSMS students with industry employers, mentors, faculty development opportunities, and verified skill credentials.'
      },
      {
        q: 'How do I get started as a student?',
        a: 'Log in using the "Student" role option on the login screen. Your dashboard will automatically show your skill profile, HSSC readiness score, AI-recommended courses, and matched internship opportunities based on your qualification program (BAMS, BHMS, etc.).'
      },
      {
        q: 'Which AYUSH degrees are supported?',
        a: 'AyushConnect supports all five AYUSH degree programs: BAMS (Bachelor of Ayurvedic Medicine & Surgery), BHMS (Homeopathy), BNYS (Naturopathy & Yoga), BUMS (Unani), and BSMS (Siddha). Use the program filter on the AI Internship Matching page to find relevant opportunities.'
      },
      {
        q: 'Is AyushConnect free to use?',
        a: 'Yes! The core platform is fully free for students, faculty, and institutions affiliated with NCISM-recognized colleges. Premium features like advanced analytics exports and direct HR pipeline access are available for recruiting organizations.'
      },
    ]
  },
  {
    category: 'AI Recommendations & Skill Gaps',
    icon: <BrainCircuit className="w-5 h-5 text-purple-700" />,
    color: 'bg-purple-50 border-purple-200',
    questions: [
      {
        q: 'How does the AI Skill Gap Analysis work?',
        a: 'Our AI engine compares your HSSC NOS assessment scores against the industry benchmark (90% target). Skills below the target are classified as "Gap" (critical, below 60%) or "Developing" (60–89%). The engine then ranks courses and internships that best address your specific gaps.'
      },
      {
        q: 'What is the Live Readiness Score?',
        a: 'The Live Readiness Score is a dynamic aggregate that updates in real time as you complete courses, earn certificates, and progress through NOS modules. It\'s calculated as: Base 68% + (completed courses × 8%) + (enrolled courses × 3%), capped at 98%. Enroll in more courses to boost your score!'
      },
      {
        q: 'How do I use program-specific filters for internships?',
        a: 'On the "AI Internship Matches" page, use the degree filter bar to select your qualification (BAMS, BHMS, BNYS, BUMS, BSMS). This narrows opportunities to those most relevant to your degree program\'s clinical and academic focus areas.'
      },
      {
        q: 'Can I save filter presets for quick access?',
        a: 'Yes! On the AI Recommendations page, scroll to the bottom "Saved Filter Presets" bar. Enter a name for your current filter setup and click "+ Save Preset". Your preset will appear as a quick-access button for future sessions.'
      },
    ]
  },
  {
    category: 'Applications & Status Tracking',
    icon: <Briefcase className="w-5 h-5 text-sky-700" />,
    color: 'bg-sky-50 border-sky-200',
    questions: [
      {
        q: 'How do I track my submitted applications?',
        a: 'Go to "AI Recommendations" → "AI Internship Matches" and click the purple "My Submitted Applications" button. The Application Status Dashboard shows a visual timeline for each application with pipeline stages: Applied → Under Review → Shortlisted → Interview Scheduled → Decision.'
      },
      {
        q: 'What do the application pipeline stages mean?',
        a: '• Applied: Your application is received by the organization.\n• Under Review: HR/recruitment panel is reviewing your profile.\n• Shortlisted: You\'ve been shortlisted based on skill match.\n• Interview Scheduled: A clinical or technical interview has been arranged.\n• Decision: Final hiring decision stage.'
      },
      {
        q: 'Will I get notified when my application status changes?',
        a: 'Yes! Toast notifications appear in real time when you submit an application. Email notifications are sent for stage transitions (shortlisting, interview scheduling). You can also manually check your Application Status Dashboard at any time for the latest updates.'
      },
    ]
  },
  {
    category: 'Certificates & Verification',
    icon: <Award className="w-5 h-5 text-emerald-700" />,
    color: 'bg-emerald-50 border-emerald-200',
    questions: [
      {
        q: 'How do I earn an HSSC NOS Certificate?',
        a: 'Enroll in a course from the "Smart Courses" section, complete all modules (reach 100% progress), then click "View Certificate". Your mentor or faculty reviewer must also sign off on your clinical assessment before an official HSSC NOS Verified Certificate is issued.'
      },
      {
        q: 'How do I verify a certificate QR code?',
        a: 'Every issued certificate has a unique QR code that links to our public verification page (http://localhost:3000/verify-certificate?id=YOUR-CERT-ID). Employers and institutions can scan the QR or enter the certificate ID directly to verify authenticity.'
      },
      {
        q: 'Can I share my certificate on LinkedIn?',
        a: 'Yes! Open your certificate modal and click "Share to LinkedIn". This opens LinkedIn\'s share intent pre-filled with your certificate title and verification link so employers can instantly verify your credential.'
      },
      {
        q: 'How does a mentor issue a verified certificate?',
        a: 'Faculty mentors log in to the Faculty Portal and click "Student Review & Certificates". They can review each student\'s progress, add clinical evaluation notes, and click "Issue HSSC Verified Certificate" to sign off. The certificate ID is then instantly available to the student.'
      },
    ]
  },
  {
    category: 'Faculty & FDPs',
    icon: <GraduationCap className="w-5 h-5 text-amber-700" />,
    color: 'bg-amber-50 border-amber-200',
    questions: [
      {
        q: 'What types of Faculty Development Programs (FDPs) are available?',
        a: 'AyushConnect lists accredited FDPs spanning Clinical Research, Digital Health & AI, Kshara Sutra, Evidence-Based Ayurveda, Yoga Therapy, and Pharmacovigilance. Programs are sponsored by Ministry of Ayush, CSIR, ICMR, and NCISM with grants ranging from ₹12,000 to ₹30,000.'
      },
      {
        q: 'How do I find Faculty Internships?',
        a: 'Go to "Faculty Portal" and click the "Faculty Internships" tab. You\'ll find industry-embedded fellowships at organizations like Kairali Ayurvedic Group, Dabur R&D, AIIMS Integrative Medicine, BYJU\'s Health Sciences, and WHO India — each with stipend, duration, and benefits listed.'
      },
      {
        q: 'Can I register for an FDP directly from the portal?',
        a: 'Yes! Click "Register for Program" on any FDP card. The system submits your registration to the organizing institution and confirms your spot. Seats are limited, so apply early. You\'ll receive a confirmation toast and the remaining seat count updates live.'
      },
    ]
  },
  {
    category: 'Analytics & Data Export',
    icon: <BarChart3 className="w-5 h-5 text-violet-700" />,
    color: 'bg-violet-50 border-violet-200',
    questions: [
      {
        q: 'How do I download the Application Analytics report as CSV?',
        a: 'Go to "Collaboration & Analytics" → "Analytics Dashboards" → "Application Submissions Analytics". Use the date range selectors (From/To) to set your reporting period, then click the green "Export CSV" button. A structured CSV file with data by program, organization, and skill gap will download automatically.'
      },
      {
        q: 'What analytics are available for colleges vs. companies?',
        a: 'College dashboards show placement rate, student readiness by department, monthly placements, top employers, and skill gap severity. Company dashboards show skill demand vs market supply gaps, hiring breakdown by role, and time-to-hire metrics — all to help align curriculum with industry needs.'
      },
    ]
  },
];

const CONTACT_LINKS = [
  { icon: <Mail className="w-5 h-5 text-primary" />, label: 'support@ayushconnect.gov.in', sub: 'Technical & Account Help' },
  { icon: <Phone className="w-5 h-5 text-emerald-700" />, label: '+91-11-2345-6789', sub: 'Mon–Sat, 9AM–6PM IST' },
  { icon: <MessageSquare className="w-5 h-5 text-sky-700" />, label: 'Live Chat Support', sub: 'Available in the portal header' },
];

export default function HelpCentreView() {
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState(null);

  const filteredFaqs = FAQ_DATA.map(cat => ({
    ...cat,
    questions: cat.questions.filter(
      q => !search || q.q.toLowerCase().includes(search.toLowerCase()) || q.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  const toggle = (id) => setOpenId(openId === id ? null : id);

  return (
    <div className="space-y-10 pb-16 font-manrope">

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary via-emerald-800 to-teal-900 text-white rounded-3xl p-8 md:p-12 shadow-wellness relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, #a7f3d0 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-emerald-200">🌿 AyushConnect Help Centre</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">How can we help you?</h1>
          <p className="text-sm text-white/80 font-medium">Find answers about skill gaps, certificates, placements, faculty portals, and analytics — all in one place.</p>
          <div className="relative mt-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search help articles, e.g. 'certificate QR code', 'CSV export'..."
              className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white text-text-main text-sm font-medium focus:outline-none shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {[
          { label: 'AI Recommendations', icon: <BrainCircuit className="w-5 h-5" />, color: 'text-purple-700 bg-purple-100', cat: 'AI Recommendations & Skill Gaps' },
          { label: 'Applications', icon: <Briefcase className="w-5 h-5" />, color: 'text-sky-700 bg-sky-100', cat: 'Applications & Status Tracking' },
          { label: 'Certificates', icon: <Award className="w-5 h-5" />, color: 'text-emerald-700 bg-emerald-100', cat: 'Certificates & Verification' },
          { label: 'Faculty & FDPs', icon: <GraduationCap className="w-5 h-5" />, color: 'text-amber-700 bg-amber-100', cat: 'Faculty & FDPs' },
          { label: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, color: 'text-violet-700 bg-violet-100', cat: 'Analytics & Data Export' },
          { label: 'Get Started', icon: <Zap className="w-5 h-5" />, color: 'text-primary bg-leaf-green-light', cat: 'Getting Started' },
        ].map((item, i) => (
          <button key={i} onClick={() => setSearch(item.cat)}
            className="bg-surface-white rounded-2xl p-5 border border-surface-container-high shadow-wellness hover:shadow-wellness-hover transition-all space-y-2 text-center">
            <div className={`p-3 rounded-xl w-fit mx-auto ${item.color}`}>{item.icon}</div>
            <div className="text-xs font-extrabold text-text-main">{item.label}</div>
          </button>
        ))}
      </div>

      {/* FAQ Sections */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-text-main flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-primary" /> Frequently Asked Questions
          {search && <span className="text-sm text-outline font-medium ml-2">— results for "{search}"</span>}
        </h2>

        {filteredFaqs.length === 0 ? (
          <div className="bg-surface-white rounded-3xl p-12 border border-surface-container-high shadow-wellness text-center space-y-3">
            <Search className="w-10 h-10 text-outline/30 mx-auto" />
            <div className="text-sm font-bold text-outline">No articles matched "{search}"</div>
            <button onClick={() => setSearch('')} className="text-xs text-primary font-extrabold underline">Clear search</button>
          </div>
        ) : (
          filteredFaqs.map((cat, catIdx) => (
            <div key={catIdx} className="bg-surface-white rounded-3xl border border-surface-container-high shadow-wellness overflow-hidden">
              <div className={`flex items-center gap-3 p-6 border-b border-surface-container-high ${cat.color}`}>
                <div className="p-2 rounded-xl bg-white/70 shadow-xs">{cat.icon}</div>
                <h3 className="text-base font-extrabold text-text-main">{cat.category}</h3>
                <span className="ml-auto text-[11px] font-bold text-outline">{cat.questions.length} articles</span>
              </div>
              <div className="divide-y divide-surface-container-high">
                {cat.questions.map((qa, qaIdx) => {
                  const id = `${catIdx}-${qaIdx}`;
                  const isOpen = openId === id;
                  return (
                    <div key={qaIdx}>
                      <button
                        onClick={() => toggle(id)}
                        className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-surface-container-lowest transition-all">
                        <span className="text-sm font-extrabold text-text-main">{qa.q}</span>
                        {isOpen ? <ChevronUp className="w-5 h-5 text-outline shrink-0" /> : <ChevronDown className="w-5 h-5 text-outline shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-6">
                          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high text-sm text-text-main font-medium leading-relaxed whitespace-pre-line">
                            {qa.a}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Contact Support */}
      <div className="bg-gradient-to-r from-surface-white to-leaf-green-light/30 rounded-3xl p-8 border border-primary/20 shadow-wellness space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-primary text-white"><MessageSquare className="w-6 h-6" /></div>
          <div>
            <h2 className="text-xl font-extrabold text-text-main">Still need help?</h2>
            <p className="text-xs text-outline font-medium">Our AYUSH portal support team is here to assist you</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {CONTACT_LINKS.map((c, i) => (
            <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-surface-white border border-surface-container-high shadow-sm hover:border-primary/30 transition-all">
              <div className="p-2.5 rounded-xl bg-surface-container-low shrink-0">{c.icon}</div>
              <div>
                <div className="text-xs font-extrabold text-text-main">{c.label}</div>
                <div className="text-[11px] text-outline font-medium">{c.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-outline font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          All support queries are handled by NCISM-trained staff with expertise in the HSSC NOS Ayush framework.
        </div>
      </div>
    </div>
  );
}
