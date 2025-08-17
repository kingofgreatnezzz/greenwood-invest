import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import InvestmentPlan from '@/models/InvestmentPlan';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [ADMIN USERS API] Request received');
    console.log('🔍 [ADMIN USERS API] Headers:', Object.fromEntries(request.headers.entries()));
    
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    console.log('🔍 [ADMIN USERS API] Session data:', JSON.stringify(session, null, 2));
    console.log('🔍 [ADMIN USERS API] Session user:', session?.user);
    console.log('🔍 [ADMIN USERS API] Session user role:', session?.user?.role);
    
    if (!session?.user?.id) {
      console.log('❌ [ADMIN USERS API] No session or user ID found');
      return NextResponse.json(
        { error: 'Unauthorized - No session found', debug: { session: !!session, hasUser: !!session?.user, hasUserId: !!session?.user?.id } },
        { status: 401 }
      );
    }

    if (session.user.role !== 'admin') {
      console.log('❌ [ADMIN USERS API] User is not admin. Role:', session.user.role);
      return NextResponse.json(
        { error: 'Admin access required', debug: { userRole: session.user.role, requiredRole: 'admin' } },
        { status: 403 }
      );
    }

    await connectDB();
    console.log('🔍 [ADMIN USERS API] Database connected successfully');

    // Get all users with their basic info (force fresh data)
    console.log('🔍 [ADMIN USERS API] Fetching users from database...');
    const users = await User.find({}).select('-password').lean().exec();
    console.log('🔍 [ADMIN USERS API] Raw users from database:', users);
    console.log('🔍 [ADMIN USERS API] Number of users found:', users.length);

    // Get investment data for all users
    const usersWithInvestments = await Promise.all(
      users.map(async (user) => {
        // Get user's investment plans
        const investmentPlans = await InvestmentPlan.find({ 
          userId: user._id,
          status: { $in: ['active', 'pending'] }
        }).lean();

        // Calculate user's investment summary
        const totalInvested = investmentPlans.reduce((sum, plan) => sum + (plan.amount || 0), 0);
        const totalCurrentValue = investmentPlans.reduce((sum, plan) => sum + (plan.currentValue || plan.amount || 0), 0);
        const totalProfit = totalCurrentValue - totalInvested;
        const activeInvestments = investmentPlans.length;

        // Get user's investment profile data
        const userInvestment = user.investment || {};
        
                 return {
           id: user._id.toString(),
           name: user.name,
           email: user.email,
           role: user.role || 'user',
           totalEarnings: userInvestment.currentBalance || 0,
           totalProfit: userInvestment.totalProfit || totalProfit,
           activeInvestments,
           joinDate: user.createdAt || new Date(),
           status: user.status || 'active',
           profile: user.profile || {},
           // Additional investment data
           totalDeposits: userInvestment.totalDeposits || 0,
           totalWithdrawals: userInvestment.totalWithdrawals || 0,
           pendingWithdrawals: userInvestment.pendingWithdrawals || 0,
           withdrawalRequests: userInvestment.withdrawalRequests || [],
           investmentPlans: investmentPlans.map(plan => ({
             id: plan._id.toString(),
             name: plan.name,
             type: plan.type,
             amount: plan.amount,
             currentValue: plan.currentValue || plan.amount,
             status: plan.status,
             startDate: plan.startDate,
             endDate: plan.endDate
           }))
         };
      })
    );

    // Calculate overall platform statistics
    const totalUsers = users.length;
    const adminUsers = users.filter(user => user.role === 'admin').length;
    const activeUsers = users.filter(user => user.status === 'active').length;
    
    console.log('🔍 [ADMIN USERS API] Stats calculated:', { totalUsers, adminUsers, activeUsers });
    
    const allInvestmentPlans = await InvestmentPlan.find({}).lean();
    const totalRevenue = allInvestmentPlans.reduce((sum, plan) => sum + (plan.amount || 0), 0);
    
    // Calculate new users this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    const newUsersThisMonth = users.filter(user => 
      new Date(user.createdAt) >= thisMonth
    ).length;

    const stats = {
      totalUsers,
      activeUsers,
      totalRevenue,
      monthlyGrowth: 0, // You can calculate this based on your business logic
      adminUsers,
      newUsersThisMonth
    };
    
    console.log('🔍 [ADMIN USERS API] Final stats:', stats);
    console.log('🔍 [ADMIN USERS API] Final users array length:', usersWithInvestments.length);

    const response = {
      users: usersWithInvestments,
      stats
    };
    
    console.log('🔍 [ADMIN USERS API] Final response being sent:', JSON.stringify(response, null, 2));
    
    const responseObj = NextResponse.json(response);
    
    // Add headers to prevent caching
    responseObj.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    responseObj.headers.set('Pragma', 'no-cache');
    responseObj.headers.set('Expires', '0');
    
    return responseObj;

  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
