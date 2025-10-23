// FIX: Added a triple-slash directive to include Vite's client types. This makes TypeScript aware of `import.meta.env` and resolves the error.
/// <reference types="vite/client" />

import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, MarketInsights } from '../types';

const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey) {
    throw new Error("VITE_API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey });

const responseSchema: any = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A 2-3 sentence professional summary of the candidate based on the provided resume or skills list.",
    },
    extractedSkills: {
      type: Type.ARRAY,
      description: "A list of all key technical and soft skills identified from the resume or provided by the user.",
      items: { type: Type.STRING },
    },
    domainStrength: {
      type: Type.STRING,
      description: "Identify the primary domain of expertise from the resume (e.g., 'Web Development', 'Data Science', 'AI/ML', 'Cybersecurity')."
    },
    experienceLevel: {
      type: Type.STRING,
      description: "Estimate the candidate's experience level (e.g., 'Entry-Level', 'Mid-Level', 'Senior')."
    },
    jobRecommendations: {
      type: Type.ARRAY,
      description: "A list of 3 suitable job roles for the candidate.",
      items: {
        type: Type.OBJECT,
        properties: {
          role: { type: Type.STRING, description: "The job title." },
          company: { type: Type.STRING, description: "A plausible example company name (e.g., 'TechCorp', 'Innovate Inc.')." },
          location: { type: Type.STRING, description: "A plausible location (e.g., 'San Francisco, CA', 'Remote')." },
          description: { type: Type.STRING, description: "A brief, 2-sentence description of why this role is a good fit." },
          matchPercentage: { type: Type.INTEGER, description: "An estimated match percentage (0-100) based on skills." },
          matchingSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of the user's skills that are relevant to this specific job." },
          skillsToLearn: {
            type: Type.ARRAY,
            description: "For this specific job, a list of the top 2-3 most critical skills the user is missing to be a strong candidate. This field is mandatory and should not be empty unless the user's profile is a 100% perfect match for all job requirements.",
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: { type: Type.STRING, description: "The name of the missing skill." },
                    reason: { type: Type.STRING, description: "A short explanation of why this skill is important for this job role." },
                    estimatedTimeline: { type: Type.STRING, description: "An estimated timeline to learn this skill (e.g., '2-4 weeks', '1 month')."},
                    learningRoadmap: {
                        type: Type.ARRAY,
                        description: "A list of 2 learning resources for the skill.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING, description: "The descriptive title of the learning resource. This will be used to generate a web search, so it must be specific and accurate (e.g., 'React Hooks Crash Course - Traversy Media' or 'Official Python Documentation - Data Classes')." },
                                url: { type: Type.STRING, description: "A unique identifier for the resource. Can be a URL, but its primary purpose is for tracking completion. The title is more important." },
                                type: { type: Type.STRING, enum: ['YouTube', 'Coursera', 'Article', 'Other'], description: "The type of the resource." },
                            },
                            required: ["title", "url", "type"],
                        }
                    }
                },
                required: ["skill", "reason", "estimatedTimeline", "learningRoadmap"],
            }
          }
        },
        required: ["role", "company", "location", "description", "matchPercentage", "matchingSkills", "skillsToLearn"],
      },
    },
  },
  required: ["summary", "extractedSkills", "domainStrength", "experienceLevel", "jobRecommendations"],
};

export const analyzeResume = async (input: string | { inlineData: { data: string; mimeType: string; } } | string[]): Promise<AnalysisResult> => {
  const isSkillList = Array.isArray(input);

  const prompt = `
    You are a world-class career advisor AI. Your task is to conduct a comprehensive analysis of a user's professional profile, which is provided either as a full resume or a list of skills.

    Your analysis must be structured and detailed, adhering to the following goals:
    1.  **Professional Summary**: Synthesize the user's experience into a concise, 2-3 sentence professional summary.
    2.  **Skill Extraction**: Identify and list all relevant technical and soft skills.
    3.  **Domain Strength**: Identify the primary professional domain (e.g., 'Web Development', 'Data Science').
    4.  **Experience Level**: Estimate the experience level (e.g., 'Entry-Level', 'Senior').
    5.  **Job Recommendations**: Suggest 3 highly suitable job roles based on the profile.
    6.  **In-Depth Role Analysis**: For EACH job recommendation, you are required to provide:
        a. **Matching Skills**: A list of the user's existing skills that align with the requirements for THAT specific job.
        b. **Skill Gaps**: A list of the top 2-3 critical skills the user needs to acquire for THAT specific job. This is mandatory.
        c. **Actionable Learning Roadmap**: For EACH identified skill gap, provide a "learning roadmap" consisting of 2 concrete online learning resources (e.g., specific YouTube tutorials, Coursera courses) AND an estimated timeline to learn the skill. Ensure the resource TITLES are specific and searchable.

    The user has submitted their information as ${isSkillList ? 'a list of skills' : 'a resume document'}.
    Please generate the output exclusively in the specified JSON format.
  `;
  
  const parts: any[] = [{ text: prompt }];

  if (isSkillList) {
    parts.push({ text: `Here are the user's skills: ${input.join(', ')}` });
  } else if (typeof input === 'string') {
    parts.push({ text: input });
  } else {
    parts.push(input);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    if (result && result.jobRecommendations) {
        return result as AnalysisResult;
    } else {
        throw new Error("Invalid response structure from API.");
    }
    
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate analysis. The AI model could not process the request.");
  }
};

export const getMarketInsights = async (domain: string): Promise<MarketInsights> => {
    const insightsSchema = {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING, description: "A brief summary of the current job market for this domain." },
            trendingSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of top 5 trending skills in this domain." },
            salaryRanges: { type: Type.STRING, description: "A general salary range for roles in this domain (e.g., '$80k - $120k for Mid-Level')." },
            hiringCompanies: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 3-5 example companies known for hiring in this domain." },
        },
        required: ["summary", "trendingSkills", "salaryRanges", "hiringCompanies"],
    };

    const prompt = `Provide a brief analysis of the job market for the domain: "${domain}". Focus on current trends, skills in demand, general salary expectations, and key companies that are hiring.`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [{ text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: insightsSchema,
                temperature: 0.3,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as MarketInsights;
    } catch (error) {
        console.error("Error fetching market insights:", error);
        throw new Error("Failed to generate market insights.");
    }
};