import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function PUT(request: NextRequest) {
  try {
    console.log('🔍 [ADMIN WITHDRAWALS UPDATE API] Request received');
    
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.log('❌ [ADMIN WITHDRAWALS UPDATE API] No session or user ID found');
      return NextResponse.json(
        { error: 'Unauthorized - No session found' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'admin') {
      console.log('❌ [ADMIN WITHDRAWALS UPDATE API] User is not admin. Role:', session.user.role);
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get request body
    const body = await request.json();
    const { withdrawalId, status, adminNotes } = body;

    if (!withdrawalId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: withdrawalId and status' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'completed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: pending, approved, rejected, completed' },
        { status: 400 }
      );
    }

    console.log('✅ [ADMIN WITHDRAWALS UPDATE API] Admin access verified, updating withdrawal:', withdrawalId);

    // Find and update the withdrawal file
    const dataDir = path.join(process.cwd(), 'data', 'withdrawals');
    const filename = `${withdrawalId}.json`;
    const filepath = path.join(dataDir, filename);

    if (!fs.existsSync(filepath)) {
      console.log('❌ [ADMIN WITHDRAWALS UPDATE API] Withdrawal file not found:', filepath);
      return NextResponse.json(
        { error: 'Withdrawal request not found' },
        { status: 404 }
      );
    }

    // Read the current withdrawal data
    const content = fs.readFileSync(filepath, 'utf-8');
    const withdrawal = JSON.parse(content);

    // Update the status and add admin notes
    withdrawal.status = status;
    withdrawal.processedAt = new Date().toISOString();
    
    if (adminNotes) {
      withdrawal.adminNotes = adminNotes;
    }

    // Save the updated withdrawal back to file
    fs.writeFileSync(filepath, JSON.stringify(withdrawal, null, 2));

    console.log('✅ [ADMIN WITHDRAWALS UPDATE API] Withdrawal status updated successfully:', {
      withdrawalId,
      newStatus: status,
      processedAt: withdrawal.processedAt
    });

    return NextResponse.json({
      success: true,
      message: `Withdrawal ${status} successfully`,
      withdrawal: withdrawal
    });

  } catch (error) {
    console.error('❌ [ADMIN WITHDRAWALS UPDATE API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}





