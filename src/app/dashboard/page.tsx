"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  FaChartLine, 
  FaWallet, 
  FaArrowUp, 
  FaArrowDown, 
  FaUser, 
  FaCog, 
  FaSignOutAlt, 
  FaPlus, 
  FaMinus,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// Mock data - replace with real API calls
const mockPortfolioData = {
  totalBalance: 25480.50,
  totalProfit: 3240.75,
  profitPercentage: 14.6,
  totalDeposits: 25000,
  totalWithdrawals: 2760.25,
  activeInvestments: 3
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[var(--brand)]/30 border-t-[var(--brand)] rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20">
      {/* Header */}
      <header className="bg-[var(--card-bg)] border-b border-[var(--brand)]/20 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard</h1>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-2 text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
              title={showBalance ? "Hide Balance" : "Show Balance"}
            >
              {showBalance ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-[var(--card-bg)] border-b border-[var(--brand)]/20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-8">
            {[
              { id: "overview", label: "Overview", icon: FaChartLine },
              { id: "investments", label: "Investments", icon: FaWallet },
              { id: "transactions", label: "Transactions", icon: FaArrowUp },
              { id: "settings", label: "Settings", icon: FaCog }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-[var(--brand)] text-[var(--brand)]"
                      : "border-transparent text-[var(--foreground)]/60 hover:text-[var(--foreground)]/80"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "overview" && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="space-y-8"
          >
            {/* Portfolio Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                variants={cardVariants}
                className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[var(--foreground)]/60 text-sm font-medium">Total Balance</h3>
                  <FaWallet className="text-[var(--brand)]" size={20} />
                </div>
                <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
                  {showBalance ? formatCurrency(mockPortfolioData.totalBalance) : "****"}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaArrowUp className="text-green-500" size={12} />
                  <span className="text-green-500">+{mockPortfolioData.profitPercentage}%</span>
                  <span className="text-[var(--foreground)]/60">this month</span>
                </div>
              </motion.div>

              <motion.div
                variants={cardVariants}
                transition={{ delay: 0.1 }}
                className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[var(--foreground)]/60 text-sm font-medium">Total Profit</h3>
                  <FaArrowUp className="text-green-500" size={20} />
                </div>
                <div className="text-2xl font-bold text-green-500 mb-2">
                  {showBalance ? formatCurrency(mockPortfolioData.totalProfit) : "****"}
                </div>
                <div className="text-sm text-[var(--foreground)]/60">
                  Since joining
                </div>
              </motion.div>

              <motion.div
                variants={cardVariants}
                transition={{ delay: 0.2 }}
                className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[var(--foreground)]/60 text-sm font-medium">Active Investments</h3>
                  <FaChartLine className="text-[var(--brand)]" size={20} />
                </div>
                <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
                  {mockPortfolioData.activeInvestments}
                </div>
                <div className="text-sm text-[var(--foreground)]/60">
                  Running plans
                </div>
              </motion.div>

              <motion.div
                variants={cardVariants}
                transition={{ delay: 0.3 }}
                className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[var(--foreground)]/60 text-sm font-medium">Total Deposits</h3>
                  <FaPlus className="text-[var(--brand)]" size={20} />
                </div>
                <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
                  {showBalance ? formatCurrency(mockPortfolioData.totalDeposits) : "****"}
                </div>
                <div className="text-sm text-[var(--foreground)]/60">
                  Lifetime total
                </div>
              </motion.div>
            </div>

            {/* Investment Performance Chart */}
            <motion.div
              variants={cardVariants}
              transition={{ delay: 0.4 }}
              className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6"
            >
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-6">Portfolio Performance</h3>
              <div className="h-64 bg-[var(--background)] rounded-lg flex items-center justify-center">
                <div className="text-center text-[var(--foreground)]/60">
                  <FaChartLine size={48} className="mx-auto mb-4" />
                  <p>Chart visualization coming soon</p>
                  <p className="text-sm">Your portfolio performance over time</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === "investments" && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Investments</h2>
            <p className="text-[var(--foreground)]/60">Investment management coming soon...</p>
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Transactions</h2>
            <p className="text-[var(--foreground)]/60">Transaction history coming soon...</p>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Settings</h2>
            <p className="text-[var(--foreground)]/60">Account settings coming soon...</p>
          </div>
        )}
      </div>
    </main>
  );
}
