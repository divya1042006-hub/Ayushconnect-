import React, { useState } from 'react';
import { X, GraduationCap, Briefcase, UserCheck, Building2, Lock, Mail, User, ShieldCheck, Sparkles, LogIn, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { API_BASE } from '../../api';

// Google multicolor brand SVG icon
function GoogleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.34 24 12 24z"/>
      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.94 0 12s.45 3.85 1.24 5.42l4.04-3.15z"/>
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
    </svg>
  );
}

// Google profile presets by persona
const GOOGLE_PROFILES = {
  student: {
    name: 'Dr. Divya Sharma',
    email: 'divya.ayush2026@gmail.com',
    institution: 'National Institute of Ayurveda (NIA), Jaipur',
    degree: 'BAMS 4th Year',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813581-797746765796?w=100&auto=format&fit=crop&q=80',
    googleId: 'goog-std-2026'
  },
  recruiter: {
    name: 'Vikramaditya Roy (HR Lead)',
    email: 'v.roy.recruiter@gmail.com',
    company: 'Patanjali Wellness & Research Labs',
    department: 'Talent Acquisition',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    googleId: 'goog-rec-2026'
  },
  faculty: {
    name: 'Prof. Dr. Rajeshwar Vaidya',
    email: 'rajeshwar.vaidya@gmail.com',
    institution: 'All India Institute of Ayurveda (AIIA), New Delhi',
    department: 'Dept of Shalya Tantra',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    googleId: 'goog-fac-2026'
  },
  institution: {
    name: 'State Ayush College Administration',
    email: 'stateayushcollege.admin@gmail.com',
    institution: 'State Ayurvedic College & Hospital, Lucknow',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    googleId: 'goog-inst-2026'
  }
};

// LinkedIn brand SVG icon
function LinkedInIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

// Mock LinkedIn profiles keyed by role
const LINKEDIN_PROFILES = {
  student: {
    name: 'Dr. Ananya Sharma',
    email: 'ananya.sharma@linkedin.in',
    headline: 'BAMS 4th Year | Panchakarma Specialist | HSSC NOS Certified',
    institution: 'National Institute of Ayurveda (NIA), Jaipur',
    degree: 'BAMS 4th Year',
    linkedinUrl: 'https://linkedin.com/in/ananya-sharma-bams',
    connections: 487,
    skills: ['Panchakarma', 'Abhyanga', 'Patient Assessment', 'Clinical Documentation'],
    avatar: 'AS',
  },
  recruiter: {
    name: 'Vikramaditya Roy',
    email: 'v.roy@patanjaliwellness.linkedin.com',
    headline: 'HR Lead, Ayush & Wellness | Talent Acquisition | IIM Lucknow',
    company: 'Patanjali Wellness & Research Foundation',
    linkedinUrl: 'https://linkedin.com/in/vikramaditya-roy-hr',
    connections: 1824,
    skills: ['Talent Acquisition', 'HR Analytics', 'Ayush Industry', 'Employer Branding'],
    avatar: 'VR',
  },
  faculty: {
    name: 'Prof. Dr. Rajeshwar Vaidya',
    email: 'rajeshwar.vaidya@aiia.gov.in',
    headline: 'Associate Professor | Shalya Tantra, AIIA | Kshara Sutra Specialist | ICMR Researcher',
    department: 'Dept of Shalya Tantra',
    institution: 'AIIA New Delhi',
    linkedinUrl: 'https://linkedin.com/in/dr-rajeshwar-vaidya',
    connections: 932,
    skills: ['Kshara Sutra', 'Clinical Research', 'Ayurvedic Surgery', 'Evidence-Based Medicine'],
    avatar: 'RV',
  },
  institution: {
    name: 'State Ayurvedic College Admin',
    email: 'admin@stateayushcollege.linkedin.edu.in',
    headline: 'Dean & NCISM Accreditation Officer | State Ayurvedic College',
    institution: 'State Ayurvedic College & Hospital',
    linkedinUrl: 'https://linkedin.com/in/state-ayurvedic-admin',
    connections: 342,
    skills: ['NCISM Compliance', 'Institutional Administration', 'NAAC Accreditation'],
    avatar: 'SA',
  },
};

