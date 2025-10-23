import React from 'react';
import type { SkillToLearn } from '../types';
import { GraduationCap, Link, Youtube, BookOpen, Clock } from 'lucide-react';

interface SkillGapCardProps {
  skillGap: SkillToLearn;
  completedResources: Set<string>;
  toggleResourceCompletion: (resourceId: string) => void;
}

const getIconForType = (type: string) => {
    switch (type) {
        case 'YouTube':
            return <Youtube className="w-4 h-4 text-red-500 flex-shrink-0" />;
        case 'Coursera':
            return <BookOpen className="w-4 h-4 text-blue-500 flex-shrink-0" />;
        default:
            return <Link className="w-4 h-4 text-gray-500 flex-shrink-0" />;
    }
}

const SkillGapCard: React.FC<SkillGapCardProps> = ({ skillGap, completedResources, toggleResourceCompletion }) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50 h-full flex flex-col">
      <h4 className="font-bold text-md text-gray-900 dark:text-white flex items-center gap-2">
        <GraduationCap className="w-5 h-5 text-gray-500" />
        {skillGap.skill}
      </h4>
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
        <Clock className="w-3 h-3" />
        <span>Est. time to learn: {skillGap.estimatedTimeline}</span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 my-2 flex-grow">{skillGap.reason}</p>
      <div className="space-y-2 mt-auto">
        {skillGap.learningRoadmap.map((resource, index) => {
          const resourceId = resource.url;
          const isCompleted = completedResources.has(resourceId);
          return (
            <div key={index} className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id={`${resourceId}-${skillGap.skill}`} // Ensure unique ID
                    checked={isCompleted}
                    onChange={() => toggleResourceCompletion(resourceId)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor={`${resourceId}-${skillGap.skill}`} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer min-w-0">
                    {getIconForType(resource.type)}
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`truncate hover:underline hover:text-primary-700 dark:hover:text-primary-300 ${isCompleted ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}
                    >
                      {resource.title}
                    </a>
                </label>
            </div>
          )
        })}
         {skillGap.learningRoadmap.length > 0 && (
          <p className="text-xs italic text-gray-400 dark:text-gray-500 pt-2">
            Note: AI-generated links may be inaccurate. Please verify.
          </p>
        )}
      </div>
    </div>
  );
};

export default SkillGapCard;