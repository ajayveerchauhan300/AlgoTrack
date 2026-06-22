/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import {
  Flame,
  User,
  Settings,
  CalendarDays,
  CalendarRange,
  CalendarCheck2,
} from "lucide-react";

export default function DashboardOverview({
  user,
  stats,
  onUpdateProfile,
  loadingStats,
}) {
  const [showConfig, setShowConfig] = useState(false);
  const [name, setName] = useState(user.name);
  const [cfHandle, setCfHandle] = useState(user.codeforcesHandle || "");
  const [lcUser, setLcUser] = useState(user.leetcodeUsername || "");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [planType, setPlanType] = useState("Day Plan");
  const [planTitle, setPlanTitle] = useState("");
  const [planNotes, setPlanNotes] = useState("");
  const [plans, setPlans] = useState(() => {
    try {
      const stored = localStorage.getItem("dashboard-plans");
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error(err);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("dashboard-plans", JSON.stringify(plans));
  }, [plans]);

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      await onUpdateProfile({
        name,
        codeforcesHandle: cfHandle,
        leetcodeUsername: lcUser,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setShowConfig(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const openPlanModal = (type) => {
    setPlanType(type);
    setPlanTitle("");
    setPlanNotes("");
    setPlanModalOpen(true);
  };

  const handlePlanSave = (e) => {
    e.preventDefault();
    const title = planTitle.trim();
    if (!title) return;

    const newPlan = {
      id: Date.now(),
      type: planType,
      title,
      notes: planNotes.trim(),
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    };

    setPlans((prev) => [newPlan, ...prev]);
    setPlanTitle("");
    setPlanNotes("");
    setPlanModalOpen(false);
  };

  const deletePlan = (id) => {
    setPlans((prev) => prev.filter((plan) => plan.id !== id));
  };

  const getCfRankColor = (rank) => {
    if (!rank) return "text-gray-400 border-gray-800";
    const r = rank.toLowerCase();
    if (r.includes("grandmaster") || r.includes("legendary"))
      return "text-red-500 border-red-500/30 bg-red-950/20";
    if (r.includes("master"))
      return "text-orange-500 border-orange-500/30 bg-orange-950/20";
    if (r.includes("candidate"))
      return "text-violet-500 border-violet-500/30 bg-violet-950/20";
    if (r.includes("expert"))
      return "text-blue-500 border-blue-500/30 bg-blue-950/20";
    if (r.includes("specialist"))
      return "text-cyan-500 border-cyan-500/30 bg-cyan-950/20";
    if (r.includes("pupil"))
      return "text-green-500 border-green-500/30 bg-green-950/20";
    return "text-gray-300 border-gray-700 bg-gray-800/20";
  };

  // Safe destructuring with fallback
  const {
    leetcode = {
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      contestRating: 0,
      globalRanking: 0,
    },
    codeforces = {
      rating: 0,
      maxRating: 0,
      rank: "Newcomer",
      maxRank: "Newcomer",
      contestCount: 0,
    },
  } = stats || {};

  return (
    <div className="space-y-6 animate-fade-in" id="dashboard-tab-overview">
      {/* Welcome Banner */}
      <div
        className="glass-card border-l-4 border-l-orange-500 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        id="welcome-banner"
      >
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {user.name}
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            Let's keep up the consistency. Your coding analytics are fully
            synced!
          </p>
          <div className="flex flex-wrap gap-2 mt-3 text-xs font-mono">
            {user.leetcodeUsername ? (
              <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-md px-2.5 py-1">
                LeetCode: @{user.leetcodeUsername}
              </span>
            ) : (
              <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md px-2.5 py-1">
                LeetCode: Unlinked
              </span>
            )}
            {user.codeforcesHandle ? (
              <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-md px-2.5 py-1">
                Codeforces: @{user.codeforcesHandle}
              </span>
            ) : (
              <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md px-2.5 py-1">
                Codeforces: Unlinked
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowConfig(!showConfig)}
          id="btn-open-settings"
          className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-sm font-bold text-white px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-orange-500/30 active:scale-95"
        >
          <Settings className="h-4 w-4" />
          Add Profile
        </button>
      </div>

      {/* Profile Configurations Panel Drawer */}
      {showConfig && (
        <div
          className="glass-card p-6 shadow-2xl relative border-orange-500/30"
          id="profile-config-drawer"
        >
          <div className="absolute top-0 right-0 p-3">
            <button
              onClick={() => setShowConfig(false)}
              className="text-slate-400 hover:text-white bg-transparent border-0 cursor-pointer text-xl font-bold"
            >
              ×
            </button>
          </div>
          <h3
            className="text-lg font-bold text-white mb-4 flex items-center gap-2"
            id="config-title"
          >
            <User className="h-5 w-5 text-orange-400" />
            Update Handles & Profile
          </h3>
          <form
            onSubmit={handleSaveConfig}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            id="config-form"
          >
            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                Your Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full glass-input rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                Codeforces Handle
              </label>
              <input
                type="text"
                placeholder="e.g. tourist"
                value={cfHandle}
                onChange={(e) => setCfHandle(e.target.value)}
                className="w-full glass-input rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                LeetCode Username
              </label>
              <input
                type="text"
                placeholder="e.g. ajay_veer"
                value={lcUser}
                onChange={(e) => setLcUser(e.target.value)}
                className="w-full glass-input rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowConfig(false)}
                className="px-4 py-2 bg-transparent text-slate-400 hover:text-white font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white font-bold rounded-xl transition-all active:scale-95 shadow-md shadow-orange-500/15"
              >
                {saving ? "Saving..." : "Save Configuration"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Overview Cards (Streak + Create Plan Buttons) */}
      <div
        className="grid grid-cols-1 md:grid-cols-[1.1fr_1.9fr] gap-6"
        id="overview-highlights-row"
      >
        {/* Streak Flame */}
        <div
          className="glass-card p-6 flex items-center gap-4 relative overflow-hidden group shadow-lg"
          id="stat-card-streak"
        >
          <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400 border border-orange-500/20 group-hover:bg-orange-500/20 transition-all">
            <Flame className="h-8 w-8 animate-pulse" />
          </div>
          <div>
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              Consistency Streak
            </span>
            <h4 className="text-3xl font-extrabold text-white mt-1">
              {stats?.streak || 0}{" "}
              <span className="text-lg font-normal text-slate-400">Days</span>
            </h4>
            <p className="text-orange-400 text-xs mt-1">
              Daily practice boosts skills!
            </p>
          </div>
        </div>

        {/* Plan Creator Buttons */}
        <div className="glass-card p-6 shadow-lg" id="plan-creator-panel">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-mono">
                Create New Plan
              </p>
              <h3 className="mt-1 text-xl font-semibold text-white">
                Plan your next sprint
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => openPlanModal("Day Plan")}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
              >
                <CalendarDays className="h-4 w-4" />
                Day Plan
              </button>
              <button
                type="button"
                onClick={() => openPlanModal("Week Plan")}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
              >
                <CalendarRange className="h-4 w-4" />
                Week Plan
              </button>
              <button
                type="button"
                onClick={() => openPlanModal("Month Plan")}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
              >
                <CalendarCheck2 className="h-4 w-4" />
                Month Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      {plans.length > 0 && (
        <div className="glass-card p-6" id="saved-plans-panel">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-mono">
                Your Plans
              </p>
              <h3 className="mt-1 text-xl font-semibold text-white">
                Saved schedule items
              </h3>
            </div>
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
              {plans.length} total
            </span>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-orange-500/10 px-2.5 py-1 text-[11px] font-semibold text-orange-300">
                    {plan.type}
                  </span>
                  <button
                    type="button"
                    onClick={() => deletePlan(plan.id)}
                    className="text-xs text-rose-400 hover:text-rose-300"
                  >
                    Delete
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400">
                    {plan.createdAt}
                  </span>
                </div>
                <h4 className="mt-3 text-sm font-semibold text-white">
                  {plan.title}
                </h4>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {plan.notes || "No additional notes added."}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {planModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-mono">
                  New Plan
                </p>
                <h3 className="mt-1 text-xl font-semibold text-white">
                  {planType}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPlanModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePlanSave} className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-wider text-slate-400 font-mono">
                  Plan Title
                </label>
                <input
                  type="text"
                  value={planTitle}
                  onChange={(e) => setPlanTitle(e.target.value)}
                  placeholder="e.g. Solve 5 DP questions"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-400/40"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-wider text-slate-400 font-mono">
                  Notes
                </label>
                <textarea
                  value={planNotes}
                  onChange={(e) => setPlanNotes(e.target.value)}
                  placeholder="Add details, priorities, or reminders..."
                  rows={5}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-400/40"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPlanModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-orange-400 to-red-500 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LeetCode & Codeforces Dashboard Splits */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        id="dashboard-platforms-grid"
      >
        {/* Leetcode card */}
        <div
          className="glass-card border-l-4 border-l-yellow-500 p-6 shadow-lg hover:border-r hover:border-r-white/5 transition-all flex flex-col justify-between"
          id="platform-leetcode-stats"
        >
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-yellow-500/10 text-yellow-400 rounded-xl flex items-center justify-center font-bold text-lg">
                  L
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">
                    LeetCode Stats
                  </h4>
                  <p className="text-xs text-slate-400">
                    @{user.leetcodeUsername || "Unlinked"}
                  </p>
                </div>
              </div>
              {leetcode.globalRanking && (
                <span className="text-xs font-mono text-slate-300 bg-white/10 border border-white/10 rounded-lg px-2 py-0.5">
                  Rank: #{leetcode.globalRanking.toLocaleString()}
                </span>
              )}
            </div>

            {/* Circle solved rings split */}
            <div className="grid grid-cols-5 gap-4 items-center">
              <div className="col-span-2 flex flex-col items-center justify-center p-3 bg-white/5 border border-white/10 rounded-xl">
                <span className="text-slate-400 text-xs font-sans">
                  Total Solved
                </span>
                <span className="text-3xl font-extrabold text-white mt-1">
                  {leetcode.totalSolved}
                </span>
                {leetcode.contestRating && (
                  <span className="text-[10px] text-yellow-400 font-mono mt-1 border border-yellow-500/20 bg-yellow-500/5 px-1.5 py-0.5 rounded">
                    ★ {leetcode.contestRating} Rating
                  </span>
                )}
              </div>
              <div className="col-span-3 space-y-3">
                {/* Easy */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-sans">
                    <span className="text-emerald-400 font-medium">
                      Easy Solved
                    </span>
                    <span className="text-slate-200 font-mono font-bold bg-white/10 px-1.5 rounded">
                      {leetcode.easySolved}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <div
                      className="bg-emerald-400 h-1.5 rounded-full"
                      style={{
                        width: `${leetcode.totalSolved ? (leetcode.easySolved / leetcode.totalSolved) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
                {/* Medium */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-sans">
                    <span className="text-yellow-450 text-yellow-400 font-medium">
                      Medium Solved
                    </span>
                    <span className="text-slate-200 font-mono font-bold bg-white/10 px-1.5 rounded">
                      {leetcode.mediumSolved}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <div
                      className="bg-yellow-450 bg-yellow-400 h-1.5 rounded-full"
                      style={{
                        width: `${leetcode.totalSolved ? (leetcode.mediumSolved / leetcode.totalSolved) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
                {/* Hard */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-sans">
                    <span className="text-rose-400 font-medium">
                      Hard Solved
                    </span>
                    <span className="text-slate-200 font-mono font-bold bg-white/10 px-1.5 rounded">
                      {leetcode.hardSolved}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <div
                      className="bg-rose-400 h-1.5 rounded-full"
                      style={{
                        width: `${leetcode.totalSolved ? (leetcode.hardSolved / leetcode.totalSolved) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 text-[11px] text-slate-450 text-slate-400 text-center">
            Problem ratio metrics:{" "}
            {Math.round(
              leetcode.mediumSolved
                ? (leetcode.mediumSolved / leetcode.totalSolved) * 100
                : 0,
            )}
            % Medium,{" "}
            {Math.round(
              leetcode.hardSolved
                ? (leetcode.hardSolved / leetcode.totalSolved) * 100
                : 0,
            )}
            % Hard
          </div>
        </div>

        {/* Codeforces card */}
        <div
          className="glass-card border-l-4 border-l-orange-500 p-6 shadow-lg hover:border-r hover:border-r-white/5 transition-all flex flex-col justify-between"
          id="platform-codeforces-stats"
        >
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center font-bold text-lg">
                  C
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">
                    Codeforces Stats
                  </h4>
                  <p className="text-xs text-slate-400">
                    @{user.codeforcesHandle || "Unlinked"}
                  </p>
                </div>
              </div>
              <span
                className={`text-xs font-mono font-bold border rounded-lg px-2.5 py-1 ${getCfRankColor(codeforces.rank)}`}
              >
                {codeforces.rank || "Newcomer"}
              </span>
            </div>

            {/* CF stats values */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col">
                <span className="text-slate-400 text-xs font-sans">
                  Current Rating
                </span>
                <span className="text-3xl font-extrabold text-white mt-1">
                  {codeforces.rating || "Unrated"}
                </span>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col">
                <span className="text-slate-400 text-xs font-sans">
                  Max Rating
                </span>
                <span className="text-3xl font-extrabold text-orange-400 mt-1">
                  {codeforces.maxRating || "Unrated"}
                </span>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col">
                <span className="text-slate-400 text-xs font-sans">
                  Contests Attended
                </span>
                <span className="text-lg font-bold text-white mt-1">
                  {codeforces.contestCount || 0} rounds
                </span>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col justify-center">
                <span className="text-slate-400 text-xs font-sans">
                  Peak Level Achieved
                </span>
                <span className="text-sm font-semibold text-slate-200 mt-1 truncate">
                  {codeforces.maxRank || "Newcomer"}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 text-[11px] text-slate-450 text-slate-400 text-center">
            Codeforces performance rating update synced of the last{" "}
            {codeforces.contestCount || 0} rounds
          </div>
        </div>
      </div>
    </div>
  );
}
