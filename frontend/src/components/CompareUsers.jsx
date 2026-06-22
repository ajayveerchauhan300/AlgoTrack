/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from "react";
import { Award, Gauge, ShieldAlert, Swords, Trophy } from "lucide-react";
import { motion } from "motion/react";

const clamp = (value, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value));

const toNumber = (value, fallback = 0) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
};

const formatMetricValue = (value) => {
  if (typeof value === "number") return value.toLocaleString();
  return value;
};

export default function CompareUsers({ token }) {
  const [friendCF, setFriendCF] = useState("neal_wu");
  const [friendLC, setFriendLC] = useState("neal");
  const [userAName, setUserAName] = useState("You");
  const [userBName, setUserBName] = useState("Friend");
  const [metrics, setMetrics] = useState([]);
  const [statsA, setStatsA] = useState(null);
  const [statsB, setStatsB] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCompare = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/compare?friendCF=${encodeURIComponent(friendCF)}&friendLC=${encodeURIComponent(friendLC)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Unable to fetch comparative student statistics.");
      }

      const data = await response.json();
      setMetrics(data.metrics || []);
      setStatsA(data.statsA || null);
      setStatsB(data.statsB || null);
      setUserAName(data.userAName || "You");
      setUserBName(data.userBName || "Friend");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCompare();
  }, []);

  const getWinner = (valA, valB) => {
    const numA = toNumber(valA);
    const numB = toNumber(valB);

    if (numA > numB) return "A";
    if (numB > numA) return "B";
    return "Draw";
  };

  const scoreProfile = (stats) => {
    const leetcode = stats?.leetcode || {};
    const codeforces = stats?.codeforces || {};

    const totalSolved = toNumber(leetcode.totalSolved);
    const easySolved = toNumber(leetcode.easySolved);
    const mediumSolved = toNumber(leetcode.mediumSolved);
    const hardSolved = toNumber(leetcode.hardSolved);
    const rating = toNumber(codeforces.rating);
    const contestCount = toNumber(codeforces.contestCount);
    const recentSubmissions = toNumber(codeforces.recentSubmissionsCount);
    const streak = toNumber(stats?.streak);

    const problemSolving = clamp((totalSolved / 450) * 100, 0, 100);
    const contestPerformance = clamp(((rating - 800) / 1800) * 100, 0, 100);
    const consistency = clamp((streak / 30) * 100, 0, 100);
    const activity = clamp((recentSubmissions / 80) * 100, 0, 100);
    const difficulty = clamp(
      ((hardSolved * 3 + mediumSolved * 1.5 + easySolved * 0.6) /
        Math.max(1, totalSolved || 1)) *
        100,
      0,
      100,
    );

    const overall = Math.round(
      0.35 * problemSolving +
        0.3 * contestPerformance +
        0.15 * consistency +
        0.1 * activity +
        0.1 * difficulty,
    );

    return {
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      rating,
      contestCount,
      streak,
      activity,
      problemSolving,
      contestPerformance,
      consistency,
      difficulty,
      overall,
    };
  };

  const profileA = useMemo(() => scoreProfile(statsA), [statsA]);
  const profileB = useMemo(() => scoreProfile(statsB), [statsB]);

  const overallWinner =
    profileA.overall > profileB.overall
      ? "A"
      : profileB.overall > profileA.overall
        ? "B"
        : "Draw";

  const scoreDiff = Math.abs(profileA.overall - profileB.overall);
  const winnerName =
    overallWinner === "A"
      ? userAName
      : overallWinner === "B"
        ? userBName
        : "Both users";

  const summaryText =
    overallWinner === "A"
      ? `${userAName} is stronger in competitive programming and overall consistency.`
      : overallWinner === "B"
        ? `${userBName} is stronger in competitive programming and overall consistency.`
        : "Both profiles are closely matched with a very small edge between them.";

  const leadText =
    overallWinner === "A"
      ? `${userAName} leads by ${scoreDiff}% overall.`
      : overallWinner === "B"
        ? `${userBName} leads by ${scoreDiff}% overall.`
        : "The overall score is tied.";

  return (
    <div
      className="glass-card p-6 shadow-xl animate-fade-in"
      id="compare-users-panel"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Swords className="h-5 w-5 text-cyan-400" />
            Arena: Peer User Comparison
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Visual analytics for Codeforces and LeetCode performance.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleCompare}
        className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end backdrop-blur-md"
        id="compare-handles-form"
      >
        <div>
          <label className="block text-slate-300 text-[11px] font-semibold mb-2 uppercase tracking-wider font-mono">
            Friend's CF Handle
          </label>
          <input
            type="text"
            required
            value={friendCF}
            onChange={(e) => setFriendCF(e.target.value)}
            placeholder="tourist"
            className="w-full glass-input text-sm rounded-xl px-4 py-2.5 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-300 text-[11px] font-semibold mb-2 uppercase tracking-wider font-mono">
            Friend's LC Username
          </label>
          <input
            type="text"
            required
            value={friendLC}
            onChange={(e) => setFriendLC(e.target.value)}
            placeholder="neal"
            className="w-full glass-input text-sm rounded-xl px-4 py-2.5 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
          id="btn-compare-handles"
        >
          {loading ? "Comparing..." : "Re-Calculate Comparison"}
        </button>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-200 text-xs flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {loading && metrics.length === 0 ? (
        <div className="text-center py-16 text-slate-400" id="compare-loader">
          <div className="inline-block h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="mt-3 text-sm font-mono tracking-wider">
            Mapping metrics database tables...
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            {[
              {
                name: userAName,
                profile: profileA,
                accent: "from-cyan-500 to-blue-600",
                badge: "You",
              },
              {
                name: userBName,
                profile: profileB,
                accent: "from-amber-500 to-orange-600",
                badge: userBName === "Friend" ? "Friend" : "Competitor",
              },
            ].map((entry, index) => (
              <motion.div
                key={entry.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                className="rounded-2xl border border-white/10 bg-slate-950/40 p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-slate-400 font-mono">
                      {entry.badge}
                    </p>
                    <h4 className="text-lg font-semibold text-white mt-1">
                      {entry.name}
                    </h4>
                  </div>
                  <div
                    className={`rounded-xl bg-gradient-to-r ${entry.accent} px-3 py-1 text-xs font-semibold text-slate-950`}
                  >
                    {entry.profile.overall}%
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-2">
                    <span>Overall Performance Score</span>
                    <span>{entry.profile.overall}/100</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${entry.accent}`}
                      style={{ width: `${entry.profile.overall}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-white/5 p-3">
                    <p className="text-slate-400 text-[11px]">LeetCode</p>
                    <p className="text-white font-semibold mt-1">
                      {entry.profile.totalSolved}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3">
                    <p className="text-slate-400 text-[11px]">CF Rating</p>
                    <p className="text-white font-semibold mt-1">
                      {entry.profile.rating || 0}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-cyan-500/10 bg-gradient-to-r from-cyan-500/10 via-slate-900 to-amber-500/10 p-5 mb-6"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-slate-400 font-mono">
                  Comparison Summary
                </p>
                <h4 className="text-base md:text-lg font-semibold text-white mt-1">
                  {summaryText}
                </h4>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-slate-950/60 px-3 py-1.5 border border-white/10">
                <Trophy className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-white">{winnerName}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-white/10 bg-slate-950/40 p-5 mb-6"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-slate-400 font-mono">
                  Winner Section
                </p>
                <h4 className="text-sm font-semibold text-white mt-1">
                  Overall Champion
                </h4>
              </div>
              <Trophy className="h-5 w-5 text-amber-400" />
            </div>
            <div className="mt-4 rounded-2xl border border-amber-500/10 bg-amber-500/5 p-5 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950">
                <Award className="h-8 w-8" />
              </div>
              <h5 className="mt-3 text-xl font-semibold text-white">{winnerName}</h5>
              <p className="mt-1 text-sm text-slate-300">{leadText}</p>
              <div className="mt-4 h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                  style={{
                    width: `${Math.max(profileA.overall, profileB.overall)}%`,
                  }}
                />
              </div>
            </div>
          </motion.div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40">
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-slate-400 font-mono">
                  Metric Breakdown
                </p>
                <h4 className="text-sm font-semibold text-white mt-1">
                  Side-by-side comparison
                </h4>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Gauge className="h-4 w-4 text-cyan-400" />
                Detailed view
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" id="comparison-sheet">
                <thead>
                  <tr className="bg-white/5 text-slate-300 border-b border-white/10 text-xs font-sans uppercase">
                    <th className="p-4 font-semibold">Metric</th>
                    <th className="p-4 font-semibold text-center text-cyan-400 font-mono">
                      {userAName}
                    </th>
                    <th className="p-4 font-semibold text-center text-amber-300 font-mono">
                      {userBName}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {metrics.map((row, idx) => {
                    const winner = getWinner(row.userA, row.userB);
                    return (
                      <tr key={idx} className="hover:bg-white/5 transition-all">
                        <td className="p-4 font-medium text-slate-200">
                          {row.metric}
                        </td>
                        <td
                          className={`p-4 text-center font-mono font-semibold ${
                            winner === "A"
                              ? "text-emerald-400 bg-emerald-500/10"
                              : "text-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            {formatMetricValue(row.userA)}
                            {winner === "A" && (
                              <Trophy className="h-3.5 w-3.5 text-yellow-400" />
                            )}
                          </div>
                        </td>
                        <td
                          className={`p-4 text-center font-mono font-semibold ${
                            winner === "B"
                              ? "text-emerald-400 bg-emerald-500/10"
                              : "text-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            {formatMetricValue(row.userB)}
                            {winner === "B" && (
                              <Trophy className="h-3.5 w-3.5 text-yellow-400" />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
