import React, { useState, useEffect } from 'react';
import { Lock, GraduationCap, Briefcase, UserCheck, Building2, Sparkles, ShieldCheck, LogIn, ArrowRight } from 'lucide-react';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import AuthModal from './components/common/AuthModal';
import HomeView from './components/views/HomeView';
import StudentDashboardView from './components/views/StudentDashboardView';
import StudentRoadmapView from './components/views/StudentRoadmapView';
import SmartRecommendationsView from './components/views/SmartRecommendationsView';
import RecruiterDashboardView from './components/views/RecruiterDashboardView';
import ResumeScreeningView from './components/views/ResumeScreeningView';
import PlacementManagementView from './components/views/PlacementManagementView';
import CollaborationAnalyticsView from './components/views/CollaborationAnalyticsView';
import FacultyDashboardView from './components/views/FacultyDashboardView';
import InstitutionDashboardView from './components/views/InstitutionDashboardView';
import HelpCentreView from './components/views/HelpCentreView';

import { API_BASE } from './api';

import { supabase } from './supabaseClient';

// Safe user data normalizer
function sanitizeUser(rawUser) {
  if (!rawUser) return null;
  const user = { ...rawUser };
  
  // Normalize skills
  if (typeof user.skills === 'string') {
    try { user.skills = JSON.parse(user.skills); } catch { user.skills = []; }
  }
  if (!Array.isArray(user.skills)) {
    user.skills = [];
  }
  user.skills = user.skills.map(s => {
    if (typeof s === 'string') {
      return { name: s, score: 75, target: 90, status: 'developing' };
    }
    return {
      name: s?.name || 'Ayush Clinical Competency',
      score: typeof s?.score === 'number' ? s.score : 75,
      target: typeof s?.target === 'number' ? s.target : 90,
      status: s?.status || (s?.score >= 80 ? 'strong' : s?.score >= 60 ? 'developing' : 'gap')
    };
  });
  if (user.skills.length === 0) {
    user.skills = [
      { name: "Abhyanga & Swedana Technique", score: 85, target: 90, status: "strong" },
      { name: "Kati/Janu Basti Setup & Monitoring", score: 75, target: 85, status: "developing" },
      { name: "Sterilization & Herbal Dravya Prep", score: 90, target: 90, status: "strong" },
      { name: "Patient Vitals & Therapy Logging", score: 80, target: 85, status: "developing" },
      { name: "Ayurvedic Pharmacology Basics", score: 65, target: 80, status: "developing" }
    ];
  }

  // Normalize certifications
  if (typeof user.certifications === 'string') {
    try { user.certifications = JSON.parse(user.certifications); } catch { user.certifications = []; }
  }
  if (!Array.isArray(user.certifications)) {
    user.certifications = [];
  }
  user.certifications = user.certifications.map(c => {
    if (typeof c === 'string') {
      return { title: c, issuer: 'HSSC Ayush Sub-SSC', year: 2025, verified: true };
    }
    return {
      title: c?.title || 'HSSC Certified Ayush Professional',
      issuer: c?.issuer || 'HSSC Ayush Sub-SSC',
      year: c?.year || 2025,
      verified: c?.verified !== false
    };
  });

  return user;
}

