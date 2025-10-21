import React from 'react';
import type { AnalysisResult } from '../types';
import JobCard from './JobCard';
import { ClipboardList, BrainCircuit, Briefcase } from 'lucide-react';

interface AnalysisResultsProps {
  result: AnalysisResult;
  completedResources: Set<string>;
  toggleResourceCompletion: (resourceId: string) => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, completedResources, toggleResourceCompletion }) => {
  return (
    <div className="space-y-16">
      {/* Professional Summary */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <ClipboardList className="w-8 h-8 text-primary-500" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Professional Summary</h2>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-gray-700 dark:text-gray-300">{result.summary}</p>
        </div>
      </section>

      {/* Extracted Skills */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <BrainCircuit className="w-8 h-8 text-primary-500" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Your Skills</h2>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {result.extractedSkills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-200 text-sm font-medium rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Job Recommendations */}
      <section>
         <div className="flex items-center gap-3 mb-4">
          <Briefcase className="w-8 h-8 text-primary-500" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Job Recommendations</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.jobRecommendations.map((job, index) => (
            <JobCard 
              key={index} 
              job={job} 
              completedResources={completedResources}
              toggleResourceCompletion={toggleResourceCompletion}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default AnalysisResults;