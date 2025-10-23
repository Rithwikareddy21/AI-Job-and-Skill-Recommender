import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import Navbar from './components/Navbar';
import UserDashboardPage from './pages/UserDashboardPage';
import ChatPage from './pages/ChatPage';
import RolesPage from './pages/RolesPage';
import RoadmapPage from './pages/RoadmapPage';
import InsightsPage from './pages/InsightsPage';

import type { AnalysisResult, User, JobRecommendation } from './types';

type Page = 'login' | 'home' | 'dashboard' | 'roles' | 'roadmap' | 'profile' | 'chat' | 'insights';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>('login');
  
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedResources, setCompletedResources] = useState<Set<string>>(new Set());
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleLogin = (name: string) => {
    setUser({ name });
    setPage('home');
  };
  
  const handleLogout = () => {
    setUser(null);
    setAnalysisResult(null);
    setSelectedJob(null);
    setCompletedResources(new Set());
    setPage('login');
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setPage('roles');
  };
  
  const handleRoleSelected = (job: JobRecommendation) => {
    setSelectedJob(job);
    setPage('roadmap');
  };
  
  const toggleResourceCompletion = (resourceId: string) => {
    setCompletedResources(prev => {
      const newSet = new Set(prev);
      if (newSet.has(resourceId)) {
        newSet.delete(resourceId);
      } else {
        newSet.add(resourceId);
      }
      return newSet;
    });
  };

  const navigate = (targetPage: Page) => {
    // Prevent access to certain pages if analysis isn't done
    if ((targetPage === 'chat' || targetPage === 'profile' || targetPage === 'insights' || targetPage === 'roadmap' || targetPage === 'roles') && !analysisResult) {
      setPage('dashboard');
      return;
    }
     // Prevent access to roadmap/profile if a job hasn't been selected
    if ((targetPage === 'roadmap' || targetPage === 'profile') && !selectedJob) {
      setPage('roles');
      return;
    }
    setPage(targetPage);
  };

  const renderPage = () => {
    switch(page) {
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'home':
        return <HomePage onStartAnalysis={() => navigate('dashboard')} />;
      case 'dashboard':
        return <DashboardPage 
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  setError={setError}
                  error={error}
                  onAnalysisComplete={handleAnalysisComplete}
                  onReset={() => {
                    setAnalysisResult(null);
                    setSelectedJob(null);
                    setError(null);
                  }}
               />;
      case 'roles':
        return <RolesPage analysisResult={analysisResult!} onRoleSelect={handleRoleSelected} />;
      case 'roadmap':
        return <RoadmapPage 
                  selectedJob={selectedJob!} 
                  completedResources={completedResources}
                  toggleResourceCompletion={toggleResourceCompletion}
                  onNavigateToChat={() => navigate('chat')}
                  onNavigateBack={() => navigate('roles')}
                />;
      case 'profile':
        return <UserDashboardPage 
                  user={user} 
                  selectedJob={selectedJob}
                  completedResources={completedResources}
                  toggleResourceCompletion={toggleResourceCompletion}
                  onNavigateToRoles={() => navigate('roles')}
                />
      case 'chat':
        return <ChatPage 
                  analysisContext={analysisResult} 
                  onNavigateBack={() => navigate('roadmap')} 
                />
      case 'insights':
        return <InsightsPage 
                  domain={analysisResult?.domainStrength} 
                  onNavigateBack={() => navigate('roles')}
                />
      default:
        return <LoginPage onLogin={handleLogin} />;
    }
  }

  return (
    <div>
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onNavigateHome={() => navigate(user ? 'home' : 'login')}
        onNavigateToDashboard={() => navigate('dashboard')}
        onNavigateToProfile={() => navigate('profile')}
        onNavigateToChat={() => navigate('chat')}
        onNavigateToInsights={() => navigate('insights')}
        isAnalysisDone={!!analysisResult}
        isJobSelected={!!selectedJob}
        theme={theme}
        onToggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
      />
      <main className="container mx-auto px-4 py-8">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;