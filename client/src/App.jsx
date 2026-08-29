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

// React Error Boundary — auto-recovers silently, no user action needed
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, recovering: false };
    this._resetTimer = null;
  }
  static getDerivedStateFromError() {
    return { hasError: true, recovering: true };
  }
  componentDidCatch(error, info) {
    console.warn('Portal caught a render error (auto-recovering):', error?.message);
    // Auto-reset after 150ms — user never sees the error screen
    this._resetTimer = setTimeout(() => {
      this.setState({ hasError: false, recovering: false });
      if (this.props.onReset) this.props.onReset();
    }, 150);
  }
  componentDidUpdate(prevProps) {
    // Also reset instantly when user logs in/out or tab changes
    if (this.state.hasError && (
      prevProps.activeTab !== this.props.activeTab ||
      prevProps.user !== this.props.user
    )) {
      clearTimeout(this._resetTimer);
      this.setState({ hasError: false, recovering: false });
    }
  }
  componentWillUnmount() {
    clearTimeout(this._resetTimer);
  }
  render() {
    if (this.state.hasError || this.state.recovering) {
      // Show a subtle loading spinner instead of the error screen
      return (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="flex flex-col items-center gap-3 text-outline">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <span className="text-xs font-semibold text-outline">Loading...</span>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}


export default function App() {
  const [activeTab, setActiveTab] = useState('home');
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
