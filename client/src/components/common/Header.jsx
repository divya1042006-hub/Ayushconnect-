import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, ShieldCheck, UserCheck, GraduationCap, Building2, Briefcase, PanelLeftClose, PanelLeft, LogIn, LogOut, ChevronDown, CheckCircle2, Award, Briefcase as JobIcon, Sparkles, X, Check, User } from 'lucide-react';

export default function Header({ 
  activeRole, 
  setActiveRole, 
  user, 
  setIsSidebarOpen, 
  isCollapsed, 
  setIsCollapsed, 
  activeTab,
  onOpenAuth,
  onLogout
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const notifRef = useRef(null);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Application Submitted', desc: 'Successfully applied to Patanjali Senior Panchakarma Clinical Intern.', time: '2m ago', type: 'job', unread: true },
    { id: 2, title: 'HSSC NOS Verified', desc: 'Panchakarma Procedure Execution score updated to 85%.', time: '1h ago', type: 'cert', unread: true },
    { id: 3, title: 'Interview Scheduled', desc: 'Patanjali Wellness Hub scheduled interview for tomorrow at 11:30 AM.', time: '3h ago', type: 'job', unread: true },
    { id: 4, title: 'FDP Registration Open', desc: 'Ministry of Ayush CSIR-CIMAP Lucknow program is accepting applications.', time: '1d ago', type: 'fdp', unread: false }
  ]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabTitles = {
    home: 'Home Overview',
    student: 'Student & Intern Dashboard',
    roadmap: 'HSSC Skill Diagnostic & Roadmap',
    recommendations: 'AI Skill Gap & Career Recommendations',
    placement: 'Placement Management Pipeline',
    recruiter: 'Industry & Recruiter Hub',
    screening: 'AI Resume Screening & Match Scoring',
    collaboration: 'Academia-Industry Collaboration Space',
    faculty: 'Faculty & Research Portal',
    institution: 'Institution & NCISM Accreditation',
    help: 'Help Centre & Support'
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const clearNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  const roleLabel = activeRole === 'student' ? 'Student' : activeRole === 'recruiter' ? 'Industry Recruiter' : activeRole === 'faculty' ? 'Faculty Member' : 'NCISM Admin';

  return (
    <header className={`sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-surface-container-high transition-all duration-300 ${
      isCollapsed ? 'lg:pl-[80px]' : 'lg:pl-[260px]'
    }`}>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 h-20 flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu Button & Context Title */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2.5 rounded-2xl bg-surface-container-low border border-surface-container-high text-primary hover:bg-surface-container transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop Collapse Toggle */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-2.5 rounded-2xl bg-surface-container-low border border-surface-container-high text-outline hover:text-primary hover:bg-surface-container transition-colors items-center gap-1.5 text-xs font-bold"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <PanelLeft className="w-4 h-4 text-primary" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>

          <div className="hidden sm:block">
            <div className="text-[11px] font-black uppercase tracking-wider text-outline">
              AyushConnect Portal
            </div>
            <h1 className="text-lg font-black text-text-main leading-tight font-manrope">
              {tabTitles[activeTab] || 'Ayush Dashboard'}
            </h1>
          </div>
        </div>

        {/* Right Actions: Search, Notifications & User Menu */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Quick Search */}
          <div className="relative hidden md:block w-48 lg:w-64">
            <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search skills, jobs, NOS..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-surface-container-low border border-surface-container-high text-xs font-semibold text-text-main focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Notification Bell Dropdown */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 rounded-2xl bg-surface-container-low border border-surface-container-high text-outline hover:text-primary hover:bg-surface-container transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary text-white text-[9px] font-extrabold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-surface-white border border-surface-container-high shadow-2xl p-5 space-y-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-primary" />
                    <span className="text-sm font-black text-text-main">Notifications</span>
                    <span className="px-2 py-0.5 rounded-full bg-leaf-green-light text-primary text-[10px] font-extrabold">
                      {notifications.length}
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllRead}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Mark read
                    </button>
                  )}
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8 text-xs text-outline font-semibold">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`p-3 rounded-2xl border transition-all ${
                          n.unread 
                            ? 'bg-leaf-green-light/40 border-leaf-green-accent/40 shadow-xs' 
                            : 'bg-surface-container-lowest border-surface-container-high opacity-80'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-black text-text-main flex items-center gap-1.5">
                            {n.type === 'job' && <JobIcon className="w-3.5 h-3.5 text-primary" />}
                            {n.type === 'cert' && <Award className="w-3.5 h-3.5 text-purple-700" />}
                            {n.type === 'fdp' && <Sparkles className="w-3.5 h-3.5 text-amber-600" />}
                            {n.title}
                          </span>
                          <span className="text-[10px] text-outline shrink-0">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-outline font-medium mt-1 leading-relaxed">{n.desc}</p>
                      </div>
                    ))
                  )}
                </div>

                {notifications.length > 0 && (
                  <button 
                    onClick={clearNotifications}
                    className="w-full py-2 text-center text-xs font-extrabold text-outline hover:text-match-error transition-colors border-t border-surface-container-high pt-3"
                  >
                    Clear All Notifications
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="h-7 w-px bg-surface-container-high hidden sm:block"></div>

          {/* User Profile & Dropdown with Sign Out */}
          {!user ? (
            <button
              onClick={() => onOpenAuth && onOpenAuth(activeRole)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-white text-xs font-extrabold hover:bg-primary-container transition-all shadow-wellness"
            >
              <LogIn className="w-4 h-4 text-leaf-green-accent" />
              <span>Sign In</span>
            </button>
          ) : (
            <div className="relative" ref={userMenuRef}>
              <div 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 cursor-pointer group p-1.5 rounded-2xl hover:bg-surface-container-low transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary text-white font-extrabold flex items-center justify-center text-base shadow-sm ring-2 ring-leaf-green-light group-hover:scale-105 transition-transform">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-extrabold text-text-main line-clamp-1 flex items-center gap-1.5">
                    {user.name}
                    <ShieldCheck className="w-4 h-4 text-leaf-green-accent" />
                  </div>
                  <div className="text-[11px] text-outline line-clamp-1">{user.degree || user.company || user.department || 'Ayush Practitioner'}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-outline group-hover:text-primary transition-colors hidden sm:block" />
              </div>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-72 rounded-3xl bg-surface-white border border-surface-container-high shadow-2xl p-4 space-y-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User Info Header */}
                  <div className="p-3.5 rounded-2xl bg-surface-container-low/70 border border-surface-container-high space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-black text-text-main truncate">
                          {user.name}
                        </div>
                        <div className="text-[11px] text-outline truncate">{user.email || 'Verified account'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-leaf-green-light text-primary text-[10px] font-extrabold border border-leaf-green-accent/30">
                        {roleLabel}
                      </span>
                      <span className="text-[10px] text-outline truncate">{user.institution || user.company || 'AyushConnect'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-1.5 pt-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        if (onOpenAuth) onOpenAuth(activeRole);
                      }}
                      className="w-full py-2.5 px-3 rounded-xl hover:bg-surface-container text-xs font-extrabold text-primary flex items-center gap-2.5 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-leaf-green-accent" />
                      <span>Switch Account / Persona</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        if (onLogout) onLogout();
                      }}
                      className="w-full py-2.5 px-3 rounded-xl hover:bg-red-50 text-xs font-extrabold text-red-600 flex items-center gap-2.5 transition-colors border-t border-surface-container-high pt-2.5 mt-1"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
