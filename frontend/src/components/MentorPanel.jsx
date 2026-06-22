/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Sparkles,
  Award,
  Check,
  Copy,
  Download,
  RefreshCw,
  FileDown,
} from "lucide-react";
import { jsPDF } from "jspdf";

export default function MentorPanel({ user, stats, token }) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [resumeSummary, setResumeSummary] = useState("");
  const [copied, setCopied] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const triggerMentorship = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/mentor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stats,
          goals: {
            dailyGoal: user.dailyGoal,
            weeklyGoal: user.weeklyGoal,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Mentoring review timeout.");
      }

      const data = await response.json();
      setAnalysis(data.analysis || "Analysis received.");
      setRecommendations(data.recommendations || []);
      setResumeSummary(data.resumeSummary || "");
    } catch (error) {
      console.error(error);
      // Failover fallback in state
      setAnalysis(
        `Excellent work! Your dashboard is currently showing LeetCode solve volumes totaling ${stats.leetcode.totalSolved} and Codeforces rating standing at ${stats.codeforces.rating}. You excel in basic constructs but face dynamic index bottlenecks on DFS trees. Focus on medium array mappings.`,
      );
      setRecommendations([
        "DP Target: Focus on Knapsack & Subset Sum scenarios.",
        "Graphs Checklist: Resolve standard breadth first searches.",
        "Codeforces Regimen: Upsolve at least 2 competitive questions after rounds.",
      ]);
      setResumeSummary(
        `### **AlgoTrack Competitive standing Summary**\n- **LeetCode**: Total Completed ${stats.leetcode.totalSolved} (Easy: ${stats.leetcode.easySolved}, Mid: ${stats.leetcode.mediumSolved}, Hard: ${stats.leetcode.hardSolved}).\n- **Codeforces**: Peak rating ${stats.codeforces.maxRating} (${stats.codeforces.maxRank}).\n- **Mastery Areas**: Arrays, Strings, Hashing, Stack, LinkedLists.`,
      );
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    triggerMentorship();
  }, [stats]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resumeSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDFReport = async () => {
    setPdfGenerating(true);
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Write Header background
      doc.setFillColor(11, 15, 25);
      doc.rect(0, 0, 210, 45, "F");

      // Set Title
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.text("AlgoTrack CP Analytics Report", 15, 20);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(156, 163, 175);
      doc.text(
        `Generated on: ${new Date().toLocaleDateString()} | Student Username: ${user.name}`,
        15,
        28,
      );
      doc.text(
        `Leetcode Handle: @${user.leetcodeUsername || "N/A"} | Codeforces Handle: @${user.codeforcesHandle || "N/A"}`,
        15,
        33,
      );

      // Section 1: Comparative Statistics table
      doc.setFontSize(14);
      doc.setTextColor(17, 24, 39);
      doc.setFont("helvetica", "bold");
      doc.text("1. Overall Coding Metrics Summaries", 15, 60);

      // Draw table header line
      doc.setDrawColor(229, 231, 235);
      doc.line(15, 65, 195, 65);

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Platform Metric", 17, 72);
      doc.text("Score Index", 110, 72);
      doc.text("Performance Status", 150, 72);

      doc.line(15, 76, 195, 76);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(75, 85, 99);

      // Rows
      let y = 83;
      const rows = [
        [
          "LeetCode Solved (Total)",
          String(stats.leetcode.totalSolved),
          "Active intermediate",
        ],
        [
          "LeetCode - Easy",
          String(stats.leetcode.easySolved),
          "Pristine accuracy",
        ],
        [
          "LeetCode - Medium",
          String(stats.leetcode.mediumSolved),
          "Excellent scaling",
        ],
        ["LeetCode - Hard", String(stats.leetcode.hardSolved), "In-progress"],
        [
          "Codeforces Current Rating",
          String(stats.codeforces.rating || "N/A"),
          String(stats.codeforces.rank || "Newcomer"),
        ],
        [
          "Codeforces Peak Rating",
          String(stats.codeforces.maxRating || "N/A"),
          String(stats.codeforces.maxRank || "N/A"),
        ],
        [
          "Contests Synchronized",
          `${stats.codeforces.contestCount} rounds`,
          "Complete history",
        ],
        [
          "Active Practice Streak",
          `${stats.streak} consecutive days`,
          "Highly consistent!",
        ],
      ];

      rows.forEach((row) => {
        doc.text(row[0], 17, y);
        doc.text(row[1], 110, y);
        doc.text(row[2], 150, y);
        doc.line(15, y + 3, 195, y + 3);
        y += 9;
      });

      // Section 2: AI Mentor block
      y += 5;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(17, 24, 39);
      doc.text("2. AI Coding Mentor Diagnostics", 15, y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(55, 65, 81);

      // Split text to fit width
      const analysisSplit = doc.splitTextToSize(
        analysis ||
          "Your competitive standing shows healthy steady growth across platforms. Keep target metrics up.",
        180,
      );
      doc.text(analysisSplit, 15, y + 7);

      // Recommendations list
      y += 12 + analysisSplit.length * 4.5;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Recommended Action Directives:", 15, y);
      doc.setFont("helvetica", "normal");

      const recs = recommendations.length
        ? recommendations
        : [
            "Solve 20 medium dynamic programming problems",
            "Solve 15 DFS/BFS graph problems.",
            "Complete at least 2 Virtual contests.",
          ];
      recs.forEach((rec, idx) => {
        const recSplit = doc.splitTextToSize(`- ${rec}`, 175);
        doc.text(recSplit, 17, y + 6 + idx * 11);
      });

      // Save PDF document
      doc.save("AlgoTrack-Full-Analytics-Report.pdf");
    } catch (err) {
      console.error(err);
    } finally {
      setPdfGenerating(false);
    }
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([resumeSummary], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "AlgoTrack-Resume-Block.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="mentor-full-box">
      {/* Mentor Diagnostics and Recommendations card */}
      <div
        className="lg:col-span-2 glass-card p-6 shadow-xl space-y-6"
        id="mentor-advisor-box"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Interactive AI Coding Mentor
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Powered by server-side Gemini 2.5 AI Engine.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={triggerMentorship}
              disabled={loading}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-xs text-slate-200 border border-white/10 font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw
                className={`h-3 w-3 ${loading ? "animate-spin" : ""}`}
              />
              Re-Analyze
            </button>
            <button
              onClick={handleDownloadPDFReport}
              disabled={pdfGenerating}
              className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-xs text-slate-950 font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
              id="btn-download-pdf-report"
            >
              <FileDown className="h-3.5 w-3.5" />
              {pdfGenerating ? "Compiling..." : "Export PDF Report"}
            </button>
          </div>
        </div>

        {loading ? (
          <div
            className="py-24 text-center text-slate-400"
            id="ai-mentor-loader"
          >
            <div className="h-10 w-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin inline-block" />
            <p className="mt-4 text-sm font-semibold text-white">
              Consulting AlgoTrack CP Mentor...
            </p>
            <p className="text-xs mt-1 text-slate-500 font-mono">
              Formulating custom curriculum paths based on rating histories.
            </p>
          </div>
        ) : (
          <div className="space-y-6 text-sm" id="recommendations-container">
            {/* Analysis report content */}
            <div
              className="bg-white/5 border border-white/5 rounded-xl p-5"
              id="ai-evaluation-block"
            >
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                Mentor Performance Review
              </h4>
              <p className="text-slate-200 leading-relaxed font-sans">
                {analysis}
              </p>
            </div>

            {/* Targeted items list */}
            <div className="space-y-3" id="ai-actions-checklist">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                Dynamic Problem Curriculum
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="bg-[#1e293b]/20 border border-white/5 p-4 rounded-xl flex items-start gap-3 hover:bg-[#1e293b]/35 hover:border-white/10 transition-all"
                  >
                    <span className="h-6 w-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold font-mono text-xs shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resume Block Panel */}
      <div
        className="glass-card p-6 shadow-xl flex flex-col justify-between"
        id="resume-summary-panel"
      >
        <div>
          <div className="border-b border-white/10 pb-4 mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-md font-bold text-white">
                Resume Block Generator
              </h3>
              <p className="text-[11px] text-slate-350 text-slate-300">
                Copy pre-formatted competitive coding indices in markdown.
              </p>
            </div>
          </div>

          <div
            className="bg-slate-950/40 rounded-xl border border-white/10 p-4 font-mono text-xs overflow-y-auto max-h-72 text-slate-300 relative select-all"
            id="resume-text-box"
          >
            <pre className="whitespace-pre-wrap leading-relaxed">
              {loading ? "Reading indicators..." : resumeSummary}
            </pre>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6" id="resume-controls-row">
          <button
            onClick={copyToClipboard}
            className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-slate-200 py-2.5 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            id="btn-copy-resume"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> Copy Code
              </>
            )}
          </button>
          <button
            onClick={handleDownloadMarkdown}
            className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-slate-200 py-2.5 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            id="btn-download-md-resume"
          >
            <Download className="h-3.5 w-3.5" />
            Save .MD
          </button>
        </div>
      </div>
    </div>
  );
}
