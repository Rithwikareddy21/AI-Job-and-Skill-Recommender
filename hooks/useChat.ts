import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import type { AnalysisResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface UseChatProps {
    analysisContext: AnalysisResult;
}

export const useChat = ({ analysisContext }: UseChatProps) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const initializeChat = () => {
            const systemInstruction = `You are a helpful and friendly AI career advisor. The user has just received an analysis based on their resume or skills. Here is a JSON summary of their analysis: ${JSON.stringify(analysisContext)}. Your role is to answer their questions about the analysis, suggest career paths, provide interview tips, and help them understand how to improve. Be encouraging and concise.`;
            
            const newChat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: { systemInstruction },
            });
            setChat(newChat);

            const initialMessage: Message = {
                role: 'model',
                content: "Hello! I'm your AI career advisor. Feel free to ask me anything about your analysis or next steps in your career."
            };
            setMessages([initialMessage]);
        };
        initializeChat();
    }, [analysisContext]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() || !chat || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const result = await chat.sendMessageStream({ message: input });
            let text = '';
            let isFirstChunk = true;

            for await (const chunk of result) {
                if (isFirstChunk) {
                    // Add the model message bubble only on the first chunk to ensure loading indicator shows correctly
                    setMessages(prev => [...prev, { role: 'model', content: '' }]);
                    isFirstChunk = false;
                }
                
                text += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    // Update the content of the last message, which is the model's response
                    newMessages[newMessages.length - 1].content = text;
                    return newMessages;
                });
            }

        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: Message = { role: 'model', content: 'Sorry, I encountered an error. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
    };
};