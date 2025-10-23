import React from 'react';
import { analyzeResume } from '../services/geminiService';
import type { AnalysisResult } from '../types';
import InputSelection from '../components/InputSelection';
import InputSelectionSkeleton from '../components/InputSelectionSkeleton';

interface DashboardPageProps {
  isLoading: boolean;
  error: string | null;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  onAnalysisComplete: (result: AnalysisResult) => void;
  onReset: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  isLoading,
  error,
  setIsLoading,
  setError,
  onAnalysisComplete,
  onReset
}) => {
  
  const handleAnalysis = async (input: string | { inlineData: { data: string; mimeType: string; } } | string[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeResume(input);
      onAnalysisComplete(result);
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
  
  const handleResetAndTryAgain = () => {
    setError(null);
    setIsLoading(false);
    onReset();
  }

  return (
    <div className="page-animation">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Provide Your Professional Details
            </h1>
            <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Upload your resume or enter your skills to get started.
            </p>
        </div>

        {isLoading ? (
          <InputSelectionSkeleton />
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 font-medium">{error}</p>
            <button
              onClick={handleResetAndTryAgain}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <InputSelection onAnalyze={handleAnalysis} />
        )}
    </div>
  );
};

export default DashboardPage;