import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';
import { Button } from '../common/Button';

export interface ResumeUploaderProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  selectedFile: File | null;
  onClearFile: () => void;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  onFileSelect,
  isLoading = false,
  selectedFile,
  onClearFile
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndHandleFile = (file: File) => {
    setErrorMessage(null);

    // Validate size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMessage('File size exceeds the 5MB maximum limit.');
      return;
    }

    // Validate type (PDF or DOCX)
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      setErrorMessage('Invalid file type. Please upload a PDF (.pdf) or Word document (.docx).');
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndHandleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndHandleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleInputChange}
        className="hidden"
      />

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/60'
              : 'border-slate-300 hover:border-indigo-400 bg-white hover:bg-slate-50/60'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-xs">
            <Upload className="w-8 h-8" />
          </div>

          <h3 className="text-base font-bold text-slate-800 mb-1">
            Choose a resume or drag & drop here
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Supports PDF and DOCX files up to 5 MB
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            Browse Document
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-indigo-50/50 border border-indigo-200/80 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase">
              {selectedFile.name.split('.').pop()}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 truncate max-w-[240px] sm:max-w-md">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for analysis
              </p>
            </div>
          </div>

          {!isLoading && (
            <button
              onClick={onClearFile}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
              title="Remove file"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {isLoading && (
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </div>
          )}
        </div>
      )}

      {errorMessage && (
        <div className="mt-3 flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

