import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const staff = await prisma.staff.findUnique({
          where: { Email: credentials.email },
        });

        if (staff && await bcrypt.compare(credentials.password, staff.Password)) {
          // Admin detection: Check if email contains 'admin' or specific role field
          const isAdmin = credentials.email.toLowerCase().includes('admin');
          return {
            id: staff.StaffID.toString(),
            name: staff.StaffName,
            email: staff.Email,
            role: isAdmin ? 'Admin' : 'Faculty',
          };
        }

        // Check User table (for Students)
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (user && user.hashedPassword && await bcrypt.compare(credentials.password, user.hashedPassword)) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role || 'Student',
          };
        }

        // Also check Student table directly (for demo purposes)
        const student = await prisma.student.findUnique({
          where: { Email: credentials.email },
        });

        if (student) {
          // For demo, allow any password for students
          // In production, students should have proper password handling
          return {
            id: student.StudentID.toString(),
            name: student.StudentName,
            email: student.Email,
            role: 'Student',
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login', // Redirect to login on error
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development', // Enable debug in dev
};