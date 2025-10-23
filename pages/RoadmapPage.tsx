import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { JobRecommendation } from '../types';
import SkillGapCard from '../components/SkillGapCard';
import { Building, MapPin, Briefcase, GraduationCap, CheckCircle, Star, MessageSquare, ArrowLeft, Download } from 'lucide-react';

interface RoadmapPageProps {
  selectedJob: JobRecommendation;
  completedResources: Set<string>;
  toggleResourceCompletion: (resourceId: string) => void;
  onNavigateToChat: () => void;
  onNavigateBack: () => void;
}

const RoadmapPage: React.FC<RoadmapPageProps> = ({ selectedJob, completedResources, toggleResourceCompletion, onNavigateToChat, onNavigateBack }) => {
    
    const roadmapRef = useRef<HTMLDivElement>(null);
    const matchColor = selectedJob.matchPercentage > 75 ? 'text-green-500' : selectedJob.matchPercentage > 50 ? 'text-yellow-500' : 'text-red-500';

    const handleExportPdf = () => {
        const input = roadmapRef.current;
        if (input) {
            html2canvas(input, { scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const canvasWidth = canvas.width;
                const canvasHeight = canvas.height;
                const ratio = canvasWidth / canvasHeight;
                const width = pdfWidth;
                const height = width / ratio;

                // Check if content exceeds one page
                let position = 0;
                if (height > pdfHeight) {
                    // This simple implementation doesn't handle multi-page well.
                    // For now, we'll just add it and let it crop. A more complex solution would be needed for perfect multi-page.
                    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
                } else {
                    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
                }
                
                pdf.save(`Roadmap-${selectedJob.role.replace(/\s/g, '_')}.pdf`);
            });
        }
    };


    return (
        <div className="page-animation space-y-10">
             {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <button 
                  onClick={onNavigateBack}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors self-start"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Roles
                </button>
                <div className="flex gap-2 self-start md:self-center">
                    <button
                        onClick={handleExportPdf}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                    >
                        <Download className="w-4 h-4" />
                        Export PDF
                    </button>
                    <button
                        onClick={onNavigateToChat}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm font-medium"
                    >
                        <MessageSquare className="w-4 h-4" />
                        Ask AI
                    </button>
                </div>
            </div>

            <div ref={roadmapRef} className="p-1">
                <div>
                    <p className="text-primary-600 dark:text-primary-400 font-semibold">YOUR PERSONALIZED ROADMAP</p>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mt-1">{selectedJob.role}</h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400 mt-2">
                        <span className="flex items-center gap-1.5"><Building className="w-4 h-4" /> {selectedJob.company}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {selectedJob.location}</span>
                        <span className={`flex items-center gap-1.5 font-bold ${matchColor}`}><Star className="w-4 h-4" /> {selectedJob.matchPercentage}% Match</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Skills & Description */}
                    <div className="lg:col-span-1 space-y-6">
                         <div>
                            <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Role Description</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{selectedJob.description}</p>
                        </div>
                        <div>
                            <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                Your Matching Skills
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {selectedJob.matchingSkills.map((skill, i) => (
                                    <span key={i} className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 text-xs font-medium rounded-full">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Learning Roadmap */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                          <GraduationCap className="w-8 h-8 text-primary-500" />
                          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Your Learning Roadmap</h2>
                        </div>
                        {selectedJob.skillsToLearn.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedJob.skillsToLearn.map((skillGap, i) => (
                                    <SkillGapCard 
                                      key={i} 
                                      skillGap={skillGap} 
                                      completedResources={completedResources}
                                      toggleResourceCompletion={toggleResourceCompletion}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center">
                                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">No skill gaps found!</p>
                                <p className="text-gray-500 dark:text-gray-400 mt-2">You are a fantastic match for this role.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoadmapPage;