import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import InvestmentPlan from '@/models/InvestmentPlan';

interface LeanUser {
  _id?: unknown;
  name?: string;
  email?: string;
  investment?: {
    totalBalance?: number;
    currentBalance?: number;
    totalDeposits?: number;
    totalWithdrawals?: number;
    totalProfit?: number;
    profitPercentage?: number;
    activeInvestments?: number;
    monthlyGrowth?: number;
    riskScore?: string;
    portfolioDiversity?: number;
    totalInvested?: number;
    totalCurrentValue?: number;
  };
}

interface LeanInvestmentPlan {
  _id?: unknown;
  name?: string;
  type?: string;
  amount?: number;
  status?: string;
  currentValue?: number;
  startDate?: string | Date;
  endDate?: string | Date;
  expectedReturn?: number;
  duration?: number;
  // Additional properties for investment plans
}

export async function GET() {
  try {
    console.log('🔍 [USER INVESTMENTS API] Request received');
    
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    console.log('🔍 [USER INVESTMENTS API] Session data:', JSON.stringify(session, null, 2));
    
    if (!session?.user?.id) {
      console.log('❌ [USER INVESTMENTS API] No session or user ID found');
      return NextResponse.json(
        { error: 'Unauthorized - No session found' },
        { status: 401 }
      );
    }

    await connectDB();
    console.log('🔍 [USER INVESTMENTS API] Database connected successfully');

    // Get user with investment data
    const user = await User.findById(session.user.id).select('-password').lean() as unknown as LeanUser;
    if (!user) {
      console.log('❌ [USER INVESTMENTS API] User not found');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('🔍 [USER INVESTMENTS API] User found:', { id: user._id?.toString() || '', name: user.name || '', email: user.email || '' });

    // Get user's investment plans
    const investmentPlans = await InvestmentPlan.find({ 
      userId: user._id,
      status: { $in: ['active', 'pending'] }
    }).lean() as unknown as LeanInvestmentPlan[];

    console.log('🔍 [USER INVESTMENTS API] Investment plans found:', investmentPlans.length);

    // Get user's investment profile data (updated by admin)
    const userInvestment = user.investment || {};
    
    // Calculate real investment summary
    const totalInvested = investmentPlans.reduce((sum, plan) => sum + (plan.amount || 0), 0);
    const totalCurrentValue = investmentPlans.reduce((sum, plan) => sum + (plan.currentValue || plan.amount || 0), 0);
    
    // Use admin-updated values if available, otherwise calculate from investments
    const totalBalance = userInvestment.currentBalance || totalCurrentValue;
    const totalProfit = userInvestment.totalProfit || (totalCurrentValue - totalInvested);
    const totalDeposits = userInvestment.totalDeposits || 0;
    const totalWithdrawals = userInvestment.totalWithdrawals || 0;
    
    // Calculate percentages
    const profitPercentage = totalInvested > 0 ? ((totalProfit / totalInvested) * 100) : 0;
    const monthlyGrowth = 8.2; // You can calculate this based on historical data
    
    // Calculate portfolio diversity
    const portfolioDiversity = investmentPlans.length > 0 ? Math.min(85, 100 - (investmentPlans.length * 5)) : 0;
    
    // Determine risk score based on investment types
    const validInvestments = investmentPlans
      .filter((plan): plan is LeanInvestmentPlan & { type: string; amount: number } => 
        typeof plan.type === 'string' && typeof plan.amount === 'number'
      )
      .map(plan => ({ type: plan.type, amount: plan.amount }));
    const riskScore = calculateRiskScore(validInvestments);
    
    const response = {
      user: {
        id: user._id?.toString() || '',
        name: user.name || '',
        email: user.email || '',
        role: 'user'
      },
      portfolio: {
        totalBalance,
        totalProfit,
        profitPercentage: parseFloat(profitPercentage.toFixed(1)),
        totalDeposits,
        totalWithdrawals,
        activeInvestments: investmentPlans.length,
        monthlyGrowth,
        riskScore,
        portfolioDiversity,
        totalInvested,
        totalCurrentValue
      },
      investments: investmentPlans.map(plan => ({
        id: plan._id?.toString() || Math.random().toString(36).substr(2, 9),
        name: plan.name || 'Unknown Investment',
        type: plan.type || 'unknown',
        amount: plan.amount || 0,
        currentValue: plan.currentValue || plan.amount || 0,
        profit: (plan.currentValue || plan.amount || 0) - (plan.amount || 0),
        profitPercentage: (plan.amount || 0) > 0 ? (((plan.currentValue || plan.amount || 0) - (plan.amount || 0)) / (plan.amount || 0) * 100) : 0,
        startDate: plan.startDate || new Date().toISOString(),
        endDate: plan.endDate || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        status: plan.status || 'pending',
        expectedReturn: plan.expectedReturn || 15,
        duration: plan.duration || 180
      }))
    };

    console.log('🔍 [USER INVESTMENTS API] Response data:', JSON.stringify(response, null, 2));
    
    const responseObj = NextResponse.json(response);
    
    // Add headers to prevent caching
    responseObj.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    responseObj.headers.set('Pragma', 'no-cache');
    responseObj.headers.set('Expires', '0');
    
    return responseObj;

  } catch (error) {
    console.error('❌ [USER INVESTMENTS API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to calculate risk score
function calculateRiskScore(investments: Array<{
  type: string;
  amount: number;
}>): string {
  if (investments.length === 0) return 'Low';
  
  const riskFactors: Record<string, number> = {
    crypto: 3,
    stocks: 2,
    'real-estate': 1,
    forex: 3,
    commodities: 2
  };
  
  let totalRisk = 0;
  let totalAmount = 0;
  
  investments.forEach(inv => {
    const risk = riskFactors[inv.type] || 1;
    totalRisk += risk * (inv.amount || 0);
    totalAmount += inv.amount || 0;
  });
  
  const avgRisk = totalAmount > 0 ? totalRisk / totalAmount : 1;
  
  if (avgRisk <= 1.5) return 'Low';
  if (avgRisk <= 2.5) return 'Medium';
  return 'High';
}

