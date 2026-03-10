'use client';

import React, { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Form, Input, Button, Card, Typography, App, Space } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, BookOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text } = Typography;

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #007BFF 0%, #0056b3 100%)' }} />}>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const [form] = Form.useForm<LoginForm>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const { message } = App.useApp();

  const handleSubmit = async (values: LoginForm) => {
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        message.error('Invalid email or password');
      } else if (result?.ok) {
        message.success('Login successful!');
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      message.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      suppressHydrationWarning
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc', // Clean light gray/white background
        position: 'relative',
        overflow: 'hidden',
        padding: 24,
      }}
    >
      {/* Animated background elements (adapted for light theme) */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(0,123,255,0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 15s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(0,123,255,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 20s ease-in-out infinite reverse',
        }}
      />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>


      <Card
        style={{
          width: '100%',
          maxWidth: 440,
          background: '#ffffff',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.02)',
          borderRadius: 24,
          border: '1px solid rgba(0, 0, 0, 0.04)',
          position: 'relative',
          zIndex: 1,
          animation: 'slideIn 0.6s ease-out',
        }}
        styles={{
          body: { padding: '40px 32px' },
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%' }}>
          {/* Logo and Title Section */}
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 72,
                height: 72,
                borderRadius: 20,
                background: 'linear-gradient(135deg, #007BFF 0%, #0056b3 100%)',
                boxShadow: '0 8px 24px rgba(0, 123, 255, 0.4)',
                marginBottom: 20,
              }}
            >
              <BookOutlined style={{ fontSize: 36, color: 'white' }} />
            </div>
            <Title
              level={2}
              style={{
                marginBottom: 4,
                color: '#001F3F',
                fontWeight: 700,
                fontSize: 28,
              }}
            >
              Welcome Back
            </Title>
            <Text
              style={{
                fontSize: 15,
                color: '#6B7280',
                fontWeight: 500,
              }}
            >
              Sign in to Manav&apos;s Schedule
            </Text>
          </div>

          {/* Login Form */}
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            size="large"
            autoComplete="off"
          >
            <Form.Item
              name="email"
              label={<span style={{ fontWeight: 600, color: '#001F3F' }}>Email Address</span>}
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#6B7280', fontSize: 16 }} />}
                placeholder="you@example.com"
                style={{
                  height: 48,
                  borderRadius: 12,
                  fontSize: 15,
                  border: '1.5px solid #e2e8f0',
                  transition: 'all 0.3s ease',
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span style={{ fontWeight: 600, color: '#001F3F' }}>Password</span>}
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#6B7280', fontSize: 16 }} />}
                placeholder="Enter your password"
                style={{
                  height: 48,
                  borderRadius: 12,
                  fontSize: 15,
                  border: '1.5px solid #e2e8f0',
                  transition: 'all 0.3s ease',
                }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<LoginOutlined />}
                block
                style={{
                  height: 48,
                  fontSize: 16,
                  fontWeight: 600,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #007BFF 0%, #0056b3 100%)',
                  border: 'none',
                  boxShadow: '0 4px 16px rgba(0, 123, 255, 0.4)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 123, 255, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 123, 255, 0.4)';
                }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          {/* Footer Links */}
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <Text style={{ color: '#6B7280', fontSize: 14 }}>
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                style={{
                  color: '#007BFF',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                Sign Up
              </Link>
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
}