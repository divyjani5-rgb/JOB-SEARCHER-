import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Copy,
  Download,
  Share2,
  Check,
  Send,
  Building,
  Briefcase,
  GraduationCap,
  Wand2,
} from 'lucide-react';
import { ResumeData, AtsAnalysisResult, UserProfile } from '../types';

interface ResumeBuilderProps {
  resume: ResumeData;
  setResume: React.Dispatch<React.SetStateAction<ResumeData>>;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onSaveProfileSkills: (skills: string[]) => void;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({
  resume,
  setResume,
  user,
  setUser,
  onSaveProfileSkills,
}) => {
  const [newSkillInput, setNewSkillInput] = useState('');
  const [targetJobRole, setTargetJobRole] = useState('Senior Full Stack Engineer');
  const [targetJobDescription, setTargetJobDescription] = useState(
    'Seeking experienced engineer proficient in React, TypeScript, Node.js, and cloud deployments with strong problem solving and system design skills.'
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AtsAnalysisResult | null>(null);

  // Cover Letter state
  const [targetCompany, setTargetCompany] = useState('Apex Cloud Technologies');
  const [coverLetterTone, setCoverLetterTone] = useState('Confident and Impactful');
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState('');
  const [copiedLetter, setCopiedLetter] = useState(false);

  // Add skill to resume & profile
  const handleAddSkill = (skillToAdd?: string) => {
    const skill = (skillToAdd || newSkillInput).trim();
    if (!skill || resume.skills.includes(skill)) return;
    const updated = [...resume.skills, skill];
    setResume((prev) => ({ ...prev, skills: updated }));
    onSaveProfileSkills(updated);
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = resume.skills.filter((s) => s !== skillToRemove);
    setResume((prev) => ({ ...prev, skills: updated }));
    onSaveProfileSkills(updated);
  };

  // Run ATS analysis via backend Gemini API
  const handleRunAtsAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const resumeFormattedText = `
Candidate: ${resume.fullName}
Email: ${resume.email} | Phone: ${resume.phone} | Location: ${resume.location}

Summary:
${resume.summary}

Skills:
${resume.skills.join(', ')}

Experience:
${resume.experiences
  .map(
    (exp) =>
      `Role: ${exp.role} at ${exp.company} (${exp.period})\nHighlights:\n${exp.highlights.map((h) => `- ${h}`).join('\n')}`
  )
  .join('\n\n')}

Education:
${resume.education.map((edu) => `${edu.degree} - ${edu.institution} (${edu.year})`).join('\n')}
      `;

      const res = await fetch('/api/gemini/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: resumeFormattedText,
          targetRole: targetJobRole,
          targetSkills: resume.skills,
          jobDescription: targetJobDescription,
        }),
      });

      const data = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error('Error running ATS analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate Tailored Cover Letter
  const handleGenerateCoverLetter = async () => {
    setIsGeneratingCoverLetter(true);
    try {
      const res = await fetch('/api/gemini/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: resume.summary + '\nSkills: ' + resume.skills.join(', '),
          jobTitle: targetJobRole,
          companyName: targetCompany,
          jobDescription: targetJobDescription,
          tone: coverLetterTone,
        }),
      });
      const data = await res.json();
      setGeneratedCoverLetter(data.coverLetter || '');
    } catch (err) {
      console.error('Error generating cover letter:', err);
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  const handleCopyCoverLetter = () => {
    navigator.clipboard.writeText(generatedCoverLetter);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  return (
    <div className="space-y-8 text-white">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FileText className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-white">Resume Studio & Gemini ATS Optimizer</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Build your professional profile, analyze keyword density against automated applicant tracking systems (ATS), and generate tailored materials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunAtsAnalysis}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing ATS...' : 'Run Gemini ATS Audit'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns: Resume Editor */}
        <div className="lg:col-span-7 space-y-6">
          {/* Personal Info */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h2 className="font-bold text-sm text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>Contact & Headline</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-1">Full Name</label>
                <input
                  type="text"
                  value={resume.fullName}
                  onChange={(e) => setResume((prev) => ({ ...prev, fullName: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Email Address</label>
                <input
                  type="email"
                  value={resume.email}
                  onChange={(e) => setResume((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Phone</label>
                <input
                  type="text"
                  value={resume.phone}
                  onChange={(e) => setResume((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Location</label>
                <input
                  type="text"
                  value={resume.location}
                  onChange={(e) => setResume((prev) => ({ ...prev, location: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 text-xs font-medium block mb-1">Professional Summary</label>
              <textarea
                rows={3}
                value={resume.summary}
                onChange={(e) => setResume((prev) => ({ ...prev, summary: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Skills Management */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Core Competencies & Skills ({resume.skills.length})</span>
              </h2>
            </div>

            <p className="text-xs text-slate-400">
              These skills directly power your proximity radar match score and real-time alert notifications.
            </p>

            {/* Add skill input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a skill (e.g. Docker, GraphQL, Kubernetes)..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => handleAddSkill()}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Skill tags */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {resume.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950 text-emerald-300 text-xs border border-emerald-500/20 font-medium group"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-500 hover:text-rose-400 focus:outline-none"
                    aria-label={`Remove ${skill}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Experience History */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h2 className="font-bold text-sm text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>Work Experience</span>
            </h2>

            <div className="space-y-4">
              {resume.experiences.map((exp, index) => (
                <div key={exp.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-white text-sm">{exp.role}</div>
                      <div className="text-slate-400 font-medium">{exp.company} · {exp.location}</div>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10">
                      {exp.period}
                    </span>
                  </div>

                  <ul className="list-disc list-inside text-slate-300 space-y-1 pt-1">
                    {exp.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="leading-relaxed">
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <h2 className="font-bold text-sm text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>Education</span>
            </h2>

            <div className="space-y-2 text-xs">
              {resume.education.map((edu) => (
                <div key={edu.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">{edu.degree}</div>
                    <div className="text-slate-400">{edu.institution}</div>
                  </div>
                  <span className="text-slate-400">{edu.year}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Columns: ATS Audit & Cover Letter */}
        <div className="lg:col-span-5 space-y-6">
          {/* Target Role Filter Settings for Audit */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 text-xs">
            <h2 className="font-bold text-sm text-white flex items-center gap-1.5">
              <Wand2 className="w-4 h-4 text-emerald-400" />
              <span>Target Role Criteria for ATS Audit</span>
            </h2>

            <div>
              <label className="text-slate-400 block mb-1">Target Job Title</label>
              <input
                type="text"
                value={targetJobRole}
                onChange={(e) => setTargetJobRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Job Description Excerpt</label>
              <textarea
                rows={2}
                value={targetJobDescription}
                onChange={(e) => setTargetJobDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* ATS Score & Breakdown Result */}
          {analysisResult ? (
            <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl text-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400">
                    ATS Audit Report
                  </span>
                  <div className="text-lg font-extrabold text-white">{analysisResult.verdict}</div>
                </div>

                {/* Score badge */}
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-slate-950 font-black text-2xl shadow-lg shadow-emerald-500/30">
                  {analysisResult.atsScore}
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                {analysisResult.summary}
              </p>

              {/* Matched Skills */}
              <div>
                <span className="font-semibold text-emerald-400 block mb-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Matched Keywords ({analysisResult.matchingSkills.length})</span>
                </span>
                <div className="flex flex-wrap gap-1">
                  {analysisResult.matchingSkills.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-medium">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills with 1-Click Add */}
              <div>
                <span className="font-semibold text-amber-400 block mb-1.5 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Missing Recommended Skills (Click to Add)</span>
                </span>
                <div className="flex flex-wrap gap-1">
                  {analysisResult.missingSkills.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleAddSkill(s)}
                      className="px-2 py-0.5 rounded-md bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[10px] font-medium flex items-center gap-1 transition-colors"
                      title={`Add ${s} to your resume`}
                    >
                      <Plus className="w-3 h-3" />
                      <span>{s}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Key Strengths */}
              <div>
                <span className="font-semibold text-slate-200 block mb-1">Key Strengths</span>
                <ul className="space-y-1 text-slate-300">
                  {analysisResult.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggestions */}
              <div>
                <span className="font-semibold text-slate-200 block mb-1">Actionable Improvements</span>
                <ul className="space-y-1.5 text-slate-300">
                  {analysisResult.improvementSuggestions.map((sug, idx) => (
                    <li key={idx} className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-[11px] leading-relaxed">
                      💡 {sug}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center text-xs text-slate-400">
              <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
              <p className="font-semibold text-white mb-1">No ATS Audit Run Yet</p>
              <p className="text-slate-400 mb-4">
                Click &quot;Run Gemini ATS Audit&quot; above to see your compatibility score, missing keywords, and rewrite suggestions.
              </p>
              <button
                onClick={handleRunAtsAnalysis}
                disabled={isAnalyzing}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors"
              >
                Audit My Resume Now
              </button>
            </div>
          )}

          {/* AI Cover Letter Generator */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl text-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Wand2 className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-sm text-white">AI Tailored Cover Letter</h3>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-slate-400 block mb-1">Company Name</label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Tone of Voice</label>
                <select
                  value={coverLetterTone}
                  onChange={(e) => setCoverLetterTone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Confident, Impactful, and Results-Driven">Confident & Results-Driven</option>
                  <option value="Enthusiastic and Collaborative">Enthusiastic & Collaborative</option>
                  <option value="Direct and Technical">Direct & Technical</option>
                </select>
              </div>

              <button
                onClick={handleGenerateCoverLetter}
                disabled={isGeneratingCoverLetter}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 mt-1"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGeneratingCoverLetter ? 'animate-spin' : ''}`} />
                <span>{isGeneratingCoverLetter ? 'Generating Letter...' : 'Draft Cover Letter with Gemini'}</span>
              </button>
            </div>

            {generatedCoverLetter && (
              <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">Generated Draft</span>
                  <button
                    onClick={handleCopyCoverLetter}
                    className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white"
                  >
                    {copiedLetter ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLetter ? 'Copied!' : 'Copy to Clipboard'}</span>
                  </button>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-300 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-line text-[11px]">
                  {generatedCoverLetter}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
