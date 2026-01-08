'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Spin, Result, Button } from 'antd';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [] 
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <Spin size="large" tip="Checking authentication..." />
      </div>
    );
  }

  if (!session) {
    redirect('/login');
  }

  const userRole = session.user?.role?.toLowerCase();

  if (allowedRoles.length > 0 && !allowedRoles.map(r => r.toLowerCase()).includes(userRole || '')) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button type="primary" href="/dashboard">
            Go to Dashboard
          </Button>
        }
      />
    );
  }

  return <>{children}</>;
}
