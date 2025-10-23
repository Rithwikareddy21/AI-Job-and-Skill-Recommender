import React from 'react';
import type { LearningResource, SkillToLearn } from '../types';
import { GraduationCap, Search, Youtube, BookOpen, Clock } from 'lucide-react';

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
            return <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />;
    }
}

const SkillGapCard: React.FC<SkillGapCardProps> = ({ skillGap, completedResources, toggleResourceCompletion }) => {

  const handleResourceClick = (resource: LearningResource) => {
    let searchUrl = '';
    const encodedTitle = encodeURIComponent(resource.title);

    switch (resource.type) {
      case 'YouTube':
        searchUrl = `https://www.youtube.com/results?search_query=${encodedTitle}`;
        break;
      default:
        searchUrl = `https://www.google.com/search?q=${encodedTitle}`;
        break;
    }

    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };

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
          const resourceId = resource.url; // Use URL as a stable unique ID for tracking
          const isCompleted = completedResources.has(resourceId);
          return (
            <div key={index} className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id={`${resourceId}-${skillGap.skill}`} // Ensure unique ID
                    checked={isCompleted}
                    onChange={() => toggleResourceCompletion(resourceId)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 min-w-0">
                    {getIconForType(resource.type)}
                    <button
                      onClick={() => handleResourceClick(resource)}
                      className={`truncate text-left hover:underline hover:text-primary-700 dark:hover:text-primary-300 ${isCompleted ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}
                      title={`Search for: ${resource.title}`}
                    >
                      {resource.title}
                    </button>
                </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default SkillGapCard;