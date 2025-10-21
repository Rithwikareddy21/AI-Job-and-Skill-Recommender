import React, { useState } from 'react';
import UploadResume from './UploadResume';

interface InputSelectionProps {
    onAnalyze: (input: string | { inlineData: { data: string; mimeType: string; } } | string[]) => void;
}

const InputSelection: React.FC<InputSelectionProps> = ({ onAnalyze }) => {
  const [inputType, setInputType] = useState<'resume' | 'skills'>('resume');
  const [skills, setSkills] = useState('');

  const handleSkillsSubmit = () => {
    if (skills.trim()) {
      const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
      onAnalyze(skillsArray);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
            <button 
                onClick={() => setInputType('resume')}
                className={`flex-1 py-3 text-center font-medium transition-colors duration-200 ${inputType === 'resume' ? 'border-b-2 border-primary-600 text-primary-700 dark:text-primary-200' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
                Upload Resume
            </button>
            <button 
                onClick={() => setInputType('skills')}
                className={`flex-1 py-3 text-center font-medium transition-colors duration-200 ${inputType === 'skills' ? 'border-b-2 border-primary-600 text-primary-700 dark:text-primary-200' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
                Enter Skills
            </button>
        </div>

        {inputType === 'resume' ? (
            <UploadResume onAnalyze={onAnalyze} />
        ) : (
            <div>
                <label htmlFor="skills-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enter your skills, separated by commas
                </label>
                <textarea
                    id="skills-input"
                    rows={5}
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g., React, TypeScript, Node.js, Project Management"
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                />
                <button
                    onClick={handleSkillsSubmit}
                    className="mt-4 w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    Analyze Skills
                </button>
            </div>
        )}
    </div>
  );
};

export default InputSelection;