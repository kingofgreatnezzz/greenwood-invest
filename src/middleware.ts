import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if user is authenticated
        if (!token) return false;
        
        // If accessing admin route, check if user is admin
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token.role === 'admin';
        }
        
        // For other protected routes, just check if authenticated
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"]
};

