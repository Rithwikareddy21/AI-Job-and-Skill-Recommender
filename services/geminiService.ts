import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
    jobRecommendations: {
      type: Type.ARRAY,
      description: "A list of 3-4 suitable job roles for the candidate.",
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
            description: "For this specific job, a list of 2-3 important skills the user is missing.",
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: { type: Type.STRING, description: "The name of the missing skill." },
                    reason: { type: Type.STRING, description: "A short explanation of why this skill is important for this job role." },
                    learningRoadmap: {
                        type: Type.ARRAY,
                        description: "A list of 2 learning resources for the skill.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING, description: "The title of the learning resource." },
                                url: { type: Type.STRING, description: "The URL to the resource. CRITICAL: This must be a real, valid, and publicly accessible link. Do NOT invent or hallucinate URLs. Prioritize official documentation, major educational platforms like Coursera, or specific, highly-rated YouTube tutorials." },
                                type: { type: Type.STRING, enum: ['YouTube', 'Coursera', 'Article', 'Other'], description: "The type of the resource." },
                            },
                            required: ["title", "url", "type"],
                        }
                    }
                },
                required: ["skill", "reason", "learningRoadmap"],
            }
          }
        },
        required: ["role", "company", "location", "description", "matchPercentage", "matchingSkills", "skillsToLearn"],
      },
    },
  },
  required: ["summary", "extractedSkills", "jobRecommendations"],
};

export const analyzeResume = async (input: string | { inlineData: { data: string; mimeType: string; } } | string[]): Promise<AnalysisResult> => {
  const isSkillList = Array.isArray(input);

  const prompt = `
    You are a world-class career advisor AI. Your task is to conduct a comprehensive analysis of a user's professional profile, which is provided either as a full resume or a list of skills.

    Your analysis must be structured and detailed, adhering to the following goals:
    1.  **Professional Summary**: Synthesize the user's experience into a concise, 2-3 sentence professional summary.
    2.  **Skill Extraction**: Identify and list all relevant technical and soft skills.
    3.  **Job Recommendations**: Suggest 3-4 highly suitable job roles based on the profile.
    4.  **In-Depth Role Analysis**: For EACH job recommendation, you are required to provide:
        a. **Matching Skills**: A list of the user's existing skills that align with the requirements for THAT specific job.
        b. **Skill Gaps**: A list of the top 2-3 critical skills the user needs to acquire for THAT specific job.
        c. **Actionable Learning Roadmap**: For EACH identified skill gap, provide a "learning roadmap" consisting of 2 concrete online learning resources (e.g., specific YouTube tutorials, Coursera courses). Ensure the URLs provided are real and valid.

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