'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, Typography, App, Space, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, UserAddOutlined, BookOutlined, TeamOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text } = Typography;
const { Option } = Select;

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'student' | 'faculty';
}

export default function SignupPage() {
  const [form] = Form.useForm<SignupForm>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { message } = App.useApp();

  const handleSubmit = async (values: SignupForm) => {
    setLoading(true);
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        message.error(data.error || 'Signup failed');
        return;
      }

      message.success('Account created successfully! Please login.');
      router.push('/login');
    } catch (error) {
      console.error('Signup error:', error);
      message.error('An error occurred during signup');
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
        background: '#f8fafc',
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
          maxWidth: 520,
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
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
              <img src="/logo.png" alt="Projextion Logo" style={{ width: 25, height: 25, objectFit: 'contain', transform: 'scale(2.2)' }} />
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
              Create Account
            </Title>
            <Text
              style={{
                fontSize: 15,
                color: '#8c8c8c',
                fontWeight: 500,
              }}
            >
              Join Student Project Management System
            </Text>
          </div>

          {/* Signup Form */}
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            size="large"
            autoComplete="off"
            initialValues={{ role: 'student' }}
          >
            <Form.Item
              name="name"
              label={<span style={{ fontWeight: 600, color: '#262626' }}>Full Name</span>}
              rules={[
                { required: true, message: 'Please enter your name' },
                { min: 2, message: 'Name must be at least 2 characters' },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#8c8c8c', fontSize: 16 }} />}
                placeholder="John Doe"
                style={{
                  height: 48,
                  borderRadius: 12,
                  fontSize: 15,
                  border: '1.5px solid #e8e8e8',
                  transition: 'all 0.3s ease',
                }}
              />
            </Form.Item>

            <Form.Item
              name="email"
              label={<span style={{ fontWeight: 600, color: '#262626' }}>Email Address</span>}
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#8c8c8c', fontSize: 16 }} />}
                placeholder="you@example.com"
                style={{
                  height: 48,
                  borderRadius: 12,
                  fontSize: 15,
                  border: '1.5px solid #e8e8e8',
                  transition: 'all 0.3s ease',
                }}
              />
            </Form.Item>

            <Form.Item
              name="role"
              label={<span style={{ fontWeight: 600, color: '#262626' }}>Your Role</span>}
              rules={[{ required: true, message: 'Please select a role' }]}
            >
              <Select
                placeholder="Select your role"
                style={{
                  height: 48,
                }}
                suffixIcon={<TeamOutlined style={{ color: '#8c8c8c' }} />}
              >
                <Option value="student">
                  <Space>
                    <UserOutlined />
                    <span>Student</span>
                  </Space>
                </Option>
                <Option value="faculty">
                  <Space>
                    <BookOutlined />
                    <span>Faculty</span>
                  </Space>
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="password"
              label={<span style={{ fontWeight: 600, color: '#262626' }}>Password</span>}
              rules={[
                { required: true, message: 'Please enter your password' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#8c8c8c', fontSize: 16 }} />}
                placeholder="Minimum 6 characters"
                style={{
                  height: 48,
                  borderRadius: 12,
                  fontSize: 15,
                  border: '1.5px solid #e8e8e8',
                  transition: 'all 0.3s ease',
                }}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={<span style={{ fontWeight: 600, color: '#262626' }}>Confirm Password</span>}
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#8c8c8c', fontSize: 16 }} />}
                placeholder="Re-enter your password"
                style={{
                  height: 48,
                  borderRadius: 12,
                  fontSize: 15,
                  border: '1.5px solid #e8e8e8',
                  transition: 'all 0.3s ease',
                }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<UserAddOutlined />}
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
                Create Account
              </Button>
            </Form.Item>
          </Form>

          {/* Footer Links */}
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <Text style={{ color: '#595959', fontSize: 14 }}>
              Already have an account?{' '}
              <Link
                href="/login"
                style={{
                  color: '#007BFF',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                Sign In
              </Link>
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
}
