import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import InvestmentPlan from '@/models/InvestmentPlan';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get user data
    const user = await User.findById(session.user.id).select('-password');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's investment plans
    const investmentPlans = await InvestmentPlan.find({ 
      userId: session.user.id,
      status: { $in: ['active', 'pending'] }
    }).sort({ createdAt: -1 });

    // Calculate portfolio summary
    const totalInvested = investmentPlans.reduce((sum, plan) => sum + plan.amount, 0);
    const totalCurrentValue = investmentPlans.reduce((sum, plan) => sum + (plan.currentValue || plan.amount), 0);
    const totalProfit = totalCurrentValue - totalInvested;
    const profitPercentage = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

    const portfolioData = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile,
      },
      portfolio: {
        totalBalance: user.investment.currentBalance,
        totalDeposits: user.investment.totalDeposits,
        totalWithdrawals: user.investment.totalWithdrawals,
        totalProfit: user.investment.totalProfit,
        activeInvestments: user.investment.activeInvestments.length,
      },
      investments: investmentPlans.map(plan => ({
        id: plan._id,
        name: plan.name,
        type: plan.type,
        amount: plan.amount,
        currentValue: plan.currentValue || plan.amount,
        startDate: plan.startDate,
        endDate: plan.endDate,
        status: plan.status,
        expectedReturn: plan.expectedReturn,
        profit: (plan.currentValue || plan.amount) - plan.amount,
        profitPercentage: plan.amount > 0 ? (((plan.currentValue || plan.amount) - plan.amount) / plan.amount) * 100 : 0,
      })),
      summary: {
        totalInvested,
        totalCurrentValue,
        totalProfit,
        profitPercentage,
        activePlans: investmentPlans.filter(plan => plan.status === 'active').length,
        pendingPlans: investmentPlans.filter(plan => plan.status === 'pending').length,
      }
    };

    return NextResponse.json(portfolioData);
  } catch (error) {
    console.error('Error fetching user investments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
