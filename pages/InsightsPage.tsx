import React, { useState, useEffect } from 'react';
import { getMarketInsights } from '../services/geminiService';
import type { MarketInsights } from '../types';
import Loader from '../components/Loader';
import { Lightbulb, DollarSign, Building2, TrendingUp, Info, ArrowLeft } from 'lucide-react';

interface InsightsPageProps {
    domain: string | undefined;
    onNavigateBack: () => void;
}

const InfoCard: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
            {icon}
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
        </div>
        {children}
    </div>
);

const InsightsPage: React.FC<InsightsPageProps> = ({ domain, onNavigateBack }) => {
    const [insights, setInsights] = useState<MarketInsights | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInsights = async () => {
            if (!domain) {
                setError("Please perform an analysis first to identify your primary domain.");
                setIsLoading(false);
                return;
            }
            try {
                const result = await getMarketInsights(domain);
                setInsights(result);
            } catch (err) {
                 if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred while fetching insights.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchInsights();
    }, [domain]);
    
    if (isLoading) {
        return <Loader />;
    }

    if (error) {
         return (
            <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center">
                <Info className="w-12 h-12 text-yellow-500 mb-4" />
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 page-animation">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                    Job Market Insights
                </h1>
                <button 
                  onClick={onNavigateBack}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Roles
                </button>
            </div>
            <div className="text-center">
                <p className="mt-2 text-xl font-semibold text-primary-600 dark:text-primary-400">
                    {domain}
                </p>
            </div>
            
            {insights && (
                <>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                        <p className="text-gray-700 dark:text-gray-300 text-center">{insights.summary}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <InfoCard icon={<TrendingUp className="w-6 h-6 text-primary-500"/>} title="Trending Skills">
                             <div className="flex flex-wrap gap-2">
                                {insights.trendingSkills.map((skill, index) => (
                                  <span key={index} className="px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-200 text-sm font-medium rounded-full">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                        </InfoCard>
                         <InfoCard icon={<DollarSign className="w-6 h-6 text-green-500"/>} title="Salary Expectations">
                           <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{insights.salaryRanges}</p>
                           <p className="text-xs text-gray-500 dark:text-gray-400">Note: This is an estimate and can vary by location and experience.</p>
                        </InfoCard>
                         <InfoCard icon={<Building2 className="w-6 h-6 text-red-500"/>} title="Top Hiring Companies">
                            <ul className="space-y-2">
                                {insights.hiringCompanies.map((company, index) => (
                                    <li key={index} className="font-medium text-gray-700 dark:text-gray-300">{company}</li>
                                ))}
                            </ul>
                        </InfoCard>
                    </div>
                </>
            )}
        </div>
    );
};

export default InsightsPage;