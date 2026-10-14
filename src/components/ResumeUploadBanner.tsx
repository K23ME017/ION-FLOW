import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  Loader2,
  Sparkles,
  FileCheck,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  FolderOpen,
  Info,
  Check,
  X,
  FileCode,
} from 'lucide-react';
import { IUserProfile, ISkill } from '../types';

interface ResumeUploadBannerProps {
  onParsed: (parsedData: Partial<IUserProfile>) => void;
}

const SAMPLE_RESUMES = {
  fullstack: `ALEX RIVERA
alex.rivera@example.com • San Francisco, CA

SUMMARY
Full Stack Engineer with 3 years of experience developing responsive web applications and distributed APIs.

EDUCATION
B.S. in Computer Science, University of California, Berkeley (2020 - 2024)

TECHNICAL SKILLS
Languages & Frameworks: JavaScript (ES6+), TypeScript, React, HTML5, CSS3, Tailwind CSS, Node.js, Express
Databases & Cloud: PostgreSQL, MongoDB, REST APIs, Git, GitHub Actions, Docker

WORK EXPERIENCE
Software Engineer | NextWave Software (2024 - Present)
• Built scalable client portals using React, TypeScript, and Tailwind CSS, reducing bundle size by 30%.
• Designed RESTful microservices in Node.js and Express connected to PostgreSQL.
• Implemented automated CI/CD unit testing pipelines with GitHub Actions.

PROJECTS
CloudTask Manager
• Full-stack project tracking web application built with TypeScript, React, and MongoDB.`,

  frontend: `JORDAN LEE
jordan.lee@example.com • New York, NY

EDUCATION
Bachelor of Science in Software Engineering, Columbia University

SKILLS
React, Next.js, JavaScript, TypeScript, Tailwind CSS, HTML5, CSS3, Redux, Jest, Git, Figma

EXPERIENCE
Frontend Developer | PixelCraft Studio (2023 - 2025)
• Led front-end architecture using Next.js App Router and TypeScript.
• Built design systems and interactive UI components with Tailwind CSS.
• Integrated GraphQL and RESTful backend APIs with comprehensive test suites.`,

  cloudbackend: `SAMANTHA CHEN
samantha.chen@example.com • Seattle, WA

EDUCATION
Master of Science in Information Systems, University of Washington

SKILLS
Python, Node.js, AWS, Docker, Kubernetes, PostgreSQL, Redis, CI/CD, Git, Linux, System Design, FastAPI

EXPERIENCE
Cloud Infrastructure Engineer | Apex Systems (2022 - 2025)
• Architected containerized backend microservices on AWS with Docker and Kubernetes.
• Managed relational database migrations in PostgreSQL with Redis caching layer.
• Developed automated deployment scripts and monitoring telemetry.`
};

