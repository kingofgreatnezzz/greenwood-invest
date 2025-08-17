import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import InvestmentPlan from '@/models/InvestmentPlan';

export async function PUT(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { userId, updates } = await request.json();
    
    if (!userId || !updates) {
      return NextResponse.json(
        { error: 'User ID and updates are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the user to update
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user fields
    if (updates.name) user.name = updates.name;
    if (updates.email) user.email = updates.email;
    if (updates.role) user.role = updates.role;
    if (updates.status) user.status = updates.status;

    // Update investment profile if it exists
    if (!user.investment) {
      user.investment = {
        currentBalance: 0,
        totalDeposits: 0,
        totalWithdrawals: 0,
        totalProfit: 0,
        activeInvestments: []
      };
    }

    if (updates.totalProfit !== undefined) {
      user.investment.totalProfit = updates.totalProfit;
    }
    
    if (updates.currentBalance !== undefined) {
      user.investment.currentBalance = updates.currentBalance;
    }
    
    if (updates.totalDeposits !== undefined) {
      user.investment.totalDeposits = updates.totalDeposits;
    }
    
    if (updates.totalWithdrawals !== undefined) {
      user.investment.totalWithdrawals = updates.totalWithdrawals;
    }

    // Update investment plans if provided
    if (updates.investmentPlans && Array.isArray(updates.investmentPlans)) {
      for (const planUpdate of updates.investmentPlans) {
        if (planUpdate.id && planUpdate.currentValue !== undefined) {
          await InvestmentPlan.findByIdAndUpdate(planUpdate.id, {
            currentValue: planUpdate.currentValue
          });
        }
      }
    }

    await user.save();

    // Return updated user data
    const updatedUser = await User.findById(userId).select('-password').lean();
    
    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
