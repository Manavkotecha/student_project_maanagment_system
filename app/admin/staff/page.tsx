'use client';

import React, { useState } from 'react';
import { Button, Form, Input, Space, Popconfirm, Typography, Tag, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AppLayout from '@/components/layout/AppLayout';
import DataTable from '@/components/ui/DataTable';
import FormModal from '@/components/ui/FormModal';
import {
  useStaff,
  useCreateStaff,
  useUpdateStaff,
  useDeleteStaff,
} from '@/hooks/useStaff';
import type { Staff, CreateStaffInput } from '@/app/types';
import { formatDate } from '@/app/lib/utils';

const { Title } = Typography;

interface StaffWithCount extends Staff {
  _count?: {
    ProjectGroup_ProjectGroup_ConvenerStaffIDToStaff: number;
    ProjectMeeting: number;
  };
}

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
      title: 'ID',
      dataIndex: 'StaffID',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.StaffID - b.StaffID,
    },
    {
      title: 'Name',
      dataIndex: 'StaffName',
      key: 'name',
      sorter: (a, b) => a.StaffName.localeCompare(b.StaffName),
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'Phone',
      key: 'phone',
      render: (text) => text || '-',
    },
    {
      title: 'Projects',
      key: 'projects',
      width: 100,
      render: (_, record) => (
        <Tag color="blue">
          {record._count?.ProjectGroup_ProjectGroup_ConvenerStaffIDToStaff || 0}
        </Tag>
      ),
    },
    {
      title: 'Meetings',
      key: 'meetings',
      width: 100,
      render: (_, record) => (
        <Tag color="green">{record._count?.ProjectMeeting || 0}</Tag>
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
      render: (_, record) => {
        const hasAssignments =
          (record._count?.ProjectGroup_ProjectGroup_ConvenerStaffIDToStaff || 0) > 0 ||
          (record._count?.ProjectMeeting || 0) > 0;

        return (
          <Space size="small">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
            <Popconfirm
              title="Delete staff member?"
              description="This action cannot be undone."
              onConfirm={() => handleDelete(record.StaffID)}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                disabled={hasAssignments}
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <AppLayout>
      <Title level={2} style={{ marginBottom: 24 }}>Staff Management</Title>

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
          <Input placeholder="Phone number" />
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
