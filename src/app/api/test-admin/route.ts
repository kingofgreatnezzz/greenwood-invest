import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    console.log('🔍 [TEST ADMIN] Request received');
    
    const session = await getServerSession(authOptions);
    console.log('🔍 [TEST ADMIN] Session data:', JSON.stringify(session, null, 2));
    
    if (!session?.user?.id) {
      console.log('❌ [TEST ADMIN] No session found');
      return NextResponse.json(
        { error: 'No session found', debug: { session: !!session, hasUser: !!session?.user, hasUserId: !!session?.user?.id } },
        { status: 401 }
      );
    }

    if (session.user.role !== 'admin') {
      console.log('❌ [TEST ADMIN] User is not admin. Role:', session.user.role);
      return NextResponse.json(
        { error: 'Admin access required', debug: { userRole: session.user.role, requiredRole: 'admin' } },
        { status: 403 }
      );
    }

    console.log('✅ [TEST ADMIN] Admin access granted');
    
    return NextResponse.json({
      message: 'Admin test successful',
      user: {
        id: session.user.id,
        role: session.user.role,
        name: session.user.name,
        email: session.user.email
      }
    });
    
  } catch (error) {
    console.error('❌ [TEST ADMIN] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Admin test failed', details: errorMessage },
      { status: 500 }
    );
  }
}
