/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, Calendar } from "lucide-react";

export default function RatingChart({ stats }) {
  const [chartType, setChartType] = useState("rating");

  // Format Codeforces contest history data for LineChart
  const rawHistory = stats?.codeforces?.contestHistory || [];
  const ratingData = rawHistory.map((item, idx) => {
    const dateObj = new Date(item.ratingUpdateTimeSeconds * 1000);
    return {
      index: idx + 1,
      contest:
        item.contestName.substring(0, 20) +
        (item.contestName.length > 20 ? "..." : ""),
      rating: item.newRating,
      oldRating: item.oldRating,
      gain: item.newRating - item.oldRating,
      rank: item.rank,
      date: dateObj.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "2-digit",
      }),
    };
  });

  // Calculate some analytics summaries
  const peakRating = ratingData.length
    ? Math.max(...ratingData.map((d) => d.rating))
    : 0;
  const initialRating = ratingData.length ? ratingData[0].oldRating : 1200;
  const currentRating = ratingData.length
    ? ratingData[ratingData.length - 1].rating
    : 1200;
  const netGain = currentRating - initialRating;

  // Let's create an alternative dataset for Cumulative Solved growth over last 12 days
  const solvedGrid = stats?.solvedHistory || {};
  const sortedDates = Object.keys(solvedGrid).sort();
  let cumulative = 0;
  const growthData = sortedDates
    .map((d) => {
      cumulative += solvedGrid[d] || 0;
      const formattedDate = new Date(d).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      return {
        date: formattedDate,
        solvedToday: solvedGrid[d] || 0,
        cumulativeSolved: cumulative,
      };
    })
    .slice(-15); // Show latest 15 active intervals

  // Custom tooltips styling
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-4 shadow-xl border border-white/20 backdrop-blur-md !bg-slate-950/70">
          <p className="text-slate-300 text-xs font-semibold">{data.date}</p>
          <p className="text-white font-bold text-sm mt-1 mb-2">
            {data.contest || "Coding Contest"}
          </p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between gap-6">
              <span className="text-slate-400">Rating:</span>
              <span className="font-mono font-bold text-cyan-400">
                {data.rating}
              </span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-slate-400">Standing Rank:</span>
              <span className="font-mono text-white">#{data.rank}</span>
            </div>
            <div className="flex justify-between gap-6 pb-1 border-t border-white/10 pt-1 mt-1">
              <span className="text-slate-400">Rating change:</span>
              <span
                className={`font-mono font-bold ${data.gain >= 0 ? "text-emerald-400" : "text-rose-400"}`}
              >
                {data.gain >= 0 ? `+${data.gain}` : data.gain}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="glass-card p-6 shadow-xl animate-fade-in"
      id="rating-progress-card"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-cyan-400" />
            Performance & Rating Progress Graphs
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Track Codeforces competitive ratings over successive rounds or
            overall practice volume expansion.
          </p>
        </div>

        {/* Chart toggle buttons */}
        <div
          className="flex bg-white/5 rounded-lg border border-white/10 p-0.5 backdrop-blur-md"
          id="chart-types-switch"
        >
          <button
            onClick={() => setChartType("rating")}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              chartType === "rating"
                ? "bg-cyan-500 text-slate-950 shadow-md"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Codeforces Rating Line
          </button>
          <button
            onClick={() => setChartType("growth")}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              chartType === "growth"
                ? "bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-md shadow-orange-500/20"
                : "text-slate-300 hover:text-white"
            }`}
          >
            LeetCode Solved Trend
          </button>
        </div>
      </div>

      {chartType === "rating" ? (
        <div className="space-y-6" id="cf-rating-chart-segment">
          {ratingData.length === 0 ? (
            <div
              className="text-center py-16 text-slate-400 border-2 border-dashed border-white/10 rounded-xl"
              id="empty-rating-history"
            >
              <Calendar className="h-10 w-10 text-slate-500 mx-auto mb-3" />
              <p>No ratings history currently available.</p>
              <p className="text-xs mt-1 text-slate-500">
                Attend actual tournaments or virtual contests to populate
                ratings changes!
              </p>
            </div>
          ) : (
            <>
              {/* Analytics row */}
              <div
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                id="rating-analytics-summaries"
              >
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl shadow-md">
                  <span className="text-slate-400 text-xs font-medium">
                    Net Gained Rating
                  </span>
                  <h4
                    className={`text-2xl font-black mt-1 ${netGain >= 0 ? "text-emerald-400" : "text-rose-450 text-rose-400"}`}
                  >
                    {netGain >= 0 ? `+${netGain}` : netGain} pts
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1">
                    From initial starting standard indices.
                  </p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl shadow-md">
                  <span className="text-slate-400 text-xs font-medium">
                    All-time Peak Index
                  </span>
                  <h4 className="text-2xl font-black text-white mt-1">
                    {peakRating}
                  </h4>
                  <p className="text-[10px] text-orange-450 text-orange-400 mt-1">
                    Maximum level reached on platform.
                  </p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl shadow-md">
                  <span className="text-slate-400 text-xs font-medium">
                    Contests Quantified
                  </span>
                  <h4 className="text-2xl font-black text-orange-400 mt-1">
                    {ratingData.length} Contests
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Successive updates logged.
                  </p>
                </div>
              </div>

              {/* Graphic chart layout */}
              <div className="h-72 w-full mt-4" id="cf-recharts-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={ratingData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorRating"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#ef4444"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#f59e0b"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255, 255, 255, 0.08)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="index"
                      stroke="rgba(255, 255, 255, 0.3)"
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#cbd5e1" }}
                    />

                    <YAxis
                      stroke="rgba(255, 255, 255, 0.3)"
                      domain={["auto", "auto"]}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#cbd5e1" }}
                    />

                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="rating"
                      stroke="#ef4444"
                      strokeWidth={3}
                      activeDot={{
                        r: 8,
                        fill: "#f59e0b",
                        stroke: "#fff",
                        strokeWidth: 2,
                      }}
                      dot={{
                        r: 4,
                        stroke: "#ef4444",
                        strokeWidth: 2,
                        fill: "#110e17",
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4" id="lc-growth-chart-segment">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"
            id="lc-growth-analytics"
          >
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl shadow-md">
              <span className="text-slate-400 text-xs font-medium">
                Daily Average Solved
              </span>
              <h4 className="text-2xl font-black text-emerald-400 mt-1">
                {(
                  growthData.reduce((acc, x) => acc + x.solvedToday, 0) /
                  Math.max(1, growthData.length)
                ).toFixed(1)}{" "}
                Questions
              </h4>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl shadow-md">
              <span className="text-slate-400 text-xs font-medium">
                Recent Solutions Synced
              </span>
              <h4 className="text-2xl font-black text-white mt-1">
                {growthData.reduce((acc, x) => acc + x.solvedToday, 0)} Solved
              </h4>
            </div>
          </div>

          <div className="h-72 w-full mt-4" id="lc-recharts-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={growthData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255, 255, 255, 0.08)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="rgba(255, 255, 255, 0.3)"
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#cbd5e1" }}
                />

                <YAxis
                  stroke="rgba(255, 255, 255, 0.3)"
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#cbd5e1" }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.85)",
                    borderColor: "rgba(255, 255, 255, 0.15)",
                    borderRadius: "12px",
                    backdropFilter: "blur(12px)",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#cbd5e1" }}
                />

                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11, color: "#cbd5e1" }}
                />
                <Line
                  name="Cumulative Questions Solved"
                  type="monotone"
                  dataKey="cumulativeSolved"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={false}
                />

                <Line
                  name="Solved on Day"
                  type="linear"
                  dataKey="solvedToday"
                  stroke="#3b82f6"
                  strokeWidth={1.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
