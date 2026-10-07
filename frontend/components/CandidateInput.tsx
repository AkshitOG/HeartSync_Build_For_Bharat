"use client";

import React, { useState } from "react";
import { RoleInfo, DemoCandidate } from "@/types/career";

interface CandidateInputProps {
  roles: RoleInfo[];
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
  demoCandidates?: DemoCandidate[];
}

export function CandidateInput({ roles, onSubmit, isLoading, demoCandidates }: CandidateInputProps) {
  const [targetRole, setTargetRole] = useState("backend-engineer");
  const [githubHandle, setGithubHandle] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const handleSelectDemo = (candId: string) => {
    setActiveDemo(candId);
    if (candId === "alex-sharma") {
      setCandidateName("Alex Sharma");
      setTargetRole("backend-engineer");
      setGithubHandle("alexsharma-dev");
      setFile(null);
      setResumeText(`ALEX SHARMA
Backend & Distributed Systems Developer | github.com/alexsharma-dev

PROFESSIONAL EXPERIENCE
Junior Backend Developer | CloudScale Solutions (2024 - Present)
- Architected and deployed 14 asynchronous REST API microservices using FastAPI and Python.
- Designed JWT authentication middleware and role-based access control protecting internal routes.
- Implemented comprehensive automated testing suites with pytest, achieving 88% branch coverage.
- Optimized API endpoint latency by 35% through Redis caching strategies for high-frequency queries.
- Maintained Docker containerization recipes and collaborated via Git trunk-based development.

Software Engineering Intern | DataStream Systems (2023 - 2024)
- Developed automated data ingestion scripts in Python connecting third-party webhooks.
- Containerized local development environments using Docker and docker-compose.
- Wrote end-to-end integration tests using pytest and mock HTTP response fixtures.

TECHNICAL SKILLS
Languages: Python, JavaScript, TypeScript, Bash, SQL
Frameworks & Libraries: FastAPI, Flask, Pydantic, Pytest, Celery
Databases & Cache: Redis, SQLite, Basic SQL
Tools & DevOps: Git, Docker, GitHub Actions, Linux, Postman

EDUCATION
B.Tech in Computer Science & Engineering | State Institute of Technology (2020 - 2024)
- Coursework: Object-Oriented Programming, Data Structures, Operating Systems, Computer Networks`);
    } else if (candId === "priya-patel") {
      setCandidateName("Priya Patel");
      setTargetRole("data-scientist");
      setGithubHandle("priyapatel-data");
      setFile(null);
      setResumeText(`PRIYA PATEL
Data Analyst & Applied Statistics Specialist | github.com/priyapatel-data

PROFESSIONAL EXPERIENCE
Associate Data Analyst | RetailInsights Corp (2022 - Present)
- Authored daily SQL extraction scripts aggregating clickstream and conversion metrics.
- Developed automated reporting pipelines in Python, saving 12 manual hours weekly.
- Completed coursework and self-study in Machine Learning algorithms and Scikit-learn.

TECHNICAL SKILLS
Languages: SQL, Python, R
Libraries & Tools: Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn, Tableau, Power BI, Excel
Concepts: Exploratory Data Analysis, Hypothesis Testing, Feature Extraction, Relational Data Modeling

EDUCATION
B.S. in Statistics & Data Analytics | Metro University (2018 - 2022)
- Coursework: Applied Statistics, Multivariate Analysis, Probability Theory, Relational Databases`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setActiveDemo(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith(".pdf") || droppedFile.name.endsWith(".txt")) {
        setFile(droppedFile);
        setActiveDemo(null);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim() && !file && !githubHandle.trim()) {
      alert("Please provide resume text, upload a PDF resume, or select a demo candidate.");
      return;
    }

    const fd = new FormData();
    fd.append("target_role", targetRole);
    if (candidateName.trim()) fd.append("candidate_name", candidateName);
    if (resumeText.trim()) fd.append("resume_text", resumeText);
    if (githubHandle.trim()) fd.append("github_handle", githubHandle);
    if (file) fd.append("resume_file", file);

    onSubmit(fd);
  };

  return (
    <section className="bg-white border border-slate-300 rounded-lg p-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Candidate Intake &amp; Analysis
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Provide candidate resume text or PDF and optional GitHub username.
          </p>
        </div>

        {/* 1-Click Demo Profiles */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Quick Test:</span>
          <button
            type="button"
            onClick={() => handleSelectDemo("alex-sharma")}
            className={`px-2.5 py-1 rounded text-xs font-medium border cursor-pointer ${
              activeDemo === "alex-sharma"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            Alex Sharma (Backend)
          </button>
          <button
            type="button"
            onClick={() => handleSelectDemo("priya-patel")}
            className={`px-2.5 py-1 rounded text-xs font-medium border cursor-pointer ${
              activeDemo === "priya-patel"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            Priya Patel (Data Scientist)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Candidate Name (Optional)
            </label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="e.g. Alex Sharma"
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Target Role *
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-xs cursor-pointer font-medium"
            >
              {roles.map((r) => (
                <option key={r.role_id} value={r.role_id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              GitHub Profile (Optional)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-mono text-slate-400 pointer-events-none">
                github.com/
              </span>
              <input
                type="text"
                value={githubHandle}
                onChange={(e) => setGithubHandle(e.target.value)}
                placeholder="username"
                className="w-full bg-white border border-slate-200 rounded-xl pl-24 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-400 transition font-mono shadow-xs"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Resume Evidence (Paste text or drop PDF file) *
            </label>
            <span className="text-[11px] text-slate-500">PDF or plain text (Max 5MB)</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <textarea
                rows={6}
                value={resumeText}
                onChange={(e) => {
                  setResumeText(e.target.value);
                  setActiveDemo(null);
                }}
                placeholder="Paste experience, projects, tools, and technical background here..."
                className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-400 transition font-mono resize-y shadow-xs"
              />
            </div>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`flex flex-col justify-center items-center border border-dashed rounded-xl p-5 text-center transition cursor-pointer relative ${
                dragActive
                  ? "border-blue-500 bg-blue-50/40"
                  : "border-slate-300/90 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400"
              }`}
            >
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 mb-2.5">
                <svg
                  className="w-5 h-5 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.75"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              {file ? (
                <div className="bg-white border border-slate-200/90 rounded-lg p-2.5 w-full shadow-2xs">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-900">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="truncate max-w-[170px]">{file.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                    {(file.size / 1024).toFixed(1)} KB • Ready for analysis
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-semibold text-slate-800">Upload Resume PDF</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Drag &amp; drop or click to browse</p>
                  <span className="inline-block mt-2 text-[10px] font-mono font-medium text-slate-500 bg-white border border-slate-200/80 px-2 py-0.5 rounded">
                    PDF • TXT
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 flex-wrap gap-4">
          <div className="text-xs text-slate-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Deterministic Scoring • Evidence Deficit Ladder • Zero Hallucinated Rejections</span>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold text-sm shadow-sm transition flex items-center gap-2 group cursor-pointer"
          >
            <span>{isLoading ? "Evaluating Intelligence..." : "Run CareerGPS Analysis →"}</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-0.5 transition"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </form>
    </section>
  );
}
