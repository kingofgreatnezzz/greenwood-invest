"use client";

import { useState } from "react";
import { FaCrown, FaUser, FaKey } from 'react-icons/fa';

export default function SetupAdmin() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [secretKey, setSecretKey] = useState("investlp-admin-2024");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch('/api/setup-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, password, secretKey }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message}`);
        setEmail("");
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
            <div className="w-16 h-16 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCrown className="text-yellow-500" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Admin Setup</h1>
            <p className="text-[var(--foreground)]/60 mt-2">
              Promote a user to admin role
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]/80 mb-2">
                User Email
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--foreground)]/40" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter user email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[var(--background)] border border-[var(--brand)]/20 rounded-lg text-[var(--foreground)] placeholder-[var(--foreground)]/40 focus:outline-none focus:border-[var(--brand)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]/80 mb-2">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--foreground)]/40" size={16} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[var(--background)] border border-[var(--brand)]/20 rounded-lg text-[var(--foreground)] placeholder-[var(--foreground)]/40 focus:outline-none focus:border-[var(--brand)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]/80 mb-2">
                Password
              </label>
              <div className="relative">
                <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--foreground)]/40" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (min 6 characters)"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 bg-[var(--background)] border border-[var(--brand)]/20 rounded-lg text-[var(--foreground)] placeholder-[var(--foreground)]/40 focus:outline-none focus:border-[var(--brand)]"
                />
              </div>
            </div>

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
              className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-600/50 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FaCrown size={16} />
                  Create/Update Admin User
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
              <h3 className="font-semibold text-[var(--foreground)] mb-2">Instructions:</h3>
              <ol className="text-sm text-[var(--foreground)]/60 space-y-1">
                <li>1. Enter your email, name, and password</li>
                <li>2. Use the default secret key: <code className="bg-[var(--background)] px-1 rounded">investlp-admin-2024</code></li>
                <li>3. Click &quot;Promote to Admin&quot; (or create new admin user)</li>
                <li>4. After setup, you can access <code className="bg-[var(--background)] px-1 rounded">/admin</code></li>
                <li>5. Use these credentials to log in normally</li>
              </ol>
            </div>
        </div>
      </div>
    </main>
  );
}
