import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

interface UploadResumeProps {
  onAnalyze: (input: { inlineData: { data: string; mimeType: string; } }) => void;
}

const UploadResume: React.FC<UploadResumeProps> = ({ onAnalyze }) => {
    const [fileError, setFileError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFileError(null);
        const file = acceptedFiles[0];
        if (file) {
            if (file.size > 4 * 1024 * 1024) { // 4MB limit for Gemini API inline data
                setFileError("File is too large. Please upload a file smaller than 4MB.");
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                const base64String = (reader.result as string).split(',')[1];
                onAnalyze({
                    inlineData: {
                        data: base64String,
                        mimeType: file.type,
                    }
                });
            };
            reader.onerror = () => {
                setFileError("Failed to read the file.");
            };
            reader.readAsDataURL(file);
        }
    }, [onAnalyze]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'text/plain': ['.txt'],
        },
        multiple: false
    });

    return (
        <div>
            <div
                {...getRootProps()}
                className={`mt-1 flex justify-center rounded-lg border-2 border-dashed px-6 pt-5 pb-6 cursor-pointer transition-colors duration-200
                ${isDragActive ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'}`}
            >
                <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-transparent font-medium text-primary-600 dark:text-primary-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:text-primary-500"
                        >
                            <span>Upload a file</span>
                            <input {...getInputProps()} id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">PDF, DOCX, TXT up to 4MB</p>
                </div>
            </div>
            {fileError && <p className="mt-2 text-sm text-red-600">{fileError}</p>}
        </div>
    );
};

export default UploadResume;