import React from 'react';
import { Leaf, Home, GraduationCap, Compass, Briefcase, FileCheck, Award, Building2, ShieldCheck, X, Sparkles, ChevronLeft, ChevronRight, BrainCircuit, Kanban, Handshake, HelpCircle, LogOut, LogIn } from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  activeRole, 
  setActiveRole, 
  isOpen, 
  setIsOpen, 
  isCollapsed, 
  setIsCollapsed, 
  user,
  onLogout,
  onOpenAuth
}) {
  const navTabs = [
    { id: 'home', label: 'Home Overview', icon: Home, role: 'student' },
    { id: 'student', label: 'Student Dashboard', icon: GraduationCap, role: 'student' },
    { id: 'roadmap', label: 'Skill Roadmap', icon: Compass, role: 'student' },
    { id: 'recommendations', label: 'AI Recommendations', icon: BrainCircuit, role: 'student' },
    { id: 'placement', label: 'Placement Hub', icon: Kanban, role: 'recruiter' },
    { id: 'recruiter', label: 'Recruiter Kanban', icon: Briefcase, role: 'recruiter' },
    { id: 'screening', label: 'AI Resume Screening', icon: FileCheck, role: 'recruiter' },
    { id: 'collaboration', label: 'Collaboration & Analytics', icon: Handshake, role: 'institution' },
    { id: 'faculty', label: 'Faculty Portal', icon: Award, role: 'faculty' },
    { id: 'institution', label: 'Institution Admin', icon: Building2, role: 'institution' },
    { id: 'help', label: 'Help Centre', icon: HelpCircle, role: 'student' },
  ];

  const handleTabClick = (tab, e) => {
    e.stopPropagation();
    setActiveTab(tab.id);
    setActiveRole(tab.role);
    // Auto-collapse sidebar after selecting any tab so full website is immediately visible!
    setIsCollapsed(true);
    if (setIsOpen) setIsOpen(false);
  };

  const handleSidebarClick = () => {
    // Toggle sidebar if clicking container
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  };

  const handleMouseLeave = () => {
    // Auto-collapse when mouse leaves the sidebar area
    if (!isCollapsed) {
      setIsCollapsed(true);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
        ></div>
      )}

      {/* Collapsible Left Sidebar (260px expanded, 80px collapsed) */}
      <aside 
        onClick={handleSidebarClick}
        onMouseLeave={handleMouseLeave}
        className={`fixed top-0 left-0 bottom-0 z-50 bg-surface-white border-r border-surface-container-high flex flex-col justify-between transition-all duration-300 shadow-wellness cursor-pointer lg:cursor-auto ${
          isCollapsed ? 'lg:w-[80px]' : 'lg:w-[260px]'
        } w-[260px] ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Top: Logo & Collapse Button */}
          <div className={`p-5 border-b border-surface-container-high flex items-center justify-between ${isCollapsed ? 'lg:px-3 lg:justify-center' : ''}`}>
            <div 
              onClick={(e) => { 
                e.stopPropagation(); 
                setActiveTab('home'); 
                setActiveRole('student'); 
                setIsCollapsed(true);
              }}
              className="flex items-center gap-3 cursor-pointer group shrink-0"
            >
              <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-wellness group-hover:scale-105 transition-transform shrink-0">
                <Leaf className="w-6 h-6 text-leaf-green-light" />
              </div>
              {!isCollapsed && (
                <div className="hidden lg:block">
                  <span className="font-black text-xl tracking-tight text-primary font-manrope block leading-tight">AyushConnect</span>
                  <span className="text-[10px] text-outline font-medium block">Side Menu</span>
                </div>
              )}
            </div>

            {/* Collapse/Expand Toggle Button on Desktop */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsCollapsed(!isCollapsed);
              }}
              className="p-2 rounded-xl hover:bg-leaf-green-light hover:text-primary text-outline hidden lg:flex items-center justify-center transition-all"
              title={isCollapsed ? "Expand Sidebar (260px)" : "Collapse Sidebar (Full Screen View)"}
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>

            {/* Close Button on Mobile */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="p-2 rounded-xl hover:bg-surface-container-low text-outline lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto py-5 px-3 space-y-4">
            {!isCollapsed && (
              <div className="px-3 text-[10px] font-extrabold text-outline uppercase tracking-wider hidden lg:block">
                Navigation
              </div>
            )}

            <div className="space-y-1.5">
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={(e) => handleTabClick(tab, e)}
                    title={tab.label}
                    className={`w-full flex items-center gap-3 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                      isCollapsed ? 'lg:justify-center lg:px-0 px-3.5' : 'px-3.5'
                    } ${
                      isActive
                        ? 'bg-leaf-green-light text-primary border border-leaf-green-accent/40 shadow-sm font-black scale-[1.02]'
                        : 'text-text-main/80 hover:bg-surface-container-low hover:text-primary'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary' : 'text-outline'}`} />
                    {!isCollapsed && <span className="truncate hidden lg:inline">{tab.label}</span>}
                    <span className="truncate lg:hidden">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Auto-collapse helper hint */}
            {!isCollapsed && (
              <div className="p-4 rounded-2xl bg-corporate-blue-pale/50 border border-tertiary/20 space-y-2 hidden lg:block">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-tertiary">
                  <Sparkles className="w-4 h-4" />
                  <span>Auto-Collapse Active</span>
                </div>
                <p className="text-[11px] text-outline leading-relaxed font-medium">
                  Selecting any tab or moving mouse outside automatically collapses sidebar.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar Bottom: Active User Persona & Sign Out */}
          <div className="p-3 border-t border-surface-container-high bg-surface-container-low/50">
            {!user ? (
              <button
                onClick={() => onOpenAuth && onOpenAuth(activeRole)}
                className={`w-full p-2.5 rounded-2xl bg-primary text-white font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-primary-container transition-all shadow-wellness ${
                  isCollapsed ? 'p-2' : ''
                }`}
                title="Sign In"
              >
                <LogIn className="w-4 h-4 text-leaf-green-accent" />
                {!isCollapsed && <span>Sign In to Portal</span>}
              </button>
            ) : (
              <div className={`p-2.5 rounded-2xl bg-white border border-surface-container-high flex items-center justify-between gap-2 shadow-xs ${isCollapsed ? 'lg:justify-center' : ''}`}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-primary text-white font-extrabold flex items-center justify-center text-sm shadow-sm ring-2 ring-leaf-green-light shrink-0">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  {!isCollapsed && (
                    <div className="overflow-hidden text-left hidden lg:block">
                      <div className="text-xs font-extrabold text-text-main truncate flex items-center gap-1">
                        {user.name}
                        <ShieldCheck className="w-3.5 h-3.5 text-leaf-green-accent shrink-0" />
                      </div>
                      <div className="text-[10px] text-outline truncate font-medium">{user.degree || user.company || user.department || 'Ayush Practitioner'}</div>
                    </div>
                  )}
                </div>
                {!isCollapsed && onLogout && (
                  <button
                    onClick={onLogout}
                    title="Sign Out"
                    className="p-2 rounded-xl text-outline hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
