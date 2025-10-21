import React from 'react';
import type { User, AnalysisResult, JobRecommendation, SkillToLearn } from '../types';
import { User as UserIcon, Briefcase, TrendingUp, Info } from 'lucide-react';
import SkillGapCard from '../components/SkillGapCard';

interface ProfilePageProps {
  user: User | null;
  analysisResult: AnalysisResult | null;
  completedResources: Set<string>;
  toggleResourceCompletion: (resourceId: string) => void;
}

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div className="bg-primary-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
    </div>
);

const ProfilePage: React.FC<ProfilePageProps> = ({ user, analysisResult, completedResources, toggleResourceCompletion }) => {
    
  const calculateProgress = (skillsToLearn: SkillToLearn[]): number => {
    const totalResources = skillsToLearn.reduce((acc, skill) => acc + skill.learningRoadmap.length, 0);
    if (totalResources === 0) return 100;

    const completedCount = skillsToLearn.reduce((acc, skill) => {
        return acc + skill.learningRoadmap.filter(res => completedResources.has(res.url)).length;
    }, 0);

    return Math.round((completedCount / totalResources) * 100);
  };
  
  return (
    <div className="space-y-12">
        <section>
            <div className="flex items-center gap-3 mb-4">
                <UserIcon className="w-8 h-8 text-primary-500" />
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">My Profile & Progress</h1>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <p className="text-xl text-gray-700 dark:text-gray-300">
                    Welcome, <span className="font-bold text-primary-600 dark:text-primary-400">{user?.name || 'User'}</span>!
                </p>
                <p className="mt-2 text-gray-500 dark:text-gray-400">This is your personal hub for tracking your career development based on your latest analysis.</p>
            </div>
        </section>

        <section>
            <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8 text-primary-500" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">My Learning Journey</h2>
            </div>
            
            {analysisResult ? (
                <div className="space-y-8">
                    {analysisResult.jobRecommendations.map((job: JobRecommendation, index: number) => (
                        <div key={index} className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Briefcase className="w-5 h-5"/>
                                        {job.role}
                                    </h3>
                                    <p className="text-sm text-gray-500">{job.company}</p>
                                </div>
                                <div className="text-right">
                                     <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Progress</p>
                                     <p className="font-bold text-lg text-primary-600">{calculateProgress(job.skillsToLearn)}%</p>
                                </div>
                            </div>

                            <ProgressBar progress={calculateProgress(job.skillsToLearn)} />
                            
                            <div className="mt-6">
                                <h4 className="font-semibold text-md text-gray-800 dark:text-gray-200 mb-3">Your Learning Roadmap for this Role:</h4>
                                {job.skillsToLearn.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {job.skillsToLearn.map((skillGap, i) => (
                                            <SkillGapCard 
                                                key={i} 
                                                skillGap={skillGap} 
                                                completedResources={completedResources}
                                                toggleResourceCompletion={toggleResourceCompletion}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">No specific skills to learn for this role. Great match!</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center">
                    <Info className="w-12 h-12 text-primary-500 mb-4" />
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">You haven't performed an analysis yet.</p>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Go to the dashboard to analyze your resume and see your learning journey here.</p>
                </div>
            )}
        </section>
    </div>
  );
};

export default ProfilePage;