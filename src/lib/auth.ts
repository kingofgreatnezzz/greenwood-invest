import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('🔍 [AUTH] Authorize function called');
        console.log('🔍 [AUTH] Credentials:', credentials);
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ [AUTH] Missing credentials');
          throw new Error("Please enter an email and password");
        }

        try {
          await connectDB();
          console.log('🔍 [AUTH] Database connected');
          
          const user = await User.findOne({ email: credentials.email });
          console.log('🔍 [AUTH] User found:', user ? { id: user._id, email: user.email, name: user.name, role: user.role } : 'None');
          
          if (!user) {
            console.log('❌ [AUTH] No user found with email:', credentials.email);
            throw new Error("No user found with this email");
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          console.log('🔍 [AUTH] Password valid:', isPasswordValid);
          
          if (!isPasswordValid) {
            console.log('❌ [AUTH] Invalid password for user:', credentials.email);
            throw new Error("Invalid password");
          }

          const userData = {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
          console.log('✅ [AUTH] User authorized successfully:', userData);
          return userData;
        } catch (error) {
          console.error("❌ [AUTH] Auth error:", error);
          throw new Error("Authentication failed");
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('🔍 [AUTH] JWT callback triggered');
      console.log('🔍 [AUTH] Token before:', token);
      console.log('🔍 [AUTH] User data:', user);
      
      if (user) {
        token.role = user.role;
        token.id = user.id;
        console.log('🔍 [AUTH] Token updated with user data:', token);
      }
      return token;
    },
    async session({ session, token }) {
      console.log('🔍 [AUTH] Session callback triggered');
      console.log('🔍 [AUTH] Session before:', session);
      console.log('🔍 [AUTH] Token in session callback:', token);
      
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
        console.log('🔍 [AUTH] Session updated with token data:', session);
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
