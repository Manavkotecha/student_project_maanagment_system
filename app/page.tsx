'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import LandingPage from './(public)/page';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showLanding, setShowLanding] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      // Unauthenticated users see the landing page
      setShowLanding(true);
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

  // Show landing page for unauthenticated users
  if (showLanding) {
    return <LandingPage />;
  }

  // Loading state while session is being checked or redirect is happening
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mx-auto mb-6" style={{ width: 80, height: 80 }}>
          <img src="/logo.png" alt="Projextion Logo" width={80} height={80} style={{ display: 'block', objectFit: 'contain', transform: 'scale(1.8)' }} />
        </div>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <p className="text-slate-500 font-medium">Redirecting to your dashboard...</p>
      </motion.div>
    </div>
  );
}
