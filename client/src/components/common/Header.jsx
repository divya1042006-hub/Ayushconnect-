import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Menu, Search, Bell, ShieldCheck, UserCheck, GraduationCap, Building2,
  Briefcase, PanelLeftClose, PanelLeft, LogIn, LogOut, ChevronDown,
  CheckCircle2, Award, Briefcase as JobIcon, Sparkles, X, Check, User,
  BookOpen, Compass, Users, Globe, HelpCircle, ArrowRight, CornerDownLeft
} from 'lucide-react';

const GLOBAL_SEARCH_INDEX = [
  // Views / Navigation
  { id: 'p1', title: 'AI Resume Screening & Career Matcher', type: 'page', tab: 'screening', role: 'student', desc: 'Upload resume to calculate HSSC skill gaps & apply to job openings', category: 'Portals & Tools', keywords: 'resume cv score match apply panchakarma percentage gap upload' },
  { id: 'p2', title: 'Smart Learning & Opportunity Hub', type: 'page', tab: 'recommendations', role: 'student', desc: 'AI courses, internships, and skill gap bridging recommendations', category: 'Portals & Tools', keywords: 'courses learning hub video youtube mcq quiz certificates bridge' },
  { id: 'p3', title: 'HSSC Skill Diagnostic & Roadmap', type: 'page', tab: 'roadmap', role: 'student', desc: 'Interactive skill tree, NOS benchmarks, and milestone progress', category: 'Portals & Tools', keywords: 'roadmap nos benchmarks standards skills level nsqf' },
  { id: 'p4', title: 'Student & Intern Career Dashboard', type: 'page', tab: 'student', role: 'student', desc: 'Live readiness score, quick actions, and active internships', category: 'Portals & Tools', keywords: 'student dashboard readiness profile certs' },
  { id: 'p5', title: 'Placement Management Pipeline', type: 'page', tab: 'placement', role: 'student', desc: 'Track job applications, interviews, offers, and campus drives', category: 'Portals & Tools', keywords: 'placement jobs applications drive interview pipeline' },
  { id: 'p6', title: 'Industry & Recruiter Hub', type: 'page', tab: 'recruiter', role: 'recruiter', desc: 'Search talent pool, post job openings, and verify candidates', category: 'Portals & Tools', keywords: 'recruiter hiring candidate talent jobs post shortlist' },
  { id: 'p7', title: 'Faculty & Research Portal', type: 'page', tab: 'faculty', role: 'faculty', desc: 'FDP programs, research grants, syllabus, and mentoring', category: 'Portals & Tools', keywords: 'faculty research fdp teaching mentor grants' },
  { id: 'p8', title: 'Academia-Industry Collaboration Space', type: 'page', tab: 'collaboration', role: 'faculty', desc: 'Joint clinical trials, MoU partnerships, and CSR funding', category: 'Portals & Tools', keywords: 'collaboration mou industry research partners csr' },
  { id: 'p9', title: 'Institution & NCISM Accreditation', type: 'page', tab: 'institution', role: 'admin', desc: 'College performance, NIRF ranking metrics, and compliance', category: 'Portals & Tools', keywords: 'institution college ncism accreditation nirf compliance' },
  { id: 'p10', title: 'Help Centre & Technical Support', type: 'page', tab: 'help', role: 'student', desc: 'FAQs, ticket submission, guidelines, and user manuals', category: 'Portals & Tools', keywords: 'help support faq contact tickets issues' },

  // Career Roles & Job Openings
  { id: 'j1', title: 'Panchakarma Clinical Specialist', type: 'job', tab: 'screening', role: 'student', desc: 'Patanjali Wellness Hub • ₹35,000 - ₹50,000/mo • 14 Openings', category: 'Jobs & Openings', keywords: 'panchakarma therapist abhyanga basti shirodhara haridwar' },
  { id: 'j2', title: 'Ayush Quality Control Analyst (GMP)', type: 'job', tab: 'screening', role: 'student', desc: 'Dabur Ayurvedic R&D • ₹28,000 - ₹42,000/mo • 8 Openings', category: 'Jobs & Openings', keywords: 'qc quality control dravyaguna kashaya pharma noida gmp' },
  { id: 'j3', title: 'Tele-Ayurveda Medical Officer', type: 'job', tab: 'screening', role: 'student', desc: 'NirogStreet Digital Care • ₹40,000 - ₹60,000/mo • 22 Openings', category: 'Jobs & Openings', keywords: 'telemedicine tele health online doctor ehr remote' },
  { id: 'j4', title: 'Therapeutic Yoga Consultant', type: 'job', tab: 'screening', role: 'student', desc: 'MDNIY Clinical Center • ₹30,000 - ₹45,000/mo • 11 Openings', category: 'Jobs & Openings', keywords: 'yoga pranayama asana mdniy ycb therapist' },
  { id: 'j5', title: 'Shalya Tantra Clinical Assistant', type: 'job', tab: 'screening', role: 'student', desc: 'BHU IMS Varanasi • ₹32,000 - ₹48,000/mo • 6 Openings', category: 'Jobs & Openings', keywords: 'shalya kshara sutra surgery ot sterile bhu' },
  { id: 'j6', title: 'Clinical Research Associate (Ayush)', type: 'job', tab: 'screening', role: 'student', desc: 'CCRAS New Delhi • ₹38,000 - ₹55,000/mo • 9 Openings', category: 'Jobs & Openings', keywords: 'clinical research associate trial ccras icmr' },

  // Courses & Certifications
  { id: 'c1', title: 'Panchakarma Therapy: Complete Clinical Protocol', type: 'course', tab: 'recommendations', role: 'student', desc: 'NIA Jaipur • 6 Weeks • SWAYAM / NPTEL • YouTube Demo & Quiz', category: 'Courses & Certifications', keywords: 'panchakarma snehana swedana basti course swayam' },
  { id: 'c2', title: 'Ayurvedic Pharmacology & Dravyaguna', type: 'course', tab: 'recommendations', role: 'student', desc: 'AIIA New Delhi • 4 Weeks • Ministry of Ayush e-Learning', category: 'Courses & Certifications', keywords: 'pharmacology dravyaguna kashaya dravya dravyaguna dravya' },
  { id: 'c3', title: 'Clinical Yoga & Naturopathy for Practitioners', type: 'course', tab: 'recommendations', role: 'student', desc: 'MDNIY Digital Academy • 3 Weeks • Free Certificate', category: 'Courses & Certifications', keywords: 'yoga naturopathy mdniy pranayama asana course' },
  { id: 'c4', title: 'AI & Digital Health Tools for Ayurveda', type: 'course', tab: 'recommendations', role: 'student', desc: 'AyushConnect Academy • 5 Weeks • Tele-Ayurveda Certification', category: 'Courses & Certifications', keywords: 'ai digital health telemedicine ehr abdm tech' },
  { id: 'c5', title: 'Kshara Sutra & Minimal Invasive Shalya', type: 'course', tab: 'recommendations', role: 'student', desc: 'BHU IMS Open Learning • 8 Weeks • OT Protocols', category: 'Courses & Certifications', keywords: 'kshara sutra shalya minor ot surgery' },
  { id: 'c6', title: 'Sterilization & Aseptic Technique in Ayurveda', type: 'course', tab: 'recommendations', role: 'student', desc: 'NCISM Certified • 2 Weeks • Clinical Safety', category: 'Courses & Certifications', keywords: 'sterilization aseptic infection control hygiene' },

  // NOS Packs
  { id: 'nos1', title: 'HSS/Q5701 - Panchakarma Paricharaka', type: 'nos', tab: 'roadmap', role: 'student', desc: 'NSQF Level 4 • Healthcare Sector Skill Council Standard', category: 'HSSC Standards', keywords: 'hss q5701 nos nsqf panchakarma standard' },
  { id: 'nos2', title: 'HSS/Q5704 - Ayush QC Associate', type: 'nos', tab: 'roadmap', role: 'student', desc: 'NSQF Level 5 • Quality Control & Testing Standards', category: 'HSSC Standards', keywords: 'hss q5704 quality analyst nos benchmark' },
  { id: 'nos3', title: 'HSS/Q2301 - Yoga Wellness Trainer', type: 'nos', tab: 'roadmap', role: 'student', desc: 'NSQF Level 4 • Yoga Certification Board & HSSC Standard', category: 'HSSC Standards', keywords: 'hss q2301 yoga nos trainer standard' }
];

