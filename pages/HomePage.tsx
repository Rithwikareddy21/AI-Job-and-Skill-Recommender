import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HomePageProps {
  onStartAnalysis: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStartAnalysis }) => {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
        <span className="block">Unlock Your</span>
        <span className="block bg-gradient-to-r from-primary-600 to-cyan-400 bg-clip-text text-transparent">Career Potential</span>
      </h1>
      <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-gray-600 dark:text-gray-300">
        Get a personalized career analysis, job recommendations, and a learning roadmap powered by AI. Let's find the next step in your professional journey.
      </p>
      <div className="mt-10 flex justify-center">
        <button
          onClick={onStartAnalysis}
          className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Start Your Analysis
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default HomePage;