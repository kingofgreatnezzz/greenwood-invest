import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [TEST SESSION] Request received');
    
    const session = await getServerSession(authOptions);
    console.log('🔍 [TEST SESSION] Session data:', JSON.stringify(session, null, 2));
    
    return NextResponse.json({
      message: 'Session test endpoint',
      hasSession: !!session,
      sessionData: session,
      headers: Object.fromEntries(request.headers.entries())
    });
  } catch (error) {
    console.error('❌ [TEST SESSION] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Session test failed', details: errorMessage },
      { status: 500 }
    );
  }
}
