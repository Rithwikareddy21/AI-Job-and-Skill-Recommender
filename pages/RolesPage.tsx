import React, { useState } from 'react';
import type { AnalysisResult, JobRecommendation } from '../types';
import { BrainCircuit, Briefcase, Star, TrendingUp, UserCheck, ArrowRight } from 'lucide-react';
import SkillsModal from '../components/SkillsModal';

interface RoleSelectionCardProps {
  job: JobRecommendation;
  onSelect: () => void;
}

const RoleSelectionCard: React.FC<RoleSelectionCardProps> = ({ job, onSelect }) => {
    const matchColor = job.matchPercentage > 75 ? 'text-green-500 bg-green-100 dark:bg-green-900/50 dark:text-green-300' 
        : job.matchPercentage > 50 ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/50 dark:text-yellow-300' 
        : 'text-red-500 bg-red-100 dark:bg-red-900/50 dark:text-red-300';

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col">
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{job.role}</h3>
                     <div className={`flex items-center gap-1.5 font-bold text-sm px-2 py-1 rounded-full ${matchColor}`}>
                        <Star className="w-4 h-4" />
                        <span>{job.matchPercentage}% Match</span>
                    </div>
                </div>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{job.company} - {job.location}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">{job.description}</p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                 <button onClick={onSelect} className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Choose this Path
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};


interface RolesPageProps {
  analysisResult: AnalysisResult;
  onRoleSelect: (job: JobRecommendation) => void;
}

const RolesPage: React.FC<RolesPageProps> = ({ analysisResult, onRoleSelect }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-12 page-animation">
        {isModalOpen && <SkillsModal skills={analysisResult.extractedSkills} onClose={() => setIsModalOpen(false)} />}
        <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Your Analysis is Complete!
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-gray-600 dark:text-gray-300">
                Here's a summary of your profile. Choose one of the recommended career paths below to generate a personalized learning roadmap.
            </p>
        </div>

        {/* Summary Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                 <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-2"><UserCheck className="w-5 h-5 text-primary-500"/> Your Profile</h2>
                 <p><strong className="font-medium">Domain:</strong> {analysisResult.domainStrength}</p>
                 <p><strong className="font-medium">Experience:</strong> {analysisResult.experienceLevel}</p>
            </div>
             <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                 <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-2"><BrainCircuit className="w-5 h-5 text-primary-500"/> Key Skills</h2>
                 <div className="flex flex-wrap gap-2 mt-2 items-center">
                    {analysisResult.extractedSkills.slice(0, 7).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-200 text-xs font-medium rounded-full">
                        {skill}
                      </span>
                    ))}
                    {analysisResult.extractedSkills.length > 7 && (
                        <button onClick={() => setIsModalOpen(true)} className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline">
                            ...and more
                        </button>
                    )}
                  </div>
            </div>
        </section>

        {/* Job Recommendations Section */}
        <section>
             <div className="flex items-center gap-3 mb-4 justify-center">
              <Briefcase className="w-8 h-8 text-primary-500" />
              <h2 className="text-2xl text-center font-bold text-gray-800 dark:text-gray-200">Select Your Career Path</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analysisResult.jobRecommendations.map((job, index) => (
                    <RoleSelectionCard key={index} job={job} onSelect={() => onRoleSelect(job)} />
                ))}
            </div>
        </section>
    </div>
  );
};

export default RolesPage;