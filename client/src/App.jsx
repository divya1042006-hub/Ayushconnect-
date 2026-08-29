import React, { useState, useEffect } from 'react';
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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState('student');

  useEffect(() => {
    // Only fetch default user if there isn't already a user in state or user matches active role
    if (!user || user.role !== activeRole) {
      fetch(`${API_BASE}/api/auth/me?role=${activeRole}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data?.success && !user) {
            setUser(data.user);
          }
        })
        .catch(() => {});
    }
  }, [activeRole]);

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
    } catch (e) {
      console.error('Logout error:', e);
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

      {/* Main Content Canvas offset dynamically by left sidebar */}
      <main 
        onClick={() => !isSidebarCollapsed && setIsSidebarCollapsed(true)}
        className={`flex-1 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[260px]'
        } w-full max-w-[1440px] px-6 sm:px-10 lg:px-12 py-8 md:py-12`}
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