export default function Header({ 
  activeRole, 
  setActiveRole, 
  user, 
  setIsSidebarOpen, 
  isCollapsed, 
  setIsCollapsed, 
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const userMenuRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

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
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return GLOBAL_SEARCH_INDEX.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.keywords.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [searchQuery]);

  const handleSelectSearchResult = (item) => {
    if (item.tab && setActiveTab) {
      setActiveTab(item.tab);
    }
    if (item.role && setActiveRole && activeRole !== item.role) {
      setActiveRole(item.role);
    }
    setSearchQuery('');
    setIsSearchOpen(false);
    setShowMobileSearch(false);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      handleSelectSearchResult(searchResults[0]);
    }
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
      setShowMobileSearch(false);
    }
  };

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

  const getResultIcon = (type) => {
    switch (type) {
      case 'job': return <Briefcase className="w-4 h-4 text-emerald-600" />;
      case 'course': return <BookOpen className="w-4 h-4 text-purple-600" />;
      case 'nos': return <ShieldCheck className="w-4 h-4 text-sky-600" />;
      default: return <Sparkles className="w-4 h-4 text-primary" />;
    }
  };

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
          {/* Mobile Search Toggle Button */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden p-2.5 rounded-2xl bg-surface-container-low border border-surface-container-high text-outline hover:text-primary hover:bg-surface-container transition-colors"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Quick Universal Search Bar (Desktop) */}
          <div className="relative hidden md:block w-60 lg:w-80" ref={searchRef}>
            <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search skills, jobs, courses, NOS..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-surface-container-low border border-surface-container-high text-xs font-semibold text-text-main focus:outline-none focus:border-primary focus:bg-white transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-surface-container-high text-outline hover:text-text-main"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Desktop Search Results Dropdown */}
            {isSearchOpen && searchQuery.trim() && (
              <div className="absolute left-0 right-0 mt-2 rounded-3xl bg-surface-white border border-surface-container-high shadow-2xl p-3 space-y-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-96 overflow-y-auto font-manrope">
                <div className="flex items-center justify-between px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-outline border-b border-surface-container-high">
                  <span>Search Results ({searchResults.length})</span>
                  <span>Press ↵ Enter to navigate</span>
                </div>

                {searchResults.length === 0 ? (
                  <div className="p-6 text-center space-y-1">
                    <p className="text-xs font-bold text-text-main">No matches found for &quot;{searchQuery}&quot;</p>
                    <p className="text-[11px] text-outline">Try searching for &apos;Panchakarma&apos;, &apos;Resume&apos;, &apos;QC&apos;, &apos;Yoga&apos;, or &apos;Jobs&apos;</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {searchResults.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectSearchResult(item)}
                        className="w-full p-2.5 rounded-2xl hover:bg-leaf-green-light/40 transition-all text-left flex items-start gap-3 group border border-transparent hover:border-leaf-green-accent/30"
                      >
                        <div className="p-2 rounded-xl bg-surface-container-low group-hover:bg-white text-primary transition-colors shrink-0 mt-0.5">
                          {getResultIcon(item.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-black text-text-main group-hover:text-primary truncate">
                              {item.title}
                            </span>
                            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-surface-container-low text-outline shrink-0">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-outline font-medium truncate mt-0.5">
                            {item.desc}
                          </p>
                        </div>

                        <ArrowRight className="w-3.5 h-3.5 text-outline opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 self-center text-primary" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
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

      {/* Mobile Search Expandable Bar */}
      {showMobileSearch && (
        <div className="md:hidden px-6 pb-4 pt-1 border-t border-surface-container-high bg-surface-white animate-in slide-in-from-top-2 duration-150 font-manrope">
          <div className="relative">
            <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search skills, jobs, courses, NOS..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-surface-container-low border border-surface-container-high text-xs font-semibold text-text-main focus:outline-none focus:border-primary focus:bg-white"
            />
            <button
              onClick={() => {
                setSearchQuery('');
                setShowMobileSearch(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-surface-container-high text-outline"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Mobile Search Results */}
            {searchQuery.trim() && (
              <div className="mt-2 rounded-3xl bg-surface-white border border-surface-container-high shadow-2xl p-3 space-y-1 max-h-80 overflow-y-auto">
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-xs text-outline font-medium">
                    No matches found for &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  searchResults.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectSearchResult(item)}
                      className="w-full p-2.5 rounded-2xl hover:bg-leaf-green-light/40 transition-all text-left flex items-start gap-2.5"
                    >
                      <div className="p-2 rounded-xl bg-surface-container-low text-primary shrink-0">
                        {getResultIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black text-text-main truncate">{item.title}</div>
                        <div className="text-[10px] text-outline truncate">{item.desc}</div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
