'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Spin, Typography } from 'antd';

const { Title } = Typography;

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
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
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
      }}
    >
      <Spin size="large" />
      <Title level={4} style={{ marginTop: 24, color: '#666' }}>
        Redirecting to your dashboard...
      </Title>
    </div>
  );
}