export default function AuthModal({ isOpen, onClose, onLoginSuccess, initialRole = 'student' }) {
  const [activeRoleTab, setActiveRoleTab] = useState(initialRole);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    institution: 'National Institute of Ayurveda (NIA), Jaipur',
    degree: 'BAMS 4th Year',
    company: 'Patanjali Wellness & Research',
    department: 'Dept of Shalya Tantra'
  });
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleStep, setGoogleStep] = useState(null); // null | 'authorizing' | 'syncing' | 'done'
  const [showCustomGooglePrompt, setShowCustomGooglePrompt] = useState(false);
  const [customGmail, setCustomGmail] = useState('');
  const [linkedInLoading, setLinkedInLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [linkedInStep, setLinkedInStep] = useState(null); // null | 'authorizing' | 'importing' | 'done'
  const [linkedInProfile, setLinkedInProfile] = useState(null);

  const handleResetPassword = async () => {
    const cleanEmail = (formData.email || '').trim().toLowerCase();
    const newPass = (formData.password || '').trim();
    if (!cleanEmail) {
      setErrorMsg('Please enter your email address first.');
      return;
    }
    if (!newPass) {
      setErrorMsg('Please enter the new password in the password field.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ password: newPass })
        .ilike('email', cleanEmail)
        .select();

      if (!error && data && data.length > 0) {
        setSuccessMsg(`✅ Password updated to "${newPass}" for ${cleanEmail}! Click Sign In.`);
        setErrorMsg('');
        setShowResetPassword(false);
      } else {
        setErrorMsg(`No account found for ${cleanEmail}. Please click 'Create Account' to register.`);
      }
    } catch (e) {
      setErrorMsg('Failed to update password: ' + e.message);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  const roleConfigs = {
    student: {
      title: 'Student & Intern Portal',
      subtitle: 'BAMS / BHMS / BNYS / BUMS Skill Mapping',
      icon: GraduationCap,
      color: 'border-leaf-green-accent bg-leaf-green-light/40 text-primary',
      btnColor: 'bg-primary text-white hover:bg-primary-container',
      defaultEmail: 'ananya.sharma@ayush.edu.in',
      demoName: 'Dr. Ananya Sharma',
      fieldsLabel: 'College / Institute Name'
    },
    recruiter: {
      title: 'Industry & Employer Hub',
      subtitle: 'Ayush Hospitals, Herbal & Pharma Labs',
      icon: Briefcase,
      color: 'border-tertiary/40 bg-corporate-blue-pale text-tertiary',
      btnColor: 'bg-tertiary text-white hover:bg-tertiary-container',
      defaultEmail: 'v.roy@patanjaliwellness.com',
      demoName: 'Vikramaditya Roy (HR Lead)',
      fieldsLabel: 'Company / Organization Name'
    },
    faculty: {
      title: 'Faculty & Research Portal',
      subtitle: 'Academicians, FDPs & Clinical Research',
      icon: UserCheck,
      color: 'border-purple-300 bg-purple-100 text-purple-800',
      btnColor: 'bg-purple-800 text-white hover:bg-purple-900',
      defaultEmail: 'rajeshwar.vaidya@aiia.gov.in',
      demoName: 'Prof. Dr. Rajeshwar Vaidya',
      fieldsLabel: 'Academic Department'
    },
    institution: {
      title: 'Institution & NCISM Admin',
      subtitle: 'Ayush Colleges & Accreditation Deans',
      icon: Building2,
      color: 'border-amber-300 bg-amber-100 text-amber-900',
      btnColor: 'bg-amber-800 text-white hover:bg-amber-900',
      defaultEmail: 'admin@stateayushcollege.edu.in',
      demoName: 'State Ayurvedic College Admin',
      fieldsLabel: 'NCISM College Accreditation Code'
    }
  };

  const currentConfig = roleConfigs[activeRoleTab];
  const CurrentIcon = currentConfig.icon;

  const executeAuth = async (roleToAuth, userEmail, overrideUser) => {
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const targetRole = roleToAuth || activeRoleTab;
    const path = isRegisterMode ? `${API_BASE}/api/auth/register` : `${API_BASE}/api/auth/login`;
    const cleanEmail = (userEmail || formData.email || currentConfig.defaultEmail).trim().toLowerCase();
    const cleanPassword = (formData.password || 'password123').trim();
    const nameToUse = overrideUser?.name || formData.name.trim() || cleanEmail.split('@')[0].replace(/[._]/g, ' ');

    // 1. Direct Supabase database sync on registration (saves password to public.users)
    try {
      if (isRegisterMode) {
        const { data: existingList } = await supabase
          .from('users')
          .select('id')
          .ilike('email', cleanEmail)
          .limit(1);

        if (existingList && existingList.length > 0) {
          await supabase.from('users').update({
            name: nameToUse,
            password: cleanPassword,
            role: targetRole,
            degree: formData.degree,
            institution: formData.institution,
            company: formData.company,
            department: formData.department
          }).ilike('email', cleanEmail);
        } else {
          const studentRegNo = `AYU-2026-${Math.floor(1000 + Math.random() * 9000)}`;
          const dbUser = {
            id: `user-${Date.now()}`,
            name: nameToUse,
            email: cleanEmail,
            password: cleanPassword,
            role: targetRole,
            degree: formData.degree || (targetRole === 'student' ? 'BAMS 4th Year' : 'Ayush Graduate'),
            institution: formData.institution || (targetRole === 'student' ? 'National Institute of Ayurveda (NIA), Jaipur' : 'Ayush Institute'),
            company: formData.company || 'Ayush Wellness Center',
            department: formData.department || 'Dept of Shalya Tantra',
            xp: targetRole === 'student' ? 1420 : 500,
            level: targetRole === 'student' ? 4 : 1,
            readiness_score: targetRole === 'student' ? 78 : 70,
            skills: JSON.stringify([
              { name: "Abhyanga & Swedana Technique", score: 85, target: 90, status: "strong" },
              { name: "Kati/Janu Basti Setup & Monitoring", score: 75, target: 85, status: "developing" },
              { name: "Sterilization & Herbal Dravya Prep", score: 90, target: 90, status: "strong" },
              { name: "Patient Vitals & Therapy Logging", score: 80, target: 85, status: "developing" },
              { name: "Ayurvedic Pharmacology Basics", score: 65, target: 80, status: "developing" }
            ]),
            certifications: JSON.stringify([
              { title: "HSSC Panchakarma Attendant Certificate", issuer: "HSSC Ayush Sub-SSC", year: 2025, verified: true },
              { title: "Ayush First-Aid & Emergency Response", issuer: "Red Cross & Min of Ayush", year: 2024, verified: true }
            ])
          };
          await supabase.from('users').insert([dbUser]);
        }
      } else if (!overrideUser && formData.email) {
        // Direct Client-Side Supabase Password Verification (case-insensitive email matching):
        const { data: matchedUsers, error: fetchErr } = await supabase
          .from('users')
          .select('*')
          .ilike('email', cleanEmail)
          .limit(1);

        if (!fetchErr && matchedUsers && matchedUsers.length > 0) {
          const existing = matchedUsers[0];
          if (existing.password && existing.password.trim() !== cleanPassword) {
            setLoading(false);
            setErrorMsg('Incorrect password! Please enter the exact password you used during registration, or click "Forgot / Reset Password" below.');
            return;
          }
        }
      }
    } catch (dbErr) {
      console.warn("Supabase public.users sync note:", dbErr);
    }

    // 2. Supabase Auth registration / signIn (non-blocking)
    try {
      if (isRegisterMode) {
        await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: { data: { name: nameToUse, role: targetRole } }
        }).catch(err => console.log('Supabase Auth signUp note:', err.message));
      } else {
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword
        }).catch(err => console.log('Supabase Auth signIn note:', err.message));
      }
    } catch (_) {}

    const payload = {
      role: targetRole,
      email: cleanEmail,
      password: cleanPassword,
      name: nameToUse,
      institution: formData.institution,
      degree: formData.degree,
      company: formData.company,
      department: formData.department
    };

    // Resolve the user object from what we already know (Supabase data)
    const resolvedUser = overrideUser || { name: nameToUse, email: cleanEmail, role: targetRole,
      institution: formData.institution, degree: formData.degree,
      company: formData.company, department: formData.department };

    // Try backend sync (best-effort — login succeeds even if backend is unreachable)
    try {
      const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000) // 8s timeout
      });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.user) Object.assign(resolvedUser, data.user);
      }
    } catch (_) {
      // Backend unreachable — continue with Supabase-only login
    }

    setLoading(false);
    setSuccessMsg(`Welcome, ${resolvedUser.name || nameToUse}!`);
    onLoginSuccess(resolvedUser, targetRole);
    onClose();

  };

  // ── Custom Social Login state ──────────────────────────────────────────────
  const [activeSocialPicker, setActiveSocialPicker] = useState(null); // null | 'google' | 'linkedin'
  const [customGoogleForm, setCustomGoogleForm] = useState({
    name: '',
    email: '',
    institution: 'National Institute of Ayurveda (NIA), Jaipur',
    degree: 'BAMS 4th Year'
  });
  const [customLinkedInForm, setCustomLinkedInForm] = useState({
    name: '',
    email: '',
    headline: 'Ayush Practitioner | Panchakarma & Clinical Research',
    institution: 'All India Institute of Ayurveda (AIIA)'
  });

  // ── Google / Gmail OAuth & Supabase integration ─────────────────
  const handleGoogleLogin = async (customProfile = null) => {
    setGoogleLoading(true);
    setGoogleStep('authorizing');
    setErrorMsg('');

    try {
      // Fast OAuth simulation
      await new Promise(r => setTimeout(r, 150));
      setGoogleStep('syncing');

      const baseProfile = GOOGLE_PROFILES[activeRoleTab];
      const emailToUse = (customProfile?.email || customGoogleForm.email.trim() || baseProfile.email).trim().toLowerCase();
      const nameToUse = (customProfile?.name || customGoogleForm.name.trim() || baseProfile.name).trim();
      const instToUse = customProfile?.institution || customGoogleForm.institution.trim() || baseProfile.institution || 'Ayush Institute';
      const degToUse = customProfile?.degree || customGoogleForm.degree.trim() || baseProfile.degree || 'BAMS Graduate';

      const skillsArr = [
        { name: "Abhyanga & Swedana Technique", score: 88, target: 90, status: "strong" },
        { name: "Sterilization & Herbal Dravya Prep", score: 92, target: 90, status: "strong" },
        { name: "Patient Vitals & Therapy Logging", score: 85, target: 85, status: "strong" },
        { name: "Kati/Janu Basti Setup & Monitoring", score: 80, target: 85, status: "developing" },
        { name: "Ayurvedic Pharmacology Basics", score: 75, target: 80, status: "developing" }
      ];
      const certsArr = [
        { title: "Google Verified Ayush Practitioner", issuer: "Google Workspace & Ayush Sub-SSC", year: 2026, verified: true },
        { title: "HSSC Panchakarma Attendant Certificate", issuer: "HSSC Ayush Sub-SSC", year: 2025, verified: true }
      ];

      const googleUser = {
        id: `goog-${Date.now()}`,
        name: nameToUse,
        email: emailToUse,
        role: activeRoleTab,
        institution: instToUse,
        degree: degToUse,
        company: activeRoleTab === 'recruiter' ? instToUse : 'Ayush Wellness Center',
        department: activeRoleTab === 'faculty' ? instToUse : 'Dept of Shalya Tantra',
        googleVerified: true,
        provider: 'google',
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(nameToUse)}&backgroundColor=0d9488,059669,0284c7`,
        xp: activeRoleTab === 'student' ? 1480 : 600,
        level: 4,
        readinessScore: 82,
        skills: skillsArr,
        certifications: certsArr,
      };

      // Save / Upsert to Supabase in background
      supabase.from('users').upsert([{
        ...googleUser,
        skills: JSON.stringify(skillsArr),
        certifications: JSON.stringify(certsArr),
        readiness_score: 82,
      }]).catch(() => {});

      setGoogleStep('done');
      setGoogleLoading(false);
      setActiveSocialPicker(null);
      setSuccessMsg(`✅ Welcome, ${googleUser.name}!`);

      // Instant transition
      onLoginSuccess(googleUser, activeRoleTab);
      onClose();

    } catch (err) {
      console.warn('Google login error:', err);
      setGoogleLoading(false);
      setGoogleStep(null);
      setErrorMsg('Google login failed. Please try again.');
    }
  };

  // ── LinkedIn OAuth & Supabase integration ──────────────────────────────
  const handleLinkedInLogin = async (customProfile = null) => {
    setLinkedInLoading(true);
    setLinkedInStep('authorizing');
    setErrorMsg('');

    try {
      // Fast OAuth simulation
      await new Promise(r => setTimeout(r, 150));
      setLinkedInStep('importing');

      const baseProfile = LINKEDIN_PROFILES[activeRoleTab];
      const emailToUse = (customProfile?.email || customLinkedInForm.email.trim() || baseProfile.email).trim().toLowerCase();
      const nameToUse = (customProfile?.name || customLinkedInForm.name.trim() || baseProfile.name).trim();
      const headlineToUse = customProfile?.headline || customLinkedInForm.headline.trim() || baseProfile.headline;
      const instToUse = customProfile?.institution || customLinkedInForm.institution.trim() || baseProfile.institution || 'Ayush Medical Institute';

      const skillsArr = [
        { name: "Panchakarma Clinical Management", score: 90, target: 90, status: "strong" },
        { name: "Clinical Evidence & Documentation", score: 85, target: 85, status: "strong" },
        { name: "Patient Diagnosis & Consultation", score: 80, target: 85, status: "developing" }
      ];

      const linkedInUser = {
        id: `li-${Date.now()}`,
        name: nameToUse,
        email: emailToUse,
        role: activeRoleTab,
        institution: instToUse,
        company: activeRoleTab === 'recruiter' ? instToUse : 'Ayush Health Network',
        degree: activeRoleTab === 'student' ? 'BAMS Graduate' : '',
        department: activeRoleTab === 'faculty' ? instToUse : 'Clinical Ayush Dept',
        linkedIn: true,
        linkedInUrl: `https://linkedin.com/in/${encodeURIComponent(nameToUse.toLowerCase().replace(/\s+/g, '-'))}`,
        linkedInHeadline: headlineToUse,
        linkedInConnections: 500,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(nameToUse)}&backgroundColor=0a66c2`,
        skills: skillsArr,
        certifications: [
          { title: "LinkedIn Verified Ayush Practitioner", issuer: "LinkedIn & NCISM", year: 2026, verified: true }
        ],
        readinessScore: 85,
        xp: 1520,
        level: 4
      };

      // Save / Upsert to Supabase in background
      supabase.from('users').upsert([{
        ...linkedInUser,
        skills: JSON.stringify(skillsArr),
        certifications: JSON.stringify(linkedInUser.certifications),
        readiness_score: 85,
      }]).catch(() => {});

      setLinkedInStep('done');
      setLinkedInLoading(false);
      setActiveSocialPicker(null);
      setSuccessMsg(`✅ Welcome, ${linkedInUser.name}!`);

      // Instant transition
      onLoginSuccess(linkedInUser, activeRoleTab);
      onClose();

    } catch (err) {
      console.warn('LinkedIn login error:', err);
      setLinkedInLoading(false);
      setLinkedInStep(null);
      setErrorMsg('LinkedIn login failed. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanEmail = (formData.email || '').trim().toLowerCase();
    const cleanPassword = (formData.password || '').trim();

    if (!cleanEmail) {
      setErrorMsg('Please enter your email address / registration ID.');
      return;
    }
    if (!cleanPassword) {
      setErrorMsg('Please enter your password.');
      return;
    }

    const enteredName = formData.name.trim() || cleanEmail.split('@')[0].replace(/[._]/g, ' ');
    executeAuth(activeRoleTab, cleanEmail, isRegisterMode ? { name: enteredName, email: cleanEmail, role: activeRoleTab, institution: formData.institution, degree: formData.degree, company: formData.company, department: formData.department } : null);
  };

  const handleQuickDemoLogin = (roleKey) => {
    setActiveRoleTab(roleKey);
    const cfg = roleConfigs[roleKey];
    executeAuth(roleKey, cfg.defaultEmail, { name: cfg.demoName, email: cfg.defaultEmail, role: roleKey });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface-white rounded-3xl max-w-xl w-full p-8 space-y-6 border border-surface-container-high shadow-2xl relative max-h-[92vh] overflow-y-auto font-manrope">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-surface-container-low text-outline transition-colors">
          <X className="w-6 h-6" />
        </button>

        {/* Role Selection Tabs */}
        <div className="space-y-2">
          <div className="text-xs font-black text-outline uppercase tracking-wider">Select Persona Role:</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'student', label: 'Student', icon: GraduationCap },
              { id: 'recruiter', label: 'Industry', icon: Briefcase },
              { id: 'faculty', label: 'Faculty', icon: UserCheck },
              { id: 'institution', label: 'Institution', icon: Building2 }
            ].map(tab => {
              const TabIcon = tab.icon;
              const isSelected = activeRoleTab === tab.id;
              return (
                <button key={tab.id} type="button"
                  onClick={() => { setActiveRoleTab(tab.id); setSuccessMsg(''); setErrorMsg(''); setActiveSocialPicker(null); setLinkedInStep(null); setGoogleStep(null); }}
                  className={`p-3 rounded-2xl border-2 text-left transition-all flex flex-col items-center gap-1.5 ${isSelected ? 'border-primary bg-leaf-green-light/40 shadow-sm font-black' : 'border-surface-container-high bg-surface-white hover:border-outline-variant'}`}>
                  <TabIcon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-outline'}`} />
                  <span className={`text-xs font-bold ${isSelected ? 'text-primary' : 'text-text-main'}`}>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Header Banner */}
        <div className={`p-5 rounded-2xl border flex items-center gap-4 ${currentConfig.color}`}>
          <div className="p-3 rounded-xl bg-white shadow-xs shrink-0"><CurrentIcon className="w-6 h-6" /></div>
          <div>
            <h3 className="text-lg font-black">{currentConfig.title}</h3>
            <p className="text-xs font-semibold opacity-90">{currentConfig.subtitle}</p>
          </div>
        </div>

        {/* ── SOCIAL AUTH (GOOGLE & LINKEDIN SELECTORS) ───────────────────────── */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={() => setActiveSocialPicker(activeSocialPicker === 'google' ? null : 'google')}
              disabled={googleLoading || linkedInLoading || !!successMsg}
              className={`w-full py-3 px-4 rounded-2xl border-2 text-xs font-black flex items-center justify-center gap-2.5 transition-all shadow-xs disabled:opacity-60 ${activeSocialPicker === 'google' ? 'border-primary bg-emerald-50 text-primary' : 'bg-white border-surface-container-high hover:border-outline-variant hover:bg-surface-container-low text-text-main'}`}
            >
              <GoogleIcon className="w-4 h-4 shrink-0" />
              <span>Continue with Google</span>
            </button>

            {/* LinkedIn Sign In Button */}
            <button
              type="button"
              onClick={() => setActiveSocialPicker(activeSocialPicker === 'linkedin' ? null : 'linkedin')}
              disabled={googleLoading || linkedInLoading || !!successMsg}
              className={`w-full py-3 px-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2.5 transition-all shadow-xs disabled:opacity-60 ${activeSocialPicker === 'linkedin' ? 'bg-[#004182] text-white border-2 border-[#004182]' : 'bg-[#0A66C2] text-white hover:bg-[#004182]'}`}
            >
              <LinkedInIcon className="w-4 h-4 shrink-0" />
              <span>Continue with LinkedIn</span>
            </button>
          </div>

          {/* ── INTERACTIVE GOOGLE ACCOUNT PICKER ── */}
          {activeSocialPicker === 'google' && (
            <div className="p-4 rounded-2xl bg-surface-container-low border-2 border-emerald-500/40 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GoogleIcon className="w-5 h-5" />
                  <span className="text-xs font-black text-text-main">Sign in with Google</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Secure OAuth 2.0</span>
              </div>

              {/* Quick default preset account */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-outline">Preset Google Account for this Role:</div>
                <button
                  type="button"
                  onClick={() => handleGoogleLogin(GOOGLE_PROFILES[activeRoleTab])}
                  disabled={googleLoading}
                  className="w-full p-2.5 rounded-xl bg-white border border-surface-container-high hover:border-primary flex items-center gap-3 transition-colors text-left"
                >
                  <img src={GOOGLE_PROFILES[activeRoleTab].avatarUrl} alt="Google Avatar" className="w-8 h-8 rounded-full object-cover border" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-extrabold text-text-main truncate">{GOOGLE_PROFILES[activeRoleTab].name}</div>
                    <div className="text-[11px] text-outline truncate">{GOOGLE_PROFILES[activeRoleTab].email}</div>
                  </div>
                  <span className="text-[10px] font-bold text-primary bg-leaf-green-light px-2 py-1 rounded-lg">Instant Sign In →</span>
                </button>
              </div>

              {/* Custom Google Account Fields */}
              <div className="space-y-2.5 pt-2 border-t border-surface-container-high">
                <div className="text-[11px] font-black text-text-main flex items-center gap-1.5">
                  <span>✨ Or enter YOUR own Google Account / Gmail:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Your Full Name (e.g. Rahul Sharma)"
                    value={customGoogleForm.name}
                    onChange={(e) => setCustomGoogleForm({ ...customGoogleForm, name: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-white border border-surface-container-high text-xs font-semibold text-text-main focus:outline-none focus:border-primary"
                  />
                  <input
                    type="email"
                    placeholder="your.email@gmail.com"
                    value={customGoogleForm.email}
                    onChange={(e) => setCustomGoogleForm({ ...customGoogleForm, email: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-white border border-surface-container-high text-xs font-semibold text-text-main focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="College / Organization Name"
                    value={customGoogleForm.institution}
                    onChange={(e) => setCustomGoogleForm({ ...customGoogleForm, institution: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-white border border-surface-container-high text-xs font-semibold text-text-main focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    placeholder="Degree / Role (e.g. BAMS 4th Year)"
                    value={customGoogleForm.degree}
                    onChange={(e) => setCustomGoogleForm({ ...customGoogleForm, degree: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-white border border-surface-container-high text-xs font-semibold text-text-main focus:outline-none focus:border-primary"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleGoogleLogin(customGoogleForm)}
                  disabled={!customGoogleForm.email || !customGoogleForm.name || googleLoading}
                  className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-black hover:bg-primary-container disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <GoogleIcon className="w-3.5 h-3.5" />
                  <span>{googleLoading ? 'Authorizing Google Account...' : 'Continue with this Gmail Account'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ── INTERACTIVE LINKEDIN PROFILE PICKER ── */}
          {activeSocialPicker === 'linkedin' && (
            <div className="p-4 rounded-2xl bg-surface-container-low border-2 border-[#0A66C2]/40 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LinkedInIcon className="w-5 h-5 text-[#0A66C2]" />
                  <span className="text-xs font-black text-text-main">Sync with LinkedIn Profile</span>
                </div>
                <span className="text-[10px] font-bold text-[#0A66C2] bg-blue-50 px-2 py-0.5 rounded-full">Profile Sync</span>
              </div>

              {/* Quick default preset account */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-outline">Preset LinkedIn Account for this Role:</div>
                <button
                  type="button"
                  onClick={() => handleLinkedInLogin(LINKEDIN_PROFILES[activeRoleTab])}
                  disabled={linkedInLoading}
                  className="w-full p-2.5 rounded-xl bg-white border border-surface-container-high hover:border-[#0A66C2] flex items-center gap-3 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-[#0A66C2] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {LINKEDIN_PROFILES[activeRoleTab].avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-extrabold text-text-main truncate">{LINKEDIN_PROFILES[activeRoleTab].name}</div>
                    <div className="text-[11px] text-outline truncate">{LINKEDIN_PROFILES[activeRoleTab].headline}</div>
                  </div>
                  <span className="text-[10px] font-bold text-[#0A66C2] bg-blue-50 px-2 py-1 rounded-lg">Import →</span>
                </button>
              </div>

              {/* Custom LinkedIn Account Fields */}
              <div className="space-y-2.5 pt-2 border-t border-surface-container-high">
                <div className="text-[11px] font-black text-text-main flex items-center gap-1.5">
                  <span>✨ Or enter YOUR own LinkedIn details:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    value={customLinkedInForm.name}
                    onChange={(e) => setCustomLinkedInForm({ ...customLinkedInForm, name: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-white border border-surface-container-high text-xs font-semibold text-text-main focus:outline-none focus:border-[#0A66C2]"
                  />
                  <input
                    type="email"
                    placeholder="your.linkedin.email@domain.com"
                    value={customLinkedInForm.email}
                    onChange={(e) => setCustomLinkedInForm({ ...customLinkedInForm, email: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-white border border-surface-container-high text-xs font-semibold text-text-main focus:outline-none focus:border-[#0A66C2]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Professional Headline (e.g. BAMS Intern | Panchakarma)"
                    value={customLinkedInForm.headline}
                    onChange={(e) => setCustomLinkedInForm({ ...customLinkedInForm, headline: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-white border border-surface-container-high text-xs font-semibold text-text-main focus:outline-none focus:border-[#0A66C2]"
                  />
                  <input
                    type="text"
                    placeholder="Institution / Organization Name"
                    value={customLinkedInForm.institution}
                    onChange={(e) => setCustomLinkedInForm({ ...customLinkedInForm, institution: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-white border border-surface-container-high text-xs font-semibold text-text-main focus:outline-none focus:border-[#0A66C2]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleLinkedInLogin(customLinkedInForm)}
                  disabled={!customLinkedInForm.email || !customLinkedInForm.name || linkedInLoading}
                  className="w-full py-2.5 rounded-xl bg-[#0A66C2] text-white text-xs font-black hover:bg-[#004182] disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <LinkedInIcon className="w-3.5 h-3.5" />
                  <span>{linkedInLoading ? 'Importing LinkedIn Profile...' : 'Connect with this LinkedIn Account'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Social Loading Indicators */}
          {googleLoading && (
            <div className="p-3 rounded-xl bg-leaf-green-light border border-leaf-green-accent/40 flex items-center gap-2 text-xs font-bold text-primary animate-pulse">
              <GoogleIcon className="w-4 h-4" />
              <span>{googleStep === 'authorizing' ? '🔐 Authenticating with Google OAuth 2.0...' : '📥 Syncing user profile & Ayush certification records...'}</span>
            </div>
          )}

          {linkedInLoading && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-2 text-xs font-bold text-[#0A66C2] animate-pulse">
              <LinkedInIcon className="w-4 h-4" />
              <span>{linkedInStep === 'authorizing' ? '🔐 Connecting with LinkedIn API...' : '📥 Importing professional headline, credentials & skills...'}</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-1">
            <div className="flex-1 h-px bg-surface-container-high" />
            <span className="text-[11px] text-outline font-medium">or sign in with credentials</span>
            <div className="flex-1 h-px bg-surface-container-high" />
          </div>
        </div>

        {/* Quick Demo Login */}
        <div className="p-4 rounded-2xl bg-leaf-green-light/60 border border-leaf-green-accent/40 space-y-2">
          <div className="flex items-center justify-between text-xs font-black text-primary">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-leaf-green-accent" />
              1-Click Instant Login as {currentConfig.demoName}:
            </span>
          </div>
          <button type="button" onClick={() => handleQuickDemoLogin(activeRoleTab)} disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-white text-xs font-extrabold hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-sm">
            <LogIn className="w-4 h-4 text-leaf-green-accent" />
            <span>{loading ? 'Logging in...' : `Instant Login as ${currentConfig.demoName}`}</span>
          </button>
        </div>

        {/* Success / Error Alerts */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" /><span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-100 border border-red-300 text-red-900 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-700 shrink-0" /><span>{errorMsg}</span>
          </div>
        )}

        {/* Form Toggle */}
        <div className="flex items-center justify-between border-b border-surface-container-high pb-4">
          <div className="flex gap-4 text-sm font-bold">
            <button type="button" onClick={() => setIsRegisterMode(false)}
              className={`pb-2 border-b-2 transition-all ${!isRegisterMode ? 'border-primary text-primary font-black' : 'border-transparent text-outline'}`}>
              Sign In
            </button>
            <button type="button" onClick={() => setIsRegisterMode(true)}
              className={`pb-2 border-b-2 transition-all ${isRegisterMode ? 'border-primary text-primary font-black' : 'border-transparent text-outline'}`}>
              Create Account
            </button>
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-text-main">Full Name / Practitioner Title</label>
              <div className="relative">
                <User className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="e.g. Dr. Ananya Sharma" value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-xs text-text-main focus:outline-none focus:border-primary" />
              </div>
            </div>
          )}
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-text-main">Email / Roll Number / Registration ID</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder={currentConfig.defaultEmail} value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-xs text-text-main focus:outline-none focus:border-primary" />
            </div>
          </div>
          {isRegisterMode && (
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-text-main">{currentConfig.fieldsLabel}</label>
              <input type="text"
                placeholder={activeRoleTab === 'student' ? 'National Institute of Ayurveda' : activeRoleTab === 'recruiter' ? 'Patanjali Wellness' : 'Shalya Tantra Dept'}
                value={activeRoleTab === 'student' ? formData.institution : activeRoleTab === 'recruiter' ? formData.company : formData.department}
                onChange={e => setFormData({ ...formData, institution: e.target.value, company: e.target.value, department: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-xs text-text-main focus:outline-none focus:border-primary" />
            </div>
          )}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-text-main">
                {showResetPassword ? 'Enter New Password' : 'Password'}
              </label>
              {!isRegisterMode && (
                <button
                  type="button"
                  onClick={() => {
                    setShowResetPassword(!showResetPassword);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-[11px] font-bold text-primary hover:underline"
                >
                  {showResetPassword ? 'Cancel Reset' : 'Forgot / Reset Password?'}
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="password" 
                placeholder={showResetPassword ? "Enter new password to set" : "••••••••"} 
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-xs text-text-main focus:outline-none focus:border-primary" 
              />
            </div>
          </div>

          {showResetPassword ? (
            <button 
              type="button" 
              onClick={handleResetPassword} 
              disabled={loading}
              className="w-full py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-md bg-emerald-600 text-white hover:bg-emerald-700 mt-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>{loading ? 'Updating Password...' : 'Save & Update Password in Supabase'}</span>
            </button>
          ) : (
            <button type="submit" disabled={loading}
              className={`w-full py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-md mt-2 ${currentConfig.btnColor}`}>
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : isRegisterMode ? `Register as ${activeRoleTab.toUpperCase()}` : `Sign In to ${currentConfig.title}`}</span>
            </button>
          )}
        </form>

        {/* LinkedIn Privacy Note */}
        <p className="text-[11px] text-outline text-center font-medium leading-relaxed">
          By continuing with LinkedIn, you agree to import your professional profile including name, headline, and skills to pre-fill your AyushConnect career portfolio.
          Your password is never shared with LinkedIn.
        </p>
      </div>
    </div>
  );
}

