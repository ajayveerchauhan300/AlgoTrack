import React, { useState } from "react";
import {
  AlertCircle,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  Code2,
  Gauge,
  Layers3,
  Lightbulb,
  Loader2,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

const languageOptions = [
  "Java",
  "C++",
  "Python",
  "JavaScript",
];

const defaultResult = {
  approach: {
    current: "",
    suggested: "",
    keyIdea: "",
  },
  complexity: {
    time: "",
    space: "",
  },
  scores: {
    efficiency: 0,
    correctness: 0,
    codeStyle: 0,
  },
  strengths: [],
  weaknesses: [],
  optimizations: [],
  interviewFeedback: "",
  difficulty: "",
  primaryTopic: "",
  secondaryTopic: "",
  pattern: "",
  similarProblems: [],
};

const clamp = (value, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value));

const ScoreBar = ({ label, value, color }) => (
  <div>
    <div className="mb-2 flex items-center justify-between">
      <span className="text-sm text-slate-300">{label}</span>
      <span className="text-sm font-semibold text-white">{value}/100</span>
    </div>
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${clamp(value)}%` }}
      />
    </div>
  </div>
);

const InfoCard = ({ title, icon: Icon, children, accent = "text-violet-300" }) => (
  <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl">
    <div className="mb-4 flex items-center gap-2">
      <div className={`rounded-xl bg-white/5 p-2 ${accent}`}>
        <Icon className="h-4 w-4" />
      </div>
      <h4 className="text-sm font-semibold text-white">{title}</h4>
    </div>
    {children}
  </section>
);

export default function CodeReview({ token }) {
  const [problemStatement, setProblemStatement] = useState("");
  const [language, setLanguage] = useState("Python");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const averageScore = result
    ? Math.round(
        (result.scores?.efficiency +
          result.scores?.correctness +
          result.scores?.codeStyle) /
          3,
      )
    : 0;

  const scoreMood =
    averageScore >= 85
      ? "Excellent"
      : averageScore >= 70
        ? "Strong"
        : averageScore >= 55
          ? "Needs polish"
          : "Draft level";

  const handleAnalyze = async () => {
    if (!problemStatement.trim() || !code.trim()) {
      setError("Please enter both the problem statement and your code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/ai/code-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          problemStatement,
          language,
          code,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data || typeof data !== "object") {
        throw new Error(
          data?.error || "The AI review service returned an invalid response."
        );
      }

      const normalized = {
        ...defaultResult,
        ...data,
        approach: {
          ...defaultResult.approach,
          ...(data.approach || {}),
        },
        complexity: {
          ...defaultResult.complexity,
          ...(data.complexity || {}),
        },
        scores: {
          ...defaultResult.scores,
          ...(data.scores || {}),
        },
      };

      setResult(normalized);
    } catch (err) {
      setError(err.message || "Something went wrong while analyzing your code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-white/5 bg-slate-950/60 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl">
        <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-violet-500/5 to-transparent" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-slate-400">
              AI Code Review
            </p>
            <h3 className="mt-1 text-2xl font-semibold text-white md:text-3xl">
              Review your solution
            </h3>
            <p className="mt-1.5 text-sm leading-6 text-slate-400">
              Get detailed feedback on complexity, correctness, patterns, and interview-ready improvements.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200">
              <Code2 className="h-4 w-4 text-violet-300" />
              {language}
            </span>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="space-y-5 rounded-2xl border border-white/5 bg-slate-950/45 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl">
          <div>
            <label className="text-xs uppercase tracking-wider text-slate-400 font-mono">
              Problem Statement
            </label>
            <textarea
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              placeholder="Paste the exact problem statement here..."
              className="mt-2 min-h-36 w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all focus:border-violet-400/30 focus:bg-slate-900/75"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-wider text-slate-400 font-mono">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none transition-all focus:border-violet-400/30 focus:bg-slate-900/75"
              >
                {languageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-slate-400 font-mono">
              Code Editor
            </label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your solution here..."
              className="mt-2 min-h-[360px] w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 font-mono text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all focus:border-violet-400/30 focus:bg-slate-900/75"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-all hover:opacity-90 disabled:opacity-60 shadow-[0_10px_24px_-12px_rgba(139,92,246,0.9)]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing Code...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4" />
                Analyze Code
              </>
            )}
          </button>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-violet-500/5 via-slate-900/50 to-cyan-500/5 p-5">
            <div className="flex items-center gap-2 text-violet-200">
              <Target className="h-4 w-4" />
              <span className="font-mono text-xs uppercase tracking-wider">
                Review Focus
              </span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <Code2 className="mt-0.5 h-4 w-4 text-violet-300" />
                Code correctness and optimization
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="mt-0.5 h-4 w-4 text-cyan-300" />
                Time and space complexity review
              </li>
              <li className="flex items-start gap-2">
                <BookOpen className="mt-0.5 h-4 w-4 text-fuchsia-300" />
                Interview-ready feedback and patterns
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
              Quick Tips
            </p>
            <div className="mt-3 space-y-3 text-sm text-slate-300">
              <p>• Be specific about constraints and edge cases.</p>
              <p>• Mention if the solution is brute force or optimized.</p>
              <p>• Paste the full logic so the AI can review deeply.</p>
            </div>
          </div>
        </div>
      </section>

      {loading && (
        <section className="rounded-2xl border border-white/5 bg-slate-950/50 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
            <Loader2 className="h-6 w-6 animate-spin text-violet-200" />
          </div>
          <p className="mt-4 text-sm text-slate-300">
            Gemini is reviewing your approach and generating insights...
          </p>
        </section>
      )}

      {!loading && result && (
        <div className="space-y-6">
          <section className="rounded-2xl border border-white/5 bg-slate-950/60 p-5">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-slate-400">
                  Review Summary
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <h4 className="text-2xl font-semibold text-white">
                    {averageScore}/100
                  </h4>
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                    {scoreMood}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                  <Gauge className="h-3.5 w-3.5 text-cyan-300" />
                  {result.difficulty || "Unknown difficulty"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                  <Layers3 className="h-3.5 w-3.5 text-fuchsia-300" />
                  {result.primaryTopic || "General"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                  <BarChart3 className="h-3.5 w-3.5 text-amber-300" />
                  {result.pattern || "Pattern review"}
                </span>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4">
              <p className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
                Difficulty
              </p>
              <p className="mt-2 text-xl font-semibold text-white">
                {result.difficulty || "—"}
              </p>
            </div>
            <div className="rounded-2xl border border-cyan-500/10 bg-cyan-500/5 p-4">
              <p className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
                Primary Topic
              </p>
              <p className="mt-2 text-xl font-semibold text-white">
                {result.primaryTopic || "—"}
              </p>
            </div>
            <div className="rounded-2xl border border-amber-500/10 bg-amber-500/5 p-4">
              <p className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
                Pattern
              </p>
              <p className="mt-2 text-xl font-semibold text-white">
                {result.pattern || "—"}
              </p>
            </div>
            <div className="rounded-2xl border border-fuchsia-500/10 bg-fuchsia-500/5 p-4">
              <p className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
                Secondary Topic
              </p>
              <p className="mt-2 text-xl font-semibold text-white">
                {result.secondaryTopic || "—"}
              </p>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <InfoCard title="Approach Card" icon={Brain}>
              <div className="space-y-3 text-sm text-slate-300">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-500">
                    Current Approach
                  </p>
                  <p className="mt-1 text-slate-100">
                    {result.approach?.current || "No summary available."}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-500">
                    Suggested Better Approach
                  </p>
                  <p className="mt-1 text-slate-100">
                    {result.approach?.suggested || "No suggestion available."}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-500">
                    Key Idea
                  </p>
                  <p className="mt-1 text-slate-100">
                    {result.approach?.keyIdea || "No key idea available."}
                  </p>
                </div>
              </div>
            </InfoCard>

            <InfoCard title="Complexity Card" icon={TrendingUp}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-wider text-slate-500">
                    Time Complexity
                  </p>
                  <p className="mt-2 font-semibold text-white">
                    {result.complexity?.time || "—"}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-wider text-slate-500">
                    Space Complexity
                  </p>
                  <p className="mt-2 font-semibold text-white">
                    {result.complexity?.space || "—"}
                  </p>
                </div>
              </div>
            </InfoCard>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <InfoCard title="Score Cards" icon={Target}>
              <div className="space-y-4">
                <ScoreBar
                  label="Efficiency"
                  value={result.scores?.efficiency || 0}
                  color="bg-gradient-to-r from-emerald-500 to-green-400"
                />
                <ScoreBar
                  label="Correctness"
                  value={result.scores?.correctness || 0}
                  color="bg-gradient-to-r from-cyan-500 to-blue-500"
                />
                <ScoreBar
                  label="Code Style"
                  value={result.scores?.codeStyle || 0}
                  color="bg-gradient-to-r from-amber-500 to-orange-500"
                />
              </div>
            </InfoCard>

            <InfoCard title="Interview Feedback Card" icon={Sparkles}>
              <p className="text-sm leading-6 text-slate-300">
                {result.interviewFeedback || "No feedback provided."}
              </p>
            </InfoCard>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <InfoCard title="Strengths Card" icon={CheckCircle2} accent="text-emerald-300">
              <ul className="space-y-2">
                {(result.strengths || []).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </InfoCard>

            <InfoCard title="Weaknesses Card" icon={AlertCircle} accent="text-rose-300">
              <ul className="space-y-2">
                {(result.weaknesses || []).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                    <AlertCircle className="mt-0.5 h-4 w-4 text-rose-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </InfoCard>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <InfoCard title="Optimization Card" icon={Lightbulb} accent="text-amber-300">
              <ul className="space-y-2">
                {(result.optimizations || []).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                    <Lightbulb className="mt-0.5 h-4 w-4 text-amber-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </InfoCard>

            <InfoCard title="Similar Problems Card" icon={BookOpen} accent="text-fuchsia-300">
              <div className="flex flex-wrap gap-2">
                {(result.similarProblems || []).map((item, idx) => (
                  <span
                    key={idx}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </InfoCard>
          </section>
        </div>
      )}
    </div>
  );
}