export const ResumeUploadBanner: React.FC<ResumeUploadBannerProps> = ({ onParsed }) => {
  const [isParsing, setIsParsing] = useState(false);
  const [parsingStep, setParsingStep] = useState<string>('Reading document...');
  const [isDragging, setIsDragging] = useState(false);
  const [activeInputMode, setActiveInputMode] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [missingSectionsNotice, setMissingSectionsNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [parsingMethod, setParsingMethod] = useState<string>('');

  const [lastExtracted, setLastExtracted] = useState<{
    fileName: string;
    fullName: string;
    targetRole: string;
    education: string;
    skills: ISkill[];
  } | null>(null);

  const [selectedFileMeta, setSelectedFileMeta] = useState<{
    name: string;
    size: string;
    type: string;
    previewUrl?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Progressive parsing status steps
  useEffect(() => {
    let t1: any;
    let t2: any;
    if (isParsing) {
      setParsingStep('1. Reading document & extracting text...');
      t1 = setTimeout(() => {
        setParsingStep('2. Analyzing via Google AI Studio (gemini-3.8-flash)...');
      }, 1000);
      t2 = setTimeout(() => {
        setParsingStep('3. Enforcing JSON schema & validating skills...');
      }, 2500);
    }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isParsing]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleExtractedResult = (parsed: any, sourceName: string, method?: string) => {
    setParsingMethod(method || 'google_ai_studio_structured');

    // Check for missing key sections to guide user
    const missing: string[] = [];
    if (!parsed.fullName) missing.push('Candidate Name');
    if (!parsed.targetRole) missing.push('Target Role');
    if (!parsed.education) missing.push('Education');
    if (!parsed.skills || parsed.skills.length === 0) missing.push('Technical Skills');

    if (missing.length > 0) {
      setMissingSectionsNotice(
        `Note: ${missing.join(', ')} ${
          missing.length === 1 ? 'was' : 'were'
        } not found in the resume. Please review and fill them in manually below.`
      );
    } else {
      setMissingSectionsNotice(null);
    }

    onParsed({
      fullName: parsed.fullName || '',
      email: parsed.email || '',
      education: parsed.education || '',
      skills: parsed.skills || [],
      experience: parsed.experience || '',
      projects: parsed.projects || [],
      targetRole: parsed.targetRole || '',
      careerInterests: parsed.careerInterests || [],
      rawResumeText: parsed.rawResumeText || '',
    });

    setLastExtracted({
      fileName: sourceName,
      fullName: parsed.fullName || 'Candidate',
      targetRole: parsed.targetRole || '',
      education: parsed.education || '',
      skills: parsed.skills || [],
    });

    setStatusMessage(
      `Extracted ${parsed.skills?.length || 0} skills and profile details from ${sourceName}.`
    );
  };

  const processFile = async (file: File) => {
    // 10MB limit check
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 10 MB limit. Please select a smaller file.');
      return;
    }

    setIsParsing(true);
    setStatusMessage(null);
    setMissingSectionsNotice(null);
    setErrorMessage(null);

    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isText =
      file.type.startsWith('text/') ||
      file.name.toLowerCase().endsWith('.txt') ||
      file.name.toLowerCase().endsWith('.md');

    let previewUrl: string | undefined;
    if (isImage) {
      previewUrl = URL.createObjectURL(file);
    }

    setSelectedFileMeta({
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type || (isPdf ? 'PDF Document' : 'File'),
      previewUrl,
    });

    try {
      let requestBody: any = {};

      if (isText) {
        const textContent = await file.text();
        requestBody = {
          resumeText: textContent,
          fileName: file.name,
        };
      } else {
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read file from disk.'));
          reader.readAsDataURL(file);
        });

        requestBody = {
          base64Data,
          mimeType: file.type || (isPdf ? 'application/pdf' : isImage ? 'image/jpeg' : 'application/octet-stream'),
          fileName: file.name,
        };
      }

      const res = await fetch('/api/user/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to parse resume');

      handleExtractedResult(data.parsed, file.name, data.method);
    } catch (err: any) {
      console.error('File parsing error:', err);
      setErrorMessage(
        `Unable to parse ${file.name}: ${err.message}. You can manually type your details below or paste text.`
      );
    } finally {
      setIsParsing(false);
    }
  };

  const processResumeText = async (text: string, label = 'Pasted Resume Text') => {
    if (!text || text.trim().length < 15) {
      setErrorMessage('Please provide a complete resume with at least 15 characters.');
      return;
    }

    setIsParsing(true);
    setStatusMessage(null);
    setMissingSectionsNotice(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/user/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: text }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to parse resume text');

      handleExtractedResult(data.parsed, label, data.method);
      if (activeInputMode === 'paste') {
        // Keep active or reset
      }
    } catch (err: any) {
      setErrorMessage(`Error: ${err.message}. Please enter details manually.`);
    } finally {
      setIsParsing(false);
    }
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
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs mb-6 transition-all">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              Resume & Candidate Data Extraction
            </h3>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200/60">
              Google AI Studio · Structured JSON
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Upload your document or paste text. The AI extracts verified technical skills, candidate credentials, and work highlights without hallucination.
          </p>
        </div>

        {/* Input Mode Selector */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveInputMode('upload')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeInputMode === 'upload'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveInputMode('paste')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeInputMode === 'paste'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Paste Text / Samples
          </button>
        </div>
      </div>

      {activeInputMode === 'upload' ? (
        /* Drag & Drop Upload Zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all ${
            isDragging
              ? 'border-blue-600 bg-blue-50/60 scale-[1.005]'
              : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt,.md,.png,.jpg,.jpeg,.webp,application/pdf,image/*"
            className="hidden"
            onChange={handleFileInputChange}
            disabled={isParsing}
          />

          {isParsing ? (
            <div className="space-y-3 py-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900">
                  Parsing {selectedFileMeta?.name || 'Resume'}
                </p>
                <p className="text-xs text-blue-600 font-medium">
                  {parsingStep}
                </p>
              </div>
            </div>
          ) : selectedFileMeta ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-2">
              {selectedFileMeta.previewUrl ? (
                <img
                  src={selectedFileMeta.previewUrl}
                  alt="Resume Preview"
                  className="w-14 h-14 object-cover rounded-xl border border-slate-200 shadow-xs"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-xs uppercase">
                  {selectedFileMeta.name.split('.').pop() || 'FILE'}
                </div>
              )}
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold text-slate-900">{selectedFileMeta.name}</h4>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {selectedFileMeta.size} · Uploaded
                </p>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 sm:mt-0 sm:ml-4 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white text-xs font-semibold text-slate-700 transition-colors"
              >
                Change File
              </button>
            </div>
          ) : (
            <div className="space-y-3 py-2">
              <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Upload className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900">
                  Drag & drop your resume here, or{' '}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 hover:text-blue-700 underline font-semibold focus:outline-none"
                  >
                    browse files
                  </button>
                </p>
                <p className="text-xs text-slate-500">
                  Supported formats: <strong>PDF, Word (.docx), TXT, PNG, JPG</strong> (Max 10 MB)
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs inline-flex items-center gap-2"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Browse Files</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Text Paste Section */
        <div className="space-y-3">
          <textarea
            rows={6}
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste your plain-text resume, CV summary, or job experience here..."
            className="w-full p-3.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono text-slate-800"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Preload Sample:</span>
              <button
                type="button"
                onClick={() => {
                  setPastedText(SAMPLE_RESUMES.fullstack);
                  processResumeText(SAMPLE_RESUMES.fullstack, 'Sample: Full Stack Engineer');
                }}
                disabled={isParsing}
                className="px-2 py-1 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] font-medium transition-colors"
              >
                Full Stack
              </button>
              <button
                type="button"
                onClick={() => {
                  setPastedText(SAMPLE_RESUMES.frontend);
                  processResumeText(SAMPLE_RESUMES.frontend, 'Sample: Frontend Specialist');
                }}
                disabled={isParsing}
                className="px-2 py-1 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] font-medium transition-colors"
              >
                Frontend
              </button>
              <button
                type="button"
                onClick={() => {
                  setPastedText(SAMPLE_RESUMES.cloudbackend);
                  processResumeText(SAMPLE_RESUMES.cloudbackend, 'Sample: Cloud & Backend');
                }}
                disabled={isParsing}
                className="px-2 py-1 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] font-medium transition-colors"
              >
                Cloud / DevOps
              </button>
            </div>

            <button
              type="button"
              disabled={isParsing || !pastedText.trim()}
              onClick={() => processResumeText(pastedText, 'Pasted CV')}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isParsing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Extract Details with AI</span>
            </button>
          </div>
        </div>
      )}

      {/* Missing Sections Alert / Graceful Guidance */}
      {missingSectionsNotice && (
        <div className="mt-4 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-amber-950">Incomplete Information in Resume</p>
            <p className="text-amber-800 leading-relaxed">{missingSectionsNotice}</p>
          </div>
        </div>
      )}

      {/* Extracted Details Confirmation Card */}
      {lastExtracted && (
        <div className="mt-4 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <h4 className="text-xs font-bold text-emerald-950">
                Successfully Extracted from {lastExtracted.fileName}
              </h4>
            </div>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
              {lastExtracted.skills.length} Technical Skills Detected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-3 rounded-lg border border-emerald-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Candidate Name</span>
              <span className="font-semibold text-slate-900">{lastExtracted.fullName || 'Candidate'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Role</span>
              <span className="font-semibold text-slate-900">{lastExtracted.targetRole || 'Not stated'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Education</span>
              <span className="font-semibold text-slate-900 truncate block">{lastExtracted.education || 'Not stated'}</span>
            </div>
          </div>

          {lastExtracted.skills.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Extracted Technical Skills & Proficiencies:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {lastExtracted.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-800"
                  >
                    <span>{s.name}</span>
                    <span
                      className={`text-[9px] px-1 rounded font-semibold ${
                        s.proficiency === 'Advanced'
                          ? 'bg-emerald-100 text-emerald-700'
                          : s.proficiency === 'Intermediate'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {s.proficiency}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mt-3 p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-500 hover:text-rose-800 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Status banner */}
      {statusMessage && !lastExtracted && (
        <div className="mt-3 p-3 rounded-xl bg-blue-50 text-blue-700 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-600" />
          <span>{statusMessage}</span>
        </div>
      )}
    </div>
  );
};
