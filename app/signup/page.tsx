'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  App,
  Space,
  Divider,
  Select,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text } = Typography;
const { Option } = Select;

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'student' | 'faculty' | 'admin';
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 24,
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 480,
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          borderRadius: 16,
        }}
        styles={{
          body: { padding: 40 },
        }}
      >
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ marginBottom: 8, color: '#1677ff' }}>
              SPMS
            </Title>
            <Text type="secondary">
              Student Project Management System
            </Text>
          </div>

          <Divider style={{ margin: '16px 0' }}>Create your account</Divider>

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
              rules={[
                { required: true, message: 'Please enter your name' },
                { min: 2, message: 'Name must be at least 2 characters' },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Full Name"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Email address"
              />
            </Form.Item>

            <Form.Item
              name="role"
              rules={[{ required: true, message: 'Please select a role' }]}
            >
              <Select placeholder="Select your role">
                <Option value="student">Student</Option>
                <Option value="faculty">Faculty</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please enter your password' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
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
                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Confirm Password"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<UserAddOutlined />}
                block
                style={{
                  height: 48,
                  fontSize: 16,
                  borderRadius: 8,
                }}
              >
                Sign Up
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Text type="secondary">
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#1677ff', fontWeight: 500 }}>
                Sign In
              </Link>
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
}
