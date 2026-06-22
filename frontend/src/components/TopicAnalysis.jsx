/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AlertTriangle, Lightbulb, CheckSquare, Trophy } from "lucide-react";

export default function TopicAnalysis({ stats }) {
  const topics = stats?.topicAnalysis || [];
  const weakTopics = stats?.weakTopics || [];
  const suggestions = stats?.suggestions || [];

  const getTopicProgressColor = (percent) => {
    if (percent >= 75) return "bg-emerald-500";
    if (percent >= 45) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTopicBgColor = (percent) => {
    if (percent >= 75)
      return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
    if (percent >= 45)
      return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
    return "bg-red-500/10 border-red-500/20 text-red-400";
  };

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in"
      id="topic-analysis-grid"
    >
      {/* List of topic competencies */}
      <div
        className="md:col-span-2 glass-card p-6 shadow-xl"
        id="topic-mastery-list-box"
      >
        <h3
          className="text-lg font-bold text-white mb-1.5 flex items-center gap-2"
          id="topic-header"
        >
          <Trophy className="h-5 w-5 text-cyan-400" />
          Technical Topic-wise Mastery Breakdowns
        </h3>
        <p className="text-xs text-slate-300 mb-6">
          Quantified ratios of problems completed over curriculum-specific
          targets across core computer science paradigms.
        </p>

        <div className="space-y-4" id="topics-bars-container">
          {topics.map((t, idx) => (
            <div
              key={idx}
              className="space-y-1.5"
              id={`topic-row-${t.topic.replace(/\s+/g, "-").toLowerCase()}`}
            >
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-200 font-semibold">{t.topic}</span>
                <span className="font-mono text-xs text-slate-400">
                  <span className="text-white font-bold">{t.count}</span> /{" "}
                  {t.total} Solved
                  <span className="ml-2 font-black text-cyan-400">
                    ({t.percent}%)
                  </span>
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2.5 relative overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getTopicProgressColor(t.percent)}`}
                  style={{ width: `${t.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weak area suggestions sidebar */}
      <div className="space-y-6" id="weak-areas-sidebar">
        {/* Weak topic alert card */}
        <div
          className="glass-card border-l-4 border-l-rose-500 p-6 shadow-xl relative overflow-hidden"
          id="weak-topic-alerts"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-full blur-xl" />
          <h4
            className="text-md font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3 mb-4"
            id="weak-alerts-title"
          >
            <AlertTriangle className="h-5 w-5 text-rose-400" />
            Weak Topics Alert
          </h4>

          <p className="text-xs text-slate-300 mb-4">
            Our automated analyzer has flagged categories where your current
            accuracy rating sits below 45%:
          </p>

          <div className="flex flex-wrap gap-2" id="weak-badges">
            {weakTopics.length === 0 ? (
              <span className="text-emerald-400 text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg">
                No weak topics flagged! Perfect mastery baseline!
              </span>
            ) : (
              weakTopics.map((wt, idx) => (
                <span
                  key={idx}
                  className="bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs font-semibold rounded-lg px-2.5 py-1 flex items-center gap-1.5"
                >
                  <span className="h-1.5 w-1.5 bg-rose-500 rounded-full animate-ping" />
                  {wt}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Action Directives Card */}
        <div className="glass-card p-6 shadow-xl" id="action-recommendations">
          <h4
            className="text-md font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3 mb-4"
            id="suggestions-title"
          >
            <Lightbulb className="h-5 w-5 text-yellow-400" />
            Targeted Solved Recommendations
          </h4>

          <ul className="space-y-4" id="suggestions-list">
            {suggestions.map((s, idx) => (
              <li
                key={idx}
                className="flex gap-3 text-xs text-slate-200"
                id={`suggestion-item-${idx}`}
              >
                <CheckSquare className="h-4.5 w-4.5 shrink-0 text-cyan-400" />
                <div>
                  <span className="font-semibold text-white block mb-0.5">
                    Recommendation #{idx + 1}
                  </span>
                  <p className="text-slate-300 leading-relaxed">{s}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
