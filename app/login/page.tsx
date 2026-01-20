'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Form, Input, Button, Card, Typography, App, Space } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, BookOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text } = Typography;

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
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
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: 24,
      }}
    >
      {/* Animated background elements */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
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
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
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
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <Card
        style={{
          width: '100%',
          maxWidth: 440,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.5)',
          borderRadius: 24,
          border: '1px solid rgba(255, 255, 255, 0.3)',
          position: 'relative',
          zIndex: 1,
          animation: 'slideIn 0.6s ease-out',
        }}
        styles={{
          body: { padding: 48 },
        }}
      >
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                marginBottom: 20,
              }}
            >
              <BookOutlined style={{ fontSize: 36, color: 'white' }} />
            </div>
            <Title
              level={2}
              style={{
                marginBottom: 8,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
                fontSize: 32,
              }}
            >
              Welcome Back
            </Title>
            <Text
              style={{
                fontSize: 15,
                color: '#8c8c8c',
                fontWeight: 500,
              }}
            >
              Sign in to Student Project Management System
            </Text>
          </div>

          {/* Login Form */}
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            size="large"
            autoComplete="off"
            style={{ marginTop: 16 }}
          >
            <Form.Item
              name="email"
              label={<span style={{ fontWeight: 600, color: '#262626' }}>Email Address</span>}
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#8c8c8c', fontSize: 16 }} />}
                placeholder="you@example.com"
                style={{
                  height: 50,
                  borderRadius: 12,
                  fontSize: 15,
                  border: '1.5px solid #e8e8e8',
                  transition: 'all 0.3s ease',
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span style={{ fontWeight: 600, color: '#262626' }}>Password</span>}
              rules={[{ required: true, message: 'Please enter your password' }]}
              style={{ marginBottom: 24 }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#8c8c8c', fontSize: 16 }} />}
                placeholder="Enter your password"
                style={{
                  height: 50,
                  borderRadius: 12,
                  fontSize: 15,
                  border: '1.5px solid #e8e8e8',
                  transition: 'all 0.3s ease',
                }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<LoginOutlined />}
                block
                style={{
                  height: 52,
                  fontSize: 16,
                  fontWeight: 600,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.4)';
                }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          {/* Footer Links */}
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <Text style={{ color: '#595959', fontSize: 14 }}>
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                style={{
                  color: '#667eea',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                Sign Up
              </Link>
            </Text>
          </div>

          <div
            style={{
              textAlign: 'center',
              marginTop: 8,
              padding: '12px 16px',
              background: 'rgba(102, 126, 234, 0.08)',
              borderRadius: 10,
              border: '1px solid rgba(102, 126, 234, 0.15)',
            }}
          >
            <Text style={{ fontSize: 12, color: '#667eea', fontWeight: 500 }}>
              💡 Demo: Use staff/student credentials from database
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
}