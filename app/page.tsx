'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      // Redirect to login page for unauthenticated users
      router.push('/login');
      return;
    }

    const role = session.user?.role?.toLowerCase();

    switch (role) {
      case 'admin':
        router.push('/admin');
        break;
      case 'faculty':
        router.push('/faculty/dashboard');
        break;
      case 'student':
        router.push('/student/dashboard');
        break;
      default:
        router.push('/login');
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/30">
          <GraduationCap size={40} className="text-white" />
        </div>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-pink-600 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <p className="text-slate-500 font-medium">Redirecting to your dashboard...</p>
      </motion.div>
    </div>
  );
}
