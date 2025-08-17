"use client";

import { useState } from "react";
import { FaDatabase, FaKey, FaExclamationTriangle } from 'react-icons/fa';

export default function FixDatabase() {
  const [secretKey, setSecretKey] = useState("investlp-admin-2024");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFixDatabase = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch('/api/fix-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secretKey }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message}`);
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch {
      setMessage("❌ An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaDatabase className="text-blue-500" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Fix Database</h1>
            <p className="text-[var(--foreground)]/60 mt-2">
              Fix MongoDB index issues
            </p>
          </div>

          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-red-500 mb-2">
              <FaExclamationTriangle size={16} />
              <span className="font-semibold">Current Issue:</span>
            </div>
            <p className="text-sm text-red-500/80">
              MongoDB has a unique index on the phone field that&apos;s causing registration errors.
              This tool will remove the problematic index.
            </p>
          </div>

          <form onSubmit={handleFixDatabase} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]/80 mb-2">
                Secret Key
              </label>
              <div className="relative">
                <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--foreground)]/40" size={16} />
                <input
                  type="text"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Enter secret key"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[var(--background)] border border-[var(--brand)]/20 rounded-lg text-[var(--foreground)] placeholder-[var(--foreground)]/40 focus:outline-none focus:border-[var(--brand)]"
                />
              </div>
              <p className="text-xs text-[var(--foreground)]/40 mt-1">
                Default: investlp-admin-2024
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Fixing Database...
                </>
              ) : (
                <>
                  <FaDatabase size={16} />
                  Fix Database Indexes
                </>
              )}
            </button>
          </form>

          {message && (
            <div className={`mt-6 p-4 rounded-lg text-center ${
              message.includes('✅') 
                ? 'bg-green-500/20 border border-green-500/30 text-green-500' 
                : 'bg-red-500/20 border border-red-500/30 text-red-500'
            }`}>
              {message}
            </div>
          )}

          <div className="mt-8 p-4 bg-[var(--background)]/50 rounded-lg">
            <h3 className="font-semibold text-[var(--foreground)] mb-2">What This Does:</h3>
            <ul className="text-sm text-[var(--foreground)]/60 space-y-1">
              <li>• Removes problematic unique index on phone field</li>
              <li>• Fixes the &quot;duplicate key error&quot; during registration</li>
              <li>• Allows normal user registration to work</li>
              <li>• Safe to run multiple times</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <h3 className="font-semibold text-blue-500 mb-2">Next Steps:</h3>
            <ol className="text-sm text-blue-500/80 space-y-1">
              <li>1. Run this database fix first</li>
              <li>2. Then go to <code className="bg-blue-500/20 px-1 rounded">/setup-admin</code> to create admin user</li>
              <li>3. Finally access <code className="bg-blue-500/20 px-1 rounded">/admin</code></li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}
