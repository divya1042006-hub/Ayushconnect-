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

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeRole, setActiveRole] = useState(() => {
    try { return localStorage.getItem('ayush_role') || 'student'; } catch { return 'student'; }
  });
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ayush_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Mandatory Login: If no user session is present, open AuthModal automatically on visit
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(() => {
    try {
      const saved = localStorage.getItem('ayush_user');
      return !saved; // Open modal immediately on first visit if not logged in
    } catch {
      return true;
    }
  });
  const [authModalRole, setAuthModalRole] = useState('student');

  const handleOpenAuth = (role = 'student') => {
    setAuthModalRole(role);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (loggedInUser, role) => {
    setUser(loggedInUser);
    setActiveRole(role);
    try {
      localStorage.setItem('ayush_user', JSON.stringify(loggedInUser));
      localStorage.setItem('ayush_role', role);
    } catch (e) {
      console.error(e);
    }
    // Auto-navigate to that persona's main portal tab
    if (role === 'student') setActiveTab('student');
    else if (role === 'recruiter') setActiveTab('placement');
    else if (role === 'faculty') setActiveTab('faculty');
    else if (role === 'institution') setActiveTab('institution');
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('ayush_user');
      setUser(null);
      setActiveTab('home');
      setIsAuthModalOpen(true); // Re-open login modal upon logout
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface font-manrope">
      {/* Collapsible Corner Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (!user) {
            handleOpenAuth(activeRole);
            return;
          }
          setActiveTab(tab);
        }}
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
        {!user ? (
          /* ── MANDATORY AUTHENTICATION GATE SCREEN ── */
          <div className="max-w-3xl mx-auto my-6 p-8 md:p-12 rounded-3xl bg-surface-white border border-surface-container-high shadow-xl text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="inline-flex p-4 rounded-3xl bg-leaf-green-light/70 border border-leaf-green-accent/40 text-primary mb-2">
              <Lock className="w-10 h-10 text-primary" />
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-leaf-green-light text-primary text-xs font-black tracking-wider uppercase">
                <ShieldCheck className="w-4 h-4 text-leaf-green-accent" />
                Ministry of Ayush • HSSC Verified Portal
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold text-text-main tracking-tight font-cabinet">
                Authentication Required
              </h2>
              <p className="text-sm md:text-base text-outline font-medium max-w-xl mx-auto">
                Welcome to <strong>AyushConnect</strong>. Please sign in with your role, Google Gmail account, or LinkedIn profile to access the portal dashboards, career mapping, and collaboration pipelines.
              </p>
            </div>

            {/* Quick 4 Persona Sign In Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl mx-auto text-left">
              {[
                { id: 'student', title: 'Student & Intern Portal', desc: 'BAMS, BHMS, BNYS Skill Tracking', icon: GraduationCap, color: 'hover:border-primary border-surface-container-high hover:bg-leaf-green-light/30' },
                { id: 'recruiter', title: 'Industry & Hospital Recruiter', desc: 'Ayush Hospitals & Pharma Hiring', icon: Briefcase, color: 'hover:border-tertiary border-surface-container-high hover:bg-corporate-blue-pale/40' },
                { id: 'faculty', title: 'Faculty & Research Space', desc: 'FDPs, Research & Kshara Sutra Hub', icon: UserCheck, color: 'hover:border-purple-500 border-surface-container-high hover:bg-purple-50' },
                { id: 'institution', title: 'Ayush College / NCISM Admin', desc: 'Accreditation, NAAC & Compliance', icon: Building2, color: 'hover:border-amber-600 border-surface-container-high hover:bg-amber-50' }
              ].map(item => {
                const ItemIcon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleOpenAuth(item.id)}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 bg-surface-white shadow-xs group ${item.color}`}
                  >
                    <div className="p-2.5 rounded-xl bg-surface-container-low text-text-main group-hover:scale-110 transition-transform shrink-0">
                      <ItemIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-black text-text-main flex items-center justify-between">
                        <span className="truncate">{item.title}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                      </div>
                      <div className="text-[11px] text-outline truncate mt-0.5">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleOpenAuth('student')}
                className="px-8 py-3.5 rounded-2xl bg-primary text-white text-xs font-black hover:bg-primary-container shadow-md transition-all inline-flex items-center gap-2"
              >
                <LogIn className="w-4 h-4 text-leaf-green-accent" />
                <span>Open Sign In / Registration Modal</span>
              </button>
            </div>
          </div>
        ) : (
          /* ── LOGGED IN PORTAL TABS ── */
          <>
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
          </>
        )}
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
