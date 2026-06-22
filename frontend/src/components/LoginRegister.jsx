/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { LogIn, UserPlus, Code2, AlertCircle } from "lucide-react";

export default function LoginRegister({ onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = isLogin ? "/api/auth/login" : "/api/auth/register";
    const body = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Authentication failed. Please check credentials.",
        );
      }

      onSuccess(data.token, data.user);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadDemoUser = () => {
    // Quickly set demo credentials for evaluators
    setEmail("ajayveerchauhan300@gmail.com");
    setPassword("password123");
    setIsLogin(true);
  };

  return (
    <div
      className="min-h-screen bg-[#070b19] text-white flex flex-col justify-center items-center px-4 relative overflow-hidden"
      id="auth-screen"
    >
      {/* Background radial effects */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-505 bg-indigo-500/10 rounded-full blur-[80px]" />

      <div
        className="w-full max-w-md glass-card p-8 shadow-2xl relative overflow-hidden"
        id="auth-container"
      >
        {/* Glow decoration */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500" />

        {/* Title */}
        <div className="flex flex-col items-center mb-8" id="auth-header">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center mb-3 shadow-lg shadow-cyan-500/20">
            <Code2 className="h-6 w-6 text-slate-950" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-300 bg-clip-text text-transparent">
            AlgoTrack
          </h1>
          <p className="text-slate-300 text-sm mt-1 text-center font-sans font-medium">
            Competitive Coding Tracker & Mentoring Dashboard
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div
            className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3 text-rose-250 text-rose-200 text-sm"
            id="auth-error"
          >
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" id="auth-form">
          {!isLogin && (
            <div id="field-name">
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1.5 font-mono">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Ajay Chauhan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full glass-input rounded-xl px-4 py-3 placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>
          )}

          <div id="field-email">
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1.5 font-mono">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="names@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full glass-input rounded-xl px-4 py-3 placeholder-slate-500 focus:outline-none transition-all"
            />
          </div>

          <div id="field-password">
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1.5 font-mono">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full glass-input rounded-xl px-4 py-3 placeholder-slate-500 focus:outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            id="btn-auth-submit"
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-3 px-4 rounded-xl shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            {loading ? (
              <span className="h-5 w-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : isLogin ? (
              <>
                <LogIn className="h-5 w-5" /> Sign In
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5" /> Create Account
              </>
            )}
          </button>
        </form>

        <div
          className="mt-6 pt-6 border-t border-white/10 text-center text-sm"
          id="auth-footer-text"
        >
          {isLogin ? (
            <p className="text-slate-400">
              Don't have an account?{" "}
              <button
                onClick={() => {
                  setIsLogin(false);
                  setError("");
                }}
                className="text-cyan-400 font-semibold hover:underline bg-transparent border-none cursor-pointer"
              >
                Sign Up Now
              </button>
            </p>
          ) : (
            <p className="text-slate-400">
              Already have an account?{" "}
              <button
                onClick={() => {
                  setIsLogin(true);
                  setError("");
                }}
                className="text-cyan-400 font-semibold hover:underline bg-transparent border-none cursor-pointer"
              >
                Sign In Instead
              </button>
            </p>
          )}
        </div> 
      </div>
    </div>
  );
}
