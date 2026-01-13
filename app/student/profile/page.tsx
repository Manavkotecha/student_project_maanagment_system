'use client';

import React from 'react';
import { Card, Form, Input, Button, Typography, Spin, Descriptions, Tag } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, SaveOutlined } from '@ant-design/icons';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { useStudents, useUpdateStudent } from '@/hooks/useStudents';
import { formatDate } from '@/app/lib/utils';

const { Title, Text } = Typography;

interface ProfileFormData {
  StudentName: string;
  Email: string;
  Phone?: string;
  Description?: string;
}

export default function StudentProfilePage() {
  const [form] = Form.useForm<ProfileFormData>();
  const { user } = useAuth();
  const { data: students, isLoading } = useStudents();
  const updateMutation = useUpdateStudent();

  const currentStudent = students?.find((s) => s.Email === user?.email);

  React.useEffect(() => {
    if (currentStudent) {
      form.setFieldsValue({
        StudentName: currentStudent.StudentName,
        Email: currentStudent.Email || '',
        Phone: currentStudent.Phone || '',
        Description: currentStudent.Description || '',
      });
    }
  }, [currentStudent, form]);

  const handleSubmit = async (values: ProfileFormData) => {
    if (!currentStudent) return;

    try {
      await updateMutation.mutateAsync({
        id: currentStudent.StudentID,
        ...values,
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Spin size="large" />
        </div>
      </AppLayout>
    );
  }

  if (!currentStudent) {
    return (
      <AppLayout>
        <Card>
          <Text type="warning">Student profile not found. Please contact administrator.</Text>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Title level={2} style={{ marginBottom: 24 }}>My Profile</Title>

      <Card style={{ marginBottom: 24 }}>
        <Descriptions title="Account Information" bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Student ID">
            <Tag color="blue">{currentStudent.StudentID}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Member Since">
            {formatDate(currentStudent.Created)}
          </Descriptions.Item>
          <Descriptions.Item label="Groups">
            {currentStudent.ProjectGroupMember?.length || 0}
          </Descriptions.Item>
          <Descriptions.Item label="Last Updated">
            {formatDate(currentStudent.Modified)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Edit Profile">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name="StudentName"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Your full name" />
          </Form.Item>

          <Form.Item
            name="Email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="your.email@example.com" />
          </Form.Item>

          <Form.Item name="Phone" label="Phone Number">
            <Input prefix={<PhoneOutlined />} placeholder="Your phone number" />
          </Form.Item>

          <Form.Item name="Description" label="About Me">
            <Input.TextArea rows={4} placeholder="Tell us about yourself..." />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={updateMutation.isPending}
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </AppLayout>
  );
}
