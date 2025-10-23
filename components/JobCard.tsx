import React from 'react';
import type { JobRecommendation, SkillToLearn } from '../types';
import SkillGapCard from './SkillGapCard';
import { MapPin, Building, Briefcase } from 'lucide-react';

interface JobCardProps {
  job: JobRecommendation;
  completedResources: Set<string>;
  toggleResourceCompletion: (resourceId: string) => void;
  calculateProgress: (skillsToLearn: SkillToLearn[]) => number;
}

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div className="bg-primary-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
    </div>
);

const JobCard: React.FC<JobCardProps> = ({ job, completedResources, toggleResourceCompletion, calculateProgress }) => {
  const progress = calculateProgress(job.skillsToLearn);
  
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
            <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5"/>
                    {job.role}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <span className="flex items-center gap-1"><Building className="w-4 h-4" /> {job.company}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                </div>
            </div>
            <div className="text-left sm:text-right w-full sm:w-auto">
                 <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Learning Progress</p>
                 <p className="font-bold text-lg text-primary-600">{progress}%</p>
            </div>
        </div>

        <ProgressBar progress={progress} />
        
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
  );
};

export default JobCard;
