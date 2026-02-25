'use client';

import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Spin, Descriptions, Tag, Avatar, Row, Col, Space, Divider } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, SaveOutlined, TeamOutlined, CalendarOutlined, IdcardOutlined, EditOutlined, CloseOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/ui/PageHeader';
import { useAuth } from '@/hooks/useAuth';
import { useStudents, useUpdateStudent } from '@/hooks/useStudents';
import { formatDate, getInitials } from '@/app/lib/utils';

const { Text, Title } = Typography;

interface ProfileFormData {
  StudentName: string;
  Email: string;
  Phone?: string;
  Description?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function StudentProfilePage() {
  const [form] = Form.useForm<ProfileFormData>();
  const [isEditing, setIsEditing] = useState(false);
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
      setIsEditing(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (currentStudent) {
      form.setFieldsValue({
        StudentName: currentStudent.StudentName,
        Email: currentStudent.Email || '',
        Phone: currentStudent.Phone || '',
        Description: currentStudent.Description || '',
      });
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
        <Card style={{ borderRadius: 16 }}>
          <Text type="warning">Student profile not found. Please contact administrator.</Text>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <PageHeader
            title="My Profile"
            subtitle="View and update your personal information"
            breadcrumbs={[
              { title: 'Student', href: '/student' },
              { title: 'Profile' },
            ]}
          />
        </motion.div>

        <Row gutter={[24, 24]}>
          {/* Profile Card */}
          <Col xs={24} lg={8}>
            <motion.div variants={itemVariants}>
              <Card
                style={{
                  borderRadius: 16,
                  textAlign: 'center',
                  background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                }}
              >
                <Avatar
                  size={100}
                  style={{
                    backgroundColor: 'white',
                    color: '#667eea',
                    fontSize: 36,
                    fontWeight: 600,
                    marginBottom: 16,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  }}
                >
                  {getInitials(currentStudent.StudentName)}
                </Avatar>
                <Title level={4} style={{ color: 'white', marginBottom: 4 }}>
                  {currentStudent.StudentName}
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {currentStudent.Email}
                </Text>

                <Divider style={{ borderColor: 'rgba(255,255,255,0.2)', margin: '24px 0' }} />

                <Row gutter={16}>
                  <Col span={8}>
                    <div>
                      <IdcardOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                      <div style={{ fontSize: 20, fontWeight: 600 }}>#{currentStudent.StudentID}</div>
                      <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Student ID</Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div>
                      <TeamOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                      <div style={{ fontSize: 20, fontWeight: 600 }}>
                        {currentStudent.ProjectGroupMember?.length || 0}
                      </div>
                      <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Groups</Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div>
                      <CalendarOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                      <div style={{ fontSize: 14, fontWeight: 600 }}>
                        {formatDate(currentStudent.Created).split(' ')[0]}
                      </div>
                      <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Joined</Text>
                    </div>
                  </Col>
                </Row>
              </Card>
            </motion.div>

            {/* Quick Info */}
            <motion.div variants={itemVariants}>
              <Card style={{ borderRadius: 16, marginTop: 24 }}>
                <Descriptions column={1} size="small" title="Account Details">
                  <Descriptions.Item label="Member Since">
                    {formatDate(currentStudent.Created)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Last Updated">
                    {formatDate(currentStudent.Modified)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    {currentStudent.Phone || '—'}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </motion.div>
          </Col>

          {/* Edit Form */}
          <Col xs={24} lg={16}>
            <motion.div variants={itemVariants}>
              <Card
                title={
                  <Space>
                    <UserOutlined style={{ color: '#667eea' }} />
                    <span>{isEditing ? 'Edit Profile' : 'Profile Details'}</span>
                  </Space>
                }
                extra={
                  !isEditing && (
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => setIsEditing(true)}
                      style={{
                        borderRadius: 8,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                      }}
                    >
                      Edit Data
                    </Button>
                  )
                }
                style={{ borderRadius: 16 }}
              >
                {/* Always render Form so useForm stays connected */}
                <div style={{ display: isEditing ? 'block' : 'none' }}>
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    size="large"
                  >
                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="StudentName"
                          label={<span style={{ fontWeight: 500 }}>Full Name</span>}
                          rules={[{ required: true, message: 'Please enter your name' }]}
                        >
                          <Input
                            prefix={<UserOutlined style={{ color: '#8c8c8c' }} />}
                            placeholder="Your full name"
                            style={{ borderRadius: 8 }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="Email"
                          label={<span style={{ fontWeight: 500 }}>Email Address</span>}
                          rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Please enter a valid email' },
                          ]}
                        >
                          <Input
                            prefix={<MailOutlined style={{ color: '#8c8c8c' }} />}
                            placeholder="your.email@example.com"
                            style={{ borderRadius: 8 }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      name="Phone"
                      label={<span style={{ fontWeight: 500 }}>Phone Number</span>}
                    >
                      <Input
                        prefix={<PhoneOutlined style={{ color: '#8c8c8c' }} />}
                        placeholder="Your phone number"
                        style={{ borderRadius: 8 }}
                      />
                    </Form.Item>

                    <Form.Item
                      name="Description"
                      label={<span style={{ fontWeight: 500 }}>About Me</span>}
                    >
                      <Input.TextArea
                        autoSize={{ minRows: 4, maxRows: 10 }}
                        maxLength={500}
                        showCount
                        placeholder="Tell us about yourself, your interests, skills..."
                        style={{ borderRadius: 8, whiteSpace: 'pre-wrap' }}
                      />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                      <Space>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={updateMutation.isPending}
                            size="large"
                            style={{
                              borderRadius: 8,
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              border: 'none',
                              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                            }}
                          >
                            Save Changes
                          </Button>
                        </motion.div>
                        <Button
                          icon={<CloseOutlined />}
                          onClick={handleCancelEdit}
                          size="large"
                          style={{ borderRadius: 8 }}
                        >
                          Cancel
                        </Button>
                      </Space>
                    </Form.Item>
                  </Form>
                </div>

                {!isEditing && (
                  <div>
                    <Row gutter={16} style={{ marginBottom: 20 }}>
                      <Col xs={24} md={12}>
                        <div style={{ marginBottom: 16 }}>
                          <Text type="secondary" style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>
                            <span style={{ color: '#ff4d4f' }}>* </span>Full Name
                          </Text>
                          <div style={{
                            padding: '8px 12px',
                            borderRadius: 8,
                            border: '1px solid #d9d9d9',
                            background: '#fafafa',
                            fontSize: 15,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            minHeight: 40,
                          }}>
                            <UserOutlined style={{ color: '#8c8c8c' }} />
                            {currentStudent.StudentName}
                          </div>
                        </div>
                      </Col>
                      <Col xs={24} md={12}>
                        <div style={{ marginBottom: 16 }}>
                          <Text type="secondary" style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>
                            <span style={{ color: '#ff4d4f' }}>* </span>Email Address
                          </Text>
                          <div style={{
                            padding: '8px 12px',
                            borderRadius: 8,
                            border: '1px solid #d9d9d9',
                            background: '#fafafa',
                            fontSize: 15,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            minHeight: 40,
                          }}>
                            <MailOutlined style={{ color: '#8c8c8c' }} />
                            {currentStudent.Email}
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <div style={{ marginBottom: 20 }}>
                      <Text type="secondary" style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>
                        Phone Number
                      </Text>
                      <div style={{
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: '1px solid #d9d9d9',
                        background: '#fafafa',
                        fontSize: 15,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        minHeight: 40,
                      }}>
                        <PhoneOutlined style={{ color: '#8c8c8c' }} />
                        {currentStudent.Phone || '—'}
                      </div>
                    </div>

                    <div>
                      <Text type="secondary" style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>
                        About Me
                      </Text>
                      <div style={{
                        padding: '12px',
                        borderRadius: 8,
                        border: '1px solid #d9d9d9',
                        background: '#fafafa',
                        fontSize: 15,
                        minHeight: 100,
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.6,
                      }}>
                        {currentStudent.Description || '—'}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* My Groups */}
            {currentStudent.ProjectGroupMember && currentStudent.ProjectGroupMember.length > 0 && (
              <motion.div variants={itemVariants}>
                <Card
                  title={
                    <Space>
                      <TeamOutlined style={{ color: '#667eea' }} />
                      <span>My Groups</span>
                    </Space>
                  }
                  style={{ borderRadius: 16, marginTop: 24 }}
                >
                  <Space wrap>
                    {currentStudent.ProjectGroupMember.map((membership) => (
                      <Tag
                        key={membership.ProjectGroup.ProjectGroupID}
                        color="blue"
                        style={{
                          padding: '8px 16px',
                          fontSize: 14,
                          borderRadius: 12,
                        }}
                      >
                        {membership.ProjectGroup.ProjectGroupName}
                      </Tag>
                    ))}
                  </Space>
                </Card>
              </motion.div>
            )}
          </Col>
        </Row>
      </motion.div>
    </AppLayout>
  );
}
