import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import Navbar from './components/Navbar';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';
import type { AnalysisResult, User } from './types';

type Page = 'login' | 'home' | 'dashboard' | 'profile' | 'chat';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>('login');
  
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedResources, setCompletedResources] = useState<Set<string>>(new Set());

  const handleLogin = (name: string) => {
    setUser({ name });
    setPage('home');
  };
  
  const handleLogout = () => {
    setUser(null);
    setAnalysisResult(null);
    setCompletedResources(new Set());
    setPage('login');
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
                  analysisResult={analysisResult}
                  isLoading={isLoading}
                  error={error}
                  setAnalysisResult={setAnalysisResult}
                  setIsLoading={setIsLoading}
                  setError={setError}
                  completedResources={completedResources}
                  toggleResourceCompletion={toggleResourceCompletion}
                  onNavigateToChat={() => navigate('chat')}
               />;
      case 'profile':
        return <ProfilePage 
                  user={user} 
                  analysisResult={analysisResult} 
                  completedResources={completedResources}
                  toggleResourceCompletion={toggleResourceCompletion}
                />
      case 'chat':
        return <ChatPage analysisContext={analysisResult} />
      default:
        return <LoginPage onLogin={handleLogin} />;
    }
  }

  return (
    <>
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onNavigateHome={() => navigate(user ? 'home' : 'login')}
        onNavigateToDashboard={() => navigate('dashboard')}
        onNavigateToProfile={() => navigate('profile')}
        onNavigateToChat={() => navigate('chat')}
        isAnalysisDone={!!analysisResult}
      />
      <main className="container mx-auto px-4 py-8">
        {renderPage()}
      </main>
    </>
  );
}

export default App;