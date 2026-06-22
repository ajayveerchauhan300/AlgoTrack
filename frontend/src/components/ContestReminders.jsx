/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Bell,
  BellRing,
  CalendarRange,
  Clock,
  ExternalLink,
  CalendarCheck,
} from "lucide-react";

export default function ContestReminders() {
  const [contests, setContests] = useState([]);
  const [reminders, setReminders] = useState({});
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  const loadContests = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/contests");
      if (response.ok) {
        const data = await response.json();
        setContests(data.contests || []);
      }
    } catch (err) {
      console.error("Failed to load upcoming contest list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContests();
  }, []);

  const toggleReminder = (id, title) => {
    setReminders((prev) => {
      const updated = !prev[id];
      if (updated) {
        setNotification(`Bell alarm scheduled successfully for: ${title}`);
        setTimeout(() => setNotification(""), 4000);
      }
      return { ...prev, [id]: updated };
    });
  };

  const getFormatDate = (timestamp) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const durationStr = (seconds) => {
    const hrs = seconds / 3600;
    return `${hrs} Hours`;
  };

  return (
    <div
      className="glass-card p-6 shadow-xl animate-fade-in"
      id="contests-scheduler-card"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CalendarRange className="h-5 w-5 text-cyan-400" />
            Competitive Contests Schedule & Reminders
          </h3>
          <p className="text-xs text-slate-300 mt-1 uppercase font-semibold font-mono tracking-wider">
            Never miss a contest. Click the bell to subscribe to in-app &
            browser flash alarms.
          </p>
        </div>
      </div>

      {notification && (
        <div className="mb-4 p-4 bg-cyan-500/10 border border-cyan-500/25 rounded-xl text-cyan-300 text-xs flex items-center gap-2 animate-bounce">
          <CalendarCheck className="h-4.5 w-4.5 text-cyan-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-slate-400" id="contests-loader">
          <div className="h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin inline-block" />
          <p className="mt-3 text-sm font-mono tracking-wider">
            Collating Codeforces & LeetCode chronologies...
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          id="contests-list-row"
        >
          {contests.map((c) => (
            <div
              key={c.id}
              className={`border rounded-xl p-5 hover:border-white/20 transition-all flex flex-col justify-between ${
                reminders[c.id]
                  ? "bg-cyan-500/10 border-cyan-500/30 shadow-md shadow-cyan-500/5"
                  : "bg-white/5 border-white/10"
              }`}
              id={`contest-block-${c.id}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full ${
                      c.platform === "LeetCode"
                        ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/25"
                        : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/25"
                    }`}
                  >
                    {c.platform}
                  </span>

                  <span className="text-[11px] font-mono text-slate-300 font-bold flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg">
                    <Clock className="h-3 w-3 text-cyan-400" />
                    {durationStr(c.duration)}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white line-clamp-2 hover:text-cyan-400 transition-colors">
                  {c.title}
                </h4>

                <p className="text-xs text-slate-300 mt-2 font-mono flex items-center gap-2">
                  <span className="inline-block h-1.5 w-1.5 bg-cyan-400 rounded-full" />
                  {getFormatDate(c.startTime)}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 hover:underline"
                >
                  Register Page <ExternalLink className="h-3 w-3" />
                </a>

                <button
                  type="button"
                  onClick={() => toggleReminder(c.id, c.title)}
                  className={`py-1.5 px-3.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    reminders[c.id]
                      ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 active:scale-95"
                      : "bg-white/10 text-slate-205 text-slate-200 hover:bg-white/20 hover:text-white border border-white/10"
                  }`}
                  id={`btn-remind-${c.id}`}
                >
                  {reminders[c.id] ? (
                    <>
                      <BellRing className="h-3.5 w-3.5" /> REMINDED
                    </>
                  ) : (
                    <>
                      <Bell className="h-3.5 w-3.5" /> REMIND ME
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
