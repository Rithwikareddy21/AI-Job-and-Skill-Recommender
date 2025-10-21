import React from 'react';
import { analyzeResume } from '../services/geminiService';
import type { AnalysisResult } from '../types';
import AnalysisResults from '../components/AnalysisResults';
import Loader from '../components/Loader';
import InputSelection from '../components/InputSelection';
import { MessageSquare } from 'lucide-react';

interface DashboardPageProps {
  analysisResult: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  completedResources: Set<string>;
  toggleResourceCompletion: (resourceId: string) => void;
  onNavigateToChat: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  analysisResult,
  isLoading,
  error,
  setAnalysisResult,
  setIsLoading,
  setError,
  completedResources,
  toggleResourceCompletion,
  onNavigateToChat
}) => {
  
  const handleAnalysis = async (input: string | { inlineData: { data: string; mimeType: string; } } | string[]) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const result = await analyzeResume(input);
      setAnalysisResult(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  }

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 font-medium">{error}</p>
        <button
          onClick={handleReset}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (analysisResult) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Your Career Analysis</h1>
          <div className="flex items-center gap-2">
              <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
              >
                  Analyze Another
              </button>
              <button
                  onClick={onNavigateToChat}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                  <MessageSquare className="w-4 h-4" />
                  Chat about results
              </button>
          </div>
        </div>
        <AnalysisResults 
          result={analysisResult} 
          completedResources={completedResources}
          toggleResourceCompletion={toggleResourceCompletion}
        />
      </div>
    );
  }

  return (
    <div>
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Provide Your Professional Details
            </h1>
            <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Upload your resume or enter your skills to get started.
            </p>
        </div>
        <InputSelection onAnalyze={handleAnalysis} />
    </div>
  );
};

export default DashboardPage;