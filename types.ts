// Fix: Added and exported User type for application-wide use.
export type User = {
  name: string;
};

export interface LearningResource {
  title: string;
  url: string;
  type: 'YouTube' | 'Coursera' | 'Article' | 'Other';
}

export interface SkillToLearn {
  skill: string;
  reason: string;
  estimatedTimeline: string;
  learningRoadmap: LearningResource[];
}

export interface JobRecommendation {
  role: string;
  company: string;
  location: string;
  description: string;
  matchPercentage: number;
  matchingSkills: string[];
  skillsToLearn: SkillToLearn[];
}

export interface AnalysisResult {
  summary: string;
  extractedSkills: string[];
  domainStrength: string;
  experienceLevel: string;
  jobRecommendations: JobRecommendation[];
}

export interface MarketInsights {
    summary: string;
    trendingSkills: string[];
    salaryRanges: string;
    hiringCompanies: string[];
}
