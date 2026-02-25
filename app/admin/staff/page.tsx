'use client';

import React, { useState, useMemo } from 'react';
import { Button, Form, Input, Space, Popconfirm, Tag, App, Avatar, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, TeamOutlined, CalendarOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import DataTable from '@/components/ui/DataTable';
import FormModal from '@/components/ui/FormModal';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import {
  useStaff,
  useCreateStaff,
  useUpdateStaff,
  useDeleteStaff,
} from '@/hooks/useStaff';
import type { Staff, CreateStaffInput } from '@/app/types';
import { formatDate, getInitials } from '@/app/lib/utils';

interface StaffWithCount extends Staff {
  _count?: {
    ProjectGroup_ProjectGroup_ConvenerStaffIDToStaff: number;
    ProjectMeeting: number;
  };
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

export default function StaffPage() {
  const [form] = Form.useForm<CreateStaffInput>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { message } = App.useApp();

  const { data: staff, isLoading, refetch } = useStaff(searchQuery);
  const createMutation = useCreateStaff();
  const updateMutation = useUpdateStaff();
  const deleteMutation = useDeleteStaff();

  // Calculate stats
  const stats = useMemo(() => {
    if (!staff) return { total: 0, activeGuides: 0, totalMeetings: 0 };
    const activeGuides = staff.filter(
      (s: StaffWithCount) => (s._count?.ProjectGroup_ProjectGroup_ConvenerStaffIDToStaff || 0) > 0
    ).length;
    const totalMeetings = staff.reduce(
      (acc: number, s: StaffWithCount) => acc + (s._count?.ProjectMeeting || 0),
      0
    );
    return { total: staff.length, activeGuides, totalMeetings };
  }, [staff]);

  const handleAdd = () => {
    form.resetFields();
    setEditingId(null);
    setModalOpen(true);
  };

  const handleEdit = (record: StaffWithCount) => {
    form.setFieldsValue({
      StaffName: record.StaffName,
      Email: record.Email || '',
      Phone: record.Phone || '',
      Description: record.Description || '',
      Password: '', // Don't populate password
    });
    setEditingId(record.StaffID);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success('Staff member deleted successfully');
    } catch (error) {
      message.error((error as Error).message || 'Failed to delete staff member');
    }
  };

  const handleSubmit = async (values: CreateStaffInput) => {
    try {
      if (editingId) {
        // Remove password if empty (don't update)
        const updateData = { ...values, id: editingId };
        if (!values.Password) {
          delete (updateData as Record<string, unknown>).Password;
        }
        await updateMutation.mutateAsync(updateData as { id: number } & Partial<CreateStaffInput>);
        message.success('Staff member updated successfully');
      } else {
        await createMutation.mutateAsync(values);
        message.success('Staff member created successfully');
      }
      setModalOpen(false);
      form.resetFields();
      setEditingId(null);
    } catch (error) {
      message.error((error as Error).message || `Failed to ${editingId ? 'update' : 'create'} staff member`);
    }
  };

  const columns: ColumnsType<StaffWithCount> = [
    {
      title: 'Staff Member',
      key: 'member',
      render: (_, record) => (
        <Space>
          <Avatar
            size={40}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 600,
            }}
          >
            {getInitials(record.StaffName)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{record.StaffName}</div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.Email}</div>
          </div>
        </Space>
      ),
      sorter: (a, b) => a.StaffName.localeCompare(b.StaffName),
    },
    {
      title: 'Phone',
      dataIndex: 'Phone',
      key: 'phone',
      render: (text) => text || <span style={{ color: '#d9d9d9' }}>—</span>,
    },
    {
      title: 'Projects',
      key: 'projects',
      width: 100,
      render: (_, record) => (
        <Tag color="blue" style={{ borderRadius: 12, fontWeight: 500 }}>
          {record._count?.ProjectGroup_ProjectGroup_ConvenerStaffIDToStaff || 0}
        </Tag>
      ),
    },
    {
      title: 'Meetings',
      key: 'meetings',
      width: 100,
      render: (_, record) => (
        <Tag color="green" style={{ borderRadius: 12, fontWeight: 500 }}>
          {record._count?.ProjectMeeting || 0}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'Created',
      key: 'created',
      width: 120,
      render: (date) => formatDate(date),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ color: '#667eea' }}
          />
          <Popconfirm
            title="Delete staff member?"
            description="This will also remove related assignments."
            onConfirm={() => handleDelete(record.StaffID)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AppLayout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <PageHeader
            title="Staff Management"
            subtitle="Manage faculty guides, conveners, and expert staff members"
            breadcrumbs={[
              { title: 'Admin', href: '/admin' },
              { title: 'Staff' },
            ]}
          />
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={itemVariants}>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={8}>
              <StatCard
                title="Total Staff"
                value={stats.total}
                icon={<UserOutlined />}
                color="#667eea"
              />
            </Col>
            <Col xs={24} sm={8}>
              <StatCard
                title="Active Guides"
                value={stats.activeGuides}
                icon={<TeamOutlined />}
                color="#764ba2"
              />
            </Col>
            <Col xs={24} sm={8}>
              <StatCard
                title="Total Meetings"
                value={stats.totalMeetings}
                icon={<CalendarOutlined />}
                color="#52c41a"
              />
            </Col>
          </Row>
        </motion.div>

        <motion.div variants={itemVariants}>
          <DataTable<StaffWithCount>
            columns={columns}
            dataSource={staff || []}
            rowKey="StaffID"
            loading={isLoading}
            onSearch={(value) => setSearchQuery(value)}
            onRefresh={() => refetch()}
            searchPlaceholder="Search staff by name or email..."
            extraActions={
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                Add Staff
              </Button>
            }
          />
        </motion.div>
      </motion.div>

      <FormModal
        title={editingId ? 'Edit Staff Member' : 'Add Staff Member'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        form={form}
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      >
        <Form.Item
          name="StaffName"
          label="Name"
          rules={[{ required: true, message: 'Please enter staff name' }]}
        >
          <Input placeholder="Full name" />
        </Form.Item>
        <Form.Item
          name="Email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input placeholder="email@example.com" />
        </Form.Item>
        <Form.Item name="Phone" label="Phone">
          <Input placeholder="Phone number" maxLength={10} />
        </Form.Item>
        <Form.Item
          name="Password"
          label="Password"
          rules={editingId ? [] : [{ required: true, message: 'Please enter password' }]}
          extra={editingId ? 'Leave empty to keep current password' : ''}
        >
          <Input.Password placeholder={editingId ? 'New password (optional)' : 'Password'} />
        </Form.Item>
        <Form.Item name="Description" label="Description">
          <Input.TextArea rows={3} placeholder="Optional notes" />
        </Form.Item>
      </FormModal>
    </AppLayout>
  );
}
