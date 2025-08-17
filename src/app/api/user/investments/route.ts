import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import InvestmentPlan from '@/models/InvestmentPlan';

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
    const user = await User.findById(session.user.id).select('-password').lean();
    if (!user) {
      console.log('❌ [USER INVESTMENTS API] User not found');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('🔍 [USER INVESTMENTS API] User found:', { id: user._id, name: user.name, email: user.email });

    // Get user's investment plans
    const investmentPlans = await InvestmentPlan.find({ 
      userId: user._id,
      status: { $in: ['active', 'pending'] }
    }).lean();

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
    const riskScore = calculateRiskScore(investmentPlans);
    
    const response = {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role || 'user'
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
        id: plan._id.toString(),
        name: plan.name,
        type: plan.type,
        amount: plan.amount,
        currentValue: plan.currentValue || plan.amount,
        profit: (plan.currentValue || plan.amount) - plan.amount,
        profitPercentage: plan.amount > 0 ? (((plan.currentValue || plan.amount) - plan.amount) / plan.amount * 100) : 0,
        startDate: plan.startDate,
        endDate: plan.endDate,
        status: plan.status,
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
function calculateRiskScore(investments: any[]): string {
  if (investments.length === 0) return 'Low';
  
  const riskFactors = {
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

