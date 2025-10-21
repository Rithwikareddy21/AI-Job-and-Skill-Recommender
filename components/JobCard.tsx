import React, { useState } from 'react';
import type { JobRecommendation } from '../types';
import SkillGapCard from './SkillGapCard';
import { ChevronDown, ChevronUp, MapPin, Building, Star, CheckCircle, GraduationCap, Download } from 'lucide-react';
import jsPDF from 'jspdf';


interface JobCardProps {
  job: JobRecommendation;
  completedResources: Set<string>;
  toggleResourceCompletion: (resourceId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, completedResources, toggleResourceCompletion }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const matchColor = job.matchPercentage > 75 ? 'text-green-500' : job.matchPercentage > 50 ? 'text-yellow-500' : 'text-red-500';

  const handleDownloadPdf = () => {
    setIsDownloading(true);
    
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let y = margin;

    const checkPageBreak = (spaceNeeded: number) => {
        if (y + spaceNeeded > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }
    }

    // --- Header ---
    doc.setFontSize(20).setFont('helvetica', 'bold');
    doc.text(`Learning Roadmap: ${job.role}`, margin, y);
    y += 8;

    doc.setFontSize(12).setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139); // gray-500
    doc.text(`${job.company} - ${job.location}`, margin, y);
    y += 10;
    
    doc.setDrawColor(226, 232, 240); // gray-200
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;
    doc.setTextColor(0, 0, 0);


    // --- Job Summary ---
    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('Job Summary', margin, y);
    y += 7;

    doc.setFontSize(11).setFont('helvetica', 'normal');
    const summaryLines = doc.splitTextToSize(job.description, pageWidth - margin * 2);
    checkPageBreak(summaryLines.length * 5);
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * 5 + 10;


    // --- Skills to Learn ---
    checkPageBreak(17);
    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('Recommended Skills to Learn', margin, y);
    y += 10;

    job.skillsToLearn.forEach(skillGap => {
        const reasonLines = doc.splitTextToSize(`Reason: ${skillGap.reason}`, pageWidth - margin * 2 - 5);
        const resourcesHeight = skillGap.learningRoadmap.length * 6;
        const totalBlockHeight = 8 + (reasonLines.length * 5) + 5 + resourcesHeight;
        checkPageBreak(totalBlockHeight);

        doc.setFontSize(12).setFont('helvetica', 'bold');
        doc.text(`• ${skillGap.skill}`, margin, y);
        y += 6;

        doc.setFontSize(10).setFont('helvetica', 'italic');
        doc.setTextColor(100, 116, 139);
        doc.text(reasonLines, margin + 5, y);
        y += reasonLines.length * 5 + 2;
        doc.setTextColor(0, 0, 0);

        skillGap.learningRoadmap.forEach(resource => {
            checkPageBreak(7);
            doc.setFontSize(10).setFont('helvetica', 'normal');
            doc.setTextColor(14, 165, 233); // sky-500
            doc.textWithLink(resource.title, margin + 8, y, { url: resource.url });
            y += 6;
        });
        y += 4; // Extra space between skills
    });

    doc.save(`Roadmap_for_${job.role.replace(/\s+/g, '_')}.pdf`);
    setIsDownloading(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="p-6">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{job.role}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <span className="flex items-center gap-1"><Building className="w-4 h-4" /> {job.company}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                </div>
            </div>
            <div className={`flex items-center gap-1 font-bold ${matchColor}`}>
                <Star className="w-5 h-5" />
                <span>{job.matchPercentage}% Match</span>
            </div>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">{job.description}</p>

        <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200 flex items-center gap-1 transition-colors"
        >
            {isExpanded ? 'Show Less' : 'Show Details'}
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="px-6 pb-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
            <div className="py-4 space-y-4">
                <div>
                    <h4 className="font-semibold text-md text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        Matching Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {job.matchingSkills.map((skill, i) => (
                            <span key={i} className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 text-xs font-medium rounded-full">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-md text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-3">
                        <GraduationCap className="w-5 h-5 text-yellow-500" />
                        Your Learning Roadmap
                    </h4>
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {job.skillsToLearn.map((skillGap, i) => (
                            <SkillGapCard 
                              key={i} 
                              skillGap={skillGap} 
                              completedResources={completedResources}
                              toggleResourceCompletion={toggleResourceCompletion}
                            />
                        ))}
                    </div>
                </div>
            </div>
             <button 
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400"
            >
                <Download className="w-4 h-4" />
                {isDownloading ? 'Downloading...' : 'Download Roadmap as PDF'}
            </button>
        </div>
      )}
    </div>
  );
};

export default JobCard;