import React from 'react';
import { Home, GraduationCap, Compass, Briefcase, FileCheck, Award, Building2 } from 'lucide-react';

export default function RoleSwitcher({ activeTab, setActiveTab, activeRole, setActiveRole }) {
  const tabs = [
    { id: 'home', label: 'Home Overview', icon: Home, role: 'student' },
    { id: 'student', label: 'Student Dashboard', icon: GraduationCap, role: 'student' },
    { id: 'roadmap', label: 'Skill Diagnostic & Roadmap', icon: Compass, role: 'student' },
    { id: 'recruiter', label: 'Recruiter Kanban', icon: Briefcase, role: 'recruiter' },
    { id: 'screening', label: 'AI Resume Screening', icon: FileCheck, role: 'recruiter' },
    { id: 'faculty', label: 'Faculty / FDP Portal', icon: Award, role: 'faculty' },
    { id: 'institution', label: 'Institution Admin', icon: Building2, role: 'institution' }
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    setActiveRole(tab.role);
  };

  return (
    <div className="bg-primary text-white py-3 px-6 md:px-12 shadow-wellness sticky top-[73px] z-30 overflow-x-auto border-b border-primary-container">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4 min-w-max">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-extrabold text-leaf-green-accent tracking-wider mr-3 hidden sm:inline">
            Stitch Screens Demo:
          </span>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-leaf-green-light text-primary shadow-md scale-[1.02]'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-leaf-green-light'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Demo Switcher Indicator */}
        <div className="hidden xl:flex items-center gap-2.5 text-xs text-leaf-green-light/90 bg-black/25 px-3.5 py-1.5 rounded-xl border border-white/10">
          <span className="w-2 h-2 rounded-full bg-leaf-green-accent animate-ping"></span>
          <span>Click any tab to present persona screen</span>
        </div>
      </div>
    </div>
  );
}
