import React from 'react';
import type { User, JobRecommendation, SkillToLearn } from '../types';
import { User as UserIcon, TrendingUp, Info, ArrowRight } from 'lucide-react';
import JobCard from '../components/JobCard';

interface UserDashboardPageProps {
  user: User | null;
  selectedJob: JobRecommendation | null;
  completedResources: Set<string>;
  toggleResourceCompletion: (resourceId: string) => void;
  onNavigateToRoles: () => void;
}

const UserDashboardPage: React.FC<UserDashboardPageProps> = ({ user, selectedJob, completedResources, toggleResourceCompletion, onNavigateToRoles }) => {
    
  const calculateProgress = (skillsToLearn: SkillToLearn[]): number => {
    const totalResources = skillsToLearn.reduce((acc, skill) => acc + skill.learningRoadmap.length, 0);
    if (totalResources === 0) return 100;

    const completedCount = skillsToLearn.reduce((acc, skill) => {
        return acc + skill.learningRoadmap.filter(res => completedResources.has(res.url)).length;
    }, 0);

    return Math.round((completedCount / totalResources) * 100);
  };
  
  return (
    <div className="space-y-12 page-animation">
        <section>
            <div className="flex items-center gap-3 mb-4">
                <UserIcon className="w-8 h-8 text-primary-500" />
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">My Progress Dashboard</h1>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <p className="text-xl text-gray-700 dark:text-gray-300">
                    Welcome, <span className="font-bold text-primary-600 dark:text-primary-400">{user?.name || 'User'}</span>!
                </p>
                <p className="mt-2 text-gray-500 dark:text-gray-400">This is your personal hub for tracking your career development for your chosen career path.</p>
            </div>
        </section>

        <section>
            <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8 text-primary-500" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">My Learning Journey</h2>
            </div>
            
            {selectedJob ? (
                <div className="space-y-8">
                   <JobCard 
                     job={selectedJob}
                     completedResources={completedResources}
                     toggleResourceCompletion={toggleResourceCompletion}
                     calculateProgress={calculateProgress}
                   />
                </div>
            ) : (
                <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center">
                    <Info className="w-12 h-12 text-primary-500 mb-4" />
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">You haven't selected a career path yet.</p>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Choose a path from your analysis results to track your progress here.</p>
                     <button
                        onClick={onNavigateToRoles}
                        className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
                        >
                        Choose a Path
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </section>
    </div>
  );
};

export default UserDashboardPage;