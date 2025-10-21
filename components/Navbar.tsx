import React from 'react';
import { Briefcase, LogOut, User as UserIcon, LayoutDashboard, MessageSquare } from 'lucide-react';
import type { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onNavigateHome: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToProfile: () => void;
  onNavigateToChat: () => void;
  isAnalysisDone: boolean;
}

const NavButton: React.FC<{onClick: () => void, children: React.ReactNode}> = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors"
  >
    {children}
  </button>
);


const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigateHome, onNavigateToDashboard, onNavigateToProfile, onNavigateToChat, isAnalysisDone }) => {
  return (
    <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <button onClick={onNavigateHome} className="flex items-center gap-2 cursor-pointer">
            <Briefcase className="w-8 h-8 text-primary-600" />
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">AI Career Advisor</h1>
          </button>
          {user && (
            <div className="flex items-center gap-2 sm:gap-4">
                <span className="hidden lg:block text-sm font-medium text-gray-600 dark:text-gray-300">Welcome, {user.name}</span>
                
                <NavButton onClick={onNavigateToDashboard}>
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:block">Dashboard</span>
                </NavButton>

                {isAnalysisDone && (
                  <>
                    <NavButton onClick={onNavigateToProfile}>
                      <UserIcon className="w-4 h-4" />
                      <span className="hidden sm:block">My Profile</span>
                    </NavButton>
                    <NavButton onClick={onNavigateToChat}>
                      <MessageSquare className="w-4 h-4" />
                      <span className="hidden sm:block">Chat AI</span>
                    </NavButton>
                  </>
                )}

                <button 
                    onClick={onLogout}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600/50"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:block">Logout</span>
                </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;