// React Error Boundary — handles unexpected render errors gracefully
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('Portal component render error:', error, info);
  }
  componentDidUpdate(prevProps) {
    if (this.state.hasError && (
      prevProps.activeTab !== this.props.activeTab ||
      prevProps.user !== this.props.user
    )) {
      this.setState({ hasError: false, error: null });
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-surface-white rounded-3xl p-8 border border-red-200 text-center space-y-4 max-w-lg mx-auto my-12 shadow-wellness">
          <div className="text-red-700 font-black text-lg">Section Encountered an Issue</div>
          <p className="text-xs text-outline font-medium">Click below to retry loading this view.</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary-container transition-all"
          >
            Retry View
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}


export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const savedRole = localStorage.getItem('ayush_role');
      const savedUser = localStorage.getItem('ayush_user');
      if (savedUser && savedRole) {
        if (savedRole === 'student') return 'student';
        if (savedRole === 'recruiter') return 'placement';
        if (savedRole === 'faculty') return 'faculty';
        if (savedRole === 'institution') return 'institution';
      }
    } catch {}
    return 'home';
  });
  const [activeRole, setActiveRole] = useState(() => {
    try { return localStorage.getItem('ayush_role') || 'student'; } catch { return 'student'; }
  });
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ayush_user');
      return saved ? sanitizeUser(JSON.parse(saved)) : null;
    } catch {
      return null;
    }
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState('student');

  const handleOpenAuth = (role = 'student') => {
    setAuthModalRole(role);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (loggedInUser, role) => {
    const cleanUser = sanitizeUser(loggedInUser);
    const resolvedRole = role || cleanUser?.role || 'student';
    setUser(cleanUser);
    setActiveRole(resolvedRole);
    setIsAuthModalOpen(false);
    try {
      localStorage.setItem('ayush_user', JSON.stringify(cleanUser));
      localStorage.setItem('ayush_role', resolvedRole);
    } catch (e) {
      console.error(e);
    }
    // Auto-navigate to that persona's main portal tab
    if (resolvedRole === 'student') setActiveTab('student');
    else if (resolvedRole === 'recruiter') setActiveTab('placement');
    else if (resolvedRole === 'faculty') setActiveTab('faculty');
    else if (resolvedRole === 'institution') setActiveTab('institution');
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('ayush_user');
      localStorage.removeItem('ayush_role');
      supabase.auth.signOut().catch(() => {});
      setUser(null);
      setActiveRole('student');
      setActiveTab('home');
    } catch (e) {
      console.error('Logout error:', e);
      setUser(null);
      setActiveTab('home');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface font-manrope">
      {/* Collapsible Corner Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        user={user}
        onLogout={handleLogout}
        onOpenAuth={handleOpenAuth}
      />

      {/* Top Header next to Sidebar */}
      <Header
        activeTab={activeTab}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        user={user}
        setIsSidebarOpen={setIsSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Main Content Canvas */}
      <main 
        onClick={() => !isSidebarCollapsed && setIsSidebarCollapsed(true)}
        className={`flex-1 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[260px]'
        } w-full max-w-[1440px] px-6 sm:px-10 lg:px-12 py-8 md:py-12`}
      >
        <ErrorBoundary 
          activeTab={activeTab} 
          user={user} 
          onReset={() => { setActiveTab('home'); setActiveRole('student'); }}
        >
          {activeTab === 'home' && <HomeView setActiveTab={setActiveTab} setActiveRole={setActiveRole} />}
          {activeTab === 'student' && <StudentDashboardView user={user} setActiveTab={setActiveTab} />}
          {activeTab === 'roadmap' && <StudentRoadmapView user={user} setUser={setUser} />}
          {activeTab === 'recommendations' && <SmartRecommendationsView user={user} />}
          {activeTab === 'placement' && <PlacementManagementView />}
          {activeTab === 'recruiter' && <RecruiterDashboardView setActiveTab={setActiveTab} />}
          {activeTab === 'screening' && <ResumeScreeningView />}
          {activeTab === 'collaboration' && <CollaborationAnalyticsView />}
          {activeTab === 'faculty' && <FacultyDashboardView />}
          {activeTab === 'institution' && <InstitutionDashboardView />}
          {activeTab === 'help' && <HelpCentreView />}
        </ErrorBoundary>
      </main>

      {/* Role-Based Authentication & Signup Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialRole={authModalRole}
      />

      {/* Footer offset by sidebar */}
      <footer className={`transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[260px]'
      } bg-surface-white border-t border-surface-container-high py-6 px-6 md:px-10 text-center text-xs text-outline font-medium`}>
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">AyushConnect</span>
            <span>• Ministry of Ayush Academia-Industry Collaboration</span>
          </div>
          <div>Anchored to HSSC Qualification Packs (Ayush Sub-SSC)</div>
          <div className="text-[11px] text-outline/80">Stitch UI Design ID: 5863538528363742421</div>
        </div>
      </footer>
    </div>
  );
}
