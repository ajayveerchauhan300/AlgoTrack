/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Code2,
  LogOut,
  RefreshCw,
  BookOpen,
  Users,
  Bell,
  Sparkles,
  LayoutDashboard,
  List,
  ScanSearch,
} from "lucide-react";

import LoginRegister from "./components/LoginRegister";
import DashboardOverview from "./components/DashboardOverview";
import TopicAnalysis from "./components/TopicAnalysis";
import CompareUsers from "./components/CompareUsers";
import MentorPanel from "./components/MentorPanel";
import ContestReminders from "./components/ContestReminders";
import ProblemSheets from "./components/ProblemSheets";
import CodeReview from "./components/CodeReview";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("algotrack_token"));
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [syncNote, setSyncNote] = useState("");

  const handleAuthSuccess = (newToken, loggedUser) => {
    localStorage.setItem("algotrack_token", newToken);
    setToken(newToken);
    setUser(loggedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("algotrack_token");
    setToken(null);
    setUser(null);
    setStats(null);
    setActiveTab("overview");
  };

  const fetchUserProfile = async () => {
    if (!token) return;
    setLoadingUser(true);
    try {
      const response = await fetch("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Token was invalid/expired
        handleLogout();
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchCodingStats = async () => {
    if (!token) return;
    setLoadingStats(true);
    setSyncNote("");
    try {
      const response = await fetch("/api/user/coding-stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        if (data.isDemo) {
          setSyncNote(data.message || "Loaded trial demo mode metrics.");
        } else {
          setSyncNote("");
        }
      }
    } catch (err) {
      console.error("Failed to load statistics:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleUpdateProfile = async (updatedFields) => {
    if (!token) return;
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        // Automatically trigger stats reload because usernames/handles could have changed!
        fetchCodingStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      fetchCodingStats();
    }
  }, [user]);

  if (!token) {
    return <LoginRegister onSuccess={handleAuthSuccess} />;
  }

  if (loadingUser || !user) {
    return (
      <div className="min-h-screen bg-[#110e17] text-white flex items-center justify-center relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] glow-orb-orange animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] glow-orb-purple animate-pulse" />

        <div className="text-center font-sans z-10 glass-card p-10 shadow-2xl relative border-white/5 bg-slate-950/40">
          <div className="h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin inline-block mb-4" />
          <p className="text-sm tracking-wider text-slate-350 uppercase font-black font-mono">
            Booting AlgoTrack Shell...
          </p>
          <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-widest">
            Synchronizing with main instance
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#110e17] text-white flex flex-col font-sans relative overflow-hidden"
      id="applet-viewport"
    >
      {/* Background orbs replicating the provided dashboard image style exactly */}
      <div className="absolute top-[-100px] left-[-150px] w-[600px] h-[600px] glow-orb-purple animate-float-slow z-0" />
      <div className="absolute bottom-[-100px] right-[-150px] w-[700px] h-[700px] glow-orb-orange animate-float-reverse z-0" />
      <div className="absolute top-[40%] left-[25%] w-[450px] h-[450px] glow-orb-purple animate-float-slow opacity-40 z-0" />

      {/* Dynamic Sync Notice and Header Alerts */}
      {syncNote && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-500 text-xs py-2 px-4 flex items-center justify-between text-center font-mono backdrop-blur-md">
          <span>⚠️ {syncNote}</span>
          <button
            onClick={() => setActiveTab("overview")}
            className="underline font-bold text-amber-400 bg-transparent border-none cursor-pointer"
          >
            Configure profile now
          </button>
        </div>
      )}

      {/* Main Header banner */}
      <header
        className="glass-header shrink-0 select-none px-6 py-4 flex items-center justify-between z-10"
        id="applet-header"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/20">
            <Code2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white">
              Algo<span className="text-orange-400 drop-shadow-md">Track</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
              Coding Analytics Desk
            </p>
          </div>
        </div>

        {/* User branding status & actions */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Rating: {stats?.codeforces.rank || "Newcomer"} (
              {stats?.codeforces.rating || 0})
            </p>
          </div>

          <button
            onClick={fetchCodingStats}
            disabled={loadingStats}
            title="Manual sync metrics"
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/10 transition-all cursor-pointer active:scale-95 flex items-center justify-center shadow-md backdrop-blur-md"
            id="btn-sync-stats"
          >
            <RefreshCw
              className={`h-4.5 w-4.5 ${loadingStats ? "animate-spin" : ""}`}
            />
          </button>

          <button
            onClick={handleLogout}
            title="Sign out of panel"
            className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/35 border border-red-500/30 text-red-200 hover:text-white py-2 px-3.5 text-xs font-semibold rounded-lg transition-all cursor-pointer active:scale-95 shadow-md backdrop-blur-sm"
            id="btn-sign-out"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Primary Workspace View container */}
      <div
        className="flex-1 flex flex-col md:flex-row min-h-0 z-10"
        id="app-workspace"
      >
        {/* Navigation Sidebar */}
        <nav
          className="w-full md:w-64 glass-sidebar p-4 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto hidden-scrollbar"
          id="nav-sidebar"
        >
          {/* Dashboard trigger */}
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-3 border ${
              activeTab === "overview"
                ? "bg-white/10 border-orange-500/30 text-orange-400 shadow-lg shadow-orange-500/10 backdrop-blur-md"
                : "text-slate-400 border-transparent hover:text-white hover:bg-white/5"
            }`}
            id="sidebar-link-overview"
          >
            <LayoutDashboard className="h-4.5 w-4.5" />
            Profile Dashboard
          </button>

          {/* Code review analyzer trigger */}
          <button
            onClick={() => setActiveTab("code-review")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-3 border ${
              activeTab === "code-review"
                ? "bg-gradient-to-r from-cyan-500/15 to-blue-500/10 border-cyan-400/30 text-cyan-200 shadow-lg shadow-cyan-500/10 backdrop-blur-md"
                : "text-slate-400 border-transparent hover:text-white hover:bg-white/5"
            }`}
            id="sidebar-link-code-review"
          >
            <ScanSearch className="h-4.5 w-4.5" />
            Code Review
          </button>

          {/* Topic-wise mastery breakdown trigger */}
          <button
            onClick={() => setActiveTab("mastery")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-3 border ${
              activeTab === "mastery"
                ? "bg-white/10 border-orange-500/30 text-orange-400 shadow-lg shadow-orange-500/10 backdrop-blur-md"
                : "text-slate-400 border-transparent hover:text-white hover:bg-white/5"
            }`}
            id="sidebar-link-mastery"
          >
            <BookOpen className="h-4.5 w-4.5" />
            Topic Mastery
          </button>

          {/* Problem Sheets trigger */}
          <button
            onClick={() => setActiveTab("sheets")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-3 border ${
              activeTab === "sheets"
                ? "bg-white/10 border-orange-500/30 text-orange-400 shadow-lg shadow-orange-500/10 backdrop-blur-md"
                : "text-slate-400 border-transparent hover:text-white hover:bg-white/5"
            }`}
            id="sidebar-link-sheets"
          >
            <List className="h-4.5 w-4.5" />
            Problem Sheets
          </button>

          {/* friend comparing matrix arena trigger */}
          <button
            onClick={() => setActiveTab("compare")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-3 border ${
              activeTab === "compare"
                ? "bg-white/10 border-orange-500/30 text-orange-400 shadow-lg shadow-orange-500/10 backdrop-blur-md"
                : "text-slate-400 border-transparent hover:text-white hover:bg-white/5"
            }`}
            id="sidebar-link-compare"
          >
            <Users className="h-4.5 w-4.5" />
            Compare Users
          </button>

          {/* upcoming events schedule alarm trigger */}
          <button
            onClick={() => setActiveTab("reminders")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-3 border ${
              activeTab === "reminders"
                ? "bg-white/15 border-white/20 text-cyan-300 shadow-md backdrop-blur-md"
                : "text-slate-400 border-transparent hover:text-white hover:bg-white/5"
            }`}
            id="sidebar-link-reminders"
          >
            <Bell className="h-4.5 w-4.5" />
            Contests Reminders
          </button>

          {/* AI Advisor chatbot/summarizers trigger */}
          <button
            onClick={() => setActiveTab("mentor")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-3 border ${
              activeTab === "mentor"
                ? "bg-white/15 border-white/20 text-cyan-300 shadow-md backdrop-blur-md"
                : "text-slate-400 border-transparent hover:text-white hover:bg-white/5"
            }`}
            id="sidebar-link-mentor"
          >
            <Sparkles className="h-4.5 w-4.5" />
            AI Coding Mentor
          </button>

        </nav>

        {/* Dynamic Display Stage */}
        <main
          className="flex-1 overflow-y-auto px-6 py-6"
          id="workspace-display-stage"
        >
          {loadingStats && !stats ? (
            <div
              className="h-full flex items-center justify-center flex-col text-gray-450"
              id="stage-loading-shield"
            >
              <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin inline-block" />
              <p className="mt-4 text-sm font-semibold text-white">
                Collating competitive accounts...
              </p>
              <p className="text-xs mt-1 text-gray-500">
                Retrieving official profiles from Codeforces and LeetCode
                GraphQL streams.
              </p>
            </div>
          ) : !stats ? (
            <div
              className="h-full flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-gray-800 rounded-3xl"
              id="stage-empty-stats"
            >
              <RefreshCw className="h-12 w-12 text-gray-600 mb-4 animate-bounce" />
              <h3 className="text-lg font-bold text-white">
                No coding statistics synced.
              </h3>
              <p className="text-sm text-gray-400 mt-1 max-w-sm">
                Click synchronization below or update profile coding handles to
                fetch real-time tournament standings.
              </p>
              <button
                onClick={fetchCodingStats}
                className="mt-4 px-6 py-2.5 bg-indigo-600 text-white hover:bg-indigo-500 text-sm font-semibold rounded-xl"
              >
                Fetch Stats Now
              </button>
            </div>
          ) : (
            <div
              className="max-w-6xl mx-auto space-y-6"
              id="algotrack-dashboard-content"
            >
              {activeTab === "overview" && (
                <DashboardOverview
                  user={user}
                  stats={stats}
                  onUpdateProfile={handleUpdateProfile}
                  loadingStats={loadingStats}
                />
              )}

              {activeTab === "mastery" && <TopicAnalysis stats={stats} />}

              {activeTab === "sheets" && <ProblemSheets user={user} />}

              {activeTab === "compare" && <CompareUsers token={token} />}

              {activeTab === "reminders" && <ContestReminders />}

              {activeTab === "mentor" && (
                <MentorPanel user={user} stats={stats} token={token} />
              )}

              {activeTab === "code-review" && <CodeReview token={token} />}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
